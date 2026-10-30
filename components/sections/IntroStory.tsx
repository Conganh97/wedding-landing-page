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

function CouplePortrait({
  src,
  alt,
  roleLabel,
  name,
}: {
  src: string;
  alt: string;
  roleLabel: string;
  name: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-[10px] tracking-[0.28em] text-charcoal-light uppercase md:text-xs">
        {roleLabel}
      </p>
      <div className="relative mt-2 aspect-[3/4] w-[120px] overflow-hidden rounded-sm border-2 border-champagne/45 bg-pearl p-1 shadow-md md:w-[140px]">
        <div className="relative h-full w-full overflow-hidden rounded-[2px]">
          <Image src={src} alt={alt} fill className="object-cover" sizes="140px" />
        </div>
      </div>
      <p className="mt-3 font-serif text-lg text-charcoal md:text-xl">{name}</p>
    </div>
  );
}

export function IntroStory() {
  const { groom, bride } = weddingData.couple;

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

          <div className="mt-10 flex items-end justify-center gap-4 md:gap-8">
            <CouplePortrait
              src={familyData.groomPortrait.src}
              alt={familyData.groomPortrait.alt}
              roleLabel={content.invitation.groomRole}
              name={groom}
            />
            <span
              className="pb-16 font-serif text-2xl text-champagne md:pb-20 md:text-3xl"
              aria-hidden="true"
            >
              &
            </span>
            <CouplePortrait
              src={familyData.bridePortrait.src}
              alt={familyData.bridePortrait.alt}
              roleLabel={content.invitation.brideRole}
              name={bride}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
