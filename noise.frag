// Description : Array - and textureless GLSL 2D simplex noise .
// Author: Ian McEwan, Ashima Arts. Version : 20110822
// Copyright (C) 2011 Ashima Arts. All rights reserved.
// Distributed under the MIT License. See LICENSE file.
// https://github.com/ashima/webgl-noise
#version 400

uniform mat4 modelViewMatrix;
uniform vec4 clippingPlane;
uniform vec3 materialSpecularColor;
uniform vec3 cameraPosition;
uniform sampler2D s_texture;
uniform sampler2D s_normals;
uniform float materialShininess;
uniform float time;

in vec3 fragVert;
in vec3 fragNormal;
in vec2 texCoord;
in vec4 worldCoord;

uniform struct Light
{
   vec3 position;
   vec3 intensities;
   float attenuation;
   float ambientCoefficient;
} light;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
{
	const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
	                  	0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
	                   -0.577350269189626,  // -1.0 + 2.0 * C.x
	                  	0.024390243902439); // 1.0 / 41.0
	// First corner
	vec2 i  = floor(v + dot(v, C.yy));
	vec2 x0 = v -   i + dot(i, C.xx);

	// Other corners
	vec2 i1;
	//i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
	//i1.y = 1.0 - i1.x;
	i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	// x0 = x0 - 0.0 + 0.0 * C.xx ;
	// x1 = x0 - i1 + 1.0 * C.xx ;
	// x2 = x0 - 1.0 + 2.0 * C.xx ;
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;

	// Permutations
	i = mod289(i); // Avoid truncation effects in permutation
	vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

	vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
	m = m*m ;
	m = m*m ;

	// Gradients: 41 points uniformly over a line, mapped onto a diamond.
	// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;

	// Normalise gradients implicitly by scaling m
	// Approximation of: m *= inversesqrt( a0*a0 + h*h );
	m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

	// Compute final noise value at P
	vec3 g;
	g.x  = a0.x  * x0.x  + h.x  * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

vec3 getColor(float f)
{
	vec3 color1 = vec3(179,27,103);
	vec3 color2 = vec3(54,23,82);

	float r, g, b;

	if (color1.r > color2.r)
		r = (color1.r/255.0f) - (((color1.r/255.0f)-(color2.r/255.0f)) * f);
	else
		r = (color1.r/255.0f) + (((color1.r/255.0f)-(color2.r/255.0f)) * f);

	if (color1.g > color2.g)
		g = (color1.g/255.0f) - (((color1.g/255.0f)-(color2.g/255.0f)) * f);
	else
		g = (color1.g/255.0f) + (((color1.g/255.0f)-(color2.g/255.0f)) * f);

	if (color1.b > color2.b)
		b = (color1.b/255.0f) - (((color1.b/255.0f)-(color2.b/255.0f)) * f);
	else
		b = (color1.b/255.0f) + (((color1.b/255.0f)-(color2.b/255.0f)) * f);

	return vec3(r, g, b);
}

void main()
{
	if (worldCoord.y > clippingPlane.y)
		discard;

    // Locals
    mat3 normalMatrix = transpose(inverse(mat3(modelViewMatrix)));
    vec3 normal = normalize(normalMatrix * fragNormal);
    vec3 surfacePos = vec3(modelViewMatrix * vec4(fragVert, 1.0f));
    vec3 surfaceToLight = normalize(light.position - surfacePos);
    vec3 surfaceToCamera = normalize(cameraPosition - surfacePos);

    // Noise
	float n = 1.5f * snoise(texCoord * 6.0);

    // Ambient
	vec3 ambient = light.ambientCoefficient * light.intensities;

    // Diffuse
    float diffuseCoefficient = max(0.0, dot(normal, surfaceToLight));
	vec3 diffuse = diffuseCoefficient * light.intensities;

    // Specular Lighting
    float specularCoefficient = 0.0;
    if(diffuseCoefficient > 0.0)
        specularCoefficient = pow(max(0.0, dot(surfaceToCamera, reflect(-surfaceToLight, normal))), materialShininess);
    vec3 specular = specularCoefficient * materialSpecularColor * light.intensities;
    
    // Bump Mapping 
    vec3 normalMap = texture2D(s_normals, texCoord/2).rgb;
    normalMap = normalize(normalMap * 2.0 - 1.0);

    vec3 lightDir = vec3(light.position.xy - gl_FragCoord.xy, light.position.z);
    lightDir = normalize(lightDir);
    
    diffuse *= 5.0 * max(dot(normalMap, lightDir), 0.0);
    specular *= 5.0 * max(dot(normalMap, lightDir), 0.0);

	// Calculate Color
	gl_FragColor = vec4(getColor(n), 1.0) * vec4((ambient + diffuse + specular), 1.0f);
}