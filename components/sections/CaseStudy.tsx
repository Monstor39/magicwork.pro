"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Metric = { value: string; label: string };
type AlsoBuilt = { title: string; body: string };

const ease = [0.22, 1, 0.36, 1] as const;

function parseMetric(raw: string): { prefix: string; number: number | null; suffix: string } {
  const match = raw.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { prefix: raw, number: null, suffix: "" };
  return {
    prefix: match[1],
    number: parseFloat(match[2]),
    suffix: match[3],
  };
}

function CountValue({ raw, animate }: { raw: string; animate: boolean }) {
  const { prefix, number, suffix } = parseMetric(raw);
  const [display, setDisplay] = useState(number === null || !animate ? number ?? 0 : 0);

  useEffect(() => {
    if (number === null || !animate) {
      if (number !== null) setDisplay(number);
      return;
    }
    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(number * eased);
      if (t < 1) raf = requestAnimationFrame(step);
      else setDisplay(number);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [number, animate]);

  if (number === null) {
    return <>{raw}</>;
  }

  const isInt = Number.isInteger(number);
  const formatted = isInt ? Math.round(display).toString() : display.toFixed(1);
  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  );
}

export function CaseStudy() {
  const t = useTranslations("case");
  const metrics = t.raw("metrics") as Metric[];
  const alsoBuilt = t.raw("alsoBuilt") as AlsoBuilt[];
  const reduced = useReducedMotion();
  const metricsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(metricsRef, { once: true, margin: "-80px" });

  return (
    <Section id="case" tone="elevated">
      <div className="flex flex-col gap-3">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease }}
        className="relative mt-6 overflow-hidden rounded-3xl border border-border bg-white p-7 elev-card sm:p-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 hidden h-72 w-72 rounded-full bg-accent/15 blur-3xl will-change-transform md:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -bottom-24 hidden h-64 w-64 rounded-full bg-blue/10 blur-3xl will-change-transform md:block"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        />

        <div className="relative flex flex-col gap-7">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{t("statusBadge")}</span>
          </div>

          <h2 className="max-w-3xl text-balance text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
            {t("title")}
          </h2>

          <p className="max-w-2xl text-[16px] leading-relaxed text-text-muted">{t("lede")}</p>

          <div ref={metricsRef} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 elev-card transition-all hover:-translate-y-0.5 hover:elev-card-hover"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent/8 blur-2xl transition-opacity group-hover:opacity-100"
                />
                <div className="relative font-display text-[40px] font-semibold leading-none tracking-tight text-text italic sm:text-[48px]">
                  <CountValue raw={m.value} animate={!reduced && inView} />
                </div>
                <div className="relative mt-3 text-[12.5px] leading-snug text-text-muted">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="mt-12 flex flex-col gap-5">
        <h3 className="font-mono text-[12px] uppercase tracking-[0.18em] text-text-muted">
          {t("alsoBuiltTitle")}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {alsoBuilt.map((item, i) => (
            <motion.div
              key={i}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className="rounded-2xl border border-border bg-white p-6 elev-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:elev-card-hover"
            >
              <h4 className="text-[15px] font-semibold tracking-tight text-text">{item.title}</h4>
              <p className="mt-2 text-[13px] leading-relaxed text-text-muted">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
