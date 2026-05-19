"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Receipt, Target, KeyRound, Boxes, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Item = { icon: string; title: string; body: string };
type Highlight = { kicker: string; title: string; body: string };

const ICONS: Record<string, LucideIcon> = {
  receipt: Receipt,
  target: Target,
  key: KeyRound,
  boxes: Boxes,
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Guarantees() {
  const t = useTranslations("guarantees");
  const items = t.raw("items") as Item[];
  const highlight = t.raw("highlight") as Highlight;
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
    <Section id="guarantees">
      <div className="flex max-w-3xl flex-col gap-4">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="text-balance text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
          {t("title")}
        </h2>
        <p className="text-[15px] leading-relaxed text-text-muted">{t("lead")}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        {items.map((item, i) => {
          const Icon = ICONS[item.icon] ?? ShieldCheck;
          return (
            <motion.div
              key={i}
              {...reveal(i * 0.06)}
              className="group relative flex gap-5 rounded-2xl border border-border bg-white p-7 elev-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:elev-card-hover"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-[17px] font-semibold tracking-tight text-text">{item.title}</h3>
                <p className="text-[14px] leading-relaxed text-text-muted">{item.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        {...reveal(0.2)}
        className="relative mt-8 overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/10 via-white to-blue/10 p-7 elev-card sm:p-9"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent sm:inset-x-9"
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-[0_4px_14px_-4px_rgba(109,40,217,0.5)]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
              {highlight.kicker}
            </span>
            <h3 className="text-balance text-[22px] font-semibold leading-[1.2] tracking-tight text-text sm:text-[26px]">
              {highlight.title}
            </h3>
            <p className="text-[14.5px] leading-relaxed text-text-muted">{highlight.body}</p>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
