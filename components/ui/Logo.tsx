import { Link } from "@/i18n/navigation";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 font-sans text-[15px] font-semibold tracking-tight text-text outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-md ${className}`}
      aria-label="MagicWork"
    >
      <LogoMark />
      <span className="inline-flex items-baseline">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent leading-none mr-1.5 hidden sm:inline">
          AI
        </span>
        <span>
          Magic<span className="text-accent">Work</span>
          <span
            aria-hidden
            className="ml-[2px] inline-block h-[1em] w-[2px] translate-y-[2px] bg-accent align-middle [animation:blink-caret_1.1s_steps(1)_infinite]"
          />
        </span>
      </span>
    </Link>
  );
}

export function LogoMark({ size = 30 }: { size?: number }) {
  const id = "mw-logo-grad";
  const idCore = "mw-logo-core";
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <radialGradient id={idCore} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="1" />
            <stop offset="60%" stopColor="#6D28D9" stopOpacity="1" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.85" />
          </radialGradient>
        </defs>

        {/* подложка-граф (всегда видна) */}
        <g
          stroke={`url(#${id})`}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        >
          <line x1="6" y1="10" x2="16" y2="16" />
          <line x1="6" y1="22" x2="16" y2="16" />
          <line x1="16" y1="16" x2="26" y2="10" />
          <line x1="16" y1="16" x2="26" y2="22" />
        </g>

        {/* пульсы по рёбрам — только при hover группы */}
        <g
          stroke={`url(#${id})`}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="6 18"
          opacity="0"
          className="transition-opacity duration-300 group-hover:opacity-100"
        >
          <line
            x1="6"
            y1="10"
            x2="16"
            y2="16"
            pathLength={24}
            style={{
              animationName: "logo-pulse-1",
              animationDuration: "1.6s",
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
            }}
          />
          <line
            x1="6"
            y1="22"
            x2="16"
            y2="16"
            pathLength={24}
            style={{
              animationName: "logo-pulse-2",
              animationDuration: "1.6s",
              animationDelay: "0.4s",
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
            }}
          />
          <line
            x1="16"
            y1="16"
            x2="26"
            y2="10"
            pathLength={24}
            style={{
              animationName: "logo-pulse-3",
              animationDuration: "1.6s",
              animationDelay: "0.8s",
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
            }}
          />
          <line
            x1="16"
            y1="16"
            x2="26"
            y2="22"
            pathLength={24}
            style={{
              animationName: "logo-pulse-4",
              animationDuration: "1.6s",
              animationDelay: "1.2s",
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
            }}
          />
        </g>

        {/* периферийные ноды */}
        <circle cx="6" cy="10" r="2" fill={`url(#${id})`} />
        <circle cx="6" cy="22" r="2" fill={`url(#${id})`} />
        <circle cx="26" cy="10" r="2" fill={`url(#${id})`} />
        <circle cx="26" cy="22" r="2" fill={`url(#${id})`} />

        {/* центральная "agent" нода */}
        <circle cx="16" cy="16" r="4.5" fill={`url(#${idCore})`} opacity="0.18" />
        <circle
          cx="16"
          cy="16"
          r="3.2"
          fill={`url(#${idCore})`}
          style={{
            transformOrigin: "16px 16px",
            transformBox: "fill-box",
            animationName: "logo-core-pulse",
            animationDuration: "2.6s",
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        />
      </svg>
    </span>
  );
}
