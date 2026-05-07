"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Send, Mail } from "lucide-react";
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

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted elev-card">
              <MapPin className="h-3 w-3 text-accent" />
              <span>Dubai, UAE</span>
            </span>
            <a
              href="https://t.me/Magicworkpro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted transition-colors hover:border-accent hover:text-accent elev-card"
            >
              <Send className="h-3 w-3 text-accent" />
              <span>@Magicworkpro</span>
            </a>
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
              className="group relative flex items-center gap-5 rounded-2xl border border-border bg-white p-5 elev-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:elev-card-hover"
            >
              <div className="relative shrink-0">
                <div
                  aria-hidden
                  className="absolute -inset-[3px] rounded-full bg-[conic-gradient(from_140deg,#6D28D9,#8B5CF6,#2563EB,#6D28D9)] opacity-90"
                />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <span className="bg-gradient-to-br from-accent to-blue bg-clip-text font-display text-[20px] font-semibold italic tracking-tight text-transparent">
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
