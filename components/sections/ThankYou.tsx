"use client";

import Image from "next/image";
import { weddingData } from "@/data/wedding";
import { thanksData } from "@/data/thanks";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoFrame } from "@/components/ui/PhotoFrame";

export function ThankYou() {
  const { groomShort: groom, brideShort: bride } = weddingData.couple;

  return (
    <section
      id={SECTION_IDS.thanks}
      className="section-shell section-rsvp py-10 md:py-14"
      aria-label={content.thanks.title}
    >
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="gold-divider mx-auto mb-6" />
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
            {content.thanks.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-charcoal-light md:text-lg">
            {content.thanks.message}
          </p>

          <PhotoFrame
            tilt
            className="mx-auto mt-8 aspect-[16/10] w-full max-w-lg"
            innerClassName="h-full w-full"
          >
            <Image
              src={thanksData.imageSrc}
              alt={thanksData.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 512px"
            />
          </PhotoFrame>

          <p className="mt-10 font-serif text-2xl tracking-wide text-champagne">
            {groom}
            <span className="mx-3 text-charcoal-light">&</span>
            {bride}
          </p>
          <div className="gold-divider mx-auto mt-10" />
        </Reveal>
      </Container>
    </section>
  );
}
