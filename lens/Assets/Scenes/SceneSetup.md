# Scene Setup Guide for Futuristic AR Lens

## Main Scene Hierarchy

```
Root
├── Environment
│   ├── GridFloor
│   ├── AmbientLight (Soft blue light)
│   └── DirectionalLight (Cinematic key light)
├── HolographicUI
│   ├── HolographicPanel_01
│   ├── HolographicPanel_02
│   ├── HolographicPanel_03
│   └── HolographicPanel_04
├── NeuralNetworkContainer
│   ├── NetworkNodes (Particle system)
│   └── NetworkConnections (Line renderer)
├── ParticleSystem
│   └── LightParticles (Soft ambient particles)
└── PostProcessing
    ├── DepthOfField
    ├── Bloom
    └── ColorGrading
```

## Component Setup Instructions

### 1. Environment Setup

#### GridFloor
- **Position**: (0, -2, 0)
- **Scale**: (20, 1, 20)
- **Material**: GridFloorMaterial.shader
- **Properties**:
  - Grid Color: Cyan (0, 1, 1)
  - Background Color: Dark Slate (0.04, 0.08, 0.15)
  - Grid Size: 10.0
  - Transparency: 0.7

#### Lighting
- **Ambient Light**:
  - Color: Light Blue (#6699FF)
  - Intensity: 0.8
  - Affects UI elements

- **Directional Light** (Key Light):
  - Color: White (#FFFFFF)
  - Intensity: 1.2
  - Direction: (-0.5, 0.8, -0.3)
  - Casts shadows

### 2. Holographic UI Panels

Create 4 panels arranged in a circle around the user:

#### Panel 01 - Front Left
- **Position**: (-2.5, 1, -3)
- **Rotation**: (0, 15, 0)
- **Scale**: (1.2, 1.5, 0.1)
- **Material**: HolographicMaterial.shader
- **Collider**: Box (for interaction)

#### Panel 02 - Front Right
- **Position**: (2.5, 1, -3)
- **Rotation**: (0, -15, 0)
- **Scale**: (1.2, 1.5, 0.1)
- **Material**: HolographicMaterial.shader

#### Panel 03 - Back Left
- **Position**: (-2.5, 1, 3)
- **Rotation**: (0, 165, 0)
- **Scale**: (1.2, 1.5, 0.1)
- **Material**: HolographicMaterial.shader

#### Panel 04 - Back Right
- **Position**: (2.5, 1, 3)
- **Rotation**: (0, -165, 0)
- **Scale**: (1.2, 1.5, 0.1)
- **Material**: HolographicMaterial.shader

### 3. Neural Network Visualization

#### NetworkNodes (Particle System)
- **Position**: (0, 1.5, 0)
- **Scale**: (1, 1, 1)
- **Settings**:
  - Start Color: Cyan (0, 1, 1, 0.8)
  - Start Size: 0.3
  - Lifetime: 3 seconds
  - Emission Rate: 50/sec
  - Max Particles: 200

#### NetworkConnections (Line Renderer)
- **Position**: (0, 1.5, 0)
- **Material**: Custom line shader with cyan glow
- **Line Width**: 0.02
- **Color**: Glowing Blue (0, 0.8, 1)

### 4. Particle System

#### LightParticles
- **Position**: (0, 0, 0)
- **Scale**: (10, 10, 10)
- **Settings**:
  - Start Color: White with transparency
  - Start Size: 0.1-0.3
  - Lifetime: 2-4 seconds
  - Emission Rate: 100/sec
  - Velocity: Random (-1, -1, -1) to (1, 2, 1)

### 5. Post-Processing

#### Depth of Field
- **Focus Distance**: 3.0
- **Focus Range**: 1.0
- **Blur Radius**: 0.8

#### Bloom
- **Intensity**: 1.5
- **Threshold**: 0.5
- **Soft Knee**: 0.5

#### Color Grading
- **Saturation**: 1.1
- **Brightness**: 1.0
- **Contrast**: 1.05
- **Color Balance**:
  - Shadows: Slight blue tint
  - Midtones: Neutral to cool
  - Highlights: Bright cyan

## Material Properties Reference

### HolographicMaterial
```
Glow Color: (0, 0.8, 1, 1) - Bright cyan
Glow Intensity: 1.5
Fresnel Power: 3.0
Transparency: 0.9
Pulse Speed: 2.0
```

### GridFloorMaterial
```
Grid Color: (0, 1, 1, 1) - Cyan
Background Color: (0.04, 0.08, 0.15, 1.0) - Dark slate
Grid Size: 10.0
Line Width: 0.05
Transparency: 0.7
```

## Animation Settings

### Panel Pulse Animation
- **Duration**: 3 seconds
- **Loop**: Infinite
- **Type**: Easing (Ease In-Out)
- **Value Range**: 0.8 to 1.5 (intensity)

### Panel Interaction
- **Scale On Tap**: 1.0 → 1.1
- **Duration**: 300ms
- **Reset**: 300ms back to 1.0

## Performance Optimization Tips

1. **Particle Count**: Adjust max particles based on device (100-200 for mobile)
2. **LOD System**: Create lower detail versions for distant cameras
3. **Shader Optimization**: Use lower precision floats on mobile
4. **Batching**: Group UI panels into single batches
5. **Draw Calls**: Monitor and reduce through material atlasing

## Testing Checklist

- [ ] All panels respond to tap interactions
- [ ] Neural network animation plays smoothly
- [ ] Particles emit and fade naturally
- [ ] Grid floor appears beneath user
- [ ] Holographic materials glow properly
- [ ] Color palette is consistent (white, blue, cyan)
- [ ] Depth of field creates cinematic effect
- [ ] No texture tearing or z-fighting
- [ ] Frame rate stable at 60fps
- [ ] Memory usage within limits

## Deployment Notes

- Ensure all references are properly linked in Lens Studio
- Test on multiple device types (iOS/Android)
- Adjust particle counts for lower-end devices
- Monitor heat generation on mobile devices
- Verify AR tracking performance with users
