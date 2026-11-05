"use client";

import { scheduleData } from "@/data/schedule";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function WeddingSchedule() {
  const headingId = "schedule-heading";
  const lastIndex = scheduleData.length - 1;

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

        <Reveal delay={0.08} className="mx-auto max-w-5xl">
          <div className="schedule-horizontal-track relative">
            <div
              className="schedule-horizontal-line pointer-events-none absolute top-[4.25rem] right-8 left-8 hidden h-px md:block"
              aria-hidden="true"
            />

            <ol className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
              {scheduleData.map((item, index) => (
                <li
                  key={item.id}
                  className="schedule-horizontal-card card-elegant relative min-w-[min(100%,260px)] shrink-0 snap-center rounded-sm px-5 py-6 text-center md:min-w-0"
                >
                  <span
                    className="absolute top-[4.15rem] left-1/2 z-10 hidden h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-pearl bg-champagne shadow-[0_0_0_4px_rgba(201,169,110,0.25)] md:block"
                    aria-hidden="true"
                  />
                  {index < lastIndex && (
                    <span
                      className="pointer-events-none absolute top-12 -right-2 hidden text-champagne/40 md:inline"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  )}
                  <time
                    dateTime={item.time}
                    className="font-serif text-3xl font-light tracking-wide text-champagne md:text-4xl"
                  >
                    {item.time}
                  </time>
                  <div className="gold-divider mx-auto my-4 w-12" />
                  <h3 className="font-serif text-xl text-charcoal md:text-[1.35rem]">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                      {item.description}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
