# Yazhi Scroll Experience — The Journey Through Five Landscapes

## Overview

The Yazhi marketing site is built around a spatial metaphor: **scrolling is travelling**. As you scroll down the page, your camera journeys through five procedurally-generated landscapes based on the **thiṇai** system from Sangam-era Tamil poetry. Each landscape embodies an emotional and cultural narrative.

The experience is immersive, whimsical, and deeply rooted in Tamil heritage. Page content and 3D world are synchronized — both flow together, telling a unified story.

---

## The Five Thinai (Landscapes)

### 1. **Kurinji (Mountains)** — Union & Purpose  
**Hue**: Violet/Bloom (#9D7BC7)  
**Scroll Progress**: 0%–20%

#### What You Experience
You begin in mountainous ridgelines, their peaks reaching violet against the night sky. Monolithic shards of stone emerge from the slopes like ancient guardians. The ground beneath you is high and angular—you're elevated, at a vantage point.

#### Visual Details
- **Terrain**: High-amplitude peaks (amplitude: 22), with a valley-carved central corridor for the camera path
- **Props**: Tetrahedron monoliths scattered across slopes, creating a sense of monumentality
- **Lighting**: Violet point light from a gate pillar at the zone threshold (70 intensity, 34-unit reach)
- **Atmosphere**: Bloom-colored gradient sky, night fog at 130–185 units depth
- **Glyphs**: Indic script characters float in peripheral bands (|x| ∈ [24, 62]), drifting slowly

#### Narrative Context
**"Union — 22+ scripts uniting around one model."**  
Kurinji represents the coming together. The violet kurinji flower grows on these mountain slopes in the Tamil poetic tradition. Here, Yazhi's promise unfolds: one sovereign AI model serving 22+ Indian languages, uniting diverse scripts under a single computational framework.

#### DOM Content Alignment
- Hero section fades in as you enter
- Navbar displays the three-sphere Yazhi logo
- Hero content talks about the "union" of Tamil heritage and modern AI
- Constellation animation spins overhead, its stars representing the diverse scripts

#### User Interactions
- Move mouse left/right: camera sways (±3 units X, ±1.2 units Y) for free-look perspective
- Pointer movement adds immediate, responsive depth
- The steep terrain creates visual drama—you're small but ascending

---

### 2. **Mullai (Forest)** — Waiting & Growth  
**Hue**: Forest Green (#6B9F2F)  
**Scroll Progress**: 20%–40%

#### What You Experience
The mountain peaks give way to a dense cone forest. Trees (icosahedra) populate the gentle terrain. Shepherd huts dot the landscape, their doorways glowing with warm hearth-light. The ground is softer now—less dramatic but more inhabited.

#### Visual Details
- **Terrain**: Gentle rolling hills (amplitude: 6, frequency: 0.04), creating a pastoral feel
- **Props**: 
  - 90 cone-shaped trees (instanced geometry, one draw call)
  - 7 shepherd huts (cylindrical base + cone roof, 2.4m diameter)
  - Warm point lights (intensity 9) at doorways, emitting #e3b458 (golden)
- **Lighting**: Forest green theme light; the world becomes warmer and more inhabited
- **Glyphs**: More glyphs appear, drifting through the forest canopy

#### Narrative Context
**"Waiting — a model grown patiently, like a forest."**  
Mullai represents patience and cultivation. In Sangam poetry, mullai is the pastoral landscape where lovers wait. Here, it symbolizes the patient, iterative work of training a large language model. Like a forest growing season by season, Adhan (Yazhi's 7B-parameter LLM) was built methodically, rooted in Tamil linguistic traditions.

#### DOM Content Alignment
- Adhan showcase section appears, detailing the LLM's training approach
- Code examples flow with the scroll, demonstrating Tamil language processing
- Typography shifts to a warmer tone (the display font lightens slightly)

#### User Interactions
- Hut lights respond to scroll progress: brighter as you scroll deeper
- Shepherd silhouettes *may* appear in windows (optional enhancement)
- The environment feels alive, inviting exploration

---

### 3. **Marutham (Agriculture)** — Cultivation & Harvest  
**Hue**: Paddy Gold-Green (#C17B3D)  
**Scroll Progress**: 40%–60%

#### What You Experience
The forest opens into cultivated farmland. Paddy fields stretch in neat strips, each 4m wide. Granaries (kalanjiyam) stand at intervals. Palmyra trees lean at angles—some bearing the weight of their own growth. The lighting shifts to a warm, cultivated tone.

#### Visual Details
- **Terrain**: Flat strips with subtle wave animation (amplitude: 2), creating the impression of paddy water
- **Props**:
  - 60 granary structures (cylindrical base + cone roof, 1.8m base diameter)
  - 10 palmyra trees (leaning stems, icosahedron canopies, realistic wind-sway)
  - Gateway pillars at zone threshold, glowing in the marutham hue
- **Lighting**: Warm earth/gold tones; the world feels ripe, ready for harvest
- **Glyphs**: Denser glyph field, as if the letters are seeds settling into the earth

#### Narrative Context
**"Its own sub-line in the brand file."**  
Marutham represents tangible harvest and the fruits of labor. In Sangam tradition, it's the landscape of agriculture, kings, and collective prosperity. Here, it symbolizes Project Sangam—the actual Tamil linguistic corpus, the harvest of thousands of poems and texts, and Yazhi's role as a keeper of this heritage.

#### DOM Content Alignment
- Project Sangam showcase section emerges
- Discussion of the Tamil corpus, poem analysis, and linguistic features
- Imagery shifts to show structured data, classifications, and the "organized harvest" of Tamil literature

#### User Interactions
- Scroll speed affects the wave animation in the paddy fields (faster scroll = ripples in water)
- Granary silhouettes grow more detailed as you approach
- The sense of stillness and cultivation dominates—less drama, more presence

---

### 4. **Palai (Desert)** — Endurance & Hardship  
**Hue**: Ochre (#CC6B4A)  
**Scroll Progress**: 60%–80%

#### What You Experience
The farmland becomes arid. A vast desert opens up with scattered hero stones (nadukal) standing upright on stone plinths. The terrain becomes rough, wind-carved. Sky and earth converge in heat-shimmer lines. This is the most challenging landscape—sparse, demanding.

#### Visual Details
- **Terrain**: Dune ripples and sharp angles (amplitude: 8, with absolute value noise for sharp peaks)
- **Props**:
  - 8 nadukal (hero stones): rectangular slabs tilted slightly on plinths, orange-emissive glow
  - Dodecahedron "markers" at crossing points
  - Gateway threshold with ochre lighting (70 intensity)
- **Lighting**: Warm ochre/red tones; the world feels harsh but noble
- **Glyphs**: Sparse, wind-scattered glyphs moving faster (suggesting wind)

#### Narrative Context
**"Hardship endured — the guardian's terrain."**  
Palai is the harsh, arid landscape where travelers suffer and heroes are tested. It represents the Yazh guardian app itself—a tool for endurance, for helping users navigate difficult information landscapes, for standing firm in the face of misinformation and noise.

The nadukal (hero stones) are historically memorials to the fallen. They symbolize Yazhi's role as a memorial and guardian of Tamil heritage—holding fast what might otherwise be lost.

#### DOM Content Alignment
- Yazh app showcase: discussing resilience, the role of a digital guardian
- Content emphasizes protection, reliability, and the "hero's journey"
- Visual tone becomes more serious, more committed

#### User Interactions
- Camera motion feels slower, more deliberate (damping increases subtly)
- Nadukal lights pulse gently (0.3–0.7 opacity over time)
- The user feels the weight of this landscape—it demands respect

---

### 5. **Neytal (Coastal)** — Reunion & Community  
**Hue**: Sea Blue (#4A9ECC)  
**Scroll Progress**: 80%–100%

#### What You Experience
The desert slopes down toward water. The terrain becomes a vast plane that gently slopes into a blue horizon—the sea. Catamarans bob on the water. A shore beacon (kalangarai vilakkam) stands tall, its light golden and welcoming. Glyphs become denser again, as if gathering for arrival.

#### Visual Details
- **Terrain**: Sloping plane that transitions from land to water (amplitude: 1, gentle gradient)
- **Props**:
  - 5 catamarans: hulls (scaled cylinders, 5.2m length) + cream-colored sails, bobbing with sinusoidal animation
  - Shore beacon (8m tower) with golden sphere light (intensity 120)
  - ~150 karthigai lamps drifting throughout: golden point lights with slow y-bobbing (±0.6m) and x-drift (±0.35m)
- **Lighting**: Cool sea blue with warm golden accents from lamps; the world feels welcoming and alive
- **Glyphs**: Dense, slow-drifting glyph field, creating a sense of gathering

#### Narrative Context
**"Separation — the diaspora across the seas, closed by the network."**  
Neytal is the coastal landscape where lovers are separated by water, yet the sea is also the path of reunion. Here it symbolizes the global Tamil diaspora—Tamils scattered across the world, united by heritage and language. Yazhi is the network that brings them together, the beacon that guides them home.

The karthigai lamps represent the sacred lights of Deepavali and the metaphorical lights of knowledge and connection spreading across the diaspora.

#### DOM Content Alignment
- Community section emerges: connections, collaboration, the global Tamil network
- Footer appears with the five thinai as a visual taxonomy
- Links to GitHub, Discord, and onboarding paths
- Language toggle becomes prominent (Tamil/English/Both)

#### User Interactions
- Catamarans become interactive: hover over them to see their "destination"
- Beacon light can be clicked to trigger a "return home" scroll action
- Community cards may appear as overlays
- Final call-to-action: join the movement, contribute to the corpus, build with Yazhi

---

## Scroll Synchronization & Camera Motion

### Camera Path
- **Z-axis travel**: Page scroll progress (0→1) drives camera position along the -Z axis through all five zones
- **Zone length**: 70 units per zone (350 units total world length)
- **Damped movement**: Camera motion uses lerp(current, target, 0.1) for smooth, responsive feel
- **Free-look sway**: Mouse/touch position adds real-time X and Y offset to camera (up to ±3 units X, ±1.2 units Y)

### Timing
- **Intro sequence**: ThinaiIntro loader (2-3 seconds) before scroll begins, setting emotional register
- **Hero constellation**: Spins during entire hero section, then fades as content begins
- **Scroll speed**: User scroll speed is translated to camera Z velocity (damped)
- **Fallback**: If no WebGL or prefers-reduced-motion, ambient gradient system (CSS only) carries the visual flow

---

## Visual & Audio Continuity

### Color Transitions
- **Smooth CSS transitions**: All theme color changes fade over 2 seconds (cubic-bezier easing)
- **DOM accent migration**: As you enter a new zone, the page's `--accent` CSS variable shifts to that zone's hue
- **Ambient gradient**: Semi-transparent radial gradient behind all content, reflecting current theme

### Audio Integration (Tamil Yazh & Pann Music)
- **Auto-play**: Ambient Tamil classical music (yazh and pann instrumental) begins quietly at page load
- **Volume curve**: Music fades in over the first 5 seconds (Mullai section), reaching ~50% volume
- **Scroll sync**: Volume may gently rise/fall based on scroll position (optional, not implemented yet)
- **Zone themes**: Each zone *may* have a subtle audio signature (different raag or rasa) — currently unified ambient track
- **Mute control**: User can toggle music on/off via UI button in navbar or footer

---

## Responsive Experience

### Desktop (1024px+)
- Full WebGL world, high-poly terrain (140-segment), full glyph field (115 glyphs)
- Free-look sway active
- Smooth scroll with Lenis inertia
- All props visible and animated

### Tablet (768–1024px)
- Mid-poly terrain (70–100 segments), DPR capped at 1.5
- Reduced glyph count (~80)
- Free-look sway slightly constrained
- Lenis scroll with reduced inertia

### Mobile (< 768px)
- Low-poly terrain (56 segments), DPR = 1.0, no antialiasing
- Sparse glyph field (~40)
- Free-look sway disabled
- Standard scroll (Lenis if device performance allows)
- All content still readable; 3D world is progressive enhancement

### Low-Performance Mode
- Triggered by: screen size < 400px, CPU cores < 4, or sustained FPS < 24
- Reduces to: 56-segment terrain, 40 glyphs, no antialiasing, DPR = 1.0
- Demotion is one-way by design—no quality flicker (PerformanceMonitor from drei)

### No WebGL Fallback
- If browser lacks WebGL or user has `prefers-reduced-motion: reduce`:
  - World never mounts
  - DOM gradient system (CSS only) provides complete visual flow
  - Lenis scroll disabled; native scroll restored
  - All content remains fully accessible and readable

---

## Interaction Points & Easter Eggs

### Primary Interactions
1. **Scroll**: Drive camera through world, trigger content reveals
2. **Mouse movement**: Free-look sway, parallax depth
3. **Language toggle**: Switch between Tamil/English/Both
4. **Theme override**: Click ThinaiBar (or call `setTheme()`) to jump to any landscape
5. **Navbar logo**: Click to return to top (scroll anchor)

### Secondary Interactions (Optional Enhancements)
- **Hut doors (Mullai)**: Click to see shepherd silhouettes or folklore stories
- **Granaries (Marutham)**: Hover to see stored content (poem excerpts, etc.)
- **Nadukal (Palai)**: Click to read inscriptions or historical context
- **Catamarans (Neytal)**: Hover to see "destination" placename or community names
- **Beacon light (Neytal)**: Click to trigger a "homeward" scroll animation
- **Karthigai lamps**: Collectively glow brighter as you scroll, creating a sense of gathering light

---

## Accessibility Features

### Reduced Motion
- All CSS transitions respect `prefers-reduced-motion: reduce`
- GSAP animations disabled; scroll-triggered reveals happen instantly
- Framer Motion respects `<MotionConfig reducedMotion="user" />`
- Lenis scroll disabled; native scroll restored

### Keyboard Navigation
- **Tab**: Navigate through all interactive elements (buttons, links)
- **Enter/Space**: Activate buttons and links
- **Escape**: Close any open modals or menus
- All buttons have visible `:focus-visible` outlines (gold, 2px)

### Screen Reader Compatibility
- All text has semantic HTML (`<h1>`, `<p>`, `<nav>`, etc.)
- Images and glyphs have `aria-label` descriptions
- Language toggles are proper `<radiogroup>` elements
- 3D canvas has `role="img"` with descriptive `aria-label`

### Color Contrast
- All text ≥ 4.5:1 contrast ratio on both backgrounds (measured, WCAG AA)
- Worst case: kurinji (5.5:1), most are 6–16:1
- Buttons (gold on dark): 10:1 contrast

---

## Performance Optimization

### Rendering Strategy
- **Instanced meshes**: One draw call per prop type per zone (e.g., "all trees" = 1 draw call)
- **Fog culling**: Objects beyond fog distance don't render
- **DPR cap**: Device pixel ratio capped at 1.5 (prevents over-rendering on high-DPI screens)
- **Bundle splitting**: Three.js lazy-loaded via `next/dynamic` (ssr: false)
- **First-load JS**: ~188 kB (unchanged from pure DOM), three.js streams in after hydration

### Adaptive Quality
- **PerformanceMonitor** (drei): Watches FPS, devolves quality if sustained FPS < 24
- **Progressive**: Skips lamps, reduces glyph density, disables antialiasing
- **One-way demotion**: Once downgraded, stays downgraded (no flicker)

### Static Output
- Fully static build (○ verified)
- Zero raster images (SVG + type only)
- Fonts: self-hosted woff2 via `next/font/local`
- Deployable to any CDN; no server-side rendering required

---

## Technical Specifications

### DOM Layout
```
<html lang="ta" data-theme="neytal">
  <body>
    <Canvas> {/* Three.js canvas, full viewport, z-index behind */}
      <ThinaiWorld />
    </Canvas>
    
    <main>
      <Navbar /> {/* z-index 50 */}
      <Hero />
      <AdhanShowcase />
      <YazhAppShowcase />
      <SangamShowcase />
      <Community />
      <Footer />
    </main>
  </body>
</html>
```

### Key Hooks & Context
- `useScrollProgress()`: Ref-based scroll tracking (0→1)
- `useLanguageContext()`: (ta|en|both) language mode
- `useTheme()`: Current thinai theme + setter
- `useViewportSize()`: Responsive breakpoint tracking

### CSS Variables (Dynamic per Zone)
```css
--accent: color for current zone
--bg: background color for current zone
--text: text color for current zone
--font-display: Anek Tamil (variable)
--font-body: Hind Madurai
--font-mono: IBM Plex Mono
```

---

## Future Enhancements

1. **Zone-specific audio themes**: Different raag (musical mode) per thinai
2. **Interactive prop details**: Click objects to reveal cultural backstories
3. **Glyph field randomization**: Procedural per-visit glyph placement (seeded random for consistency)
4. **Multiplayer avatars**: See other visitors' avatars in the world
5. **Mobile touch gestures**: Swipe to rotate camera, pinch to zoom (optional)
6. **Quest system**: Unlockable content by exploring specific zones
7. **Constellation generation**: Personalized constellation based on user's scripts/language preferences

---

## Troubleshooting & Notes

### "World is not rendering"
- Check browser console for WebGL errors
- Verify `public/fonts/` files are loaded (especially Anek Tamil)
- Fallback should activate automatically; you should see CSS gradient background

### "Audio not playing"
- Check browser's autoplay policy (may require user interaction first)
- Verify audio files are in `public/audio/`
- Check volume level; default is muted initially (user must click unmute)

### "Performance is choppy"
- App monitors FPS and auto-degrades quality
- If still slow: try reducing viewport width or closing other tabs
- Mobile: verify device has ≥4 cores; low-power mode may further degrade

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-08  
**Author**: Yazhi Design Team
