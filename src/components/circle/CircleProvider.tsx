"use client";
import { createContext, useContext, type ReactNode } from "react";
import { useCircle } from "@/lib/circle/useCircle";

type CircleContextValue = ReturnType<typeof useCircle>;

const CircleContext = createContext<CircleContextValue | null>(null);

/** One Circle session per page tree — every Circle button and bubble
    reads the same state instead of fetching it separately. */
export function CircleProvider({ children }: { children: ReactNode }) {
  const value = useCircle();
  return <CircleContext.Provider value={value}>{children}</CircleContext.Provider>;
}

export function useCircleSession(): CircleContextValue {
  const ctx = useContext(CircleContext);
  if (!ctx) throw new Error("useCircleSession must be used inside <CircleProvider>");
  return ctx;
}
