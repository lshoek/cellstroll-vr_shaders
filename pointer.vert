#version 400

layout(location = 0) in vec3 vertPosition;
layout(location = 1) in vec3 vertNormal;

out vec3 fragVert;
out vec3 fragNormal;

uniform mat4 modelViewProjectionMatrix;

void main()
{
    fragVert = vertPosition;
    fragNormal = vertNormal;

	gl_Position = modelViewProjectionMatrix * vec4(vertPosition, 1.0);
}