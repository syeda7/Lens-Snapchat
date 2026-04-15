# Asset Import and Texture Guide

## Texture Requirements

All textures should follow these specifications for optimal performance:

### UI Panel Textures
- **Resolution**: 2048x2048 or 1024x1024
- **Format**: PNG (RGBA) or TGA
- **Color Space**: sRGB
- **Compression**: Automatic (ETC2/ASTC on mobile)
- **Content**: Holographic panel design with transparency

**Recommended Textures**:
- `panel_diffuse.png` - Main panel color/pattern
- `panel_normal.png` - Normal map for depth
- `panel_roughness.png` - Roughness/metallic map
- `panel_emission.png` - Emission map for glow areas

### Grid Floor Texture
- **Resolution**: 512x512
- **Format**: PNG (RGB)
- **Color Space**: sRGB
- **Content**: Grid line pattern or procedural gradient

**Recommended File**: `grid_floor.png`

### UI Icon Assets
- **Resolution**: 512x512
- **Format**: PNG (RGBA)
- **Color Space**: sRGB
- **Content**: Holographic UI icons (system, settings, info, etc.)

**Recommended Icons**:
- `icon_settings.png`
- `icon_info.png`
- `icon_close.png`
- `icon_zoom.png`

## 3D Model Guidelines

### Panel Models
- **Format**: FBX, OBJ, or GLTF
- **Polygon Count**: 500-2000 per panel
- **Materials**: 1-2 per panel
- **Optimization**: Remove unused geometry

**Recommended Structure**:
```
HolographicPanel
├── frame (geometry)
├── screen (geometry)
└── lights (optional)
```

### Neural Network Elements
- **Node Models**: Simple spheres (100-300 polys each)
- **Connection Models**: Cylinders or ribbon geometry
- **Total Count**: Optimize to ~50K polys

## Import Process in Lens Studio

### Step 1: Prepare Assets
```
1. Verify texture sizes and formats
2. Check model polygon counts
3. Validate material assignments
4. Test on low-end device first
```

### Step 2: Import Textures
```
1. Asset → Import Textures
2. Select all texture files
3. Verify color space settings
4. Check compression format
```

### Step 3: Import Models
```
1. Asset → Import Models
2. Select FBX/OBJ/GLTF file
3. Configure material import
4. Verify scale and orientation
```

### Step 4: Configure Materials
```
1. Create new material
2. Assign shader (HolographicMaterial.shader)
3. Set texture slots:
   - Diffuse: panel_diffuse.png
   - Normal: panel_normal.png
   - Emission: panel_emission.png
4. Adjust parameters
```

## Recommended Texture Atlasing

### Combining Multiple Assets
For performance, combine textures into atlases:

**Atlas Layout**:
```
2048x2048 Master Texture
├── 1024x1024: Panel textures (top-left)
├── 512x512: UI icons (top-right)
├── 512x512: Grid pattern (bottom-left)
└── 512x512: Reserved (bottom-right)
```

**Benefits**:
- Reduces draw calls
- Improves cache efficiency
- Faster GPU memory access
- Better performance on mobile

## Texture Naming Convention

Use consistent naming for organization:

```
{element}_{type}_{resolution}.{extension}

Examples:
panel_diffuse_2k.png
panel_normal_2k.png
panel_emission_1k.png
grid_floor_512.png
icon_settings_512.png
icon_info_512.png
```

## Material Slot Mapping

### HolographicMaterial Slots
```
Slot 0: Diffuse (main color)
Slot 1: Normal (detail/depth)
Slot 2: Emission (glow areas)
Slot 3: Roughness (optional)
Slot 4: Metallic (optional)
```

### GridFloorMaterial Slots
```
Slot 0: Pattern texture (primary)
Slot 1: Normal map (optional)
```

## Color Reference for Textures

When creating custom textures, use these color values:

### Primary Glow Area
- **RGB**: 0, 200, 255
- **HEX**: #00C8FF
- **Alpha**: 200/255 (0.78)

### Panel Background
- **RGB**: 20, 30, 50
- **HEX**: #141E32
- **Alpha**: 230/255 (0.90)

### Accent Highlights
- **RGB**: 100, 220, 255
- **HEX**: #64DCFF
- **Alpha**: 128/255 (0.50)

### Grid Lines
- **RGB**: 0, 255, 255
- **HEX**: #00FFFF
- **Alpha**: 200/255 (0.78)

## Optimization Checklist

- [ ] All textures are power-of-2 dimensions
- [ ] Color space is correctly set (sRGB for colors, Linear for data)
- [ ] Compression is appropriate for target devices
- [ ] Normal maps are properly authored
- [ ] Models use shared materials where possible
- [ ] Polygon counts are within limits
- [ ] Vertex colors are baked where appropriate
- [ ] All assets fit within memory budget

## Troubleshooting Import Issues

### Textures Appear Pink
- Check color space (should be sRGB)
- Verify file format is supported
- Try converting to PNG

### Models Import with Wrong Scale
- Check model scale in 3D software (usually in cm or m)
- Use scale parameter in import settings
- Manually adjust in scene if needed

### Materials Not Applying
- Verify material is assigned in import settings
- Check that textures are in project
- Ensure shader exists and is compatible

### Poor Performance After Import
- Reduce texture resolution
- Optimize polygon count
- Use model LOD system
- Consider atlasing textures

## File Organization

Recommended folder structure in Lens Studio:

```
Assets/
├── Textures/
│   ├── UI/
│   │   ├── panel_diffuse_2k.png
│   │   ├── panel_normal_2k.png
│   │   └── panel_emission_1k.png
│   ├── Environment/
│   │   └── grid_floor_512.png
│   └── Icons/
│       ├── icon_settings_512.png
│       └── icon_info_512.png
├── Models/
│   ├── UI/
│   │   └── holographic_panels.fbx
│   └── Environment/
│       └── grid_floor.fbx
└── Materials/
    ├── HolographicMaterial.mat
    └── GridFloorMaterial.mat
```

## Performance Budgets

### Texture Memory Budget
- High-end: 50 MB
- Mid-range: 30 MB
- Low-end: 15 MB

### Model Memory Budget
- High-end: 30 MB
- Mid-range: 15 MB
- Low-end: 8 MB

### Total Asset Budget
- High-end: 80 MB
- Mid-range: 45 MB
- Low-end: 23 MB
