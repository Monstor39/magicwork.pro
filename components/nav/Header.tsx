"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/Logo";
import { LangSwitch } from "@/components/ui/LangSwitch";
import { useEffect, useState } from "react";

export function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: Array<{ id: string; label: string }> = [
    { id: "services", label: t("services") },
    { id: "case", label: t("cases") },
    { id: "process", label: t("process") },
    { id: "team", label: t("team") },
    { id: "contact", label: t("contact") },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="text-[13px] text-text-muted transition-colors hover:text-text"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitch />
          <a
            href="#contact"
            className="hidden h-9 items-center rounded-md bg-accent px-4 text-[13px] font-medium text-white shadow-[0_0_0_1px_rgba(139,92,246,0.4),0_8px_22px_-8px_rgba(139,92,246,0.6)] transition-colors hover:bg-accent-light sm:inline-flex"
          >
            {t("cta")}
          </a>
        </div>
      </div>
    </header>
  );
}
