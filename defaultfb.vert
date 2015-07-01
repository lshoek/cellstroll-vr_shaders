#version 400

layout(location = 0) in vec3 vertPosition;

uniform mat4 modelViewProjectionMatrix;
uniform vec2 screenSize;
out vec2 texCoord;

void main()
{
	texCoord = (vec2(vertPosition) + vec2(1, 1)) / 2.0;
	gl_Position = vec4(vertPosition, 1) * 2.0;
}