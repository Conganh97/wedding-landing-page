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
  const { groom, bride } = weddingData.couple;
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

          <h1 className="invitation-script invitation-couple-names mt-4 text-[clamp(2.25rem,9vw,3.75rem)] leading-[1.15] text-white">
            {groom}
            <span className="mx-2 text-champagne/95">&</span>
            {bride}
          </h1>

          <InvitationRibbonSeal
            photoSrc={heroImage}
            photoAlt={heroImageAlt}
            isOpening={isOpening}
            onOpen={handleOpen}
            disabled={isOpening}
            hint={invitationData.sealHint}
          />

          <div className="mx-auto max-w-sm">
            <p className="font-serif text-sm tracking-[0.2em] text-white/85 uppercase sm:text-base">
              {invitationData.quoteTitle}
            </p>
            <p className="mt-2 font-serif text-2xl tracking-[0.08em] text-white sm:text-[1.65rem]">
              {invitationData.quoteGuest}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              {invitationData.quoteBody}
            </p>
          </div>

          <motion.button
            type="button"
            onClick={handleOpen}
            disabled={isOpening}
            whileHover={!isOpening ? { scale: 1.02 } : undefined}
            whileTap={!isOpening ? { scale: 0.98 } : undefined}
            className="invitation-open-btn invitation-open-btn--gate mx-auto mt-8 block min-w-[200px] px-10 py-3.5 text-sm tracking-[0.32em] uppercase disabled:opacity-50"
          >
            {invitationData.openButton}
          </motion.button>

          <p className="mt-6 font-serif text-sm italic text-champagne/80">
            {invitationData.blessing}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
