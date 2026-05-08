"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Mail, Send } from "lucide-react";
import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL = "golodbizai@gmail.com";

export function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [emailCopied, setEmailCopied] = useState(false);
  const reduced = useReducedMotion();

  const onEmailClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(EMAIL);
      } catch {
        // ignore — fall through to mailto
      }
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
      window.location.href = `mailto:${EMAIL}`;
    }
  };

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
          <h2 className="text-balance text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
            {t("title")}
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-text-muted">{t("subtitle")}</p>

          <div className="mt-4 flex flex-col gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle">
              {t("alternativesTitle")}
            </p>
            <a
              href="https://t.me/Magicworkpro"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 elev-card transition-all hover:-translate-y-0.5 hover:border-accent hover:elev-card-hover"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent to-blue text-white">
                <Send className="h-4 w-4" />
              </span>
              <span className="font-mono text-[14px] text-text">{t("alternatives.telegram")}</span>
              <ArrowRight className="ml-auto h-4 w-4 text-text-muted transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={`mailto:${EMAIL}`}
              onClick={onEmailClick}
              className="group inline-flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 elev-card transition-all hover:-translate-y-0.5 hover:border-accent hover:elev-card-hover"
              aria-label={emailCopied ? "Email copied" : `Email: ${EMAIL}`}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent to-blue text-white">
                <Mail className="h-4 w-4" />
              </span>
              <span className="font-mono text-[14px] text-text">{t("alternatives.email")}</span>
              <span className="ml-auto flex items-center gap-2">
                {emailCopied && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-success">
                    {t("emailCopied")}
                  </span>
                )}
                {emailCopied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-text-muted transition-transform group-hover:translate-x-0.5" />
                )}
              </span>
            </a>
          </div>
        </div>

        <motion.form
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={onSubmit}
          className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-bg-elevated p-6 elev-card sm:p-8"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
          />
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
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-[15px] font-medium text-white elev-cta transition-all hover:bg-accent-light disabled:opacity-60 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
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
    "w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-[14px] text-text placeholder-text-subtle outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20";
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {multiline ? (
        <textarea
          name={name}
          rows={3}
          required={required}
          aria-required={required}
          className={cls + " resize-y"}
        />
      ) : (
        <input
          type="text"
          name={name}
          required={required}
          aria-required={required}
          className={cls}
        />
      )}
    </label>
  );
}
