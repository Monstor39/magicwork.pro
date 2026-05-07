import { type HTMLAttributes, type ReactNode } from "react";

type SectionProps = HTMLAttributes<HTMLElement> & {
  id?: string;
  children: ReactNode;
};

export function Section({ id, className = "", children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative w-full px-5 sm:px-8 lg:px-12 py-20 sm:py-28 ${className}`}
      {...props}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
