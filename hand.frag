#version 400

uniform sampler2D s_texture;
uniform bool isRight;

in vec3 fragVert;
in vec3 fragNormal;
in vec2 texCoord;

void main()
{  
    vec2 fragTexCoord;
    if (isRight)
        fragTexCoord = texCoord * vec2(-1.0, 1.0);
    else
        fragTexCoord = texCoord;

    gl_FragColor = vec4(texture2D(s_texture, fragTexCoord));

    if (gl_FragColor.a < 1.0)
        discard;
}