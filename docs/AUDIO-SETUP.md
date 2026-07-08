# Audio Setup — Tamil Yazh & Pann Integration

## Overview

The Yazhi marketing site includes provisions for ambient Tamil classical music (yazh and pann instrumental) to enhance the immersive experience.

**Current Status**: Framework ready; audio files not yet added (placeholder path configured)

---

## Audio Files Needed

### Primary Ambient Track
- **Path**: `/public/audio/yazhi-ambient.mp3`
- **Format**: MP3 (H.264 codec compatible), stereo, 48 kHz
- **Duration**: 3–5 minutes (will loop)
- **Loudness**: -14 LUFS (normalized, broadcast standard)
- **Composition**: Tamil yazh and pann instruments, instrumental only (no vocals)
- **Mood**: Contemplative, whimsical, meditative

**Recommended Sources**:
- Yazh performances (ancient string instrument native to Tamil Nadu)
- Pann performances (ancient wind instrument)
- Modern fusion recordings of traditional raagas (Bhairav, Yaman, Kharaharapriya for Tamil modes)

### File Size Optimization
```bash
# Convert to optimized MP3 using ffmpeg:
ffmpeg -i yazhi-ambient.wav \
  -codec:a libmp3lame \
  -q:a 4 \
  -joint_stereo \
  -ar 48000 \
  yazhi-ambient.mp3

# Result: ~5–8 MB per 5 minutes (acceptable for streaming)
```

---

## Integration Instructions

### Step 1: Place Audio Files

```
public/
  audio/
    yazhi-ambient.mp3          # Primary ambient track (required)
    yazhi-zone-kurinji.mp3     # Optional: zone-specific theme
    yazhi-zone-mullai.mp3
    yazhi-zone-marutham.mp3
    yazhi-zone-palai.mp3
    yazhi-zone-neytal.mp3
```

### Step 2: Audio Player Component

Add to `src/components/AudioPlayer.tsx`:

```typescript
'use client';
import { useAmbientMusic } from '@/hooks/useAmbientMusic';
import { Volume2, VolumeMute, Play, Pause } from 'lucide-react';

export function AudioPlayer() {
  const { audioRef, isPlaying, isMuted, volume, toggleMute, togglePlayPause, setVolume } =
    useAmbientMusic();

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} aria-hidden="true" />

      {/* Floating control button (bottom-right) */}
      <div
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full 
                   bg-surface-card border border-accent/30 p-3 backdrop-blur"
        role="region"
        aria-label="Audio controls"
      >
        {/* Play/Pause */}
        <button
          onClick={togglePlayPause}
          className="hover:text-accent transition-colors"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          title="Play/Pause"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {/* Mute Toggle */}
        <button
          onClick={toggleMute}
          className="hover:text-accent transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          title={isMuted ? 'Click to unmute' : 'Click to mute'}
        >
          {isMuted ? <VolumeMute size={20} /> : <Volume2 size={20} />}
        </button>

        {/* Volume Slider */}
        {!isMuted && (
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
            className="w-20 h-1 rounded-full accent-accent"
            aria-label="Volume"
            title="Volume"
          />
        )}
      </div>
    </>
  );
}
```

### Step 3: Add to Layout

Edit `src/app/layout.tsx`:

```typescript
import { AudioPlayer } from '@/components/AudioPlayer';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* ... existing providers ... */}
        <AudioPlayer />
        {children}
      </body>
    </html>
  );
}
```

### Step 4: Hook Usage

The `useAmbientMusic()` hook is available in any client component:

```typescript
'use client';
import { useAmbientMusic } from '@/hooks/useAmbientMusic';

export function MyComponent() {
  const { isPlaying, isMuted, volume, toggleMute } = useAmbientMusic();

  return (
    <button onClick={toggleMute}>
      {isMuted ? '🔇 Unmute' : '🔊 Mute'}
    </button>
  );
}
```

---

## Advanced Features (Optional)

### Zone-Specific Audio Themes

To play different raags (musical modes) per thinai zone:

```typescript
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useRef } from 'react';

export function useZoneAudio() {
  const { theme } = useTheme();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    // Map zone to audio file
    const audioMap = {
      kurinji: '/audio/yazhi-zone-kurinji.mp3',
      mullai: '/audio/yazhi-zone-mullai.mp3',
      marutham: '/audio/yazhi-zone-marutham.mp3',
      palai: '/audio/yazhi-zone-palai.mp3',
      neytal: '/audio/yazhi-zone-neytal.mp3',
    };

    const newSrc = audioMap[theme] || '/audio/yazhi-ambient.mp3';

    if (audioRef.current.src !== newSrc) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = newSrc;
      if (wasPlaying) {
        audioRef.current.play();
      }
    }
  }, [theme]);

  return audioRef;
}
```

### Volume Sync with Scroll

Fade music volume based on scroll position:

```typescript
export function useScrollAudioVolume(audioRef: React.RefObject<HTMLAudioElement>) {
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      scrollRef.current = progress;

      if (audioRef.current) {
        // Fade volume: 0% scroll → 30% volume, 50% scroll → 60% volume, 100% → 40% volume
        const targetVolume = Math.sin(progress * Math.PI) * 0.3 + 0.35;
        audioRef.current.volume = targetVolume;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [audioRef]);
}
```

### Accessibility Features

```typescript
// Announce audio state to screen readers
<div
  role="status"
  aria-live="polite"
  aria-label={`Audio player: ${isPlaying ? 'playing' : 'paused'}, ${Math.round(volume * 100)}% volume`}
/>
```

---

## Browser Autoplay Policy

Modern browsers restrict autoplay to:
1. **Muted by default** (then can be unmuted by user gesture)
2. **User interaction required** (click, touch)
3. **Exceptions**: User has engaged with site before

**Best Practice**: Start muted, provide unmute button. The `useAmbientMusic` hook follows this approach.

---

## Performance Considerations

### File Optimization

```bash
# Keep MP3 file sizes <10 MB for fast loading:
# - Bitrate: 128–192 kbps (sufficient for ambient music)
# - Sample rate: 44.1 kHz or 48 kHz
# - Channels: Stereo (2 channels)

ffmpeg -i input.wav -b:a 192k -ar 44100 output.mp3
```

### Lazy Loading

Audio loads after main content:

```typescript
const audioRef = useRef<HTMLAudioElement>(null);

// Audio element only mounts if user hasn't disabled it in preferences
useEffect(() => {
  const userPreference = localStorage.getItem('yazhi:audio:enabled');
  if (userPreference === 'false') return;

  // Create audio element
  const audio = new Audio();
  audio.src = '/audio/yazhi-ambient.mp3';
  audio.loop = true;
  audioRef.current = audio;
}, []);
```

### Service Worker Caching

For offline support:

```javascript
// sw.js - Cache audio files for offline playback
const CACHE_NAME = 'yazhi-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/audio/yazhi-ambient.mp3',
        '/audio/yazhi-zone-kurinji.mp3',
        // ... other files
      ]);
    })
  );
});
```

---

## Testing Audio Integration

### Manual Testing Checklist

- [ ] Audio loads without console errors
- [ ] Mute button toggles audio on/off
- [ ] Volume slider adjusts volume 0–100%
- [ ] Audio loops seamlessly
- [ ] Audio persists across page reloads (localStorage)
- [ ] Mobile autoplay policy respected (requires user gesture)
- [ ] No audio memory leaks after 10+ minute playtime
- [ ] Audio works with keyboard navigation (focus-visible states)
- [ ] Screen reader announces audio status

### Automated Testing

```typescript
// __tests__/useAmbientMusic.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAmbientMusic } from '@/hooks/useAmbientMusic';

describe('useAmbientMusic', () => {
  it('should toggle mute', () => {
    const { result } = renderHook(() => useAmbientMusic());

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.isMuted).toBe(false);
  });

  it('should persist mute state to localStorage', () => {
    const { result } = renderHook(() => useAmbientMusic());

    act(() => {
      result.current.toggleMute();
    });

    expect(localStorage.getItem('yazhi:audio:muted')).toBe('false');
  });

  it('should adjust volume', () => {
    const { result } = renderHook(() => useAmbientMusic());

    act(() => {
      result.current.setVolume(0.75);
    });

    expect(result.current.volume).toBe(0.75);
  });
});
```

---

## Troubleshooting

### "Audio not playing"
1. Check `/public/audio/yazhi-ambient.mp3` exists
2. Verify file format is valid MP3
3. Open browser console, check for CORS or network errors
4. Try manually clicking mute button to trigger user gesture
5. Some browsers require HTTPS for autoplay

### "Audio plays but sounds distorted"
1. Verify audio file is normalized (-14 LUFS or similar)
2. Check volume slider isn't at max (may exceed clipping threshold)
3. Reduce audio bitrate or resample if too much data

### "Audio memory leak / battery drain"
1. Ensure audio element pauses when tab unfocused:
```typescript
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden && audioRef.current) {
      audioRef.current.pause();
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, []);
```

---

## Resources

- **ffmpeg Audio Encoding**: https://trac.ffmpeg.org/wiki/Encode/MP3
- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **Browser Autoplay Policy**: https://developer.chrome.com/blog/autoplay/
- **Tamil Music Collections**: 
  - Project Veezha (Tamil music archive)
  - Sangeet Martand (Indian classical recordings)

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-08  
**Status**: Framework ready; audio files to be added by user
