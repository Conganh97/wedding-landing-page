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

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(
    null,
  );
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const headingId = "gallery-heading";

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedImage, closeLightbox]);

  return (
    <section
      id={SECTION_IDS.gallery}
      className="section-shell section-gallery section-divider py-10 md:py-14"
      aria-labelledby={headingId}
    >
      <Container>
        <SectionHeading
          id={headingId}
          title={content.gallery.title}
          subtitle={content.gallery.subtitle}
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3">
          {galleryData.map((image, index) => (
            <motion.button
              key={image.id}
              type="button"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm border border-champagne/15 shadow-sm focus:outline-none sm:aspect-[4/5]"
              onClick={() => setSelectedImage(image)}
              aria-label={`${content.gallery.viewImage}: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
                priority={index === 0}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-charcoal/0 transition-colors duration-300 group-hover:bg-charcoal/20"
                aria-hidden="true"
              />
            </motion.button>
          ))}
        </div>
      </Container>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.alt}
            onClick={closeLightbox}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              onClick={closeLightbox}
              aria-label={content.gallery.closeImage}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[85vh] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={selectedImage.width}
                height={selectedImage.height}
                className="max-h-[85vh] w-auto rounded-sm object-contain"
              />
              <p className="mt-4 text-center text-sm text-white/80">
                {selectedImage.alt}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
