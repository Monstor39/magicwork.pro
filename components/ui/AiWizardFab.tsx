"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Bot, X } from "lucide-react";
import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 0.4;
const TOOLTIP_SEEN_KEY = "mw-fab-tooltip-seen";

export function AiWizardFab() {
  const t = useTranslations("wizard.fab");
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipAllowed, setTooltipAllowed] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTooltipAllowed(localStorage.getItem(TOOLTIP_SEEN_KEY) !== "1");
    } catch {
      setTooltipAllowed(true);
    }
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? scrolled / max : 0;
      setVisible(ratio > SCROLL_THRESHOLD);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!visible || dismissed || !tooltipAllowed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowTooltip(false);
      return;
    }
    const t1 = setTimeout(() => {
      setShowTooltip(true);
      try {
        localStorage.setItem(TOOLTIP_SEEN_KEY, "1");
      } catch {
        // ignore
      }
    }, 2500);
    const t2 = setTimeout(() => setShowTooltip(false), 7500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [visible, dismissed, tooltipAllowed]);

  function onOpen() {
    setDismissed(true);
    setShowTooltip(false);
    const el = document.getElementById("wizard");
    if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  function onDismiss(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setDismissed(true);
    setShowTooltip(false);
  }

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed bottom-5 right-4 z-40 flex items-end gap-2 sm:bottom-6 sm:right-6"
        >
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={reduced ? false : { opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-auto mb-1 hidden max-w-[240px] rounded-2xl border border-border bg-white px-3.5 py-2.5 elev-card sm:block"
              >
                <p className="text-[12.5px] leading-snug text-text">{t("tooltip")}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={onOpen}
            aria-label={t("label")}
            className="group pointer-events-auto relative inline-flex h-14 items-center gap-2 rounded-full bg-gradient-to-br from-accent to-blue px-5 text-white elev-cta transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            <span
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full bg-accent/40 [animation:ring-out_2.4s_ease-out_infinite]"
            />
            <Bot className="h-5 w-5" />
            <span className="text-[13px] font-medium tracking-tight">{t("label")}</span>
          </button>

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close"
            className="pointer-events-auto inline-flex h-7 w-7 items-center justify-center self-start rounded-full border border-border bg-white text-text-subtle elev-card transition-colors hover:border-accent hover:text-accent"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
