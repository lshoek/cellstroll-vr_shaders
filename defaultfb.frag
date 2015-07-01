#version 400

uniform sampler2D screenTexture;
in vec2 texCoord;

void main()
{
	gl_FragColor = texture(screenTexture, texCoord);
}