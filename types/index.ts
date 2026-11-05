export type TimelineItem = {
  year: string;
  title: string;
  description: string;
  image?: string;
};

export type GalleryLayout = "default" | "feature" | "tall" | "wide";

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  layout?: GalleryLayout;
};

export type GiftPerson = {
  name: string;
  roleLabel: string;
  portraitSrc: string;
  portraitAlt: string;
  qrSrc: string;
  qrAlt: string;
  bankInfo?: string;
};

export type GiftData = {
  title: string;
  subtitle: string;
  cardImageSrc: string;
  cardImageAlt: string;
  cardHint: string;
  groom: GiftPerson;
  bride: GiftPerson;
};

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt?: string;
  /** Vị trí preset cho lời chúc dạng chữ (seed) */
  slotIndex?: number;
  /** Chữ ký vẽ tay (PNG trong suốt) */
  signatureDataUrl?: string;
  /** Vị trí chữ ký trên ảnh (%) */
  positionX?: number;
  positionY?: number;
};

export type GuestbookBoardConfig = {
  imageSrc: string;
  imageAlt: string;
  maxPins: number;
};

export type MusicData = {
  src: string;
  title: string;
  artist?: string;
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
  /** Link mở Google Maps (app / trình duyệt) */
  mapUrl: string;
  /** Tuỳ chọn — tọa độ hoặc địa chỉ chính xác cho bản đồ nhúng (vd: "21.0285,105.8542") */
  mapEmbedQuery?: string;
};

export type WeddingData = {
  couple: {
    /** Họ tên đầy đủ — Hero, section Hai họ */
    groom: string;
    bride: string;
    /** Tên gọi (không họ) — header, footer, thiệp, v.v. */
    groomShort: string;
    brideShort: string;
  };
  weddingDate: string;
  tagline: string;
  heroEyebrow: string;
  heroImage: string;
  heroImageAlt: string;
};

export type FamilySide = {
  label: string;
  father: string;
  mother: string;
  address: string;
};

export type FamilyPortrait = {
  src: string;
  alt: string;
  caption: string;
};

export type FamilyData = {
  announcement: string;
  groomSide: FamilySide;
  brideSide: FamilySide;
  couplePortrait: FamilyPortrait;
  groomPortrait: FamilyPortrait;
  bridePortrait: FamilyPortrait;
};

export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  description?: string;
};

export type InvitationData = {
  gateEyebrow: string;
  gateTitle: string;
  gateSubtitle: string;
  sealHint: string;
  openButton: string;
  quoteTitle: string;
  quoteGuest: string;
  quoteBody: string;
  blessing: string;
  lunarDate: string;
  displayDate: string;
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
