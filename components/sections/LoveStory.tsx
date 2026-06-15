"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { timelineData } from "@/data/timeline";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function LoveStory() {
  const shouldReduceMotion = useReducedMotion();
  const headingId = "our-story-heading";

  return (
    <section
      id={SECTION_IDS.story}
      className="section-shell section-story py-20 md:py-28"
      aria-labelledby={headingId}
    >
      <Container>
        <SectionHeading
          id={headingId}
          title={content.story.title}
          subtitle={content.story.subtitle}
        />

        <div className="relative mx-auto max-w-3xl">
          <div
            className="absolute top-0 bottom-0 left-4 w-px bg-champagne/30 md:left-8"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-12">
            {timelineData.map((item, index) => (
              <motion.article
                key={item.year + item.title}
                initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative pl-12 md:pl-20"
              >
                <div
                  className="absolute top-2 left-2.5 h-3 w-3 rounded-full border-2 border-champagne bg-pearl md:left-6.5"
                  aria-hidden="true"
                />

                <span className="font-serif text-2xl text-champagne">
                  {item.year}
                </span>
                <h3 className="mt-1 font-serif text-xl text-charcoal md:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-light md:text-base">
                  {item.description}
                </p>

                {item.image && (
                  <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-sm border border-champagne/20 shadow-sm">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover"
                    />
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
