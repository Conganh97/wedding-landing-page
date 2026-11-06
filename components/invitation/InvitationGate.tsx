"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/wedding";
import { invitationData } from "@/data/invitation";

type InvitationGateProps = {
  onOpen: () => void;
};

export function InvitationGate({ onOpen }: InvitationGateProps) {
  const [phase, setPhase] = useState<"idle" | "opening">("idle");
  const [visible, setVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const { groomShort: groom, brideShort: bride } = weddingData.couple;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleOpen = () => {
    if (phase !== "idle") return;

    if (shouldReduceMotion) {
      setVisible(false);
      onOpen();
      return;
    }

    setPhase("opening");
    window.setTimeout(() => {
      setVisible(false);
      onOpen();
    }, 700);
  };

  if (!visible) return null;

  const isOpening = phase === "opening";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isOpening ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={invitationData.gateTitle}
    >
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-6 py-12 text-center">
        <p className="flex items-center gap-3 text-[11px] tracking-[0.42em] text-white/80 uppercase">
          <span className="h-px w-8 bg-white/45" aria-hidden="true" />
          <span className="text-[8px]" aria-hidden="true">
            ◆
          </span>
          {invitationData.gateEyebrow}
          <span className="text-[8px]" aria-hidden="true">
            ◆
          </span>
          <span className="h-px w-8 bg-white/45" aria-hidden="true" />
        </p>

        <h1 className="mt-8 font-script text-[4.25rem] leading-[0.95] text-white sm:text-7xl">
          <span className="block">{groom}</span>
          <span className="my-1 block font-script text-5xl">&</span>
          <span className="block">{bride}</span>
        </h1>

        <p className="mt-8 text-sm tracking-[0.38em] text-white/80">
          {invitationData.displayDate}
        </p>

        <p className="mt-10 text-[11px] tracking-[0.42em] text-white/65 uppercase">
          Kính mời
        </p>
        <p className="font-script text-4xl text-white">{invitationData.quoteGuest}</p>

        <div className="mx-auto mt-4 h-px w-36 bg-white/35" />

        <motion.button
          type="button"
          onClick={handleOpen}
          disabled={isOpening}
          whileHover={!isOpening ? { scale: 1.03 } : undefined}
          whileTap={!isOpening ? { scale: 0.98 } : undefined}
          className="mt-8 rounded-full border border-white/45 px-10 py-3 text-xs tracking-[0.38em] text-white uppercase disabled:opacity-50"
        >
          {invitationData.openButton}
        </motion.button>
      </div>
    </motion.div>
  );
}
