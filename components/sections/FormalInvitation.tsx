"use client";

import { invitationData } from "@/data/invitation";
import { weddingData } from "@/data/wedding";
import { eventsData } from "@/data/events";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { googleCalendarUrl } from "@/lib/calendar-utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function FormalInvitation() {
  const wedding = new Date(weddingData.weddingDate);
  const day = wedding.getDate();
  const weekday = wedding.toLocaleDateString("vi-VN", { weekday: "long" });
  const monthYear = wedding.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });
  const mainEvent =
    eventsData.find((e) => e.id === "reception") ?? eventsData[0];
  const calendarUrl = googleCalendarUrl({
    title: `${weddingData.couple.groom} & ${weddingData.couple.bride} — Đám cưới`,
    startIso: weddingData.weddingDate,
    details: invitationData.quoteBody,
    location: `${mainEvent.venue}, ${mainEvent.address}`,
  });

  return (
    <section
      id={SECTION_IDS.invitation}
      className="section-shell section-gallery section-divider py-10 md:py-14"
      aria-labelledby="formal-invitation-heading"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="formal-invitation-heading"
            title={invitationData.quoteTitle}
            subtitle={content.formalInvitation.subtitle}
          />
        </Reveal>

        <Reveal delay={0.08} className="mx-auto max-w-lg">
          <div className="card-elegant overflow-hidden rounded-sm text-center">
            <p className="bg-pearl/80 py-3 text-xs tracking-[0.35em] text-champagne uppercase">
              {content.formalInvitation.saveTheDate}
            </p>
            <div className="px-6 py-8 md:px-10">
              <p className="font-serif text-sm tracking-[0.25em] text-charcoal-light uppercase">
                {invitationData.quoteGuest}
              </p>
              <p className="mt-2 font-serif text-lg text-charcoal md:text-xl">
                {invitationData.quoteBody}
              </p>

              <div className="gold-divider mx-auto my-8 w-20" />

              <p className="text-sm text-charcoal-light">{weekday}</p>
              <p className="font-serif text-6xl text-champagne md:text-7xl">{day}</p>
              <p className="mt-1 font-serif text-xl capitalize text-charcoal">
                {monthYear}
              </p>
              <p className="mt-2 text-sm text-charcoal-light">
                ({invitationData.lunarDate})
              </p>

              <div className="mt-8 rounded-sm border border-champagne/25 bg-linen/50 px-4 py-4">
                <p className="text-lg font-medium text-charcoal">{mainEvent.time}</p>
                <p className="mt-1 text-xs tracking-widest text-champagne uppercase">
                  {content.formalInvitation.receptionLabel}
                </p>
              </div>

              <div className="mt-6 text-left">
                <p className="text-xs tracking-widest text-charcoal-light uppercase">
                  {content.formalInvitation.venueLabel}
                </p>
                <p className="mt-1 font-serif text-lg text-charcoal">
                  {mainEvent.venue}
                </p>
                <p className="text-sm text-charcoal-light">{mainEvent.address}</p>
              </div>

              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block text-sm text-champagne underline-offset-4 hover:underline"
              >
                {content.formalInvitation.addToCalendar}
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
