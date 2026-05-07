"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Globe2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Member = { slug: string; initials: string; name: string; role: string };

const ease = [0.22, 1, 0.36, 1] as const;

function MemberPortrait({ member }: { member: Member }) {
  const [errored, setErrored] = useState(false);
  const showPhoto = !errored;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-[3px] rounded-full bg-[conic-gradient(from_140deg,#6D28D9,#8B5CF6,#2563EB,#6D28D9)] opacity-90"
      />
      <div className="relative h-[124px] w-[124px] overflow-hidden rounded-full bg-white sm:h-[140px] sm:w-[140px]">
        {showPhoto ? (
          <Image
            src={`/team/${member.slug}.jpg`}
            alt={member.name}
            width={280}
            height={280}
            priority={false}
            onError={() => setErrored(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-bg-elevated to-bg-subtle">
            <span className="bg-gradient-to-br from-accent to-blue bg-clip-text font-display text-[36px] font-semibold tracking-tight text-transparent sm:text-[40px]">
              {member.initials}
            </span>
          </div>
        )}
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

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
          {members.map((m, i) => (
            <motion.div
              key={i}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
              className="flex flex-col items-start gap-5"
            >
              <MemberPortrait member={m} />
              <div className="flex flex-col gap-1.5">
                <p className="text-[20px] font-semibold tracking-tight text-text">{m.name}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
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
