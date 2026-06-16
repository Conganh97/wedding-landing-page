"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { timelineData } from "@/data/timeline";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  );
}

export function LoveStory() {
  const [current, setCurrent] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const headingId = "our-story-heading";
  const total = timelineData.length;
  const item = timelineData[current];

  const paginate = useCallback((step: number) => {
    setCurrent((prev) => (prev + step + total) % total);
  }, [total]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paginate]);

  const slideTransition = { duration: 0.35, ease: "easeInOut" as const };

  return (
    <section
      id={SECTION_IDS.story}
      className="section-shell section-story py-10 md:py-14"
      aria-labelledby={headingId}
    >
      <Container>
        <SectionHeading
          id={headingId}
          title={content.story.title}
          subtitle={content.story.subtitle}
          className="mb-6 md:mb-7"
        />

        <div
          className="relative mx-auto max-w-4xl"
          role="region"
          aria-roledescription="carousel"
          aria-label={content.story.title}
        >
          <div className="card-elegant overflow-hidden rounded-sm">
            <div className="relative min-h-[340px] md:min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.article
                  key={item.year + item.title}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={slideTransition}
                  className="grid h-full md:grid-cols-2"
                  aria-live="polite"
                >
                  <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[300px]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-[220px] items-center justify-center bg-linear-to-br from-linen to-blush md:min-h-[300px]">
                        <span className="font-serif text-6xl text-champagne/40 md:text-7xl">
                          {item.year}
                        </span>
                      </div>
                    )}
                    <div
                      className="absolute inset-0 bg-linear-to-t from-charcoal/30 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:via-transparent md:to-charcoal/5"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="flex flex-col justify-center px-6 py-6 md:px-8 md:py-8">
                    <span className="font-serif text-2xl text-champagne">
                      {item.year}
                    </span>
                    <h3 className="mt-2 font-serif text-xl text-charcoal md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-charcoal-light md:line-clamp-5 md:text-base">
                      {item.description}
                    </p>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between border-t border-champagne/15 px-4 py-4 md:px-6">
              <button
                type="button"
                onClick={() => paginate(-1)}
                aria-label={content.story.prev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-champagne/30 text-champagne transition-colors hover:border-champagne hover:bg-champagne/10"
              >
                <ChevronIcon direction="left" />
              </button>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  {timelineData.map((slide, index) => (
                    <button
                      key={slide.year + slide.title}
                      type="button"
                      onClick={() => setCurrent(index)}
                      aria-label={`${content.story.goToSlide} ${index + 1}`}
                      aria-current={index === current ? "true" : undefined}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        index === current
                          ? "w-6 bg-champagne"
                          : "w-2 bg-champagne/30 hover:bg-champagne/50",
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs tracking-widest text-charcoal-light uppercase">
                  {content.story.slideOf(current + 1, total)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => paginate(1)}
                aria-label={content.story.next}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-champagne/30 text-champagne transition-colors hover:border-champagne hover:bg-champagne/10"
              >
                <ChevronIcon direction="right" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
