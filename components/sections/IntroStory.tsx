"use client";

import Image from "next/image";
import { introStoryData } from "@/data/intro";
import { invitationData } from "@/data/invitation";
import { familyData } from "@/data/family";
import { weddingData } from "@/data/wedding";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function IntroStory() {
  const { groom, bride } = weddingData.couple;
  const { couplePortrait } = familyData;

  return (
    <section
      id={SECTION_IDS.intro}
      className="section-shell section-story py-10 md:py-14"
      aria-label={content.intro.ariaLabel}
    >
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs tracking-[0.35em] text-champagne uppercase">
            {introStoryData.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-2xl leading-snug text-charcoal md:text-3xl">
            {invitationData.blessing}
          </h2>
          {introStoryData.paragraphs.map((p) => (
            <p
              key={p.slice(0, 24)}
              className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-charcoal-light md:text-lg"
            >
              {p}
            </p>
          ))}

          <div className="mx-auto mt-10 max-w-sm">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-sm border-2 border-champagne/45 bg-pearl p-1.5 shadow-md">
              <div className="relative h-full w-full overflow-hidden rounded-[2px]">
                <Image
                  src={couplePortrait.src}
                  alt={couplePortrait.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80vw, 280px"
                />
              </div>
            </div>
            <p className="mt-6 font-serif text-[clamp(1.35rem,4.5vw,1.85rem)] leading-snug tracking-[0.06em] text-charcoal">
              {groom}
            </p>
            <p className="my-2 font-serif text-xl text-champagne md:text-2xl">&</p>
            <p className="font-serif text-[clamp(1.35rem,4.5vw,1.85rem)] leading-snug tracking-[0.06em] text-charcoal">
              {bride}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
