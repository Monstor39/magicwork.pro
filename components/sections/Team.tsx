"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
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

          <div className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-text-muted elev-card">
            <MapPin className="h-3 w-3 text-accent" />
            <span>Dubai</span>
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
              className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-border bg-white p-7 elev-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:elev-card-hover"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/12 blur-2xl transition-opacity duration-500 group-hover:bg-accent/20"
              />
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent via-accent-light to-blue opacity-80 blur-[2px]"
                />
                <div
                  aria-hidden
                  className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white font-display text-[24px] font-semibold italic tracking-tight text-text"
                >
                  <span className="bg-gradient-to-br from-accent to-blue bg-clip-text text-transparent">
                    {m.initials}
                  </span>
                </div>
              </div>
              <div className="relative flex flex-col gap-1">
                <p className="text-[18px] font-semibold tracking-tight text-text">{m.name}</p>
                <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-text-muted">
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
