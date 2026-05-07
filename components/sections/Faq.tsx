"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Item = { q: string; a: string };

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as Item[];
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <Section id="faq" tone="deep">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-3">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-balance text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
            {t("title")}
          </h2>
        </div>

        <ul className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white elev-card">
          {items.map((item, i) => {
            const isOpen = open === i;
            const buttonId = `${baseId}-q-${i}`;
            const panelId = `${baseId}-a-${i}`;
            return (
              <li
                key={i}
                className="group border-b border-border last:border-b-0 transition-colors hover:bg-bg-elevated"
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:bg-accent/5"
                >
                  <span className="mt-0.5 font-mono text-[12px] uppercase tracking-[0.16em] text-text-subtle">
                    0{i + 1}
                  </span>
                  <span
                    className={`flex-1 text-[16px] font-medium tracking-tight transition-colors ${
                      isOpen ? "text-accent" : "text-text group-hover:text-accent"
                    }`}
                  >
                    {item.q}
                  </span>
                  <Plus
                    className={`h-4 w-4 shrink-0 transition-all duration-300 ${
                      isOpen ? "rotate-45 text-accent" : "text-text-muted"
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pl-[3.25rem] pr-8 text-[14px] leading-relaxed text-text-muted">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
