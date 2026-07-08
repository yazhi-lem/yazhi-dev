# Yazhi 3D Architecture — Technical Deep-Dive

## System Overview

The Yazhi marketing site's 3D world is built with **React Three Fiber (R3F)** and **Drei** utilities, rendering a procedurally-generated open world using **Three.js**. The experience is:

- **Scroll-driven**: Page scroll position maps directly to camera Z-axis travel
- **Procedural**: No downloaded 3D models; all geometry generated at runtime
- **Deterministic**: Seeded random number generation ensures identical worlds on every visit
- **Performant**: Instanced meshes, fog culling, adaptive rendering
- **Progressive**: Graceful degradation for older browsers, mobile devices, reduced motion

---

## Component Hierarchy

```
<World>
  <ThinaiWorld>
    <Canvas>
      <CameraRig />
      <Terrain />
      <SangamObjects />
      <GlyphField />
      <Lighting />  {/* Per-zone point lights */}
      <Fog />
    </Canvas>
  </ThinaiWorld>
</World>
```

### `ThinaiWorld.tsx` — Main Orchestrator

**Path**: `src/three/scenes/ThinaiWorld.tsx`

Responsibilities:
1. **Mount gate**: Checks for WebGL support, `prefers-reduced-motion`, and SSR context
2. **Device detection**: Analyzes screen size and CPU cores
3. **Performance monitoring**: Uses `drei.PerformanceMonitor` to watch FPS
4. **Scene setup**: Configures camera, fog, lighting
5. **Adaptive rendering**: Applies quality tiers (high/mid/low)

Key Settings:
```typescript
const camera = {
  position: [0, 0, 5],    // Start at top of kurinji
  fov: 58,                // Field of view
  near: 0.1,
  far: 250
};

const fog = {
  color: '#0b0e1a',       // Night sky
  near: 130,              // Fog starts at 130 units
  far: 185                // Fog fully opaque at 185 units
};

const dpr = Math.min(window.devicePixelRatio, 1.5);  // Cap at 1.5
```

**Quality Tiers**:
- **High**: Full terrain (140 segments), all props, antialiasing, DPR 1.5
- **Mid**: 100-segment terrain, most props, DPR 1.0
- **Low**: 56-segment terrain, sparse props, no AA, DPR 1.0
- **Adaptive**: Starts high, downgrades if FPS < 24 (one-way, no flicker)

---

## Terrain Generation

### `Terrain.tsx` — Procedural Heightfields

**Path**: `src/three/scenes/Terrain.tsx`

The world is composed of **5 zones**, each 70 units long along the Z-axis:

```
ZONE_LEN = 70
WORLD_LEN = 5 * ZONE_LEN = 350

Zone boundaries:
  Kurinji:  z ∈ [0, 70]
  Mullai:   z ∈ [70, 140]
  Marutham: z ∈ [140, 210]
  Palai:    z ∈ [210, 280]
  Neytal:   z ∈ [280, 350]
```

#### Terrain Mesh Generation

Each zone generates a heightfield plane:

```typescript
function createTerrain(zone: Zone, segments: number) {
  const geometry = new PlaneGeometry(200, ZONE_LEN, 200, segments);
  const positions = geometry.attributes.position;
  
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    
    // Simplex noise for height
    const noise = simplex.noise2D(
      x * zone.frequency,
      z * zone.frequency
    );
    
    // Apply zone-specific amplitude
    const height = noise * zone.amplitude;
    
    // Valley carving: keep center low for camera path
    const centerDip = Math.exp(-Math.pow(x / 30, 2)) * 15;
    
    positions.setY(i, height - centerDip);
  }
  
  positions.needsUpdate = true;
  return geometry;
}
```

#### Zone Parameters

| Zone | Frequency | Amplitude | Characteristic | Color |
|------|-----------|-----------|-----------------|-------|
| Kurinji | 0.045 | 22 | High peaks, sharp ridges | #1a1228 (purple) |
| Mullai | 0.04 | 6 | Gentle rolling hills | #FFFEF9 (light) |
| Marutham | 0.06 | 2 | Flat, cultivated strips | #FFF8F0 (warm) |
| Palai | 0.08 | 8 | Sharp dunes, ripples | #2B1A1A (deep red) |
| Neytal | 0.03 | 1 | Sloping plane into water | #0A1628 (ocean) |

**Valley Carving Formula**:
```
centerDip = exp(-(x/30)²) * 15
finalHeight = noiseHeight - centerDip
```

This ensures a smooth, clear path for the camera to travel down the center (x ≈ 0 ± 3).

#### Material & Coloring

```typescript
const material = new MeshPhongMaterial({
  color: zone.groundColor,        // Zone-specific base color
  emissive: zone.emissiveColor,   // Subtle glow
  emissiveIntensity: 0.15,
  shininess: 10,                  // Matte finish
  wireframe: false
});

// Vertex-based coloring for variety
geometry.setAttribute('color', new BufferAttribute(colors, 3));
material.vertexColors = true;
```

---

## Procedural Props System

### `SangamObjects.tsx` — Cultural Set Dressing

**Path**: `src/three/scenes/SangamObjects.tsx`

Seven procedurally-generated layers of cultural details:

#### 1. **Gateway Pillars** (Per Zone Threshold)

```typescript
class Gateway {
  // Twin pillars: 1.7m wide × 11m tall
  // Positioned at x = ±11, spanning across camera path
  // Lintel: 25.5m wide × 1.5m tall above pillars
  
  // Zone-colored point light at top
  // Intensity: 70, Distance: 34 units
  // Color: thinai hue (#9D7BC7 for kurinji, etc.)
}
```

Each gateway glows in its zone's hue, providing visual threshold markers.

#### 2. **Kurinji Blooms** (Mountain Scatter)

```typescript
// 130 floating icosahedra on kurinji slopes
// Color: violet (#8b7ae0), emissive
// Position: scattered on terrain via simplex noise sampling
// Animation: 
//   y += sin(time * 0.5) * 0.3
//   x += cos(time * 0.3) * 0.2
// Opacity: 0.6 (semi-transparent)
```

Represents the kurinji flowers that bloom on mountain peaks.

#### 3. **Mullai Huts** (Shepherd Dwellings)

```typescript
class Hut {
  base: Cylinder(diameter: 2.4m, height: 1.2m)
  roof: Cone(radius: 1.3m, height: 2.3m)
  door: Plane(width: 0.8m, height: 1.5m)
  
  // Hearth light at door
  light: PointLight(
    color: #e3b458,      // Warm gold
    intensity: 9,
    distance: 8
  )
}

// 7 huts scattered at zone edges (z: 70-140, x: ±40-60)
// Animation: slight sway (Math.sin(time * 0.2) * 0.1)
```

Shepherd huts evoke the pastoral mullai landscape.

#### 4. **Marutham Granaries & Palmyra Trees**

```typescript
class Granary {
  base: Cylinder(diameter: 1.8m, height: 2.5m)
  roof: Cone(radius: 1.0m, height: 1.5m)
  // Arranged in rows of 4, repeated along zone
}

class PalmyraTree {
  stem: Cylinder(diameter: 0.24–0.42m, height: 8–12m)
  canopy: Icosahedron(radius: 1.8m)
  
  // Realistic lean (rotation: 0–0.12 rad)
  // Creates impression of weight and wind
}

// 60 granaries, 10 palmyra trees
// z: 140-210 (marutham zone)
// Positioned to suggest cultivated fields
```

Agricultural structures of Sangam era.

#### 5. **Palai Nadukal** (Hero Stones)

```typescript
class Nadukal {
  stone: Box(width: 1.2m, height: 3m, depth: 0.4m)
  plinth: Box(width: 1.8m, height: 0.3m, depth: 0.6m)
  
  // Slight tilt for dramatic effect
  rotation.z = randomInRange(-0.08, 0.08)
  
  // Emissive glow (orange #d17a4a)
  emissiveIntensity: 0.3
}

// 8 nadukal at palai crossing (z: 210-280)
// Positioned at intervals suggesting historical standing
```

Memorial stones, symbolizing the heroic past.

#### 6. **Neytal Catamarans** (Fishing Boats)

```typescript
class Catamaran {
  hull: Cylinder(
    radiusTop: 0.8m,
    radiusBottom: 0.85m,
    height: 5.2m,
    segments: 8
  )
  
  sail: Plane(width: 1.7m, height: 2.1m)
  sail.material.color = #f5e8d8  // Cream
  
  // Bobbing animation
  animation: {
    y: Math.sin(time * speed + phase) * 0.16,
    z: Math.cos(time * speed * 0.7) * 0.08,
    rotation.z: Math.sin(time * speed * 0.5) * 0.045
  }
  
  // 5 boats spread across neytal zone (z: 280-350)
}
```

Boats suggest maritime trade and diaspora journeys.

#### 7. **Karthigai Lamps** (Ambient Lights)

```typescript
class KarthigaiLamp {
  position: randomInRange3D(
    x: [-80, 80],
    y: [5, 25],
    z: [0, 350]
  )
  
  light: PointLight(
    color: #e3b458,      // Golden
    intensity: 0.8,
    distance: 20
  )
  
  // Drifting animation
  animation: {
    y: y0 + Math.sin(time * 0.3 + phase) * 0.6,
    x: x0 + Math.cos(time * 0.2 + phase) * 0.35
  }
  
  opacity: 0.85
  blending: AdditiveBlending
}

// Density: 70–150 (depends on performance tier)
// Low mode thins evenly (every other lamp)
```

Sacred lights representing knowledge, spirituality, and gathering.

#### Instancing Strategy

All props use **instanced meshes** for efficiency:

```typescript
// Each prop type = 1 draw call
const treesBuffer = new InstancedBufferGeometry();
const treeCount = 90;

for (let i = 0; i < treeCount; i++) {
  const matrix = new Matrix4();
  const pos = getTreePosition(i);
  matrix.setPosition(pos);
  
  instancedMesh.setMatrixAt(i, matrix);
}

instancedMesh.count = treeCount;
// Result: 1 draw call for all 90 trees
```

**Performance Impact**: ~20 draw calls total (5 zones × 4 prop types), vs. 1000+ without instancing.

---

## Scroll-Driven Camera System

### `CameraRig.tsx` — Dynamic View Control

**Path**: `src/three/scenes/CameraRig.tsx`

The camera is the player's eyes traveling through the world.

#### Z-Axis Travel (Scroll-Driven)

```typescript
function CameraRig() {
  const scrollProgress = useScrollProgress();  // 0 → 1
  
  // Target Z position: scroll drives traverse
  const targetZ = scrollProgress * WORLD_LEN;  // 0 → 350
  
  // Damped lerp for smooth motion
  camera.position.z = lerp(
    camera.position.z,
    targetZ,
    0.1  // Damping factor
  );
}
```

**Scroll Mapping**:
- Page scrolls 0% → Camera at z = 0 (kurinji start)
- Page scrolls 50% → Camera at z = 175 (marutham)
- Page scrolls 100% → Camera at z = 350 (neytal end)

#### Free-Look Sway (Pointer-Driven)

```typescript
// Mouse/touch position adds X and Y offset
const pointerX = (mousePos.x / window.innerWidth) * 2 - 1;
const pointerY = (mousePos.y / window.innerHeight) * 2 - 1;

// Sway limits
const maxSwayX = 3.0;   // ±3 units
const maxSwayY = 1.2;   // ±1.2 units

const swayX = pointerX * maxSwayX;
const swayY = pointerY * maxSwayY;

// Damped application
camera.position.x = lerp(camera.position.x, swayX, 0.15);
camera.position.y = lerp(camera.position.y, swayY, 0.15);

// Camera looks slightly ahead (36 units forward in Z)
camera.lookAt(swayX, swayY, camera.position.z + 36);
```

**Effect**: Pointer movement creates parallax depth, making terrain feel dimensional.

#### Damping Factors

```typescript
lerp(current, target, 0.1)  // Z travel: 0.1 (slower, less reactive)
lerp(current, target, 0.15) // X sway: 0.15 (faster, more responsive)
lerp(current, target, 0.12) // Y sway: 0.12 (medium)
```

These values create a snappy, responsive feel while maintaining smooth motion.

### `useScrollProgress.ts` — Ref-Based Scroll Tracking

**Path**: `src/three/hooks/useScrollProgress.ts`

```typescript
export function useScrollProgress() {
  const progressRef = useRef(0);
  
  // Listen to Lenis scroll events (not React renders)
  useEffect(() => {
    lenis.on('scroll', (e: ScrollEvent) => {
      progressRef.current = e.progress;  // 0 → 1
    });
  }, []);
  
  // Return ref, not value (avoids React re-renders)
  return progressRef;
}
```

**Why a Ref?**
- Scroll events fire 60+ times/second
- React state updates would trigger 60+ re-renders/second (expensive)
- Ref updates don't trigger renders; frame loop reads ref value
- Result: smooth 60 FPS without React overhead

---

## Indic Typography in 3D

### `GlyphField.tsx` — Floating Scripts

**Path**: `src/three/scenes/GlyphField.tsx`

Yazhi includes **115 distinct Indic glyphs** floating through the world:

#### Glyph Set

```typescript
const SCRIPTS = {
  TAMIL: 'அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ கக்க ...',    // 13 vowels + consonants
  DEVANAGARI: 'अ आ इ ई उ ऊ ऋ ए ऐ ओ औ कक्क ...',    // 9 vowels + consonants
  BENGALI: 'অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ কক্ক ...',
  TELUGU: 'అ ఆ ఇ ఈ ఉ ఊ ఋ ఏ ఐ ఒ ఓ ఔ కక్క ...',
  KANNADA: 'ಅ ಆ ಇ ಈ ಉ ಊ ಋ ಏ ಐ ಒ ಓ ಔ ಕಕ್ಕ ...',
  MALAYALAM: 'അ ആ ഇ ഈ ഉ ഊ ഋ എ ഏ ഐ ഒ ഓ കക്ക ...',
  GUJARATI: 'અ આ ઇ ઈ ઉ ઊ ઋ એ ઐ ઓ ઔ કક્ક ...'
};

// Total: ~115 unique glyphs across all scripts
```

#### Texture Generation

```typescript
function createGlyphTexture(glyph: string, font: string) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Match display font size to --font-display CSS variable
  ctx.font = `bold 128px "${font}"`;  // e.g., "Anek Tamil"
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw glyph to canvas
  ctx.fillText(glyph, canvas.width / 2, canvas.height / 2);
  
  // Convert to Three.js texture
  const texture = new CanvasTexture(canvas);
  return texture;
}

// Wait for document.fonts.ready before rendering
await document.fonts.ready;
glyphTextures = SCRIPTS.map(glyph => createGlyphTexture(glyph, fontFamily));
```

**Why Canvas Textures?**
- Glyphs render in the site's actual display font (Anek Tamil)
- Ensures 3D typography matches DOM typography exactly
- High-quality antialiasing from browser's text renderer
- One-time cost at load (not per-frame)

#### Placement Strategy

```typescript
// Peripheral placement: keep central corridor clear
const PERIPHERAL_X_MIN = 24;
const PERIPHERAL_X_MAX = 62;

function placeGlyph(glyphIndex: number) {
  const x = randomInRange(
    [-PERIPHERAL_X_MAX, -PERIPHERAL_X_MIN],
    [PERIPHERAL_X_MIN, PERIPHERAL_X_MAX]
  );
  
  const y = randomInRange(3, 45);
  const z = glyphIndex * (WORLD_LEN / GLYPH_COUNT);
  
  return { x, y, z };
}

// Central corridor: |x| < 24 stays clear for camera path
```

**Visual Effect**: Scripts frame the journey without occluding the readable content strip.

#### Animation

```typescript
// Each glyph drifts slowly, creating organic movement
const baseX = glyphPositions[i].x;
const baseY = glyphPositions[i].y;

glyph.position.x = baseX + Math.sin(time * speeds[i] + phases[i]) * 0.35;
glyph.position.y = baseY + Math.cos(time * speeds[i] * 0.5 + phases[i]) * 0.5;

// Opacity: 40% (readable background, subtle)
glyph.material.opacity = 0.4;
glyph.material.depthWrite = false;  // Don't occlude behind/ahead
```

#### Adaptive Density

```typescript
// Quality tiers affect glyph count
const GLYPHS_PER_TIER = {
  high: 115,      // All glyphs
  mid: 90,        // 78% of glyphs
  low: 58,        // 50% of glyphs (every other one)
  adaptive: ...   // Downgrades as FPS drops
};

// Low mode: thin evenly
if (performanceMode === 'low') {
  for (let i = 0; i < GLYPHS.length; i++) {
    if (i % 2 === 1) continue;  // Skip every other glyph
  }
}
```

---

## Lighting & Atmosphere

### Zone Lighting

Each zone has a dedicated **point light** at its threshold gate:

```typescript
class ZoneLight extends Light {
  light = new PointLight(
    zone.hue,           // Color: zone-specific
    intensity: 70,      // Brightness
    distance: 34        // Attenuation distance
  );
  
  position: gate.position  // At threshold gateway
}
```

**Effect**: Each zone glows in its theme color, providing visual continuity between DOM theme and 3D world.

### Global Fog

```typescript
const fog = new Fog(
  color: '#0b0e1a',       // Night sky color
  near: 130,              // Fog begins
  far: 185                // Fully opaque
);

scene.fog = fog;
```

**Purpose**: 
- Culls distant geometry (performance)
- Creates atmospheric depth
- Frames the camera's forward view

### Ambient Lighting

```typescript
const ambientLight = new AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Slightly tinted per zone (optional enhancement)
// e.g., kurinji → slight violet tint
```

Ensures all surfaces are visible, not completely black.

---

## Adaptive Rendering System

### Performance Monitoring

```typescript
function ThinaiWorld() {
  const [qualityTier, setQualityTier] = useState('high');
  
  return (
    <PerformanceMonitor
      onDecline={() => downgradeQuality()}
      onFpsChange={(fps) => {
        if (fps < 24) setQualityTier('low');
      }}
    >
      {/* Render based on qualityTier */}
    </PerformanceMonitor>
  );
}
```

**Tiers**:
- **High** → **Mid** → **Low** (one-way)
- Triggered by: FPS < 24 (sustained)
- Effects:
  - Terrain segments: 140 → 100 → 56
  - Glyph count: 115 → 90 → 58
  - Props visibility: all → most → sparse
  - Antialiasing: on → off
  - DPR: 1.5 → 1.0 → 1.0

### Device Detection Heuristic

```typescript
function initializeQualityTier() {
  const screenSize = Math.min(window.innerWidth, window.innerHeight);
  const cores = navigator.hardwareConcurrency || 4;
  
  if (screenSize < 400 || cores < 4) {
    return 'low';  // Mobile or low-power
  } else if (screenSize < 800) {
    return 'mid';  // Tablet
  } else {
    return 'high'; // Desktop
  }
}
```

### One-Way Demotion

```typescript
// Demotion is one-way by design
if (tier === 'low') return 'low';  // Never upgrade back
if (fps < 24) return downgradeTier(tier);
return tier;  // Stay current
```

**Rationale**: Prevents quality flickering (cheap → expensive → cheap → expensive). Better to be stable at lower quality than visually jarring.

---

## Fallback Strategy

### No WebGL or Reduced Motion

If the browser lacks WebGL or user has `prefers-reduced-motion: reduce`:

```typescript
if (!webglSupported || prefersReducedMotion) {
  return null;  // Don't mount ThinaiWorld
}
```

The DOM-only gradient system (CSS) provides complete visual experience:

```css
body {
  background: radial-gradient(ellipse at 50% 50%, var(--accent), var(--bg));
  transition: background 2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Result**: Identical visual flow, zero 3D rendering overhead.

---

## Bundle & Performance Stats

### First-Load JS
- **Before 3D loads**: ~188 kB (unchanged)
- **After 3D loads** (lazy): +250 kB (three.js + r3f + utils)
- **Total**: ~440 kB (still within fast-loading range)

### Runtime Performance
- **FPS target**: 60 on desktop, 30+ on mobile
- **Draw calls**: ~20 (5 zones × 4 prop types + lights)
- **Vertices**: ~50k–200k (depending on terrain segments)
- **Texture memory**: ~5 MB (glyph canvas textures + font faces)

### Build Size
- **Static output**: Fully pre-rendered (no server-side rendering)
- **Fonts**: ~500 kB (Anek Tamil variable woff2)
- **Total bundle**: ~950 kB (gzipped: ~280 kB)

---

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Optimal performance |
| Firefox 88+ | ✅ Full | Slight slower on mobiles |
| Safari 15+ | ✅ Full | Good WebGL support |
| Edge 90+ | ✅ Full | Chromium-based |
| Mobile Safari (iOS 15+) | ⚠️ Limited | Performance mode, reduced quality |
| Android Chrome | ✅ Full | Adaptive rendering handles variance |
| IE 11 | ❌ None | No WebGL; falls back to CSS-only |

---

## Debugging & Profiling

### Enable Debug Mode

```typescript
// In ThinaiWorld.tsx
const DEBUG = true;

if (DEBUG) {
  // Display FPS counter
  const stats = new Stats();
  document.body.appendChild(stats.dom);
  
  useFrame(() => {
    stats.update();
  });
  
  // Show terrain wireframe
  terrain.material.wireframe = true;
  
  // Display camera position
  console.log(`Camera: [${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}]`);
}
```

### Performance Profiling

1. **Chrome DevTools**:
   - Performance tab → Record → Scroll → Stop
   - Analyze frame time, paint time
   - Look for consistently 60 FPS (desktop) or 30 FPS (mobile)

2. **Three.js Inspector**:
   - Browser extension to inspect scene graph, textures, shaders

3. **Lighthouse**:
   - Run audit on deployed site
   - Check First Contentful Paint, Largest Contentful Paint, CLS

---

## Future Optimizations

1. **GPU-instanced lighting**: Instead of 150 point lights, use GPU compute shaders
2. **LOD (Level of Detail)**: Terrain mesh complexity based on distance from camera
3. **Streaming terrain**: Load/unload zones dynamically (for infinite worlds)
4. **WASM procedural generation**: Offload noise computation to WebAssembly
5. **Shader-based glyphs**: Render glyphs in fragment shader instead of canvas textures

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-08  
**Technical Review**: Recommended before major optimizations
