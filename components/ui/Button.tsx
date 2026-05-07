import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-sans text-[14px] font-medium tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none";

const sizes = {
  md: "h-11 px-5",
  lg: "h-[52px] px-7 text-[15px]",
} as const;

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-light shadow-[0_0_0_1px_rgba(139,92,246,0.4),0_10px_30px_-10px_rgba(139,92,246,0.65)] hover:shadow-[0_0_0_1px_rgba(167,139,250,0.5),0_14px_36px_-10px_rgba(167,139,250,0.75)]",
  secondary:
    "bg-bg-elevated text-text border border-border-strong hover:border-accent hover:text-accent",
  ghost:
    "text-text-muted hover:text-text",
};

type CommonProps = {
  variant?: Variant;
  size?: keyof typeof sizes;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & CommonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
});

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & CommonProps;

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: LinkButtonProps) {
  return (
    <a className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />
  );
}
