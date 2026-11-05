"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/wedding";
import { invitationData } from "@/data/invitation";
import { InvitationRibbonSeal } from "@/components/invitation/InvitationRibbonSeal";
import {
  InvitationCornerFoliage,
  InvitationGateFrame,
  InvitationTopFlourish,
} from "@/components/invitation/InvitationOrnaments";

type InvitationGateProps = {
  onOpen: () => void;
};

export function InvitationGate({ onOpen }: InvitationGateProps) {
  const [phase, setPhase] = useState<"idle" | "opening">("idle");
  const [visible, setVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const { groomShort: groom, brideShort: bride } = weddingData.couple;
  const { heroImage, heroImageAlt } = weddingData;

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
    }, 2100);
  };

  if (!visible) return null;

  const isOpening = phase === "opening";
  const doorTransition = { duration: 1.05, ease: [0.45, 0, 0.2, 1] as const };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isOpening ? 0 : 1 }}
      transition={{ duration: 0.35, delay: isOpening ? 1.55 : 0 }}
      className="invitation-gate-root fixed inset-0 z-[100] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={invitationData.gateTitle}
    >
      <motion.div
        className="invitation-gate-door invitation-gate-door--left"
        aria-hidden="true"
        initial={false}
        animate={{ x: isOpening ? "-108%" : "0%" }}
        transition={doorTransition}
      />
      <motion.div
        className="invitation-gate-door invitation-gate-door--right"
        aria-hidden="true"
        initial={false}
        animate={{ x: isOpening ? "108%" : "0%" }}
        transition={doorTransition}
      />

      <div className="invitation-gate-bg absolute inset-0" />
      <div className="invitation-gate-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="invitation-gate-grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? -12 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex min-h-full flex-col items-center justify-center overflow-y-auto px-6 py-10 sm:px-10"
      >
        <InvitationGateFrame />
        <InvitationCornerFoliage side="left" />
        <InvitationCornerFoliage side="right" />

        <div className="relative w-full max-w-lg text-center">
          <InvitationTopFlourish />

          <p className="mt-3 text-[10px] tracking-[0.42em] text-champagne/90 uppercase sm:text-[11px]">
            {invitationData.gateEyebrow}
          </p>

          <h1 className="invitation-couple-names mx-auto mt-4 w-full max-w-2xl px-1 font-serif text-[clamp(1.65rem,5.2vw,2.85rem)] font-light leading-snug tracking-[0.06em] text-white">
            <span className="mx-auto flex max-w-full flex-col items-center justify-center gap-1 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:justify-center min-[420px]:gap-x-3 min-[420px]:gap-y-1 md:flex-nowrap md:gap-x-4">
              <span className="text-center whitespace-nowrap">{groom}</span>
              <span
                className="shrink-0 font-serif text-[0.92em] leading-none text-champagne"
                aria-hidden="true"
              >
                &
              </span>
              <span className="text-center whitespace-nowrap">{bride}</span>
            </span>
          </h1>

          <InvitationRibbonSeal
            photoSrc={heroImage}
            photoAlt={heroImageAlt}
            isOpening={isOpening}
            onOpen={handleOpen}
            disabled={isOpening}
            hint={invitationData.sealHint}
          />

          <div className="mx-auto max-w-md">
            <p className="font-serif text-base tracking-[0.2em] text-white/85 uppercase md:text-lg">
              {invitationData.quoteTitle}
            </p>
            <p className="mt-3 font-serif text-2xl tracking-[0.08em] text-white md:text-3xl">
              {invitationData.quoteGuest}
            </p>
            <p className="mt-3 text-base leading-relaxed text-white/75 md:text-lg">
              {invitationData.quoteBody}
            </p>
          </div>

          <motion.button
            type="button"
            onClick={handleOpen}
            disabled={isOpening}
            whileHover={!isOpening ? { scale: 1.02 } : undefined}
            whileTap={!isOpening ? { scale: 0.98 } : undefined}
            className="invitation-open-btn invitation-open-btn--gate mx-auto mt-8 block min-w-[220px] px-10 py-4 text-base tracking-[0.32em] uppercase disabled:opacity-50 md:text-lg"
          >
            {invitationData.openButton}
          </motion.button>

          <p className="mt-6 font-serif text-base italic text-champagne/80 md:text-lg">
            {invitationData.blessing}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
