import { Link } from "@/i18n/navigation";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-1.5 font-sans text-[16px] font-semibold tracking-tight text-text outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-md ${className}`}
      aria-label="AI MagicWork.PRO"
    >
      <LogoMark />
      <span className="inline-flex items-baseline">
        <span>
          Magic<span className="text-accent">Work</span>
        </span>
        <span className="mx-[1px] text-accent">.</span>
        <span className="font-mono text-[13px] font-bold uppercase tracking-[0.06em] text-text-muted">
          PRO
        </span>
      </span>
    </Link>
  );
}

export function LogoMark({ size = 30 }: { size?: number }) {
  const bodyId = "mw-logo-body";
  const aiId = "mw-logo-ai";
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        transform: "translate(2px, -2px)",
      }}
      aria-hidden
    >
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <defs>
          <linearGradient id={bodyId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="55%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          <linearGradient
            id={aiId}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="22%" stopColor="#E9D5FF" />
            <stop offset="42%" stopColor="#C4B5FD" />
            <stop offset="62%" stopColor="#93C5FD" />
            <stop offset="82%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFFFFF" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1 0"
              to="1 0"
              dur="3.6s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        {/* briefcase handle */}
        <rect
          x="11"
          y="6"
          width="10"
          height="4"
          rx="1.6"
          fill="none"
          stroke={`url(#${bodyId})`}
          strokeWidth="1.6"
        />

        {/* briefcase body */}
        <rect
          x="4"
          y="10"
          width="24"
          height="17"
          rx="2.6"
          fill={`url(#${bodyId})`}
        />
        {/* inner highlight (top edge) */}
        <rect
          x="4"
          y="10"
          width="24"
          height="17"
          rx="2.6"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.6"
        />

        {/* AI text inside the briefcase, with shimmer gradient */}
        <text
          x="16"
          y="22.6"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="10"
          fontWeight="800"
          letterSpacing="0.5"
          fill={`url(#${aiId})`}
        >
          AI
        </text>
      </svg>
    </span>
  );
}
