"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Cog, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { useId, useState } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Company = {
  name: string;
  industry: string;
  region: string;
  oneLineEdge: string;
  whatTheyAutomated: string;
  howTheyUseAI: string;
  leadVsCompetitors: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const MONOGRAMS: Record<string, string> = {
  Klarna: "KL",
  Netflix: "NF",
  Amazon: "AZ",
  JPMorgan: "JP",
  Spotify: "SP",
  Stripe: "ST",
  Uber: "UB",
  "Booking.com": "BK",
  Duolingo: "DL",
  Revolut: "RV",
};

function monogramFor(name: string) {
  return MONOGRAMS[name] ?? name.slice(0, 2).toUpperCase();
}

export function AiLeaders() {
  const t = useTranslations("aiLeaders");
  const companies = t.raw("companies") as Company[];
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
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
    <Section id="ai-leaders" tone="elevated">
      <motion.div {...reveal(0)} className="flex max-w-3xl flex-col gap-4">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="text-balance text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
          {t("title")}
        </h2>
        <p className="text-[15px] leading-relaxed text-text-muted">{t("lead")}</p>
      </motion.div>

      <ul className="mt-12 flex flex-col overflow-hidden rounded-2xl border border-border bg-white elev-card">
        {companies.map((c, i) => {
          const isOpen = open === i;
          const buttonId = `${baseId}-c-${i}`;
          const panelId = `${baseId}-p-${i}`;
          return (
            <motion.li
              key={c.name}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.05, ease }}
              className="group border-b border-border last:border-b-0 transition-colors hover:bg-bg-elevated"
            >
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center gap-4 px-5 py-5 text-left focus-visible:outline-none focus-visible:bg-accent/5 sm:px-6"
              >
                <span className="hidden font-mono text-[12px] uppercase tracking-[0.16em] text-text-subtle sm:inline">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 font-sans text-[12px] font-semibold tracking-tight text-accent">
                  {monogramFor(c.name)}
                </span>

                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span
                      className={`text-[16px] font-semibold tracking-tight transition-colors ${
                        isOpen ? "text-accent" : "text-text group-hover:text-accent"
                      }`}
                    >
                      {c.name}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-border bg-bg-elevated px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-subtle">
                      {c.industry}
                    </span>
                  </span>
                  <span className="text-[13px] leading-snug text-text-muted">{c.oneLineEdge}</span>
                </span>

                <Plus
                  className={`h-4 w-4 shrink-0 transition-all duration-300 ${
                    isOpen ? "rotate-45 text-accent" : "text-text-muted"
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-6 px-5 pb-7 pt-1 sm:px-6 sm:pb-8 lg:grid-cols-3">
                      <DetailBlock
                        Icon={Cog}
                        label={t("labels.whatAutomated")}
                        body={c.whatTheyAutomated}
                      />
                      <DetailBlock
                        Icon={Sparkles}
                        label={t("labels.howAI")}
                        body={c.howTheyUseAI}
                      />
                      <DetailBlock
                        Icon={TrendingUp}
                        label={t("labels.lead")}
                        body={c.leadVsCompetitors}
                      />
                    </div>
                    <div className="flex justify-end px-5 pb-6 sm:px-6">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-subtle">
                        {t("labels.region")}: {c.region}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>

      <motion.div
        {...reveal(0.1)}
        className="mt-12 rounded-2xl border border-border-strong bg-bg-deep p-8 lg:mt-16 lg:p-12"
      >
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex max-w-2xl flex-col gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
              {t("closing.kicker")}
            </span>
            <h3 className="text-balance text-[26px] font-semibold leading-[1.15] tracking-tight sm:text-[32px]">
              {t("closing.title")}
            </h3>
            <p className="text-[15px] leading-relaxed text-text-muted">{t("closing.body")}</p>
          </div>
          <a
            href="#services"
            className="group inline-flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-7 text-[15px] font-medium text-white elev-cta transition-all hover:bg-accent-light"
          >
            {t("closing.cta")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </motion.div>
    </Section>
  );
}

function DetailBlock({
  Icon,
  label,
  body,
}: {
  Icon: typeof Cog;
  label: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Icon className="h-4 w-4" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-subtle">
          {label}
        </span>
      </div>
      <p className="text-[14px] leading-relaxed text-text-muted">{body}</p>
    </div>
  );
}
