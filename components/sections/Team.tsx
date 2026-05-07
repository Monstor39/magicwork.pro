"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Member = { initials: string; name: string; role: string };

const ease = [0.22, 1, 0.36, 1] as const;

export function Team() {
  const t = useTranslations("team");
  const members = t.raw("members") as Member[];

  return (
    <Section id="team">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-balance text-[34px] font-semibold leading-tight tracking-tight sm:text-[44px]">
            {t("title")}
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-text-muted">{t("body")}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {members.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
              className="flex flex-col gap-5 rounded-2xl border border-border bg-bg-elevated p-7"
            >
              <div
                aria-hidden
                className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 via-accent/10 to-blue/20 font-mono text-[20px] font-semibold tracking-tight text-text ring-1 ring-accent/40"
              >
                {m.initials}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[18px] font-semibold tracking-tight text-text">{m.name}</p>
                <p className="font-mono text-[12px] uppercase tracking-wider text-text-muted">
                  {m.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
