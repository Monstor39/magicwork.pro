"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Bot, Cable, Workflow, Code2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Item = { title: string; body: string };

const ease = [0.22, 1, 0.36, 1] as const;

const icons = [Bot, Cable, Workflow, Code2];

export function Services() {
  const t = useTranslations("services");
  const items = t.raw("items") as Item[];

  return (
    <Section id="services">
      <div className="flex flex-col gap-3">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="max-w-2xl text-balance text-[34px] font-semibold leading-tight tracking-tight sm:text-[44px]">
          {t("title")}
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item, i) => {
          const Icon = icons[i] ?? Bot;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease }}
              className="group relative flex flex-col gap-4 rounded-xl border border-border bg-bg-elevated p-7 transition-all hover:border-accent/50 hover:bg-bg-subtle"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/12 text-accent ring-1 ring-accent/30 transition-all group-hover:bg-accent group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-[18px] font-semibold tracking-tight text-text">
                {item.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-text-muted">{item.body}</p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
