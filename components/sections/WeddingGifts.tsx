"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { giftData } from "@/data/gifts";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { GiftPerson } from "@/types";

function GiftPersonPanel({ person }: { person: GiftPerson }) {
  return (
    <article className="flex flex-col items-center gap-4 rounded-sm border border-champagne/25 bg-white/60 p-5">
      <p className="text-xs tracking-[0.25em] text-champagne uppercase">
        {person.roleLabel}
      </p>
      <div className="relative h-36 w-28 overflow-hidden rounded-sm border border-champagne/30 shadow-sm">
        <Image
          src={person.portraitSrc}
          alt={person.portraitAlt}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>
      <p className="font-serif text-lg text-charcoal">{person.name}</p>
      <div className="relative h-40 w-40 rounded-sm border border-champagne/30 bg-white p-2 shadow-inner">
        <Image
          src={person.qrSrc}
          alt={person.qrAlt}
          fill
          className="object-contain p-1"
          sizes="160px"
        />
      </div>
      {person.bankInfo && (
        <p className="text-center text-xs text-charcoal-light">{person.bankInfo}</p>
      )}
    </article>
  );
}

export function WeddingGifts() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const headingId = "gifts-heading";

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <section
      id={SECTION_IDS.gifts}
      className="section-shell section-rsvp section-divider py-10 md:py-14"
      aria-labelledby={headingId}
    >
      <Container>
        <Reveal>
          <SectionHeading
            id={headingId}
            title={content.gifts.title}
            subtitle={content.gifts.subtitle}
          />
        </Reveal>

        <Reveal delay={0.08} className="mx-auto max-w-lg">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative mx-auto block w-full overflow-hidden rounded-md border border-champagne/35 bg-pearl shadow-[0_12px_40px_rgba(74,68,60,0.12)] transition hover:shadow-[0_16px_48px_rgba(74,68,60,0.16)] focus:outline-none"
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={giftData.cardImageSrc}
                alt={giftData.cardImageAlt}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 90vw, 512px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-charcoal/50 via-transparent to-transparent" />
              <p className="absolute right-0 bottom-0 left-0 pb-4 text-center text-sm tracking-wide text-white">
                {giftData.cardHint}
              </p>
            </div>
          </button>
        </Reveal>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/85 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={content.gifts.dialogTitle}
            onClick={close}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label={content.gifts.close}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-sm bg-ivory p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-center font-serif text-2xl text-charcoal">
                {content.gifts.dialogTitle}
              </h3>
              <p className="mt-2 text-center text-sm text-charcoal-light">
                {content.gifts.dialogSubtitle}
              </p>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <GiftPersonPanel person={giftData.groom} />
                <GiftPersonPanel person={giftData.bride} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
