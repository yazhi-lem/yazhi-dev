export type MascotMode = "video" | "interactive" | "avatar" | "static";

export type MascotSize = "xs" | "sm" | "md" | "lg" | "xl" | "custom";

export interface MascotInteractionEvent {
  type: "proximity" | "hover" | "click" | "greeting";
  data?: unknown;
}

export interface YazhiMascotProps {
  /** Rendering mode:
   * - "video": Plays the transparent VP9 WebM animation with fallback poster and reduced-motion handling.
   * - "interactive": Assembles all 6 layers with subtle, premium micro-animations (breathing, tail sway, gaze tracking, blink).
   * - "avatar": Cropped and framed head + eyes for compact avatars, agent pickers, and cards.
   * - "static": All layers assembled anatomically without continuous motion.
   */
  mode?: MascotMode;
  /** Predefined size preset or "custom" for parent-controlled sizing */
  size?: MascotSize;
  /** Extra CSS class name */
  className?: string;
  /** Whether mouse/cursor gaze tracking is active (defaults to true in interactive mode) */
  interactive?: boolean;
  /** High priority image/video loading */
  priority?: boolean;
  /** Accessible image/video description */
  alt?: string;
  /** Future interaction hook (proximity, hover, click, greeting) */
  onInteraction?: (event: MascotInteractionEvent) => void;
}
