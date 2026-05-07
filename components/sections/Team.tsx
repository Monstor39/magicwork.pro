"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Globe2, Mail } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Member = { initials: string; name: string; role: string };

const ease = [0.22, 1, 0.36, 1] as const;

export function Team() {
  const t = useTranslations("team");
  const members = t.raw("members") as Member[];
  const reduced = useReducedMotion();

  return (
    <Section id="team">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-balance text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
            {t("title")}
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-text-muted">{t("body")}</p>

          <div className="mt-3 flex flex-col gap-2.5 rounded-2xl border border-border bg-white p-4 elev-card">
            <div className="flex items-center gap-2">
              <Globe2 className="h-3.5 w-3.5 text-accent" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-subtle">
                {t("geoTitle")}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-gradient-to-br from-accent to-blue px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_4px_10px_-4px_rgba(109,40,217,0.5)]">
                {t("geoCore")}
              </span>
              <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                {t("geoExtra")}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {members.map((m, i) => (
            <motion.div
              key={i}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
              className="group relative flex items-center gap-5 rounded-2xl border border-border bg-white p-5 elev-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:elev-card-hover sm:p-6"
            >
              <div className="relative shrink-0">
                <div
                  aria-hidden
                  className="absolute -inset-[3px] rounded-full bg-[conic-gradient(from_140deg,#6D28D9,#8B5CF6,#2563EB,#6D28D9)] opacity-90"
                />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <span className="bg-gradient-to-br from-accent to-blue bg-clip-text font-display text-[20px] font-semibold tracking-tight text-transparent">
                    {m.initials}
                  </span>
                </div>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="truncate text-[16px] font-semibold tracking-tight text-text">
                  {m.name}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
                  {m.role}
                </p>
              </div>
              <a
                href="mailto:golodbizai@gmail.com"
                aria-label={`Email ${m.name}`}
                className="ml-auto inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
