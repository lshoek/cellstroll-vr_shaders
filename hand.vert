#version 400

layout(location = 0) in vec3 vertPosition;
layout(location = 1) in vec3 vertNormal;
layout(location = 2) in vec2 a_texCoord;

out vec3 fragVert;
out vec3 fragNormal;
out vec2 texCoord;

uniform mat4 modelViewProjectionMatrix;

void main()
{
    fragVert = vertPosition;
    fragNormal = vertNormal;
    texCoord = a_texCoord;

	gl_Position = modelViewProjectionMatrix * vec4(vertPosition, 1.0);
}