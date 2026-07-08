# Yazhi v1 — Cyberpunk Aesthetic (Archived)

**Date Archived**: 2026-07-08
**Reason**: Replaced with enhanced Sangam-era 3D open-world experience

## What This Is
This directory preserves the original cyberpunk-themed marketing site with:
- Neon/cyber aesthetic (bright accent colors, dark mode emphasis)
- Basic 3D scenes (wireframe, particles, waves, torus knot)
- Scroll-triggered Thinai theme switching
- 5 abstract WebGL scenes per theme
- Mouse-tracked interactions and hero constellation

## Key Design Philosophy
**Cyber-forward tech aesthetic** celebrating Tamil heritage through a high-contrast, neon-accented approach. Emphasizes the "7B parameters" and "3 core projects" through technical visual language.

## Why It Changed
The enhanced Sangam-era experience provides:
- Immersive 3D open-world with procedural terrain and cultural set dressing
- Scroll-driven camera that "travels" through five poetic landscapes
- Deeper integration of Sangam-era historical details and whimsical elements
- Better storytelling through environment and spatial navigation
- Refined typography (unified Anek Tamil font family)
- Complete accessibility with graceful fallbacks

## Reusable Patterns
If you need to reference patterns from this version:
- **Language Context**: `src/contexts/LanguageContext.tsx` (i18n three-way toggle)
- **Thinai Theme System**: `src/app/globals.css` (CSS variable scheme, theme switching)
- **Theme Observer**: `src/components/ScrollThemeObserver.tsx` (Intersection Observer pattern)
- **Particle Effects**: `src/components/AdhanShowcase.tsx` (animation patterns)

---

For the current production site, see `/src` in parent directory.
