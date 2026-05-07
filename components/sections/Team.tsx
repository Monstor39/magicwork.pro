"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Globe2, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Member = { slug: string; initials: string; name: string; role: string };

const ease = [0.22, 1, 0.36, 1] as const;

function DuoPhoto() {
  const [errored, setErrored] = useState(false);
  const showPhoto = !errored;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-bg-elevated elev-card">
      <div className="relative aspect-[16/7] w-full">
        {showPhoto ? (
          <Image
            src="/team/duo.jpg"
            alt="MagicWork.PRO team"
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            onError={() => setErrored(true)}
            className="object-cover"
            priority={false}
          />
        ) : (
          <DuoPlaceholder />
        )}
      </div>
    </div>
  );
}

function DuoPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.18),transparent_55%),radial-gradient(circle_at_75%_75%,rgba(37,99,235,0.14),transparent_55%)]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15,15,30,0.10) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative flex flex-col items-center gap-3 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-white/80 text-accent backdrop-blur-sm">
          <Users className="h-5 w-5" />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
          Photo coming soon
        </span>
      </div>
    </div>
  );
}

export function Team() {
  const t = useTranslations("team");
  const members = t.raw("members") as Member[];
  const reduced = useReducedMotion();

  return (
    <Section id="team">
      <div className="flex flex-col gap-12">
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

          <div className="grid grid-cols-1 gap-6 self-start sm:grid-cols-2">
            {members.map((m, i) => (
              <motion.div
                key={i}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className="relative flex flex-col gap-2 border-l-2 border-accent/40 pl-5"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-subtle">
                  0{i + 1}
                </span>
                <p className="text-[22px] font-semibold leading-tight tracking-tight text-text sm:text-[24px]">
                  {m.name}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                  {m.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          <DuoPhoto />
        </motion.div>
      </div>
    </Section>
  );
}
