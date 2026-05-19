"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Bot,
  User,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Send,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { trackGoal } from "@/components/analytics/YandexMetrika";

type Option = { id: string; label: string };
type Stage = "intro" | "q1" | "q2" | "q3" | "q4" | "preview" | "contact" | "result";
type Message = { from: "bot" | "user"; text: string; isResult?: boolean };
type SubmitStatus = "idle" | "sending" | "sent" | "error";

type Answers = {
  business?: string;
  pain?: string;
  size?: string;
  timeline?: string;
};

type Field = "business" | "pain" | "size" | "timeline";

const ease = [0.22, 1, 0.36, 1] as const;
const STORAGE_KEY = "mw-wizard-v2";
const TG_HANDLE = "Magicworkpro";

const FIELD_FOR_STAGE: Record<"q1" | "q2" | "q3" | "q4", Field> = {
  q1: "business",
  q2: "pain",
  q3: "size",
  q4: "timeline",
};

const PROGRESS: Record<Stage, number> = {
  intro: 0,
  q1: 20,
  q2: 40,
  q3: 60,
  q4: 80,
  preview: 90,
  contact: 95,
  result: 100,
};

const STAGE_FOR_STEP: Record<1 | 2 | 3 | 4, Stage> = {
  1: "q1",
  2: "q2",
  3: "q3",
  4: "q4",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function AiWizard() {
  const t = useTranslations("wizard");
  const locale = useLocale();
  const reduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const businessOpts = t.raw("step1.options") as Option[];
  const painOpts = t.raw("step2.options") as Option[];
  const sizeOpts = t.raw("step3.options") as Option[];
  const timelineOpts = t.raw("step4.options") as Option[];

  useEffect(() => {
    // One-shot client-only hydration from localStorage. setState in effect is
    // unavoidable here because we can't read localStorage during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        stage?: Stage;
        answers?: Answers;
        messages?: Message[];
      };
      if (saved.stage && saved.stage !== "intro") {
        setStage(saved.stage);
        setAnswers(saved.answers ?? {});
        setMessages(saved.messages ?? []);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (stage === "intro") {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ stage, answers, messages }),
        );
      }
    } catch {
      // ignore
    }
  }, [hydrated, stage, answers, messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, stage]);

  function recKey(a: Answers): string | null {
    if (!a.business || !a.pain) return null;
    return `${a.business}_${a.pain}`;
  }

  function lookupRec(a: Answers): string {
    const key = recKey(a);
    if (!key) return "";
    try {
      const r = t(`recs.${key}`);
      if (r && !r.startsWith("recs.")) return r;
    } catch {
      // fall through
    }
    try {
      return t(`recs.other_${a.pain ?? "leads"}`);
    } catch {
      return "";
    }
  }

  async function botSay(text: string, opts?: { isResult?: boolean; delayMs?: number }) {
    setTyping(true);
    await sleep(reduced ? 100 : (opts?.delayMs ?? 750));
    setTyping(false);
    setMessages((prev) => [...prev, { from: "bot", text, isResult: opts?.isResult }]);
  }

  async function start() {
    setMessages([{ from: "bot", text: t("intro") }]);
    setStage("q1");
    await botSay(t("step1.q"), { delayMs: 400 });
  }

  async function pick(stageId: "q1" | "q2" | "q3" | "q4", opt: Option) {
    const field = FIELD_FOR_STAGE[stageId];
    setMessages((prev) => [...prev, { from: "user", text: opt.label }]);
    const newAnswers = { ...answers, [field]: opt.id };
    setAnswers(newAnswers);

    if (stageId === "q1") {
      setStage("q2");
      await botSay(t("step2.q"));
    } else if (stageId === "q2") {
      setStage("q3");
      await botSay(t("step3.q"));
    } else if (stageId === "q3") {
      setStage("q4");
      await botSay(t("step4.q"));
    } else {
      // q4 done — show preview
      const rec = lookupRec(newAnswers);
      await botSay(`${t("preview.preface")} ${rec}`, { isResult: true, delayMs: 1400 });
      await botSay(t("preview.ask"), { delayMs: 700 });
      setStage("preview");
    }
  }

  function goBack() {
    setMessages((prev) => {
      // remove last user + bot pair, keeping bot question for current step
      const next = [...prev];
      // strip from the end: any trailing bot (re-ask) + last user reply + previous bot question becomes current step's question
      // simpler: pop while last is bot, then pop user, then leave previous bot as current question
      while (next.length && next[next.length - 1].from === "bot") next.pop();
      if (next.length && next[next.length - 1].from === "user") next.pop();
      return next;
    });

    setStage((s) => {
      if (s === "q2") {
        setAnswers((a) => ({ ...a, business: undefined }));
        return "q1";
      }
      if (s === "q3") {
        setAnswers((a) => ({ ...a, pain: undefined }));
        return "q2";
      }
      if (s === "q4") {
        setAnswers((a) => ({ ...a, size: undefined }));
        return "q3";
      }
      if (s === "preview") {
        setAnswers((a) => ({ ...a, timeline: undefined }));
        return "q4";
      }
      if (s === "contact") {
        return "preview";
      }
      return s;
    });
  }

  async function skipContact() {
    setStage("result");
  }

  async function goToContact() {
    setStage("contact");
  }

  function getProfileLine() {
    const labelFor = (opts: Option[], id?: string) =>
      opts.find((o) => o.id === id)?.label ?? id ?? "—";
    return [
      `Бизнес: ${labelFor(businessOpts, answers.business)}`,
      `Боль: ${labelFor(painOpts, answers.pain)}`,
      `Команда: ${labelFor(sizeOpts, answers.size)}`,
      `Сроки: ${labelFor(timelineOpts, answers.timeline)}`,
    ].join("\n");
  }

  async function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitStatus === "sending") return;
    if (!name.trim() || !contact.trim()) return;

    setSubmitStatus("sending");

    const tgToken = process.env.NEXT_PUBLIC_TG_BOT_TOKEN;
    const tgChat = process.env.NEXT_PUBLIC_TG_CHAT_ID;

    const rec = lookupRec(answers);
    const text = [
      "🤖 Заявка с AI-демо Данилы (magicwork.pro)",
      `Имя: ${name.trim()}`,
      `Контакт: ${contact.trim()}`,
      "",
      "Профиль:",
      getProfileLine(),
      "",
      "Рекомендация визарда:",
      rec,
      "",
      `Локаль: ${locale}`,
    ].join("\n");

    if (!tgToken || !tgChat) {
      console.warn("[wizard] telegram not configured");
      setSubmitStatus("sent");
      await sleep(600);
      setStage("result");
      return;
    }

    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChat,
          text,
          disable_web_page_preview: true,
        }),
        signal: controller.signal,
      });
      clearTimeout(tid);
      if (!res.ok) throw new Error("submit failed");
      trackGoal("wizard_lead", {
        business: answers.business,
        pain: answers.pain,
        size: answers.size,
        timeline: answers.timeline,
      });
      setSubmitStatus("sent");
      await sleep(600);
      setStage("result");
    } catch {
      setSubmitStatus("error");
    }
  }

  function copyResult() {
    const rec = lookupRec(answers);
    if (!rec) return;
    const text = `${t("result.title")}\n\n${rec}\n\n— magicwork.pro`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  function reset() {
    setMessages([]);
    setAnswers({});
    setName("");
    setContact("");
    setSubmitStatus("idle");
    setStage("intro");
  }

  const currentOptionsByStage: Partial<Record<Stage, Option[]>> = {
    q1: businessOpts,
    q2: painOpts,
    q3: sizeOpts,
    q4: timelineOpts,
  };
  const currentOptions =
    stage === "q1" || stage === "q2" || stage === "q3" || stage === "q4"
      ? currentOptionsByStage[stage]
      : null;
  const currentStageForPick =
    stage === "q1" || stage === "q2" || stage === "q3" || stage === "q4" ? stage : null;

  const currentStepNumber: 1 | 2 | 3 | 4 | null =
    stage === "q1" ? 1 : stage === "q2" ? 2 : stage === "q3" ? 3 : stage === "q4" ? 4 : null;
  void STAGE_FOR_STEP;

  const progress = PROGRESS[stage];
  const canGoBack = stage === "q2" || stage === "q3" || stage === "q4" || stage === "preview" || stage === "contact";
  const finalRec = lookupRec(answers);

  return (
    <Section id="wizard" tone="elevated">
      <div className="flex max-w-3xl flex-col gap-4">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="text-balance text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
          {t("title")}
        </h2>
        <p className="text-[15px] leading-relaxed text-text-muted">{t("subtitle")}</p>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-white elev-card">
        <div className="flex items-center gap-3 border-b border-border bg-bg-elevated px-5 py-4 sm:px-6">
          <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue text-white">
            <Bot className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full border-2 border-white bg-success" />
          </span>
          <div className="flex flex-1 flex-col">
            <span className="text-[14px] font-semibold tracking-tight text-text">{t("botName")}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-success">
              {t("botRole")} · online
            </span>
          </div>
          {currentStepNumber && (
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-text-subtle sm:inline">
              {t("stepCounter", { n: currentStepNumber })}
            </span>
          )}
        </div>

        {stage !== "intro" && (
          <div className="h-1 w-full bg-border">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-blue"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease }}
            />
          </div>
        )}

        <div
          ref={scrollRef}
          className="flex max-h-[520px] min-h-[360px] flex-col gap-3 overflow-y-auto bg-bg-elevated/40 px-4 py-6 sm:px-6"
        >
          {stage === "intro" && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="flex items-start gap-3"
            >
              <BotAvatar />
              <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-border bg-white px-4 py-3 elev-card">
                <p className="text-[14px] leading-relaxed text-text">{t("intro")}</p>
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease }}
                className={`flex items-start gap-3 ${m.from === "user" ? "flex-row-reverse" : ""}`}
              >
                {m.from === "bot" ? <BotAvatar /> : <UserAvatar />}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                    m.from === "bot"
                      ? `rounded-tl-md border bg-white text-text elev-card ${m.isResult ? "border-accent/40" : "border-border"}`
                      : "rounded-tr-md bg-accent text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3"
            >
              <BotAvatar />
              <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-border bg-white px-4 py-3 elev-card">
                <Dot delay={0} />
                <Dot delay={0.15} />
                <Dot delay={0.3} />
                <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.16em] text-text-subtle">
                  {t("thinking")}
                </span>
              </div>
            </motion.div>
          )}

          {!typing && stage === "intro" && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25, ease }}
              className="ml-12 mt-2"
            >
              <button
                type="button"
                onClick={start}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[13px] font-medium text-white elev-cta transition-all hover:bg-accent-light"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {t("start")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.div>
          )}

          {!typing && currentOptions && currentStageForPick && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease }}
              className="ml-12 mt-1 flex flex-wrap gap-2"
            >
              {currentOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => pick(currentStageForPick, opt)}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-2 text-[13px] font-medium text-text transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:elev-card-hover"
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}

          {!typing && stage === "preview" && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease }}
              className="ml-12 mt-1 flex flex-wrap gap-2"
            >
              <button
                type="button"
                onClick={goToContact}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-[13px] font-medium text-white elev-cta transition-all hover:bg-accent-light"
              >
                <Send className="h-3.5 w-3.5" />
                {t("preview.submitLabel")}
              </button>
              <button
                type="button"
                onClick={skipContact}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2.5 text-[13px] font-medium text-text-muted transition-all hover:border-accent hover:text-accent"
              >
                {t("preview.skipLabel")}
              </button>
            </motion.div>
          )}

          {!typing && stage === "contact" && (
            <motion.form
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              onSubmit={submitContact}
              className="ml-12 mt-2 flex flex-col gap-3 rounded-2xl border border-accent/40 bg-white p-4 elev-card"
            >
              <div className="flex flex-col gap-1">
                <p className="text-[14px] font-semibold tracking-tight text-text">
                  {t("contact.title")}
                </p>
                <p className="text-[12.5px] leading-relaxed text-text-muted">
                  {t("contact.subtitle")}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
                    {t("contact.nameLabel")}
                    <span className="text-accent"> *</span>
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-[14px] text-text outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
                    {t("contact.contactLabel")}
                    <span className="text-accent"> *</span>
                  </span>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-[14px] text-text outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </label>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={submitStatus === "sending"}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-5 text-[14px] font-medium text-white elev-cta transition-all hover:bg-accent-light disabled:opacity-60"
                >
                  {submitStatus === "sending" ? t("contact.submitting") : t("contact.submit")}
                  {submitStatus !== "sending" && <ArrowRight className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={skipContact}
                  className="inline-flex h-10 items-center text-[13px] font-medium text-text-muted transition-colors hover:text-accent"
                >
                  {t("preview.skipLabel")}
                </button>
                {submitStatus === "error" && (
                  <span className="text-[12.5px] text-danger">{t("contact.error")}</span>
                )}
              </div>
            </motion.form>
          )}
        </div>

        {stage !== "intro" && (
          <div className="flex items-center justify-between gap-3 border-t border-border bg-white px-5 py-3 sm:px-6">
            <button
              type="button"
              onClick={goBack}
              disabled={!canGoBack}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-text-muted transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("back")}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-text-subtle transition-colors hover:text-accent"
            >
              <RotateCcw className="h-3 w-3" />
              {t("restart")}
            </button>
          </div>
        )}

        {stage === "result" && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="border-t border-border bg-gradient-to-br from-accent/5 via-white to-blue/5 px-5 py-6 sm:px-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  {t("result.title")}
                </span>
                <p className="text-[15px] leading-relaxed text-text">{finalRec}</p>
              </div>

              <div className="mt-1 flex flex-col gap-2">
                <h3 className="text-[17px] font-semibold tracking-tight text-text">
                  {t("result.ctaTitle")}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-text-muted">
                  {t("result.ctaBody")}
                </p>
              </div>

              <div className="mt-1 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="group inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-5 text-[14px] font-medium text-white elev-cta transition-all hover:bg-accent-light"
                >
                  {t("result.ctaButton")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href={`https://t.me/${TG_HANDLE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-white px-5 text-[14px] font-medium text-text transition-all hover:border-accent hover:text-accent"
                >
                  <Send className="h-4 w-4" />
                  {t("result.askHuman")}
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
                <button
                  type="button"
                  onClick={copyResult}
                  className="inline-flex h-11 items-center gap-1.5 px-2 text-[13px] font-medium text-text-subtle transition-colors hover:text-accent"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? t("result.copied") : t("result.copyResult")}
                </button>
              </div>

              {submitStatus === "sent" && (
                <p className="mt-1 inline-flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-3 py-2 text-[13px] text-text">
                  <Check className="h-4 w-4 text-success" />
                  {t("contact.success")}
                </p>
              )}

              <p className="mt-1 text-[11.5px] leading-relaxed text-text-subtle">
                {t("result.disclaimer")}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </Section>
  );
}

function BotAvatar() {
  return (
    <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue text-white">
      <Bot className="h-4 w-4" />
    </span>
  );
}

function UserAvatar() {
  return (
    <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-text-muted">
      <User className="h-4 w-4" />
    </span>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      aria-hidden
      className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
      animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 0.9, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}
