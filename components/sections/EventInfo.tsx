"use client";

import { motion, useReducedMotion } from "framer-motion";
import { eventsData } from "@/data/events";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

function LocationIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-champagne"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-champagne"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-champagne"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

export function EventInfo() {
  const shouldReduceMotion = useReducedMotion();
  const headingId = "events-heading";

  return (
    <section
      id={SECTION_IDS.events}
      className="section-shell section-events section-divider py-10 md:py-14"
      aria-labelledby={headingId}
    >
      <Container>
        <SectionHeading
          id={headingId}
          title={content.events.title}
          subtitle={content.events.subtitle}
        />

        <div className="grid gap-8 md:grid-cols-2">
          {eventsData.map((event, index) => (
            <motion.article
              key={event.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="card-elegant rounded-sm p-8"
            >
              <p className="text-xs tracking-[0.2em] text-champagne uppercase">
                {event.typeLabel}
              </p>
              <h3 className="mt-2 font-serif text-2xl text-charcoal">
                {event.title}
              </h3>

              <ul className="mt-6 flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <CalendarIcon />
                  <span className="text-sm text-charcoal-light">{event.date}</span>
                </li>
                <li className="flex items-start gap-3">
                  <ClockIcon />
                  <span className="text-sm text-charcoal-light">{event.time}</span>
                </li>
                <li className="flex items-start gap-3">
                  <LocationIcon />
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {event.venue}
                    </p>
                    <p className="text-sm text-charcoal-light">
                      {event.address}
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-6 border-t border-rose-dark/20 pt-6">
                <p className="text-xs tracking-widest text-charcoal-light uppercase">
                  {content.events.dressCode}
                </p>
                <p className="mt-1 text-sm text-charcoal">{event.dressCode}</p>
              </div>

              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm text-champagne transition-colors hover:text-champagne-dark"
              >
                {content.events.viewMap}
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
