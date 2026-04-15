# Quick Start Guide - Futuristic Holographic AR Lens

## 5-Minute Setup

### 1. Open Lens Studio
- Launch Lens Studio
- Create a new project
- Select "Empty Project"

### 2. Import Project Files
```
File → Open
Navigate to: /Users/azhar/Desktop/Desktop/lens
Select the project folder
```

### 3. Add Shaders to Project
```
1. In Lens Studio: Assets → Import Asset
2. Select: Assets/Materials/HolographicMaterial.shader
3. Repeat for: GridFloorMaterial.shader
```

### 4. Import Scripts
```
1. Assets → Import Asset
2. Select all .js files from Assets/Scripts/
3. Click Import
```

## Project Structure Explained

```
lens/
├── README.md                 ← Project overview
├── CONFIGURATION.md          ← Configuration guide
├── Assets/
│   ├── Materials/           ← Shader files
│   ├── Scripts/             ← JavaScript files
│   ├── Scenes/              ← Scene setup guide
│   ├── Textures/            ← Texture assets (create these)
│   └── Models/              ← 3D models (create these)
└── Assets/
    ├── ASSET_GUIDE.md       ← Texture/model guide
    └── VFX_DOCUMENTATION.md ← Visual effects details
```

## Core Components

### 1. **HolographicUIManager.js**
- Manages interactive UI panels
- Handles tap/click interactions
- Controls glow animations

### 2. **NeuralNetworkVFX.js**
- Creates animated neural network visualization
- Generates node positions and connections
- Manages animation state

### 3. **ParticleEffects.js**
- Soft light particle system
- Ambient atmosphere creation
- Configurable emission and lifetime

### 4. **Main.js**
- Entry point for the lens
- Initializes all systems
- Manages update loop

### 5. **Shaders**
- `HolographicMaterial.shader` - UI glow effect
- `GridFloorMaterial.shader` - Digital floor

## Next Steps

### Essential (Required for functional lens)
1. ✅ Import all shader files
2. ✅ Import all script files
3. ⭕ Create main scene (follow Assets/Scenes/SceneSetup.md)
4. ⭕ Create/import 3D models for UI panels
5. ⭕ Create/import textures
6. ⭕ Configure materials with shaders
7. ⭕ Set up holographic panels in scene
8. ⭕ Test in Lens Studio preview

### Enhanced (Recommended)
- Add custom colors/branding
- Create additional UI panels
- Implement custom interactions
- Add audio effects
- Optimize for specific devices

### Advanced (Optional)
- Add face tracking elements
- Implement gesture recognition
- Create data visualization modes
- Add physics interactions
- Build statistics/analytics

## Default Configuration

### Colors
- **Primary Glow**: Bright Cyan #00C8FF
- **UI Background**: Dark Blue #0A1220
- **Accent**: Electric Blue #00CCFF

### Performance
- **Particle Count**: 100-200 (adjustable)
- **Target FPS**: 60 (minimum 30)
- **Memory Target**: < 200MB

### Interactions
- **Tap**: Scale panels (1.0 → 1.1)
- **Duration**: 300ms animation
- **Feedback**: Visual scale + glow pulse

## Testing Checklist

Before publishing to Snapchat:

- [ ] All panels render correctly
- [ ] Tap interactions work
- [ ] Particles emit and fade
- [ ] Neural network animates
- [ ] Colors are vibrant
- [ ] Frame rate is stable (30-60 FPS)
- [ ] No memory leaks
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Thermal performance acceptable

## Customization Examples

### Change Glow Color
In `HolographicMaterial.shader`:
```glsl
uniform float4 glowColor = float4(0.0, 0.8, 1.0, 1.0); // Cyan
// Change to:
uniform float4 glowColor = float4(1.0, 0.0, 1.0, 1.0); // Magenta
```

### Adjust Particle Count
In `ParticleEffects.js`:
```javascript
particleCount: 100,    // Increase for more particles
emissionRate: 50,      // Particles per second
```

### Modify Animation Speed
In `NeuralNetworkVFX.js`:
```javascript
pulseSpeed: 2000,      // Milliseconds per pulse cycle
```

## Keyboard Shortcuts in Lens Studio

| Action | Shortcut |
|--------|----------|
| Play/Pause | Space |
| Reset View | R |
| Zoom In | Scroll Up |
| Zoom Out | Scroll Down |
| Rotate View | Middle Mouse + Drag |
| Pan View | Right Mouse + Drag |

## Troubleshooting

### Lens Won't Load
- Check Lens Studio console for errors
- Verify all scripts are imported
- Ensure no circular dependencies

### Shaders Not Rendering
- Confirm shaders are in project
- Check material assignments
- Verify shader compilation

### Poor Performance
- Reduce particle count
- Lower texture resolution
- Check for geometry issues

### Interaction Not Working
- Verify script is attached to scene
- Check tap event binding
- Ensure colliders are set up

## API Reference Quick Guide

### Backboard Proxy Integration

`Main.js` now exports two helper methods:

- `sendAssistantPrompt(content, options)`
- `resetAssistantSession()`

Use these methods from your interaction handlers to call your local backend proxy (`http://localhost:3000/api/backboard/message`) without exposing your Backboard API key in Lens assets.

Example flow:

1. Start your backend proxy from `api/`.
2. Call `sendAssistantPrompt("Give me a futuristic UI tip")` when a panel is tapped.
3. Read the assistant text from `result.response.content`.
4. Keep using the returned `threadId` automatically through the built-in session state.
5. Call `resetAssistantSession()` when you want to start a fresh conversation.

Current default behavior:

1. `Main.js` now automatically sends a prompt when a holographic panel is activated.
2. Repeated taps while a request is active are ignored to prevent request flooding.
3. If a scene object named `AssistantResponseText` exists, the assistant response is written there.
4. If `AssistantResponseText` is missing, responses are still logged to Diagnostics.

### HolographicUIManager
```javascript
manager.setGlowIntensity(1.5)     // 0.5-2.0
manager.setPulseSpeed(1.0)        // 0.1-3.0
```

### NeuralNetworkVFX
```javascript
vfx.setGlowColor(r, g, b)         // 0-1 range
vfx.setAnimationSpeed(2000)        // milliseconds
```

### ParticleEffects
```javascript
particles.setEmissionRate(50)      // particles/sec
particles.setParticleColor(r, g, b) // 0-1 range
particles.startEmission()          // begin emission
particles.stopEmission()           // stop emission
```

## Publishing to Snapchat

1. **Finalize Assets**
   - Ensure all textures are optimized
   - Verify model LOD levels
   - Test on target devices

2. **Build for Snapchat**
   - File → Export for Snapchat
   - Select iOS/Android
   - Choose optimization level

3. **Upload to Snap**
   - Snapchat Creator Portal
   - Upload .lns file
   - Configure settings
   - Submit for review

4. **Monitor Performance**
   - Track user engagement
   - Monitor crash reports
   - Gather feedback

## Resources

- **Lens Studio Docs**: https://support.snapchat.com/lens-studio
- **Asset Guide**: See `Assets/ASSET_GUIDE.md`
- **VFX Guide**: See `Assets/VFX_DOCUMENTATION.md`
- **Configuration**: See `CONFIGURATION.md`

## Support & Feedback

For issues or feature requests:
1. Check the documentation files
2. Review the code comments
3. Test in Lens Studio preview
4. Check Snapchat Creator documentation

## Performance Tips

### For Smooth 60 FPS
- Keep particles under 150
- Use simple geometry
- Minimize shader complexity
- Batch draw calls

### For Battery Life
- Disable unnecessary effects
- Reduce emission rates
- Optimize texture sizes
- Use LOD models

### For Low-End Devices
- Particle count: 50
- Texture size: 512x512
- Disable post-processing
- Simplify geometry

## Version Information

- **Project Version**: 1.0
- **Lens Studio Target**: 4.0+
- **Snapchat AR Support**: iOS 11.2+ / Android 5.0+
- **Last Updated**: April 15, 2026

---

**Ready to create something amazing!** Start by following the Scene Setup guide in `Assets/Scenes/SceneSetup.md`.
