// HolographicMaterial.shader
// Creates futuristic glowing holographic effect

uniform float4 glowColor = float4(0.0, 0.8, 1.0, 1.0);
uniform float glowIntensity = 1.5;
uniform float pulse = 0.5;
uniform float transparency = 0.9;
uniform float fresnel_power = 3.0;

varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUV;

#ifdef VERTEX_SHADER

void vertex() {
    vNormal = normalize(N);
    vViewDir = normalize(viewDir);
    vUV = UV;
    
    // Add vertex animation for holographic effect
    vec3 worldPos = (M * vec4(P, 1.0)).xyz;
    gl_Position = ProjMatrix * (V * vec4(worldPos, 1.0));
}

#endif

#ifdef FRAGMENT_SHADER

void fragment() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewDir);
    
    // Fresnel effect for holographic appearance
    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), fresnel_power);
    
    // Add pulsing glow
    float pulseFactor = 0.5 + 0.5 * sin(pulse * 6.28);
    float glowFactor = fresnel * pulseFactor * glowIntensity;
    
    // Base color with glow
    vec3 finalColor = glowColor.rgb * (1.0 + glowFactor);
    
    // Add scanlines for tech effect
    float scanlines = sin(vUV.y * 30.0) * 0.1 + 0.9;
    finalColor *= scanlines;
    
    // Apply transparency
    gl_FragColor = vec4(finalColor, transparency * fresnel);
}

#endif
