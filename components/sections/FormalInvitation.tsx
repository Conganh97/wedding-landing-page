"use client";

import { invitationData } from "@/data/invitation";
import { weddingData } from "@/data/wedding";
import { coupleShortLine } from "@/lib/couple-names";
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
  const mainEvent =
    eventsData.find((e) => e.id === "reception") ?? eventsData[0];
  const calendarUrl = googleCalendarUrl({
    title: `${coupleShortLine()} — Đám cưới`,
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

        <Reveal delay={0.08}>
          <div className="card-elegant rounded-sm px-6 py-8 text-center">
            <p className="text-[11px] tracking-[0.35em] text-champagne/80 uppercase">
              Kính mời
            </p>
            <p className="mt-2 font-script text-4xl text-charcoal">
              {invitationData.quoteGuest}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-light">
              {invitationData.quoteBody}
            </p>

            <p className="mt-8 text-[11px] tracking-[0.32em] text-champagne/70 uppercase">
              Vào lúc
            </p>
            <p className="mt-1 font-serif text-3xl text-charcoal">{mainEvent.time}</p>

            <p className="mt-4 text-sm capitalize text-charcoal-light">{weekday}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="font-serif text-4xl text-champagne">{day}</p>
              </div>
              <div className="border-x border-champagne/25">
                <p className="font-serif text-lg capitalize text-charcoal">
                  {wedding.toLocaleDateString("vi-VN", { month: "long" })}
                </p>
              </div>
              <div>
                <p className="font-serif text-lg text-charcoal">{wedding.getFullYear()}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-charcoal-light">({invitationData.lunarDate})</p>

            <p className="mt-8 text-[11px] tracking-[0.32em] text-champagne/70 uppercase">
              {content.formalInvitation.venueLabel}
            </p>
            <p className="mt-2 font-serif text-xl text-charcoal">{mainEvent.venue}</p>
            <p className="text-sm text-charcoal-light">{mainEvent.address}</p>

            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full border border-champagne/50 px-6 py-2 text-xs tracking-[0.28em] text-champagne uppercase"
            >
              {content.formalInvitation.addToCalendar}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
