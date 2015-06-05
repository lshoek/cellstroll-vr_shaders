#version 400

uniform mat4 modelViewMatrix;
uniform vec3 materialSpecularColor;
uniform vec3 cameraPosition;
uniform sampler2D s_texture;
uniform sampler2D s_normals;
uniform float materialShininess;
uniform float time;
uniform bool isRight;

in vec3 fragVert;
in vec3 fragNormal;
in vec2 texCoord;

uniform struct Light 
{
   vec3 position;
   vec3 intensities;
   float attenuation;
   float ambientCoefficient;
} light;

void main()
{  
  /*
    // Locals
    mat3 normalMatrix = transpose(inverse(mat3(modelViewMatrix)));
    vec3 normal = normalize(normalMatrix * fragNormal);
    vec3 surfacePos = vec3(modelViewMatrix * vec4(fragVert, 1.0f));
    vec3 surfaceToLight = normalize(light.position - surfacePos);
    vec3 surfaceToCamera = normalize(cameraPosition - surfacePos);

    // Ambient
    vec3 ambient = light.ambientCoefficient * light.intensities;

    // Diffuse
    float diffuseCoefficient = max(0.0, dot(normal, surfaceToLight));
    vec3 diffuse = diffuseCoefficient * light.intensities;

    // Specular Lighting
    float specularCoefficient = 0.0;
    if(diffuseCoefficient > 0.0)
        specularCoefficient = pow(max(0.0, dot(surfaceToCamera, reflect(-surfaceToLight, normal))), materialShininess);
    vec3 specular = specularCoefficient * materialSpecularColor * light.intensities;
    */

    // Calculate Color
    //gl_FragColor = vec4(texture2D(s_texture, texCoord).rgb, 1.0) * vec4((ambient + diffuse + specular), 1.0);
    vec2 fragTexCoord;

    if (isRight)
        fragTexCoord = texCoord * vec2(-1.0, 1.0);
    else
        fragTexCoord = texCoord;

    gl_FragColor = vec4(texture2D(s_texture, fragTexCoord));

    if (gl_FragColor.a < 1.0)
        discard;
}