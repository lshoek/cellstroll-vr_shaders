#version 400

in vec3 vertPosition;
out vec3 fragVert;

void main()
{
	fragVert = vertPosition;
	gl_Position = vec4(vertPosition, 1.0);
}