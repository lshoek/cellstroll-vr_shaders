#version 400

uniform mat4 modelViewMatrix;

in vec3 fragVert;
in vec3 fragNormal;

void main()
{  
	gl_FragData[0] = vec4(1.0, 0.0, 0.0, 1.0);
}