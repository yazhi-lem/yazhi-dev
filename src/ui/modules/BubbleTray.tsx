"use client";
import { useMemo } from "react";
import { Bubble } from "../components/Bubble";
import type { BubbleSize } from "@/lib/bubble/types";
import { packColumn } from "./pack";

export interface TrayItem {
  id: string;
  label: string;
  accent: string;
  size: BubbleSize;
  glyph?: string;
  title?: string;
}

/** The packed column of bubbles from the Bubble UI sketch: circles that
    never touch, laid out deterministically. On phones it becomes one
    scrolling row. */
export function BubbleTray({
  items,
  activeId,
  onSelect,
  width = 150,
}: {
  items: TrayItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  width?: number;
}) {
  const { placed, height } = useMemo(() => packColumn(items.map((i) => i.size), width), [items, width]);
  return (
    <nav aria-label="Bubbles">
      <ul className="flex gap-2 overflow-x-auto px-3 py-2 md:hidden" data-lenis-prevent>
        {items.map((b) => (
          <li key={b.id}>
            <Bubble
              accent={b.accent}
              label={b.label}
              glyph={b.glyph}
              title={b.title}
              size={40}
              active={b.id === activeId}
              onSelect={onSelect && (() => onSelect(b.id))}
            />
          </li>
        ))}
      </ul>
      <ul className="relative hidden md:block" style={{ width, height }}>
        {items.map((b, i) => (
          <li key={b.id} className="absolute" style={{ left: placed[i].x - placed[i].r, top: placed[i].y - placed[i].r }}>
            <Bubble
              accent={b.accent}
              label={b.label}
              glyph={b.glyph}
              title={b.title}
              size={placed[i].r * 2}
              active={b.id === activeId}
              onSelect={onSelect && (() => onSelect(b.id))}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
