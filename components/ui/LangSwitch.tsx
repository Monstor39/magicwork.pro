"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export function LangSwitch() {
  const locale = useLocale();
  const t = useTranslations("lang");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (target: "ru" | "en") => {
    if (target === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: target });
    });
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center gap-1 rounded-md border border-border bg-white p-0.5 font-mono text-[11px] uppercase tracking-wider"
      data-busy={isPending ? "true" : undefined}
    >
      {(["ru", "en"] as const).map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            className={
              active
                ? "rounded-sm bg-accent px-2.5 py-1 text-white"
                : "rounded-sm px-2.5 py-1 text-text-muted transition-colors hover:text-text"
            }
            aria-pressed={active}
          >
            {t(code)}
          </button>
        );
      })}
    </div>
  );
}
