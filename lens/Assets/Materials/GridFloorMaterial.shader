// GridFloorMaterial.shader
// Creates digital grid floor effect

uniform float4 gridColor = float4(0.0, 1.0, 1.0, 1.0);
uniform float4 backgroundColor = float4(0.04, 0.08, 0.15, 1.0);
uniform float gridSize = 10.0;
uniform float lineWidth = 0.05;
uniform float transparency = 0.7;
uniform float distortionAmount = 0.1;

varying vec3 vWorldPos;
varying vec2 vUV;

#ifdef VERTEX_SHADER

void vertex() {
    vWorldPos = (M * vec4(P, 1.0)).xyz;
    vUV = UV;
    gl_Position = ProjMatrix * (V * vec4(vWorldPos, 1.0));
}

#endif

#ifdef FRAGMENT_SHADER

void fragment() {
    // Create grid pattern
    vec2 gridUV = mod(vUV * gridSize, 1.0);
    
    // Calculate grid lines
    float dx = abs(dFdx(gridUV.x));
    float dy = abs(dFdy(gridUV.y));
    
    // Smooth grid line edges
    float gridX = smoothstep(lineWidth - dx, lineWidth + dx, abs(gridUV.x - 0.5) * 2.0);
    float gridY = smoothstep(lineWidth - dy, lineWidth + dy, abs(gridUV.y - 0.5) * 2.0);
    
    // Combine grid
    float grid = gridX * gridY;
    
    // Add distortion based on distance
    float distortion = sin(vUV.x * 3.14 + vUV.y * 3.14) * distortionAmount;
    grid += distortion;
    
    // Blend between grid and background
    vec3 finalColor = mix(backgroundColor.rgb, gridColor.rgb, grid);
    
    // Add depth falloff
    float depth = length(vWorldPos);
    float depthFade = exp(-depth * 0.1);
    
    gl_FragColor = vec4(finalColor * depthFade, transparency);
}

#endif
