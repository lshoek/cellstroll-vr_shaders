// Description : Array - and textureless GLSL 2D simplex noise .
// Author: Ian McEwan, Ashima Arts. Version : 20110822
// Copyright (C) 2011 Ashima Arts. All rights reserved.
// Distributed under the MIT License. See LICENSE file.
// https://github.com/ashima/webgl-noise
#version 400

uniform float time;
in vec2 texCoord;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
{
	const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
	                  	0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
	                   -0.577350269189626,  // -1.0 + 2.0 * C.x
	                  	0.024390243902439); // 1.0 / 41.0
	// First corner
	vec2 i  = floor(v + dot(v, C.yy));
	vec2 x0 = v -   i + dot(i, C.xx);

	// Other corners
	vec2 i1;
	//i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
	//i1.y = 1.0 - i1.x;
	i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	// x0 = x0 - 0.0 + 0.0 * C.xx ;
	// x1 = x0 - i1 + 1.0 * C.xx ;
	// x2 = x0 - 1.0 + 2.0 * C.xx ;
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;

	// Permutations
	i = mod289(i); // Avoid truncation effects in permutation
	vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

	vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
	m = m*m ;
	m = m*m ;

	// Gradients: 41 points uniformly over a line, mapped onto a diamond.
	// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;

	// Normalise gradients implicitly by scaling m
	// Approximation of: m *= inversesqrt( a0*a0 + h*h );
	m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

	// Compute final noise value at P
	vec3 g;
	g.x  = a0.x  * x0.x  + h.x  * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

vec3 getColor(float f)
{
	vec3 color1 = vec3(255,188,189);
	vec3 color2 = vec3(255,112,158);
	//vec3 color2 = vec3(255,148,182);

	float r, g, b;

	if (color1.r > color2.r)
		r = (color1.r/255.0f) - (((color1.r/255.0f)-(color2.r/255.0f)) * f);
	else
		r = (color1.r/255.0f) + (((color1.r/255.0f)-(color2.r/255.0f)) * f);

	if (color1.g > color2.g)
		g = (color1.g/255.0f) - (((color1.g/255.0f)-(color2.g/255.0f)) * f);
	else
		g = (color1.g/255.0f) + (((color1.g/255.0f)-(color2.g/255.0f)) * f);

	if (color1.b > color2.b)
		b = (color1.b/255.0f) - (((color1.b/255.0f)-(color2.b/255.0f)) * f);
	else
		b = (color1.b/255.0f) + (((color1.b/255.0f)-(color2.b/255.0f)) * f);

	return vec3(r, g, b);
}

void main()
{
	float coeff = 0.6f;
	float fbm = 
		(0.5*sin(time))*snoise(vec2(5.0*texCoord*coeff))
		+ 0.5*snoise(vec2(10.0*texCoord*coeff))
		+ 0.15*snoise(vec2(20.0*texCoord*coeff))
		+ 0.125*snoise(vec2(40.0*texCoord*coeff))
		+ 0.0625*snoise(vec2(80.0*texCoord*coeff));

	gl_FragColor = vec4((getColor(fbm)), 1.0f);
}