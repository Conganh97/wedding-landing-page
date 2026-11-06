"use client";

import Image from "next/image";
import { familyData } from "@/data/family";
import { weddingData } from "@/data/wedding";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoFrame } from "@/components/ui/PhotoFrame";

function FamilySideCard({
  side,
}: {
  side: (typeof familyData)["groomSide"];
}) {
  return (
    <article className="px-2 py-4 text-center">
      <p className="text-xs tracking-[0.25em] text-champagne uppercase">
        {side.label}
      </p>
      <p className="mt-4 text-sm text-charcoal-light">{side.father}</p>
      <p className="text-sm text-charcoal-light">{side.mother}</p>
      <p className="mt-4 text-sm text-charcoal">{side.address}</p>
    </article>
  );
}

function CoupleSidePortrait({
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
      <PhotoFrame
        className="mt-2 aspect-[3/4] w-[120px] md:w-[140px]"
        innerClassName="relative h-full w-full"
      >
        <Image src={src} alt={alt} fill className="object-cover" sizes="140px" />
      </PhotoFrame>
      <p className="mt-3 font-serif text-lg text-charcoal md:text-xl">{name}</p>
    </div>
  );
}

export function FamilyInfo() {
  const headingId = "family-heading";
  const { groomShort: groom, brideShort: bride } = weddingData.couple;

  return (
    <section
      id={SECTION_IDS.family}
      className="section-shell section-gallery section-divider py-10 md:py-14"
      aria-labelledby={headingId}
    >
      <Container>
        <Reveal>
          <SectionHeading
            id={headingId}
            title={content.family.title}
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="card-elegant grid grid-cols-2 overflow-hidden rounded-sm">
            <FamilySideCard side={familyData.groomSide} />
            <div className="border-l border-champagne/25">
              <FamilySideCard side={familyData.brideSide} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="my-8 text-center font-serif text-lg text-charcoal-light">
            {familyData.announcement}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex items-end justify-center gap-4">
            <CoupleSidePortrait
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
            <CoupleSidePortrait
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
