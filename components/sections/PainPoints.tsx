"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Item = { title: string; body: string };

const ease = [0.22, 1, 0.36, 1] as const;

export function PainPoints() {
  const t = useTranslations("pain");
  const items = t.raw("items") as Item[];
  const reduced = useReducedMotion();

  const reveal = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.5, delay, ease },
        };

  return (
    <Section id="pain">
      <div className="flex flex-col gap-3">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="max-w-2xl text-balance text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
          {t("title")}
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        {items.map((item, i) => (
          <motion.div
            key={i}
            {...reveal(i * 0.06)}
            className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-white p-7 elev-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:elev-card-hover"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-subtle">
              0{i + 1}
            </span>
            <h3 className="text-[18px] font-semibold tracking-tight text-text">{item.title}</h3>
            <p className="text-[15px] leading-relaxed text-text-muted">{item.body}</p>
            <span className="absolute inset-x-7 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-accent to-transparent transition-transform duration-500 group-hover:scale-x-100" />
          </motion.div>
        ))}
      </div>

      <motion.div
        {...reveal(0.2)}
        className="mt-10 flex max-w-2xl flex-col gap-5 rounded-xl border border-accent/30 bg-accent/10 p-6"
      >
        <p className="text-[16px] leading-relaxed text-text">{t("answer")}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <a
            href="#wizard"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-5 text-[14px] font-medium text-white elev-cta transition-all hover:bg-accent-light"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t("ctaPrimary")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#contact"
            className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-text-muted transition-colors hover:text-accent"
          >
            {t("ctaSecondary")}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </motion.div>
    </Section>
  );
}
