import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
      <span className="relative inline-block h-[6px] w-[6px] rounded-full bg-accent">
        <span className="absolute inset-0 rounded-full bg-accent [animation:pulse-dot_2.4s_ease-out_infinite]" />
      </span>
      <span>{children}</span>
    </div>
  );
}
