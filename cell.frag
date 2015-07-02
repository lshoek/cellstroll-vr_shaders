// Description : Array - and textureless GLSL 2D simplex noise .
// Author: Ian McEwan, Ashima Arts. Version : 20110822
// Copyright (C) 2011 Ashima Arts. All rights reserved.
// Distributed under the MIT License. See LICENSE file.
// https://github.com/ashima/webgl-noise
#version 400

uniform mat4 modelViewMatrix;
uniform vec3 materialSpecularColor;
uniform vec3 cameraPosition;
uniform vec3 pointerPosition;
uniform sampler2D s_texture;
uniform sampler2D s_normals;
uniform float materialShininess;
uniform float time;
uniform int elementIndex;
uniform bool isPointing;
uniform bool selected;

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

uniform struct Plane
{
	vec3 point;
	vec3 normal;
} clippingPlane;

bool bumpmapping = false;

void main()
{
	vec3 diff = worldCoord.xyz - clippingPlane.point;
	float dotprod = dot(diff, clippingPlane.normal);
	if (dotprod < 0)
		discard;

    // Locals
    mat3 normalMatrix = transpose(inverse(mat3(modelViewMatrix)));
    vec3 normal = normalize(normalMatrix * fragNormal);
    vec3 surfacePos = vec3(modelViewMatrix * vec4(fragVert, 1.0f));
    vec3 surfaceToLight = normalize(light.position - surfacePos);
    vec3 surfaceToCamera = normalize(cameraPosition - surfacePos);

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
    if (bumpmapping)
    {
	    vec3 normalMap = texture2D(s_normals, texCoord*1.0).rgb;
	    normalMap = normalize(normalMap * 2.0 - 1.0);

	    vec3 lightDir = vec3(light.position.xy - gl_FragCoord.xy, light.position.z);
	    lightDir = normalize(lightDir);
	    
	    diffuse *= 4.0 * max(dot(normalMap, lightDir), 0.0);
	    specular *= 4.0 * max(dot(normalMap, lightDir), 0.0);
	}

    vec3 selectionColor = vec3(0.0);

    if (selected)
        selectionColor = vec3(0.3);

    gl_FragData[0] = vec4(texture2D(s_texture, texCoord).rgb + selectionColor, 1.0) * vec4((ambient + diffuse + specular*2.0), 1.0); 

    vec3 diffvec = pointerPosition - worldCoord.xyz;
    float distance = sqrt(diffvec.x * diffvec.x + diffvec.y * diffvec.y + diffvec.z * diffvec.z);
    if (isPointing && distance < 0.5)
        gl_FragData[1] = vec4(vec3(elementIndex/256.0), 1.0);
    else
        gl_FragData[1] = vec4(vec3(0.0), 1.0);
}