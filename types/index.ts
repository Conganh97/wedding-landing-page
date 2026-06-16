export type TimelineItem = {
  year: string;
  title: string;
  description: string;
  image?: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type EventDetail = {
  id: string;
  typeLabel: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  dressCode: string;
  mapUrl: string;
};

export type WeddingData = {
  couple: {
    groom: string;
    bride: string;
  };
  weddingDate: string;
  tagline: string;
  heroEyebrow: string;
  heroImage: string;
  heroImageAlt: string;
};

export type RsvpPayload = {
  name: string;
  phone: string;
  attendance: "YES" | "NO";
  guestCount: number;
  message: string;
};

export type NavLink = {
  label: string;
  href: string;
};
