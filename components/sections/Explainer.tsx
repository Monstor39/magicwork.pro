"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Check, X } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Tone = "what" | "can" | "cant";
type Card = {
  tone: Tone;
  kicker: string;
  title?: string;
  body?: string;
  items?: string[];
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Explainer() {
  const t = useTranslations("explainer");
  const cards = t.raw("cards") as Card[];
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
    <Section id="explainer" tone="elevated">
      <div className="flex max-w-3xl flex-col gap-4">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="text-balance text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
          {t("title")}
        </h2>
        <p className="text-[15px] leading-relaxed text-text-muted">{t("lead")}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            {...reveal(i * 0.08)}
            className={`relative flex flex-col gap-4 rounded-2xl border bg-white p-7 elev-card transition-all hover:-translate-y-0.5 hover:elev-card-hover ${
              card.tone === "what"
                ? "border-accent/40"
                : card.tone === "can"
                  ? "border-success/40"
                  : "border-danger/30"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                  card.tone === "what"
                    ? "bg-accent/10 text-accent"
                    : card.tone === "can"
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                }`}
              >
                {card.tone === "what" && <Sparkles className="h-4 w-4" />}
                {card.tone === "can" && <Check className="h-4 w-4" />}
                {card.tone === "cant" && <X className="h-4 w-4" />}
              </span>
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                  card.tone === "what"
                    ? "text-accent"
                    : card.tone === "can"
                      ? "text-success"
                      : "text-danger"
                }`}
              >
                {card.kicker}
              </span>
            </div>

            {card.title && (
              <h3 className="text-[16px] font-semibold leading-snug tracking-tight text-text">
                {card.title}
              </h3>
            )}
            {card.body && (
              <p className="text-[14px] leading-relaxed text-text-muted">{card.body}</p>
            )}

            {card.items && card.items.length > 0 && (
              <ul className="flex flex-col gap-2.5">
                {card.items.map((item, k) => (
                  <li
                    key={k}
                    className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-text"
                  >
                    <span
                      aria-hidden
                      className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                        card.tone === "can" ? "bg-success" : "bg-danger"
                      }`}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
