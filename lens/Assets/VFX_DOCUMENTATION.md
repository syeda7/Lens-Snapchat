# Visual Effects Technical Documentation

## Overview
This document outlines the visual effects pipeline for the futuristic holographic AR lens, including shaders, particle systems, and post-processing effects.

## Shader System

### HolographicMaterial.shader

**Purpose**: Creates glowing holographic UI panel effect

**Key Features**:
- Fresnel effect for depth-dependent transparency
- Pulsing glow animation
- Scanline overlay for technological appearance
- Smooth opacity transitions

**Uniforms**:
```glsl
glowColor (float4): RGBA color of the glow
glowIntensity (float): Multiplier for glow strength (1.0-2.0)
pulse (float): Animation parameter (0-1)
transparency (float): Base opacity level
fresnel_power (float): Controls fresnel falloff
```

**Performance**:
- Very lightweight (6 instructions per pixel)
- Works on low-end devices
- Minimal overdraw with transparency

### GridFloorMaterial.shader

**Purpose**: Renders digital grid floor effect

**Key Features**:
- Procedurally generated grid pattern
- Distortion effect for depth perception
- Distance-based fade
- Smooth anti-aliasing

**Uniforms**:
```glsl
gridColor (float4): Color of grid lines
backgroundColor (float4): Color of grid background
gridSize (float): Scale of grid pattern
lineWidth (float): Thickness of grid lines
transparency (float): Overall opacity
distortionAmount (float): Magnitude of wave distortion
```

**Optimization Notes**:
- Uses derivative functions for anti-aliasing
- Efficient grid calculation
- Fade reduces overdraw at distance

## Particle System

### Soft Light Particles

**Emitter Configuration**:
```
Position: Origin (0, 0, 0)
Shape: Sphere (radius 2m)
Emission Rate: 50 particles/second
Lifetime: 2-4 seconds
Max Particles: 200
```

**Particle Properties**:
```
Size: 0.1-0.3 units
Color: White (RGB 255, 255, 255)
Transparency: Fades over lifetime
Velocity: Random, constrained
Physics: Gravity enabled (-9.8 m/s²)
```

**Rendering**:
- Additive blending
- Soft particles (depth tested)
- HDR rendering for glow

### Neural Network Particles

**Node System**:
- 12 nodes positioned in spherical pattern
- Each node pulses independently
- Color: Cyan (RGB 0, 200, 255)
- Size: 0.2-0.4 units

**Connection System**:
- 20 connections between random nodes
- Animated line renderer
- Width: 0.02 units
- Color gradient based on connection intensity

**Animation**:
```
Pulse Frequency: 2 seconds per cycle
Node Intensity: 0.5-1.0 (normalized)
Connection Probability: 40% activation
Update Frequency: 60 FPS
```

## Post-Processing Pipeline

### Depth of Field

**Settings**:
```
Focus Mode: Manual
Focus Distance: 3.0 meters
Focus Range: 1.0 meters (smoothness)
Blur Samples: 16-32
Blur Radius: 0.8 units
```

**Effect**: Cinematic focus on UI panels while blurring background

### Bloom Effect

**Settings**:
```
Intensity: 1.5
Threshold: 0.5 (values above 50% brightness)
Soft Knee: 0.5 (smooth falloff)
Blur Iterations: 5
Upsample Count: 5
```

**Result**: Glowing halos around bright UI elements and particles

### Color Grading

**LUT-Based Adjustments**:
```
Saturation: 1.1 (10% more saturated)
Brightness: 1.0 (neutral)
Contrast: 1.05 (5% increase)
```

**Channel-Specific Adjustments**:
- **Shadows**: +0.05 blue (cool tone)
- **Midtones**: Neutral
- **Highlights**: +0.1 cyan (bright cyan accents)

## Animation System

### UI Pulse Animation

**Timeline**:
```
Duration: 3 seconds
Loop: Infinite
Easing: EaseInOutQuad

Keyframes:
  0%   → Intensity 0.8
  50%  → Intensity 1.5 (peak glow)
  100% → Intensity 0.8
```

### Particle Velocity Curve

**Launch Phase (0-0.2s)**:
- Velocity: Full
- Acceleration: Gravity only

**Mid-Life Phase (0.2-0.8s)**:
- Velocity: Decelerating
- Fade: Minimal (fully visible)

**End-Life Phase (0.8-1.0s)**:
- Velocity: Minimal
- Fade: Rapid (0→1 opacity)

### Neural Network Update

**Connection Activation** (Every 60 frames):
- Probability: 5% per connection
- Duration: 1-3 seconds
- Animation: Fade in/out

**Node Pulsing** (Continuous):
- Phase Offset: Per-node (0-2π)
- Frequency: 1 Hz
- Amplitude: 0.5 (intensity variation)

## Rendering Order (Important)

1. **Opaque Objects** (Grid floor)
2. **Transparent Objects** (UI panels)
3. **Particles** (Light and network)
4. **Post-Processing** (Bloom, DOF, Grading)

## GPU Memory Usage

### Typical Configuration
```
Textures: ~20-30 MB
  - UI panel textures: ~10 MB
  - Grid texture: ~5 MB
  - Bloom LUT: ~2 MB
  - Misc: ~5 MB

Mesh Data: ~5-10 MB
  - UI panels: ~2 MB
  - Grid floor: ~1 MB
  - Neural network geometry: ~2 MB

Shader Programs: ~5-8 MB
  - Holographic shader: ~2 MB
  - Grid shader: ~1.5 MB
  - Particle shaders: ~2 MB

Particle Buffer: ~10-20 MB (varies with count)

Total: 40-70 MB typical
```

## Performance Optimization Strategies

### For High-End Devices
- Maximum particle count (200)
- Full resolution textures
- 16x bloom blur samples
- Full depth of field

### For Mid-Range Devices
- Medium particle count (100)
- Half resolution textures
- 8x bloom blur samples
- Simplified DOF

### For Low-End Devices
- Minimal particle count (50)
- Quarter resolution textures
- 4x bloom blur samples
- No DOF (fixed focus)

## Shader Compilation Tips

1. **Check for Syntax Errors**: Verify all function signatures
2. **Test on Target Devices**: Different GPUs may behave differently
3. **Monitor Instruction Count**: Aim for <20 instructions per pixel
4. **Use Appropriate Precision**: Consider using `mediump` on mobile

## Advanced Customization

### Adding New Glow Colors
Edit the glow color in respective shaders:
```glsl
uniform float4 glowColor = float4(NEW_R, NEW_G, NEW_B, 1.0);
```

### Adjusting Particle Behavior
Modify ParticleEffects.js:
```javascript
getRandomVelocity() {
    const speed = Math.random() * this.config.velocityScale;
    // Customize velocity calculations here
}
```

### Creating Custom Post-Effects
Extend post-processing chain in scene:
1. Add new shader
2. Apply to camera output
3. Integrate with existing pipeline

## Testing Recommendations

1. **Visual Testing**: Compare on multiple devices
2. **Performance Testing**: Profile GPU usage
3. **Thermal Testing**: Monitor device temperature
4. **Battery Testing**: Measure power consumption
5. **User Testing**: Gather feedback on visual impact

## Troubleshooting

### Holographic Material Not Glowing
- Check shader compilation
- Verify glow color values
- Ensure material is assigned correctly
- Check lighting conditions

### Particles Not Visible
- Verify particle count > 0
- Check emission rate
- Confirm particle lifetime > 0
- Ensure camera can see particles

### Grid Floor Flickering
- Increase line width
- Reduce grid size
- Check camera near/far planes
- Verify depth testing

### Performance Drop
- Reduce particle count
- Lower texture resolution
- Disable bloom if not needed
- Check for geometry overdraw
