#version 400

layout(location = 0) in vec3 vertPosition;
layout(location = 1) in vec3 vertNormal;
layout(location = 2) in vec2 a_texCoord;

out vec3 fragVert;
out vec3 fragNormal;
out vec2 texCoord;
out vec4 worldCoord;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

void main()
{
	// Simply pass variables to fragment shader
    fragVert = vertPosition;
    fragNormal = vertNormal;
    texCoord = a_texCoord;

    worldCoord = modelMatrix * vec4(vertPosition, 1.0);
	gl_Position = modelViewMatrix * projectionMatrix * vec4(vertPosition, 1.0);
}