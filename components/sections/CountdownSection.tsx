"use client";

import { weddingData } from "@/data/wedding";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Countdown } from "@/components/sections/Countdown";

export function CountdownSection() {
  const headingId = "countdown-section-heading";

  return (
    <section
      id={SECTION_IDS.countdown}
      className="section-shell section-gallery section-divider py-10 md:py-14"
      aria-labelledby={headingId}
    >
      <Container>
        <Reveal>
          <SectionHeading
            id={headingId}
            title={content.countdownSection.title}
            subtitle={content.countdownSection.subtitle}
          />
        </Reveal>
        <Reveal delay={0.1} className="flex justify-center">
          <Countdown targetDate={weddingData.weddingDate} variant="section" />
        </Reveal>
      </Container>
    </section>
  );
}
