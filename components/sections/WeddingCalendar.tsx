"use client";

import { weddingData } from "@/data/wedding";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import { buildMonthCalendar } from "@/lib/calendar-utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function WeddingCalendar() {
  const wedding = new Date(weddingData.weddingDate);
  const year = wedding.getFullYear();
  const month = wedding.getMonth();
  const day = wedding.getDate();
  const monthLabel = wedding.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });
  const cells = buildMonthCalendar(year, month, day);
  const headingId = "calendar-heading";

  return (
    <section
      id={SECTION_IDS.calendar}
      className="section-shell section-events section-divider py-10 md:py-14"
      aria-labelledby={headingId}
    >
      <Container>
        <Reveal>
          <SectionHeading
            id={headingId}
            title={content.calendar.title}
            subtitle={content.calendar.subtitle}
          />
        </Reveal>

        <Reveal delay={0.08} className="mx-auto max-w-md">
          <p className="mb-4 text-center font-serif text-xl capitalize text-champagne">
            {monthLabel}
          </p>
          <div className="card-elegant rounded-sm p-4 md:p-6">
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-charcoal-light">
              {WEEKDAYS.map((d) => (
                <span key={d} className="py-2 font-medium">
                  {d}
                </span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {cells.map((cell, i) => (
                <div
                  key={`${cell.day}-${i}`}
                  className={`flex aspect-square items-center justify-center rounded-full text-sm ${
                    !cell.inMonth
                      ? "text-transparent"
                      : cell.isWeddingDay
                        ? "bg-champagne font-semibold text-ink shadow-md"
                        : "text-charcoal"
                  }`}
                >
                  {cell.inMonth ? cell.day : ""}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
