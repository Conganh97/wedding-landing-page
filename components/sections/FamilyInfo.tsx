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
    <article className="card-elegant rounded-sm p-6 text-center md:p-8">
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
            subtitle={content.family.subtitle}
          />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mb-8 text-center font-serif text-lg text-charcoal-light md:mb-10">
            {familyData.announcement}
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mb-10 md:mb-12">
          <div className="gold-divider mx-auto mb-8 w-24" />
          <div className="flex items-end justify-center gap-4 md:gap-10">
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

        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          <Reveal delay={0.08} direction="left">
            <FamilySideCard side={familyData.groomSide} />
          </Reveal>
          <Reveal delay={0.08} direction="right">
            <FamilySideCard side={familyData.brideSide} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
