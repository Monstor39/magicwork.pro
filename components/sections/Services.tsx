"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  Utensils,
  ShoppingBag,
  Briefcase,
  Factory,
  Building2,
  LineChart,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Niche = {
  id: string;
  label: string;
  summary: string;
  items: string[];
};

const ICONS: Record<string, LucideIcon> = {
  horeca: Utensils,
  ecom: ShoppingBag,
  agency: Briefcase,
  manufacturing: Factory,
  realestate: Building2,
  b2b: LineChart,
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Services() {
  const t = useTranslations("services");
  const niches = t.raw("niches") as Niche[];
  const [activeId, setActiveId] = useState(niches[0]?.id ?? "horeca");
  const active = niches.find((n) => n.id === activeId) ?? niches[0];
  const ActiveIcon = ICONS[active.id] ?? Briefcase;

  return (
    <Section id="services">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="flex flex-col gap-5">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-balance text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
            {t("title")}
          </h2>
          <p className="text-[15px] leading-relaxed text-text-muted">{t("lead")}</p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle">
              {t("selectorTitle")}
            </p>
            <p className="text-[14px] text-text-muted">{t("selectorHint")}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {niches.map((n) => {
              const Icon = ICONS[n.id] ?? Briefcase;
              const isActive = n.id === activeId;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setActiveId(n.id)}
                  aria-pressed={isActive}
                  className={`group relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                    isActive
                      ? "border-accent bg-accent text-white shadow-[0_4px_14px_-4px_rgba(109,40,217,0.5)]"
                      : "border-border bg-white text-text-muted hover:border-accent/50 hover:text-text"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-text-subtle"}`} />
                  {n.label}
                </button>
              );
            })}
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-white elev-card">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease }}
                className="flex flex-col gap-5 p-7"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-blue text-white shadow-[0_4px_14px_-4px_rgba(109,40,217,0.5)]">
                    <ActiveIcon className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-[16px] font-semibold tracking-tight text-text">
                      {active.label}
                    </p>
                    <p className="text-[13px] text-text-muted">{active.summary}</p>
                  </div>
                </div>

                <ul className="grid grid-cols-1 gap-2.5">
                  {active.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i + 0.06, duration: 0.3, ease }}
                      className="flex items-start gap-3 rounded-lg border border-border bg-bg-elevated p-3.5"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-[14px] leading-relaxed text-text">{item}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="flex items-start gap-2.5 rounded-lg border border-accent/30 bg-accent/10 p-3.5">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                  <p className="text-[12.5px] leading-relaxed text-text">
                    {t("individualNote")}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <a
            href="#contact"
            className="group inline-flex items-center gap-2 self-start text-[13px] text-text-muted transition-colors hover:text-accent"
          >
            <span>{t("ctaHint")}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </Section>
  );
}
