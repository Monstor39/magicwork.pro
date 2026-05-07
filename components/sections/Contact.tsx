"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Send } from "lucide-react";
import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("website")) {
      setStatus("success");
      form.reset();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          business: data.get("business"),
          pain: data.get("pain"),
          contact: data.get("contact"),
          time: data.get("time"),
          locale,
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <Section id="contact">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-5">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-balance text-[34px] font-semibold leading-tight tracking-tight sm:text-[44px]">
            {t("title")}
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-text-muted">{t("subtitle")}</p>

          <div className="mt-4 flex flex-col gap-3">
            <p className="font-mono text-[11px] uppercase tracking-wider text-text-subtle">
              {t("alternativesTitle")}
            </p>
            <a
              href="https://t.me/Magicworkpro"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-lg border border-border bg-bg-elevated px-4 py-3 transition-colors hover:border-accent"
            >
              <Send className="h-4 w-4 text-accent" />
              <span className="font-mono text-[14px] text-text">{t("alternatives.telegram")}</span>
              <ArrowRight className="ml-auto h-4 w-4 text-text-muted transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="mailto:golodbizai@gmail.com"
              className="group inline-flex items-center gap-3 rounded-lg border border-border bg-bg-elevated px-4 py-3 transition-colors hover:border-accent"
            >
              <Mail className="h-4 w-4 text-accent" />
              <span className="font-mono text-[14px] text-text">{t("alternatives.email")}</span>
              <ArrowRight className="ml-auto h-4 w-4 text-text-muted transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={onSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-bg-elevated p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field name="name" label={t("fields.name")} required />
            <Field name="business" label={t("fields.business")} />
          </div>
          <Field name="pain" label={t("fields.pain")} multiline />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field name="contact" label={t("fields.contact")} required />
            <Field name="time" label={t("fields.time")} />
          </div>

          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden opacity-0"
            aria-hidden="true"
          />

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-[15px] font-medium text-white shadow-[0_0_0_1px_rgba(139,92,246,0.4),0_10px_28px_-10px_rgba(139,92,246,0.65)] transition-all hover:bg-accent-light disabled:opacity-60"
            >
              {status === "submitting" ? t("submitting") : t("submit")}
              {status !== "submitting" && <ArrowRight className="h-4 w-4" />}
            </button>
            {status === "success" && (
              <span className="text-[13px] text-success">{t("success")}</span>
            )}
            {status === "error" && (
              <span className="text-[13px] text-danger">{t("error")}</span>
            )}
          </div>
        </motion.form>
      </div>
    </Section>
  );
}

function Field({
  name,
  label,
  required,
  multiline,
}: {
  name: string;
  label: string;
  required?: boolean;
  multiline?: boolean;
}) {
  const cls =
    "w-full rounded-md border border-border bg-bg/60 px-3.5 py-2.5 text-[14px] text-text placeholder-text-subtle outline-none transition-colors focus:border-accent focus:bg-bg-elevated";
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {multiline ? (
        <textarea name={name} rows={3} required={required} className={cls + " resize-y"} />
      ) : (
        <input type="text" name={name} required={required} className={cls} />
      )}
    </label>
  );
}
