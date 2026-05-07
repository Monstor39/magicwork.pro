"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/Logo";
import { LangSwitch } from "@/components/ui/LangSwitch";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  const links: Array<{ id: string; label: string }> = [
    { id: "services", label: t("services") },
    { id: "approach", label: t("approach") },
    { id: "case", label: t("cases") },
    { id: "process", label: t("process") },
    { id: "team", label: t("team") },
    { id: "contact", label: t("contact") },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent bg-bg/50 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="relative text-[13px] text-text-muted transition-colors hover:text-text after:absolute after:inset-x-0 after:-bottom-1.5 after:h-[2px] after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitch />
          <a
            href="#contact"
            className="hidden h-9 items-center rounded-md bg-accent px-4 text-[13px] font-medium text-white elev-cta transition-all hover:bg-accent-light sm:inline-flex"
          >
            {t("cta")}
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-white text-text transition-colors hover:border-accent hover:text-accent lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden"
          >
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="border-b border-border bg-white shadow-[0_18px_40px_-22px_rgba(15,15,30,0.18)]"
            >
              <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
                {links.map((l, i) => (
                  <motion.a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.25 }}
                    className="flex items-center justify-between rounded-md px-3 py-3 text-[15px] font-medium text-text transition-colors hover:bg-bg-elevated hover:text-accent"
                  >
                    <span>{l.label}</span>
                    <span className="font-mono text-[11px] text-text-subtle">0{i + 1}</span>
                  </motion.a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-[14px] font-medium text-white elev-cta sm:hidden"
                >
                  {t("cta")}
                </a>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
