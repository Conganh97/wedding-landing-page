"use client";

import { primaryVenue } from "@/data/venue";
import { content } from "@/data/content";
import { SECTION_IDS } from "@/lib/constants";
import {
  buildGoogleMapsDirectionsUrl,
  getMapSearchQuery,
} from "@/lib/google-maps";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";

type VenueMapSectionProps = {
  /** Ngay dưới thông tin sự kiện — bớt khoảng trống phía trên */
  compactTop?: boolean;
};

export function VenueMapSection({ compactTop = false }: VenueMapSectionProps) {
  const headingId = "venue-map-heading";
  const mapQuery = getMapSearchQuery(
    primaryVenue.venue,
    primaryVenue.address,
    primaryVenue.mapEmbedQuery,
  );
  const directionsUrl = buildGoogleMapsDirectionsUrl(mapQuery);

  return (
    <section
      id={SECTION_IDS.venue}
      className={`section-shell section-events ${compactTop ? "pb-10 pt-4 md:pb-14 md:pt-6" : "section-divider py-10 md:py-14"}`}
      aria-labelledby={headingId}
    >
      <Container>
        <Reveal>
          <SectionHeading
            id={headingId}
            title={content.venue.title}
            subtitle={content.venue.subtitle}
          />
        </Reveal>

        <Reveal delay={0.08} className="mx-auto max-w-3xl">
          <p className="mb-4 text-center font-serif text-xl text-charcoal">
            {primaryVenue.venue}
          </p>
          <p className="mb-6 text-center text-sm text-charcoal-light">
            {primaryVenue.address}
          </p>
          <GoogleMapEmbed
            query={mapQuery}
            title={content.events.mapEmbedTitle(primaryVenue.venue)}
            venueLabel={primaryVenue.venue}
          />
          <div className="mt-4 flex flex-wrap justify-center gap-6">
            <a
              href={primaryVenue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-champagne hover:text-champagne-dark"
            >
              {content.events.viewMap}
            </a>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-champagne hover:text-champagne-dark"
            >
              {content.events.getDirections}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
