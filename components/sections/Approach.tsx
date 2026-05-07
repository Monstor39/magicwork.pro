"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Fingerprint } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Principle = { kicker: string; title: string; body: string };

const ease = [0.22, 1, 0.36, 1] as const;

export function Approach() {
  const t = useTranslations("approach");
  const principles = t.raw("principles") as Principle[];
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
    <Section id="approach" tone="deep">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div className="flex flex-col gap-5">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-balance text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
            {t("title")}
            <span className="ml-1 align-text-top text-accent">.</span>
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-text-muted">{t("lead")}</p>

          <motion.div
            {...reveal(0.15)}
            className="mt-2 inline-flex w-fit items-center gap-2.5 rounded-full border border-accent/30 bg-white px-4 py-2.5 elev-card"
          >
            <Fingerprint className="h-4 w-4 text-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
              {t("tagline")}
            </span>
          </motion.div>
        </div>

        <ol className="relative flex flex-col gap-3">
          <span
            aria-hidden
            className="absolute left-[22px] top-3 bottom-3 w-px bg-gradient-to-b from-accent/60 via-accent/20 to-transparent"
          />
          {principles.map((p, i) => (
            <motion.li
              key={i}
              {...reveal(i * 0.08)}
              className="group relative flex gap-5 rounded-2xl border border-border bg-white p-6 elev-card transition-all hover:border-accent/40 hover:elev-card-hover sm:p-7"
            >
              <div className="relative shrink-0">
                <span className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-accent/30 bg-white font-mono text-[12px] font-semibold uppercase tracking-wider text-accent shadow-[0_0_0_4px_rgba(255,255,255,1)]">
                  0{i + 1}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-subtle">
                  {p.kicker}
                </span>
                <h3 className="text-[18px] font-semibold tracking-tight text-text">{p.title}</h3>
                <p className="text-[14px] leading-relaxed text-text-muted">{p.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
