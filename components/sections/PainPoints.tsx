"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Item = { title: string; body: string };

const ease = [0.22, 1, 0.36, 1] as const;

export function PainPoints() {
  const t = useTranslations("pain");
  const items = t.raw("items") as Item[];

  return (
    <Section id="pain">
      <div className="flex flex-col gap-3">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="max-w-2xl text-balance text-[34px] font-semibold leading-tight tracking-tight sm:text-[44px]">
          {t("title")}
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease }}
            className="group relative flex flex-col gap-3 bg-bg-elevated p-7 transition-colors hover:bg-bg-subtle"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-subtle">
              0{i + 1}
            </span>
            <h3 className="text-[18px] font-semibold tracking-tight text-text">
              {item.title}
            </h3>
            <p className="text-[15px] leading-relaxed text-text-muted">{item.body}</p>
            <span className="absolute inset-x-7 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-accent to-transparent transition-transform duration-500 group-hover:scale-x-100" />
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.2, ease }}
        className="mt-10 max-w-2xl rounded-xl border border-accent/30 bg-accent/5 p-6 text-[16px] leading-relaxed text-text"
      >
        {t("answer")}
      </motion.p>
    </Section>
  );
}
