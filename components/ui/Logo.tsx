import { Link } from "@/i18n/navigation";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 font-sans text-[15px] font-semibold tracking-tight text-text ${className}`}
    >
      <span
        aria-hidden
        className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent to-blue text-white shadow-[0_0_18px_-4px_rgba(139,92,246,0.7)]"
      >
        <span className="font-mono text-[13px] font-bold">M</span>
      </span>
      <span>
        Magic<span className="text-accent">Work</span>
      </span>
    </Link>
  );
}
