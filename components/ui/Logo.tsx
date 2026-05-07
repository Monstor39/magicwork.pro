import { Link } from "@/i18n/navigation";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 font-sans text-[15px] font-semibold tracking-tight text-text ${className}`}
      aria-label="MagicWork"
    >
      <LogoMark />
      <span>
        Magic<span className="text-accent">Work</span>
      </span>
    </Link>
  );
}

export function LogoMark({ size = 28 }: { size?: number }) {
  const id = "mw-logo-grad";
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className="drop-shadow-[0_0_10px_rgba(139,92,246,0.45)]"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>

        <g stroke={`url(#${id})`} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.35">
          <line x1="6.5" y1="22.5" x2="16" y2="6" />
          <line x1="16" y1="6" x2="25.5" y2="22.5" />
          <line x1="6.5" y1="22.5" x2="25.5" y2="22.5" />
        </g>

        <g
          stroke={`url(#${id})`}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="6 18"
          style={{
            animationName: "logo-pulse-1",
            animationDuration: "2.4s",
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
          }}
        >
          <line x1="6.5" y1="22.5" x2="16" y2="6" pathLength={24} />
        </g>
        <g
          stroke={`url(#${id})`}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="6 18"
          style={{
            animationName: "logo-pulse-2",
            animationDuration: "2.4s",
            animationDelay: "0.8s",
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
          }}
        >
          <line x1="16" y1="6" x2="25.5" y2="22.5" pathLength={24} />
        </g>
        <g
          stroke={`url(#${id})`}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="6 18"
          style={{
            animationName: "logo-pulse-3",
            animationDuration: "2.4s",
            animationDelay: "1.6s",
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
          }}
        >
          <line x1="25.5" y1="22.5" x2="6.5" y2="22.5" pathLength={24} />
        </g>

        <circle cx="6.5" cy="22.5" r="2.4" fill={`url(#${id})`} />
        <circle
          cx="16"
          cy="6"
          r="2.4"
          fill={`url(#${id})`}
          style={{
            transformOrigin: "16px 6px",
            animationName: "logo-node-glow",
            animationDuration: "2.4s",
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        />
        <circle cx="25.5" cy="22.5" r="2.4" fill={`url(#${id})`} />
      </svg>
    </span>
  );
}
