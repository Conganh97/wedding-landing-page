import type { NavLink } from "@/types";
import { content } from "@/data/content";

export const SECTION_IDS = {
  hero: "home",
  story: "our-story",
  gallery: "gallery",
  events: "events",
  rsvp: "rsvp",
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: content.nav.home, href: `#${SECTION_IDS.hero}` },
  { label: content.nav.story, href: `#${SECTION_IDS.story}` },
  { label: content.nav.gallery, href: `#${SECTION_IDS.gallery}` },
  { label: content.nav.events, href: `#${SECTION_IDS.events}` },
  { label: content.nav.rsvp, href: `#${SECTION_IDS.rsvp}` },
];

export const RSVP_SUCCESS_MESSAGE = content.rsvp.success;
export const RSVP_ERROR_MESSAGE = content.rsvp.error;
