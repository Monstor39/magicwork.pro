"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Step = { title: string; body: string };

const ease = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as Step[];

  return (
    <Section id="process">
      <div className="flex flex-col gap-3">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="max-w-2xl text-balance text-[34px] font-semibold leading-tight tracking-tight sm:text-[44px]">
          {t("title")}
        </h2>
      </div>

      <ol className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
        {steps.map((step, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease }}
            className="relative flex flex-col gap-4 bg-bg-elevated p-7"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-accent/40 bg-accent/10 font-mono text-[13px] text-accent">
                0{i + 1}
              </span>
              {i < steps.length - 1 && (
                <span className="hidden h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent md:block" />
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
