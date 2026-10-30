"use client";

import { familyData } from "@/data/family";
import { weddingData } from "@/data/wedding";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

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

export function FamilyInfo() {
  const headingId = "family-heading";

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

        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          <Reveal delay={0.08} direction="left">
            <FamilySideCard side={familyData.groomSide} />
          </Reveal>
          <Reveal delay={0.08} direction="right">
            <FamilySideCard side={familyData.brideSide} />
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-10 text-center">
          <div className="gold-divider mx-auto mb-6 w-24" />
          <p className="text-xs tracking-[0.25em] text-champagne uppercase">
            {content.invitation.groomRole}
          </p>
          <p className="font-serif text-2xl text-charcoal">
            {weddingData.couple.groom}
          </p>
          <p className="mt-4 text-xs tracking-[0.25em] text-champagne uppercase">
            {content.invitation.brideRole}
          </p>
          <p className="font-serif text-2xl text-charcoal">
            {weddingData.couple.bride}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
