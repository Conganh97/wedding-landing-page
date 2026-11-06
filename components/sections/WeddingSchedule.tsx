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

        <Reveal delay={0.08}>
          <ol className="relative ml-3 border-l border-champagne/30">
            {scheduleData.map((item) => (
              <li key={item.id} className="relative pb-8 pl-6 last:pb-0">
                <span
                  className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full bg-champagne shadow-[0_0_0_4px_rgba(214,220,239,0.15)]"
                  aria-hidden="true"
                />
                <time
                  dateTime={item.time}
                  className="font-serif text-2xl text-champagne"
                >
                  {item.time}
                </time>
                <h3 className="font-serif text-xl text-charcoal">{item.title}</h3>
                {item.description && (
                  <p className="mt-1 text-sm leading-relaxed text-charcoal-light">
                    {item.description}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
