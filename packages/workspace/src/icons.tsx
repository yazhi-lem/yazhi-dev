/** UI line icons for the workspace shell: 24 grid, 1.6 stroke, round caps,
    currentColor — the Bubble icon rules. Decorative: the label beside
    each icon carries its name. */

const PATHS = {
  book: <path d="M5 4.5h9a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3zM17 7.5h2v12.5M8.5 9h5M8.5 12.5h5" />,
  ask: <path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H11l-4 3.5v-3.5h-.5a2 2 0 0 1-2-2zM9 9.5h6M9 12.5h4" />,
  practice: <path d="M7 4.5h10v15H7zM10 8.5l1.5 1.5 3-3M10 14h4M10 17h3" />,
  history: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 8v4.5l3 1.5" />
    </>
  ),
  teacher: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19.5c.5-3.3 2.7-5 5.5-5s5 1.7 5.5 5M15 5.5h5.5v7H16" />
    </>
  ),
  scale: <path d="M12 4v16M7 20h10M5 8h14M5 8l-2.5 6a2.5 2.5 0 0 0 5 0zM19 8l-2.5 6a2.5 2.5 0 0 0 5 0z" />,
  doc: <path d="M7 3.5h7l4 4V20.5H7zM14 3.5v4h4M9.5 12h6M9.5 15h6M9.5 18h4" />,
  shield: <path d="M12 3.5l7 3v5c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9v-5zM9 12l2 2 4-4" />,
  pen: <path d="M5 19l1-4L16 5l3 3L9 18zM14 7l3 3M5 19h14" />,
  desk: <path d="M4.5 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6l-4 3.5V16h-1a2 2 0 0 1-2-2zM8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" />,
  inbox: <path d="M4 13.5l2-8h12l2 8v5H4zM4 13.5h4.5l1 2h5l1-2H20" />,
  undo: <path d="M9 7.5L5 11.5l4 4M5.5 11.5H15a4 4 0 0 1 0 8h-2" />,
  base: (
    <>
      <ellipse cx="12" cy="6.5" rx="6.5" ry="2.5" />
      <path d="M5.5 6.5v11c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-11M5.5 12c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5" />
    </>
  ),
  store: <path d="M4 9.5L5.5 4.5h13L20 9.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5.5 12v7.5h13V12M10 19.5v-4.5h4v4.5" />,
  list: <path d="M9 6.5h10.5M9 12h10.5M9 17.5h10.5M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" />,
  sliders: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
  type: <path d="M4 18.5L8.5 6h1L14 18.5M5.6 14.5h6.8M15.5 18.5l2.5-7h.5l2.5 7M16.3 16.5h3.9" />,
  back: <path d="M14.5 5.5L8 12l6.5 6.5" />,
  flag: <path d="M6 20.5V4.5M6 5h10l-2 3.5 2 3.5H6" />,
  upload: <path d="M12 15.5V4.5M7.5 9L12 4.5 16.5 9M4.5 15v4.5h15V15" />,
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 18, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      {PATHS[name]}
    </svg>
  );
}
