import { Link } from "@/i18n/navigation";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 font-sans text-[16px] font-semibold tracking-tight text-text outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-md ${className}`}
      aria-label="MagicWork.AI"
    >
      <LogoMark />
      <span className="inline-flex items-baseline">
        <span>
          Magic<span className="text-accent">Work</span>
        </span>
        <span className="mx-[1px] text-accent">.</span>
        <span
          className="font-mono text-[15px] font-bold uppercase tracking-[0.04em] leading-none bg-[linear-gradient(110deg,#6D28D9_0%,#8B5CF6_22%,#A78BFA_42%,#60A5FA_62%,#2563EB_82%,#6D28D9_100%)] bg-[length:200%_100%] bg-clip-text text-transparent [animation:shimmer_3.6s_linear_infinite] motion-reduce:[animation:none]"
        >
          AI
        </span>
      </span>
    </Link>
  );
}

export function LogoMark({ size = 30 }: { size?: number }) {
  const id = "mw-logo-grad";
  const idGlow = "mw-logo-glow";
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
            <stop offset="55%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id={idGlow} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="1" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="1" />
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
          stroke={`url(#${id})`}
          strokeWidth="1.6"
        />

        {/* briefcase body */}
        <rect
          x="4"
          y="10"
          width="24"
          height="17"
          rx="2.6"
          fill={`url(#${id})`}
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

        {/* central divider line (briefcase clasp) */}
        <line
          x1="4"
          y1="16.5"
          x2="28"
          y2="16.5"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* AI core node — pulsing spark in the centre (hint of intelligence) */}
        <circle
          cx="16"
          cy="16.5"
          r="2"
          fill="white"
          style={{
            transformOrigin: "16px 16.5px",
            transformBox: "fill-box",
            animationName: "logo-core-pulse",
            animationDuration: "2.4s",
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        />
        <circle cx="16" cy="16.5" r="0.9" fill={`url(#${idGlow})`} />
      </svg>
    </span>
  );
}
