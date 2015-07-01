#version 400

uniform sampler2D screenTexture;
uniform sampler2D byteDataTexture;
in vec2 texCoord;

void main()
{
	gl_FragData[0] = texture(screenTexture, texCoord);
	gl_FragData[1] = texture(byteDataTexture, texCoord) * 1.5;
}