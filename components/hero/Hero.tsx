"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const HeroBackdrop = dynamic(
  () => import("./HeroBackdrop").then((m) => m.HeroBackdrop),
  { ssr: false },
);

const reveal = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden pt-14"
    >
      <HeroBackdrop />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-7 px-5 pb-24 pt-8 sm:px-8 sm:pt-16 lg:px-12">
        <motion.div
          initial="initial"
          animate="animate"
          variants={reveal}
          transition={{ duration: 0.6, ease }}
          className="flex flex-wrap items-center gap-3"
        >
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            <Sparkles className="h-3 w-3" />
            {t("tagIndividual")}
          </span>
        </motion.div>

        <motion.h1
          initial="initial"
          animate="animate"
          variants={reveal}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="max-w-3xl text-balance font-sans text-[40px] font-semibold leading-[1.12] tracking-tight sm:text-[58px] sm:leading-[1.08] lg:text-[72px] lg:leading-[1.06]"
        >
          <span className="text-text">{t("headlinePart1")}</span>{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-accent-deep via-accent to-blue bg-clip-text text-transparent">
              {t("headlineAccent")}
            </span>
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-[0.05em] z-0 h-[0.14em] bg-accent/15"
            />
          </span>
          <br />
          <span className="text-text-muted">{t("headlinePart2")}</span>
        </motion.h1>

        <motion.p
          initial="initial"
          animate="animate"
          variants={reveal}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          className="max-w-2xl text-[16px] leading-relaxed text-text-muted sm:text-[18px]"
        >
          {t("subhead")}
        </motion.p>

        <motion.p
          initial="initial"
          animate="animate"
          variants={reveal}
          transition={{ duration: 0.7, delay: 0.32, ease }}
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-subtle"
        >
          {t("proofLine")}
        </motion.p>

        <motion.div
          initial="initial"
          animate="animate"
          variants={reveal}
          transition={{ duration: 0.7, delay: 0.4, ease }}
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          <a
            href="#contact"
            className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-md bg-accent px-7 text-[15px] font-medium text-white elev-cta transition-all hover:bg-accent-light"
          >
            {t("primaryCta")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#case"
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-md border border-border-strong bg-white px-7 text-[15px] font-medium text-text transition-colors hover:border-accent hover:text-accent"
          >
            {t("secondaryCta")}
          </a>
          <a
            href="#contact"
            className="group inline-flex h-[52px] items-center gap-2 px-2 text-[14px] font-medium text-text-muted transition-colors hover:text-accent"
          >
            <span className="border-b border-dashed border-border-strong pb-0.5 transition-colors group-hover:border-accent">
              {t("tertiaryCta")}
            </span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={reveal}
          transition={{ duration: 0.7, delay: 0.55, ease }}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 font-mono text-[12px] uppercase tracking-wider text-text-subtle"
        >
          <span className="inline-flex items-center gap-2">
            <span className="relative inline-block h-[7px] w-[7px] rounded-full bg-success">
              <span className="absolute inset-0 rounded-full bg-success [animation:pulse-dot_2s_ease-out_infinite]" />
            </span>
            {t("spotsOpen")}
          </span>
          <span className="hidden h-3 w-px bg-border-strong sm:inline-block" />
          <span className="text-text-muted normal-case tracking-normal font-sans">
            {t("trustLine")}
          </span>
        </motion.div>
      </div>

      <a
        href="#pain"
        aria-label="Scroll to next section"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-text-subtle transition-colors hover:text-text"
      >
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  );
}
