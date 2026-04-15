# Lens Configuration Guide

## Quick Start

1. **Open Lens Studio** and create a new project
2. **Import Assets** from the Assets folder
3. **Follow Scene Setup** instructions in Assets/Scenes/SceneSetup.md
4. **Configure Materials** using the shader files provided
5. **Test** on device before publishing

## Color Palette Reference

### Primary Colors
- **Cyan/Electric Blue**: RGB(0, 200, 255) / HEX(#00C8FF)
- **Deep Blue**: RGB(0, 136, 255) / HEX(#0088FF)
- **White**: RGB(255, 255, 255) / HEX(#FFFFFF)

### Secondary Colors
- **Dark Slate**: RGB(10, 18, 32) / HEX(#0A1220)
- **Medium Blue**: RGB(15, 50, 100) / HEX(#0F3264)
- **Glow Accent**: RGB(100, 220, 255) / HEX(#64DCFF)

## Key Parameters

### UI Elements
```
Panel Opacity: 0.9 (90% visible)
Glow Intensity: 1.5x base brightness
Interaction Scale: 1.1x (10% larger on tap)
Pulse Speed: 1.0 (1 pulse per 3 seconds)
```

### Particle System
```
Emission Rate: 50 particles/second
Lifetime: 3 seconds
Velocity Scale: 0.5
Particle Color: Cyan with transparency
Max Particles: 200
```

### Neural Network
```
Node Count: 12 nodes
Connection Count: 20 connections
Pulse Speed: 2 seconds per cycle
Glow Color: Cyan (0, 0.8, 1.0)
Animation Intensity: 1.0
```

### Lighting
```
Ambient Light: Light Blue, 0.8 intensity
Directional Light: White, 1.2 intensity
Soft Shadows: Enabled
Light Probes: Auto
```

### Post-Processing
```
Depth of Field: Focus distance 3.0m
Bloom: Intensity 1.5, Threshold 0.5
Color Grade: Saturation 1.1
Motion Blur: Disabled (for AR clarity)
```

## Device Optimization

### High-End Devices (iPhone 12+, Flagship Android)
- Full particle count: 200
- Full resolution textures
- All post-processing effects
- High polygon count models

### Mid-Range Devices (iPhone 8-11, Mid-range Android)
- Reduced particles: 100-150
- Standard resolution textures
- Limited bloom effect
- Optimized polygon count

### Low-End Devices (iPhone SE, Budget Android)
- Minimal particles: 50-75
- Low resolution textures
- No bloom effect
- LOD models required

## Performance Targets

- **Frame Rate**: 60 FPS (minimum 30 FPS stable)
- **Memory**: < 200MB (peak usage)
- **Thermal**: Acceptable heat generation (no throttling)
- **Battery**: Minimal drain increase

## Interactive Elements

### Tap Interactions
- Each holographic panel responds to tap
- Visual feedback: scale animation + glow pulse
- Multi-tap support for complex interactions

### Face Tracking (Optional)
- Attach UI to face for continuous visibility
- Scale based on face distance
- Rotate with head movement

### World Tracking (Optional)
- UI remains in world space
- Grid floor attached to ground plane
- Neural network floats in center

## Export Settings

### For Snapchat Publishing
- **Platform**: iOS & Android
- **Resolution**: 1080x1920 (portrait mode)
- **Frame Rate**: 30-60 FPS
- **File Format**: .lns (Lens Studio format)

### Size Requirements
- Target lens size: < 10MB
- Uncompressed: Optimize before publish
- Streaming assets: Pre-download if needed

## Customization Options

### Easy Changes
1. **Glow Intensity**: Modify in HolographicUIManager
2. **Color Palette**: Edit shader RGB values
3. **Particle Count**: Adjust in ParticleEffects config
4. **Animation Speed**: Modify pulse timings

### Advanced Changes
1. **Add New UI Panels**: Duplicate existing + configure
2. **Custom Shaders**: Edit .shader files
3. **New Particle Effects**: Extend ParticleEffects.js
4. **Additional VFX**: Reference NeuralNetworkVFX pattern

## Troubleshooting

### Performance Issues
- Reduce particle count
- Lower shader quality
- Disable bloom effect
- Optimize texture sizes

### Visual Issues
- Check material assignments
- Verify light directions
- Confirm shader compilation
- Test on actual device

### Interaction Issues
- Verify collider setup
- Check tap event binding
- Confirm script execution order
- Monitor console logs

## Next Steps

1. Create texture assets for panels
2. Add audio effects for interactions
3. Implement user customization options
4. Add analytics tracking
5. Create additional scene variations
6. Optimize for all target devices

## Support Resources

- Lens Studio Documentation: https://support.snapchat.com/en-US/a/camera-kit
- Script API Reference: Check LensStudio docs
- Shader Examples: Assets/Materials folder
- Script Examples: Assets/Scripts folder
