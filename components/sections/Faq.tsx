"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Item = { q: string; a: string };

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as Item[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-3">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-balance text-[34px] font-semibold leading-tight tracking-tight sm:text-[44px]">
            {t("title")}
          </h2>
        </div>

        <ul className="flex flex-col">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={i} className="border-b border-border first:border-t">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start gap-4 py-5 text-left transition-colors hover:text-accent"
                >
                  <span className="mt-0.5 font-mono text-[12px] uppercase tracking-wider text-text-subtle">
                    0{i + 1}
                  </span>
                  <span className="flex-1 text-[16px] font-medium tracking-tight text-text">
                    {item.q}
                  </span>
                  <Plus
                    className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-accent" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pl-10 pr-8 text-[14px] leading-relaxed text-text-muted">
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
