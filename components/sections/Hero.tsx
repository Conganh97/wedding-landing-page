"use client";

import { motion, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/wedding";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { invitationData } from "@/data/invitation";
import { introStoryData } from "@/data/intro";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { groomShort: groom, brideShort: bride } = weddingData.couple;

  return (
    <section
      id={SECTION_IDS.hero}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-28 text-center"
      aria-label={content.hero.ariaLabel}
    >
      <div className="relative z-10 mx-auto w-full max-w-md">
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[11px] tracking-[0.45em] text-white/70 uppercase"
        >
          {weddingData.heroEyebrow}
        </motion.p>

        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-6 font-script text-6xl leading-[1.05] text-white sm:text-7xl"
        >
          <span className="block">{groom}</span>
          <span className="my-1 block text-5xl">&</span>
          <span className="block">{bride}</span>
        </motion.h1>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-sm tracking-[0.42em] text-white/85 [text-shadow:0_0_18px_rgba(214,223,255,0.45)]"
        >
          {invitationData.displayDate}
        </motion.p>
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-3 text-sm text-white/70"
        >
          {invitationData.lunarDate}
        </motion.p>
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-6 max-w-xs font-serif text-lg leading-relaxed text-white/85 italic"
        >
          {introStoryData.paragraphs[0]}
        </motion.p>
      </div>
    </section>
  );
}
