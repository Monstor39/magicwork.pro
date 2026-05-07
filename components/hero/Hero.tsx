"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), { ssr: false });

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
      <Scene />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 pb-24 pt-8 sm:px-8 sm:pt-16 lg:px-12">
        <motion.div initial="initial" animate="animate" variants={reveal} transition={{ duration: 0.6, ease }}>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
        </motion.div>

        <motion.h1
          initial="initial"
          animate="animate"
          variants={reveal}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="max-w-3xl text-balance font-sans text-[40px] leading-[1.05] tracking-tight sm:text-[58px] lg:text-[72px]"
        >
          <span className="text-text">{t("headlinePart1")}</span>{" "}
          <span className="bg-gradient-to-r from-accent via-accent-light to-blue bg-clip-text text-transparent">
            {t("headlineAccent")}
          </span>
          <br />
          <span className="text-text-muted">{t("headlinePart2")}</span>
        </motion.h1>

        <motion.p
          initial="initial"
          animate="animate"
          variants={reveal}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          className="max-w-xl text-[16px] leading-relaxed text-text-muted sm:text-[17px]"
        >
          {t("subhead")}
        </motion.p>

        <motion.div
          initial="initial"
          animate="animate"
          variants={reveal}
          transition={{ duration: 0.7, delay: 0.4, ease }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <a
            href="#contact"
            className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-md bg-accent px-7 text-[15px] font-medium text-white shadow-[0_0_0_1px_rgba(139,92,246,0.4),0_12px_32px_-10px_rgba(139,92,246,0.7)] transition-all hover:bg-accent-light hover:shadow-[0_0_0_1px_rgba(167,139,250,0.5),0_18px_44px_-10px_rgba(167,139,250,0.8)]"
          >
            {t("primaryCta")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#case"
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-md border border-border-strong bg-bg-elevated/40 px-7 text-[15px] font-medium text-text backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
          >
            {t("secondaryCta")}
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
          <span className="hidden h-3 w-px bg-border sm:inline-block" />
          <span className="text-text-muted normal-case tracking-normal font-sans">
            {t("trustLine")}
          </span>
        </motion.div>
      </div>

      <a
        href="#pain"
        aria-label="scroll"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-text-subtle transition-colors hover:text-text"
      >
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  );
}
