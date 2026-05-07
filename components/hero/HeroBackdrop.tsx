"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Briefcase,
  CheckCircle2,
  FileText,
  LineChart,
  Sparkles,
  Zap,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroBackdrop() {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mxs = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const mys = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });

  // parallax magnitudes per layer
  const x1 = useTransform(mxs, (v) => v * 12);
  const y1 = useTransform(mys, (v) => v * 12);
  const x2 = useTransform(mxs, (v) => v * -8);
  const y2 = useTransform(mys, (v) => v * -8);
  const x3 = useTransform(mxs, (v) => v * 6);
  const y3 = useTransform(mys, (v) => v * 6);

  useEffect(() => {
    setMounted(true);
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduced]);

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_38%,rgba(139,92,246,0.18),transparent_55%)]"
      />
    );
  }

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* mesh-gradient blobs */}
      <motion.div
        animate={
          reduced
            ? undefined
            : {
                x: [0, 30, -20, 0],
                y: [0, -20, 25, 0],
              }
        }
        transition={
          reduced
            ? undefined
            : { duration: 22, repeat: Infinity, ease: "easeInOut" }
        }
        className="absolute right-[-4rem] top-[-6rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(167,139,250,0.50),rgba(139,92,246,0.15)_55%,transparent_75%)] blur-3xl"
      />
      <motion.div
        animate={
          reduced
            ? undefined
            : {
                x: [0, -25, 30, 0],
                y: [0, 30, -15, 0],
              }
        }
        transition={
          reduced
            ? undefined
            : { duration: 26, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }
        className="absolute right-[8rem] bottom-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(96,165,250,0.40),rgba(37,99,235,0.10)_55%,transparent_75%)] blur-3xl"
      />

      {/* subtle dotted grid behind cards (right half only) */}
      <div
        className="absolute inset-y-0 right-0 left-1/2 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15,15,30,0.10) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse_at_70%_45%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse_at_70%_45%, black 0%, transparent 75%)",
        }}
      />

      {/* connecting flow line behind tiles */}
      <svg
        className="absolute inset-0 h-full w-full hidden lg:block"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="flow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 700 180 Q 850 250 900 380 T 1050 600"
          stroke="url(#flow)"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="3 6"
        >
          {!reduced && (
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-180"
              dur="6s"
              repeatCount="indefinite"
            />
          )}
        </path>
      </svg>

      {/* floating dashboard tiles (right side) */}
      <motion.div
        style={{ x: x1, y: y1 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease }}
        className="absolute right-[6%] top-[14%] hidden md:block"
      >
        <FloatingTile delay={0}>
          <MetricTile />
        </FloatingTile>
      </motion.div>

      <motion.div
        style={{ x: x2, y: y2 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease }}
        className="absolute right-[18%] top-[44%] hidden lg:block"
      >
        <FloatingTile delay={1.4}>
          <FlowTile />
        </FloatingTile>
      </motion.div>

      <motion.div
        style={{ x: x3, y: y3 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease }}
        className="absolute right-[4%] bottom-[14%] hidden md:block"
      >
        <FloatingTile delay={2.6}>
          <ChartTile />
        </FloatingTile>
      </motion.div>

      {/* small badges scattered for density */}
      <motion.div
        style={{ x: x1, y: y1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.1, ease }}
        className="absolute right-[42%] top-[32%] hidden lg:block"
      >
        <BadgeChip icon={<Bot className="h-3 w-3" />} label="AI agent" />
      </motion.div>

      <motion.div
        style={{ x: x2, y: y2 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.25, ease }}
        className="absolute right-[35%] bottom-[28%] hidden lg:block"
      >
        <BadgeChip icon={<Sparkles className="h-3 w-3" />} label="No-touch" />
      </motion.div>

      {/* hard scrim on the left so headline never collides with the cards */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-1/2 sm:right-1/3 bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0.95)_42%,rgba(255,255,255,0.55)_72%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white" />
    </div>
  );
}

function FloatingTile({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      animate={
        reduced
          ? undefined
          : {
              y: [0, -10, 0],
            }
      }
      transition={
        reduced
          ? undefined
          : {
              duration: 5.4,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
    >
      {children}
    </motion.div>
  );
}

function MetricTile() {
  return (
    <div className="relative w-[260px] overflow-hidden rounded-2xl border border-border bg-white/95 p-5 backdrop-blur-md elev-card">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-subtle">
          <FileText className="h-3 w-3 text-accent" />
          Документооборот
        </span>
        <span className="rounded-full bg-success/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-success">
          LIVE
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-[42px] font-semibold leading-none tracking-tight text-text italic">
          −90%
        </span>
        <span className="inline-flex items-center gap-0.5 text-[11px] text-success">
          <ArrowUpRight className="h-3 w-3" />
          time
        </span>
      </div>
      <div className="mt-4 flex h-10 items-end gap-1.5">
        {[40, 55, 32, 78, 48, 65, 88, 72, 95, 82, 100, 90].map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-accent/30 to-accent"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function FlowTile() {
  return (
    <div className="relative w-[230px] overflow-hidden rounded-2xl border border-border bg-white/95 p-4 backdrop-blur-md elev-card">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-subtle">
        <Zap className="h-3 w-3 text-accent" />
        Lead → CRM
      </div>
      <div className="mt-3 flex items-center justify-between">
        <FlowNode label="Inbox" />
        <FlowArrow />
        <FlowNode label="AI" highlight />
        <FlowArrow />
        <FlowNode label="CRM" />
      </div>
      <div className="mt-3 flex items-center gap-1.5 rounded-md bg-success/10 px-2 py-1.5">
        <CheckCircle2 className="h-3 w-3 text-success" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-success">
          Auto · 24/7
        </span>
      </div>
    </div>
  );
}

function FlowNode({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <span
      className={`inline-flex h-7 min-w-[44px] items-center justify-center rounded-md px-2 font-mono text-[10px] font-semibold uppercase tracking-wider ${
        highlight
          ? "bg-gradient-to-br from-accent to-blue text-white shadow-[0_4px_10px_-4px_rgba(109,40,217,0.5)]"
          : "border border-border bg-bg-elevated text-text"
      }`}
    >
      {label}
    </span>
  );
}

function FlowArrow() {
  return (
    <svg width="14" height="6" viewBox="0 0 14 6" className="text-text-subtle">
      <path
        d="M0 3 H10 M7 0 L11 3 L7 6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function ChartTile() {
  return (
    <div className="relative w-[240px] overflow-hidden rounded-2xl border border-border bg-white/95 p-4 backdrop-blur-md elev-card">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-subtle">
          <LineChart className="h-3 w-3 text-accent" />
          Conversion
        </span>
        <span className="font-mono text-[10px] font-semibold text-accent">
          +42%
        </span>
      </div>
      <svg viewBox="0 0 220 60" className="mt-3 h-12 w-full">
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="chart-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <path
          d="M0 50 L20 45 L40 48 L60 38 L80 40 L100 30 L120 28 L140 22 L160 24 L180 14 L200 10 L220 4 L220 60 L0 60 Z"
          fill="url(#chart-fill)"
        />
        <path
          d="M0 50 L20 45 L40 48 L60 38 L80 40 L100 30 L120 28 L140 22 L160 24 L180 14 L200 10 L220 4"
          stroke="url(#chart-stroke)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="220" cy="4" r="3" fill="#6D28D9" />
        <circle cx="220" cy="4" r="6" fill="#6D28D9" opacity="0.25">
          <animate attributeName="r" values="3;9;3" dur="2s" repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            values="0.5;0;0.5"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <div className="mt-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-text-subtle">
        <span>Mon</span>
        <span>Wed</span>
        <span>Fri</span>
        <span>Sun</span>
      </div>
    </div>
  );
}

function BadgeChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/90 px-3 py-1.5 backdrop-blur-md elev-card">
      <span className="text-accent">{icon}</span>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text">
        {label}
      </span>
    </div>
  );
}
