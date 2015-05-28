#version 400

layout(location = 0) in vec3 vertPosition;
layout(location = 1) in vec3 vertNormal;
layout(location = 2) in vec2 a_texCoord;

out vec2 texCoord;

uniform mat4 modelViewProjectionMatrix;
uniform float time;

void main()
{
    texCoord = a_texCoord;
	gl_Position = modelViewProjectionMatrix * vec4(vertPosition, 1.0);
}