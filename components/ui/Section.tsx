import { type HTMLAttributes, type ReactNode } from "react";

type Tone = "default" | "elevated" | "deep";

type SectionProps = HTMLAttributes<HTMLElement> & {
  id?: string;
  tone?: Tone;
  innerClassName?: string;
  children: ReactNode;
};

const tones: Record<Tone, string> = {
  default: "",
  elevated:
    "bg-gradient-to-b from-bg via-bg-elevated to-bg before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-border-strong before:to-transparent",
  deep:
    "bg-bg-subtle before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-border-strong before:to-transparent after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-border-strong after:to-transparent",
};

export function Section({
  id,
  tone = "default",
  className = "",
  innerClassName = "",
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative w-full px-5 sm:px-8 lg:px-12 py-20 sm:py-28 ${tones[tone]} ${className}`}
      {...props}
    >
      <div className={`mx-auto w-full max-w-6xl ${innerClassName}`}>{children}</div>
    </section>
  );
}
