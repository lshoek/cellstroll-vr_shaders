#version 400

layout(location = 0) in vec3 vertPosition;
uniform mat4 modelViewProjectionMatrix;

void main()
{
	gl_Position = modelViewProjectionMatrix * vec4(vertPosition, 1.0);
}