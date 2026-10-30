"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { galleryData } from "@/data/gallery";
import { content } from "@/data/content";
import type { GalleryImage } from "@/types";
import { SECTION_IDS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Gallery() {
  const [index, setIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(
    null,
  );
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const headingId = "gallery-heading";
  const total = galleryData.length;
  const current = galleryData[index];

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + total) % total);
    },
    [total],
  );

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedImage, closeLightbox]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedImage) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, selectedImage]);

  return (
    <section
      id={SECTION_IDS.gallery}
      className="section-shell section-gallery section-divider py-10 md:py-14"
      aria-labelledby={headingId}
    >
      <Container>
        <Reveal>
          <SectionHeading
            id={headingId}
            title={content.gallery.title}
            subtitle={content.gallery.subtitle}
          />
        </Reveal>

        <Reveal delay={0.08} className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-md border border-champagne/25 bg-pearl shadow-md">
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal shadow hover:bg-white"
              aria-label={content.gallery.prev}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute top-1/2 right-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal shadow hover:bg-white"
              aria-label={content.gallery.next}
            >
              ›
            </button>

            <motion.button
              type="button"
              key={current.id}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="relative block aspect-[4/5] w-full md:aspect-[16/10]"
              onClick={() => setSelectedImage(current)}
              aria-label={`${content.gallery.viewImage}: ${current.alt}`}
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority={index === 0}
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-charcoal/70 to-transparent px-6 py-6 text-left">
                <p className="text-sm text-white/95 md:text-base">{current.alt}</p>
                <p className="mt-1 text-xs text-white/70">
                  {content.gallery.slideOf(index + 1, total)}
                </p>
              </div>
            </motion.button>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {galleryData.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === index ? "bg-champagne" : "bg-champagne/30"
                }`}
                aria-label={`${content.gallery.goToSlide} ${i + 1}`}
                aria-current={i === index ? true : undefined}
              />
            ))}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
            {galleryData.map((img, i) => (
              <button
                key={`thumb-${img.id}`}
                type="button"
                onClick={() => setIndex(i)}
                className={`relative aspect-square overflow-hidden rounded-sm border-2 ${
                  i === index ? "border-champagne" : "border-transparent opacity-70"
                }`}
              >
                <Image src={img.src} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </Reveal>
      </Container>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/92 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.alt}
            onClick={closeLightbox}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={closeLightbox}
              aria-label={content.gallery.closeImage}
            >
              ×
            </button>
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="relative max-h-[85vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={selectedImage.width}
                height={selectedImage.height}
                className="max-h-[85vh] w-auto rounded-md object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
