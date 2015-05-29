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
	gl_FragColor = vec4(texture2D(s_texture, texCoord).rgb, 1.0) * vec4((ambient + diffuse + specular), 1.0f);
}