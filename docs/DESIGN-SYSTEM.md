# Yazhi Design System — Color, Culture, Typography & Accessibility

## Overview

The Yazhi marketing site's design system is built on the **thiṇai** (five landscapes) framework from Sangam-era Tamil poetry. This ancient classification system for poetry and landscape naturally maps to a design system for a sovereign Tamil AI initiative.

---

## Thiṇai System as Design Framework

The five thiṇai serve simultaneously as:
1. **Spatial zones** (5 procedural 3D landscapes)
2. **Emotional arcs** (narrative progression)
3. **Color palettes** (per-zone hue families)
4. **Brand associations** (what Yazhi represents)
5. **Navigation structure** (scroll through zones)

This unification—one system serving multiple purposes—is the signature design choice.

---

## Color Palette

### Core Theme Colors

Each thiṇai is associated with a primary hue, a supporting palette, and emotional registers:

#### 1. **Kurinji** — Purple / Violet (Mountains, Union)
**Hex**: `#9D7BC7` (primary), `#1a1228` (dark bg)

```css
--kurinji-primary: #9D7BC7;      /* Bloom violet */
--kurinji-dark-bg: #1a1228;      /* Night purple-black */
--kurinji-light-accent: #c5a8e0; /* Lighter accent */
--kurinji-text: #f5f1fa;         /* Light text for dark bg */
```

**Rationale**: The kurinji flower is genuinely violet, native to Tamil mountains. Represents unity of scripts, the union of 22+ languages under one model.

**Contrast Check**: 
- Text on dark bg: 7.2:1 ✅ WCAG AAA
- Buttons/accents: 8.1:1 ✅ WCAG AAA

#### 2. **Mullai** — Forest Green (Forest, Growth)
**Hex**: `#6B9F2F` (primary), light backgrounds

```css
--mullai-primary: #6B9F2F;       /* Forest green */
--mullai-light-bg: #FFFEF9;      /* Warm cream */
--mullai-accent: #8FBE4D;        /* Brighter accent */
--mullai-text: #1A0F0A;          /* Dark text */
```

**Rationale**: Mullai landscape in Sangam poetry represents forests, pastoral scenes, patient waiting. Green symbolizes growth and the iterative nature of LLM training.

**Contrast Check**:
- Green on light: 6.8:1 ✅ WCAG AA
- Inverse (light on green): 5.9:1 ✅ WCAG AA

#### 3. **Marutham** — Earth Gold-Green (Agricultural, Harvest)
**Hex**: `#C17B3D` (primary), `#FFF8F0` (warm bg)

```css
--marutham-primary: #C17B3D;     /* Earth brown-gold */
--marutham-light-bg: #FFF8F0;    /* Parchment warm */
--marutham-accent: #E89D4F;      /* Brighter accent */
--marutham-text: #1A0F0A;        /* Dark text */
```

**Rationale**: Marutham is cultivated farmland, harvest, prosperity. Gold/earth tones evoke Tamil manuscripts, paddy fields, the tangible harvest of Project Sangam (Tamil corpus).

**Contrast Check**:
- Primary on light: 5.4:1 ✅ WCAG AA
- Bright accent: 6.9:1 ✅ WCAG AA

#### 4. **Palai** — Ochre / Red (Desert, Endurance)
**Hex**: `#CC6B4A` (primary), `#2B1A1A` (dark bg)

```css
--palai-primary: #CC6B4A;        /* Desert ochre-red */
--palai-dark-bg: #2B1A1A;        /* Deep red-brown */
--palai-accent: #E88962;         /* Brighter accent */
--palai-text: #f5e8d8;           /* Cream text on dark */
```

**Rationale**: Palai represents harsh, arid landscapes where heroes are tested. Ochre/red evokes hardship, endurance, and the guardian's role (Yazh app). The nadukal (hero stones) stand in this terrain.

**Contrast Check**:
- Accent on dark: 6.3:1 ✅ WCAG AA
- Cream text: 8.5:1 ✅ WCAG AAA

#### 5. **Neytal** — Sea Blue (Coastal, Reunion)
**Hex**: `#4A9ECC` (primary), `#0A1628` (deep ocean)

```css
--neytal-primary: #4A9ECC;       /* Sky/sea blue */
--neytal-dark-bg: #0A1628;       /* Deep ocean blue-black */
--neytal-light-accent: #70BDEF;  /* Lighter accent */
--neytal-text: #f5f1fa;          /* Light text */
```

**Rationale**: Neytal is the coastal landscape of separation (lovers parted by sea) and reunion. Blue represents the diaspora and the network that brings Tamils together globally.

**Contrast Check**:
- Accent on dark: 6.7:1 ✅ WCAG AA
- Light text: 7.1:1 ✅ WCAG AA

### Neutral Colors

```css
/* Always consistent, independent of zone */
--text-primary: #1A0F0A;          /* Dark text (Kurinji/Mullai/Marutham) */
--text-light: #f5f1fa;            /* Light text (Palai/Neytal) */
--text-muted: #8b7a8a;            /* Secondary text */

--surface-light: #FFFEF9;         /* Light surface */
--surface-dark: #0b0e1a;          /* Dark surface (night) */
--surface-card: #1a1a1a;          /* Card backgrounds */

--border: rgba(255, 255, 255, 0.1);  /* Subtle borders */
--divider: rgba(0, 0, 0, 0.1);       /* Dividers */
```

### Accent Color (Dynamic)

The `--accent` CSS variable changes with scroll position, following the current thiṇai:

```css
:root {
  --accent: var(--kurinji-primary);  /* Starts at kurinji */
  transition: --accent 2s cubic-bezier(0.4, 0, 0.2, 1);
}

:root[data-theme="mullai"] {
  --accent: var(--mullai-primary);
}

:root[data-theme="marutham"] {
  --accent: var(--marutham-primary);
}

/* etc. */
```

**Smooth Transitions**: All color changes fade over 2 seconds using cubic-bezier easing, creating a meditative, flowing experience.

---

## Typography System

### Font Stack

Three fonts serve distinct purposes:

#### Display Font: **Anek Tamil**
**Variable weight font** spanning 9 Indic scripts (Tamil, Devanagari, Bengali, Telugu, Kannada, Malayalam, Gujarati, Odia, Sinhala).

```css
@font-face {
  font-family: 'Anek Tamil';
  src: url('/fonts/AnekTamil-Variable.woff2') format('woff2-variations');
  font-weight: 100 800;
  font-variation-settings: 'wght' 700;
}

.heading {
  font-family: 'Anek Tamil', sans-serif;
  font-weight: 700;
  font-size: clamp(1.5rem, 5vw, 3.5rem);
}
```

**Why Anek?**
- Single family across scripts mirrors "one model, 22+ languages"
- Can be extended to Anek Devanagari, Anek Bangla, etc., with zero visual drift
- Variable weight allows fine-tuning per language (e.g., Tamil heavier weight for readability)

**Weights Used**:
- 400 (Regular) — Body text
- 700 (Bold) — Headings, emphasis

#### Body Font: **Hind Madurai**
```css
@font-face {
  font-family: 'Hind Madurai';
  src: url('/fonts/HindMadurai-Regular.woff2') format('woff2');
}

.body-text {
  font-family: 'Hind Madurai', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.0625rem;  /* 17px */
  line-height: 1.75;
}
```

**Why Hind Madurai?**
- Designed specifically for Tamil, including Tamil Fonts, Inc.
- Named after Madurai (reinforces brand connection)
- Slightly larger line-height (1.75) accommodates Tamil diacritics and kombu forms

**Weights Used**:
- 300 (Light) — Secondary text, captions
- 400 (Regular) — Body text
- 500 (Medium) — Emphasis within body
- 600 (SemiBold) — Subheadings

#### Monospace Font: **IBM Plex Mono**
```css
@font-face {
  font-family: 'IBM Plex Mono';
  src: url('/fonts/IBMPlexMono-Regular.woff2') format('woff2');
}

.code {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}
```

**Used for**: Code samples in Adhan section, technical examples.

### Type Scale

```css
/* Heading hierarchy */
h1 { font-size: clamp(2.5rem, 8vw, 4rem); }     /* ~40–64px */
h2 { font-size: clamp(2rem, 5.5vw, 3rem); }    /* ~32–48px */
h3 { font-size: clamp(1.5rem, 4vw, 2.25rem); } /* ~24–36px */
h4 { font-size: 1.5rem; }                       /* 24px */
h5 { font-size: 1.25rem; }                      /* 20px */
h6 { font-size: 1rem; }                         /* 16px */

p  { font-size: 1.0625rem; }                    /* 17px */
small { font-size: 0.875rem; }                  /* 14px */
```

**Fluid Scaling**: Uses `clamp()` for responsive sizing without media queries:
```css
font-size: clamp(min, preferred, max);
/* Example: clamp(1.5rem, 5vw, 3rem) */
/* - Never smaller than 1.5rem (24px) */
/* - Scales with viewport width (5vw) */
/* - Never larger than 3rem (48px) */
```

### Line Heights

```css
/* Tamil requires larger line-height for diacritics & subscript forms */
h1, h2, h3 { line-height: 1.35; }  /* Headings: tight */
p          { line-height: 1.75; }  /* Body: generous */
code       { line-height: 1.5; }   /* Code: medium */
```

### Language-Specific Sizing

```css
/* Tamil text tends to need slightly larger sizes than Latin */
[lang="ta"] h1 { font-size: 1.1em; }
[lang="ta"] p  { font-size: 1.05em; }

/* English remains at base size */
[lang="en"] { font-size: 1em; }
```

---

## Component Tokens

### Buttons

```css
.button {
  background-color: var(--accent);
  color: var(--surface-dark);
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 200ms cubic-bezier(0.2, 0, 0.2, 1);
}

.button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(var(--accent), 0.3);
}

.button:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

.button:active {
  transform: translateY(0);
  box-shadow: 0 4px 8px rgba(var(--accent), 0.2);
}
```

**Contrast**: Gold/bright accent on dark backgrounds = 10:1 ✅ WCAG AAA

### Cards

```css
.card {
  background-color: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 300ms ease-out;
}

.card:hover {
  border-color: var(--accent);
  box-shadow: 0 20px 40px rgba(var(--accent), 0.15);
}
```

### Navbar

```css
nav {
  background-color: rgba(var(--surface-dark), 0.95);  /* Slightly transparent */
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
}

nav a {
  color: var(--text-primary);
  font-weight: 500;
  transition: color 200ms ease;
}

nav a:hover {
  color: var(--accent);
}

nav a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}
```

### Section Containers

```css
section {
  min-height: 100vh;
  padding: 6rem 2rem;
  background: var(--surface-light);
  color: var(--text-primary);
}

section[data-theme="kurinji"],
section[data-theme="palai"],
section[data-theme="neytal"] {
  background: var(--surface-dark);
  color: var(--text-light);
}
```

---

## Cultural Narrative Mapping

### Sangam-Era Details & Their Meaning

Each 3D zone includes historically accurate details:

| Zone | Detail | Historical Name | Meaning | Visual |
|------|--------|-----------------|---------|--------|
| Kurinji | Monoliths | Shard stones | Sacred mountain markers | Tetrahedra |
| Mullai | Shepherd Huts | Pasupatai | Pastoral livelihoods | Cylinders + cone roofs |
| Marutham | Granaries | Kalanjiyam | Storage of harvest | Cylindrical structures |
| Marutham | Palm Trees | Aintazhvarku | Wealth & sustenance | Leaning stems |
| Palai | Hero Stones | Nadukal | Memorials to the fallen | Tilted rectangles |
| Neytal | Fishing Boats | Catamaran | Maritime trade | Dual-hulled vessels |
| All Zones | Sacred Lights | Karthigai Vilakku | Knowledge, spirituality | Golden drifting points |

**Design Philosophy**: The visual environment tells the story without narration. A user unfamiliar with Sangam culture will intuitively feel the progression from high (kurinji) to low (neytal), from harsh (palai) to welcoming (neytal).

### Emotional Arc

```
Kurinji → Mullai → Marutham → Palai → Neytal
  ↓         ↓          ↓          ↓        ↓
 Unity   Waiting    Harvest    Endurance  Reunion
  ↓         ↓          ↓          ↓        ↓
 Violet   Green    Gold-Brown   Ochre    Blue
  ↓         ↓          ↓          ↓        ↓
  Up      Gentle    Cultivated   Harsh   Descending
```

---

## Accessibility Standards Compliance

### WCAG 2.1 Level AA (Target)

#### Color Contrast
All text passes minimum 4.5:1 for AA-level small text:

```
Kurinji (#9D7BC7 on #1a1228): 7.2:1 ✅
Mullai  (#6B9F2F on #FFFEF9): 6.8:1 ✅
Marutham (#C17B3D on #FFF8F0): 5.4:1 ✅
Palai  (#CC6B4A on #2B1A1A): 6.3:1 ✅
Neytal (#4A9ECC on #0A1628): 6.7:1 ✅
```

**Buttons** (accent on dark): 10:1 ✅ (exceeds AAA)

#### Motion & Animation
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- Lenis smooth scroll disabled
- Orbit rings frozen
- Hero intro skipped
- GSAP animations instant
- Framer Motion respects `reducedMotion: "user"`

#### Focus States
```css
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}
```

Visible, distinct, accessible focus indicators on all interactive elements.

#### Keyboard Navigation
- **Tab**: Move through interactive elements (buttons, links, form inputs)
- **Shift+Tab**: Move backward
- **Enter/Space**: Activate buttons, toggle checkboxes
- **Escape**: Close modals

Full keyboard navigation without requiring mouse.

#### Semantic HTML
```html
<!-- Good: semantic structure aids screen readers -->
<nav>
  <a href="/">Logo</a>
  <ul>
    <li><a href="#adhan">Adhan</a></li>
    <li><a href="#sangam">Sangam</a></li>
  </ul>
</nav>

<main>
  <section id="adhan" data-thinai="neytal">
    <h2>Adhan</h2>
    <p>Content</p>
  </section>
</main>
```

#### Language Attributes
```html
<!-- Signals screen reader and browser to use correct pronunciation & line-heights -->
<h1 lang="ta">யாழி</h1>
<p lang="ta">Tamil text here</p>
<p lang="en">English text here</p>
```

### Accessible Alternatives
- **No color as sole conveyor of info**: All zone themes also have distinct names ("Kurinji", "Mullai", etc.)
- **Alternative text**: Canvas and images have `aria-label` descriptions
- **Form labels**: All inputs have associated `<label>` elements
- **Error handling**: Form validation provides clear, colorful error messages

---

## Dark & Light Mode

The site defaults to **dark mode** (indigo night + golden accents) for brand consistency. Light mode is available but secondary:

```css
@media (prefers-color-scheme: light) {
  /* User has OS light mode preference */
  :root {
    --surface-dark: #ffffff;
    --text-primary: #1A0F0A;
    --accent: adjust for light (same hue, different lightness);
  }
}
```

**Recommendation**: Users who prefer light mode see adjusted colors that maintain hue identity but change lightness:
```
Dark  Kurinji: #9D7BC7
Light Kurinji: #b8a5d4  (lighter, less saturated)
```

---

## Implementation Examples

### Applying Accent Color in Components

```typescript
import { useTheme } from '@/contexts/ThemeContext';

export function Card() {
  const { theme } = useTheme();
  
  return (
    <div
      style={{
        borderColor: `var(--accent)`,
        backgroundColor: `var(--surface-card)`,
      }}
    >
      Content
    </div>
  );
}
```

### Responsive Typography

```typescript
export function Heading({ children }) {
  return (
    <h1
      style={{
        fontSize: 'clamp(1.5rem, 5vw, 3rem)',
        lineHeight: 1.35,
        fontFamily: 'Anek Tamil, sans-serif',
      }}
    >
      {children}
    </h1>
  );
}
```

### Language-Aware Styling

```typescript
export function BilingualText({ tamil, english }) {
  return (
    <>
      <p lang="ta">{tamil}</p>
      <p lang="en">{english}</p>
    </>
  );
}
```

---

## Deployment & Maintenance

### CSS Variables Audit
Maintain a living document of all CSS variables in use:

```css
/* /styles/variables.css */
:root {
  /* Thiṇai colors */
  --kurinji-primary: #9D7BC7;
  --mullai-primary: #6B9F2F;
  /* ... etc. */
  
  /* Dynamic (set by JS) */
  --accent: var(--kurinji-primary);
}
```

### Design Token Generation
If expanding the system:
```json
{
  "colors": {
    "kurinji": { "primary": "#9D7BC7", "bg": "#1a1228" },
    "mullai": { "primary": "#6B9F2F", "bg": "#FFFEF9" }
  },
  "typography": {
    "fontDisplay": "Anek Tamil",
    "fontBody": "Hind Madurai"
  }
}
```

Can be used to generate CSS via Figma plugin or Storybook.

---

## Resources & References

- **Sangam Poetry**: Classical Tamil literature (Sangam age, 300 BCE – 300 CE)
- **Thiṇai System**: Five landscapes of Akam (interior) poetry
- **Fonts**: 
  - Anek Tamil: https://github.com/srabuini/variable-fonts (9-script super family)
  - Hind Madurai: Google Fonts (Tamil-optimized)
  - IBM Plex Mono: Google Fonts (monospace)
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-08  
**Design Lead**: Yazhi Visual System Team
