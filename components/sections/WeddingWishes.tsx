"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { guestbookSeed } from "@/data/guestbook";
import { content } from "@/data/content";
import { fetchGuestbookEntries } from "@/lib/guestbook";
import { mergeGuestbookEntries } from "@/lib/guestbook-storage";
import type { GuestbookEntry } from "@/types";
import { SECTION_IDS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

function prepareSeed(entries: GuestbookEntry[]): GuestbookEntry[] {
  return entries.map((entry, index) => ({
    ...entry,
    slotIndex: entry.slotIndex ?? index,
  }));
}

export function WeddingWishes() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(() =>
    prepareSeed(guestbookSeed),
  );
  const headingId = "wishes-heading";

  useEffect(() => {
    fetchGuestbookEntries()
      .then((remote) => {
        setEntries(mergeGuestbookEntries(prepareSeed(guestbookSeed), remote));
      })
      .catch(() => {});
  }, []);

  const messages = entries.filter((e) => e.message.trim().length > 0);

  return (
    <section
      id={SECTION_IDS.wishes}
      className="section-shell section-story section-divider py-10 md:py-14"
      aria-labelledby={headingId}
    >
      <Container>
        <Reveal>
          <SectionHeading
            id={headingId}
            title={content.wishes.title}
            subtitle={content.wishes.subtitle}
          />
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
            {messages.map((entry) => (
              <li
                key={entry.id}
                className="card-elegant rounded-sm p-5 text-left"
              >
                <p className="font-serif text-lg text-charcoal">
                  {entry.name.trim() || content.wishes.anonymous}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-light italic">
                  &ldquo;{entry.message}&rdquo;
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sm text-charcoal-light">
            {content.wishes.cta}{" "}
            <Link
              href={`#${SECTION_IDS.guestbook}`}
              className="text-champagne underline-offset-2 hover:underline"
            >
              {content.wishes.ctaLink}
            </Link>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
