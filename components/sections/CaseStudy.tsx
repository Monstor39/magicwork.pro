"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Metric = { value: string; label: string };
type AlsoBuilt = { title: string; body: string };

const ease = [0.22, 1, 0.36, 1] as const;

export function CaseStudy() {
  const t = useTranslations("case");
  const metrics = t.raw("metrics") as Metric[];
  const alsoBuilt = t.raw("alsoBuilt") as AlsoBuilt[];

  return (
    <Section id="case">
      <div className="flex flex-col gap-3">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease }}
        className="relative mt-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-bg-elevated via-bg-subtle to-bg-elevated p-7 sm:p-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -bottom-32 h-72 w-72 rounded-full bg-blue/15 blur-3xl"
        />

        <div className="relative flex flex-col gap-7">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{t("statusBadge")}</span>
          </div>

          <h2 className="max-w-3xl text-balance text-[34px] font-semibold leading-tight tracking-tight sm:text-[44px]">
            {t("title")}
          </h2>

          <p className="max-w-2xl text-[16px] leading-relaxed text-text-muted">{t("lede")}</p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease }}
                className="rounded-xl border border-border bg-bg/60 p-5 backdrop-blur-sm"
              >
                <div className="font-sans text-[28px] font-semibold leading-none tracking-tight text-text sm:text-[32px]">
                  {m.value}
                </div>
                <div className="mt-2 text-[12px] leading-snug text-text-muted">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="mt-12 flex flex-col gap-5">
        <h3 className="font-mono text-[12px] uppercase tracking-wider text-text-muted">
          {t("alsoBuiltTitle")}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {alsoBuilt.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className="rounded-xl border border-border bg-bg-elevated p-6 transition-colors hover:border-accent/40"
            >
              <h4 className="text-[15px] font-semibold tracking-tight text-text">{item.title}</h4>
              <p className="mt-2 text-[13px] leading-relaxed text-text-muted">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
