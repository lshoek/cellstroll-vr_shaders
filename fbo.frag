#version 400

uniform float time;
uniform vec2 screenSize;
uniform sampler2D s_texture;
varying vec2 texCoord;

void main()
{
	vec4 color = texture(s_texture, texCoord);
	gl_FragColor = color;
}