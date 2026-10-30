"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/wedding";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { invitationData } from "@/data/invitation";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { couple, tagline, heroEyebrow, heroImage, heroImageAlt } = weddingData;
  return (
    <section
      id={SECTION_IDS.hero}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      aria-label={content.hero.ariaLabel}
    >
      <Image
        src={heroImage}
        alt={heroImageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-charcoal/40" aria-hidden="true" />
      <div className="hero-fade absolute inset-x-0 bottom-0 h-48 sm:h-56" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-32 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-sm tracking-[0.3em] text-white/90 uppercase sm:text-base"
        >
          {content.hero.saveTheDate}
        </motion.p>

        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-3 sm:gap-4"
        >
          <span className="font-serif text-[clamp(1.75rem,6vw,3.75rem)] font-light tracking-[0.12em] text-white">
            {couple.groom}
          </span>

          <div className="flex items-center gap-4 sm:gap-6">
            <span
              className="h-px w-10 bg-linear-to-r from-transparent to-champagne/80 sm:w-16"
              aria-hidden="true"
            />
            <span className="font-serif text-2xl text-champagne sm:text-3xl md:text-4xl">
              &
            </span>
            <span
              className="h-px w-10 bg-linear-to-l from-transparent to-champagne/80 sm:w-16"
              aria-hidden="true"
            />
          </div>

          <span className="font-serif text-[clamp(1.75rem,6vw,3.75rem)] font-light tracking-[0.12em] text-white">
            {couple.bride}
          </span>
        </motion.h1>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 font-serif text-2xl tracking-[0.2em] text-champagne md:text-3xl"
        >
          {invitationData.displayDate}
        </motion.p>
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-2 text-sm text-white/85"
        >
          {invitationData.lunarDate}
        </motion.p>
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.48 }}
          className="mt-4 font-serif text-lg text-white/90 italic sm:text-xl"
        >
          {heroEyebrow}
        </motion.p>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base"
        >
          {tagline}
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-14"
        >
          <a
            href={`#${SECTION_IDS.rsvp}`}
            className="inline-block rounded-sm border border-white/50 bg-white/10 px-8 py-3 text-sm tracking-widest text-white uppercase backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            {content.hero.rsvpCta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
