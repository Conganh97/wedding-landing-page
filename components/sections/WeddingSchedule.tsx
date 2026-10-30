"use client";

import { scheduleData } from "@/data/schedule";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function WeddingSchedule() {
  const headingId = "schedule-heading";

  return (
    <section
      id={SECTION_IDS.schedule}
      className="section-shell section-events section-divider py-10 md:py-14"
      aria-labelledby={headingId}
    >
      <Container>
        <Reveal>
          <SectionHeading
            id={headingId}
            title={content.schedule.title}
            subtitle={content.schedule.subtitle}
          />
        </Reveal>

        <div className="relative mx-auto max-w-xl">
          <div
            className="absolute top-0 bottom-0 left-4 w-px bg-champagne/30 md:left-1/2 md:-translate-x-px"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-8">
            {scheduleData.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.08}>
                <div className="relative pl-12 md:pl-0 md:text-center">
                  <div
                    className="absolute top-1 left-2.5 h-3 w-3 rounded-full border-2 border-champagne bg-pearl md:left-1/2 md:-translate-x-1/2"
                    aria-hidden="true"
                  />
                  <time className="font-serif text-2xl text-champagne">
                    {item.time}
                  </time>
                  <h3 className="mt-1 font-serif text-xl text-charcoal">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-sm text-charcoal-light">
                      {item.description}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
