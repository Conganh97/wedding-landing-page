import type { NavLink } from "@/types";
import { content } from "@/data/content";

export const SECTION_IDS = {
  hero: "home",
  intro: "intro",
  invitation: "invitation",
  family: "family",
  gallery: "gallery",
  events: "events",
  calendar: "calendar",
  countdown: "countdown",
  schedule: "schedule",
  venue: "venue",
  gifts: "gifts",
  guestbook: "guestbook",
  wishes: "wishes",
  rsvp: "rsvp",
  thanks: "thanks",
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: content.nav.home, href: `#${SECTION_IDS.hero}` },
  { label: content.nav.intro, href: `#${SECTION_IDS.intro}` },
  { label: content.nav.family, href: `#${SECTION_IDS.family}` },
  { label: content.nav.events, href: `#${SECTION_IDS.events}` },
  { label: content.nav.gallery, href: `#${SECTION_IDS.gallery}` },
  { label: content.nav.guestbook, href: `#${SECTION_IDS.guestbook}` },
  { label: content.nav.rsvp, href: `#${SECTION_IDS.rsvp}` },
];

export const RSVP_SUCCESS_MESSAGE = content.rsvp.success;
export const RSVP_ERROR_MESSAGE = content.rsvp.error;
