import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/Logo";
import { LangSwitch } from "@/components/ui/LangSwitch";

export function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("contact");
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-bg-elevated">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="max-w-xs text-[13px] text-text-muted">{t("tagline")}</p>
          </div>
          <div className="flex flex-col gap-2 font-mono text-[12px] text-text-muted">
            <a
              href="https://t.me/Magicworkpro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text transition-colors hover:text-accent"
            >
              {tc("alternatives.telegram")}
            </a>
            <a
              href="mailto:golodbizai@gmail.com"
              className="transition-colors hover:text-accent"
            >
              {tc("alternatives.email")}
            </a>
          </div>
          <LangSwitch />
        </div>
        <div className="flex flex-col gap-2 border-t border-border pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-text-subtle sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} MagicWork</span>
          <span>{t("rights")}</span>
        </div>
      </div>
    </footer>
  );
}
