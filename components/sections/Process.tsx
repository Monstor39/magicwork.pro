"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Step = { title: string; body: string };

const ease = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as Step[];
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
    <Section id="process">
      <div className="flex flex-col gap-3">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="max-w-2xl text-balance text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
          {t("title")}
        </h2>
      </div>

      <ol className="relative mt-12 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <motion.li
            key={i}
            {...reveal(i * 0.08)}
            className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 elev-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:elev-card-hover sm:p-7"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-accent/40 bg-accent/10 font-mono text-[13px] font-semibold text-accent">
                0{i + 1}
              </span>
              {i < steps.length - 1 && (
                <span className="hidden h-px flex-1 bg-gradient-to-r from-accent/40 via-accent/15 to-transparent lg:block" />
              )}
            </div>
            <h3 className="text-[16px] font-semibold tracking-tight text-text">{step.title}</h3>
            <p className="text-[13px] leading-relaxed text-text-muted">{step.body}</p>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
