# Wedding Landing Page — Step Flow

## Project Overview

Production-ready wedding landing page built with Next.js App Router, TypeScript, TailwindCSS v4, Framer Motion, React Hook Form, Zod, and Sonner toasts.

---

## Steps Done

### Phase 1 — Scaffold and Config
- [x] Initialized Next.js project with TypeScript, TailwindCSS, ESLint, App Router
- [x] Installed framer-motion, react-hook-form, zod, @hookform/resolvers, sonner, clsx, tailwind-merge
- [x] Configured luxury theme in `app/globals.css` (ivory, champagne, rose, charcoal)
- [x] Forced light mode (`html.light`, `color-scheme: light`, no dark mode styles)
- [x] Added Cormorant Garamond + Lato fonts via `next/font`
- [x] Configured `next.config.ts` for Unsplash remote images

### Phase 2 — Foundation Files
- [x] Created `types/index.ts` with shared interfaces
- [x] Created mock data: `data/wedding.ts`, `data/timeline.ts`, `data/gallery.ts`, `data/events.ts`
- [x] Created `lib/utils.ts`, `lib/constants.ts`, `lib/rsvp.ts`
- [x] Created `schemas/rsvp.ts` with Zod validation (name, phone, attendance, guestCount, message)

### Phase 3 — UI Components
- [x] `components/ui/Button.tsx`
- [x] `components/ui/Input.tsx`
- [x] `components/ui/Textarea.tsx`
- [x] `components/ui/Select.tsx`
- [x] `components/ui/RadioGroup.tsx`
- [x] `components/ui/SectionHeading.tsx`
- [x] `components/ui/Container.tsx`
- [x] `components/ui/ToastProvider.tsx`

### Phase 4 — Layout
- [x] `components/layout/Header.tsx` — sticky nav, mobile menu, skip-to-content link
- [x] `components/layout/Footer.tsx` — couple name, date, nav links

### Phase 5 — Sections
- [x] `components/sections/Hero.tsx` — full-viewport hero with background image
- [x] `components/sections/Countdown.tsx` — live countdown with aria-live
- [x] `components/sections/LoveStory.tsx` — vertical timeline with scroll animations
- [x] `components/sections/Gallery.tsx` — responsive grid + accessible lightbox
- [x] `components/sections/EventInfo.tsx` — ceremony/reception cards with map links
- [x] `components/sections/RsvpForm.tsx` — React Hook Form + Zod + toast feedback

### Phase 6 — Integration
- [x] `app/page.tsx` — composes all sections
- [x] `app/layout.tsx` — SEO metadata, OpenGraph, Twitter cards, ToastProvider
- [x] RSVP qua `/api/rsvp` (proxy server-side, tránh CORS Google Apps Script)
- [x] `.env.local` với `RSVP_API_URL`
- [x] Success/error toast notifications via Sonner

### Phase 7 — Assets and Config
- [x] `public/images/og.jpg` — Open Graph placeholder image
- [x] `.env.example` with `NEXT_PUBLIC_RSVP_API` and `NEXT_PUBLIC_SITE_URL`
- [x] `.gitignore` updated to allow `.env.example`

### Phase 8 — Verification
- [x] `npm run build` passes with no TypeScript errors
- [x] Fixed Countdown hydration mismatch (static SSR placeholder, client update after mount)

---

## Hướng dẫn chỉnh sửa nội dung

| Muốn sửa | File | Ghi chú |
|----------|------|---------|
| Tên, ngày cưới, ảnh Hero, lời mời | `data/wedding.ts` | `weddingDate` dùng ISO `YYYY-MM-DDTHH:mm:ss` |
| Carousel Love Story | `data/timeline.ts` | Thêm/xoá slide trong mảng |
| Thư viện ảnh | `data/gallery.ts` | Carousel; trường `layout` giữ cho tương lai / lightbox |
| Lời mời & lịch | `data/intro.ts`, `data/invitation.ts`, `lib/calendar-utils.ts` | Intro, thiệp formal, lịch tháng, thêm vào Google Calendar |
| Bản đồ riêng | `data/venue.ts`, `VenueMapSection` | Map nhấn để tải; sự kiện link xuống `#venue` |
| Ảnh cô dâu chú rể | `data/family.ts` | `couplePortrait` (ảnh chung — intro); `groom-portrait` / `bride-portrait` (section gia đình) |
| Mừng cưới & QR | `data/gifts.ts` | `public/images/gifts/` — card, portrait, qr-groom, qr-bride |
| Sổ chúc phúc (Sheet chung) | `.env.local` + `docs/guestbook-google-apps-script.md` | `GUESTBOOK_API_URL` — mọi khách thấy chữ ký trên ảnh |
| Ảnh nền ký tên | `data/guestbook.ts` | `public/images/guestbook/couple-board.jpg` |
| Ảnh Thank You | `data/thanks.ts` | `public/images/thanks/thank-you.jpg` |
| Ảnh cô dâu/chú rể (đầu trang) | `data/family.ts` | `groom-portrait.jpg`, `bride-portrait.jpg` — section Trân trọng kính mời |
| Nhạc nền | `data/music.ts` | `public/audio/wedding-music.mp3` |
| Thư mời / mở phong bì | `data/invitation.ts` | gateTitle, lunarDate, displayDate, lời mời |
| Hai bên gia đình | `data/family.ts` | Nhà trai, nhà gái |
| Lễ cưới, tiệc, địa điểm | `data/events.ts` | `venue`, `address`, `mapUrl`, `mapEmbedQuery` (lat,lng) |
| Google Maps nhúng | `.env.local` | Tuỳ chọn `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` |
| Text menu, tiêu đề, form RSVP | `data/content.ts` | Toàn bộ chữ tiếng Việt trên UI |
| Ảnh share mạng xã hội | `public/images/og.jpg` | 1200×630px |
| API gửi RSVP | `.env.local` | `NEXT_PUBLIC_RSVP_API` |
| SEO / domain | `.env.local` | `NEXT_PUBLIC_SITE_URL` |

Mỗi file trong `data/` có comment chi tiết ở đầu file.

---

## Steps Remaining

### Customization (User Action)
- [x] Updated couple names: chú rể Bùi Công Anh, cô dâu Vũ Thuỳ Dương
- [x] Redesigned hero couple names: vertical layout (groom / & / bride) with gold dividers
- [x] Cohesive warm section backgrounds (linen, cream, blush gradients) flowing from hero
- [x] Bỏ section Câu chuyện; Thư viện ảnh dạng carousel (mũi tên + dots + thumbnail, giống mẫu 27biggroup)
- [x] Mừng cưới (thiệp → modal QR 2 bên), Sổ chúc phúc, nhạc nền
- [x] Gia đình: cầu nối ảnh cô dâu/chú rể; bỏ tên trùng cuối section
- [x] Scroll reveal: mount trang sau mở thiệp + `Reveal` thống nhất
- [x] Reduced vertical spacing between sections (tighter padding & headings)
- [x] Footer couple names: vertical layout on mobile (no awkward line breaks)
- [x] Header nav: light text on hero, dark text when scrolled
- [x] Hiệu ứng mở thiệp — full màn hình: ruy băng, ấn dấu ảnh cặp đôi, chữ script, cánh cửa hai bên (tông charcoal/champagne, không xanh-đỏ mẫu)
- [x] Cấu trúc trang theo mẫu 27biggroup: Hero → IntroStory → Family → FormalInvitation → Events → Calendar → Countdown → Schedule → Venue map → Gallery → Guestbook → RSVP → Wishes → Gifts → Thank You
- [x] Lời chúc nằm dưới ký tên (marquee khi ≥3), data từ API — không mock seed
- [x] Sections: IntroStory, FormalInvitation, WeddingCalendar, CountdownSection, VenueMapSection, FamilyInfo, WeddingSchedule, ThankYou (đã gỡ InvitationQuote)
- [ ] Replace Unsplash image URLs with your own photos in `data/gallery.ts` and `data/wedding.ts`
- [ ] Update `public/images/og.jpg` with your own Open Graph image
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain

### Google Apps Script Setup
- [x] Google Apps Script deployed & tested (curl + form integration)
- [x] `NEXT_PUBLIC_RSVP_API` configured in `.env.local`
- [ ] Sheet columns: Name, Phone, Attendance, GuestCount, Message

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    data.name,
    data.phone,
    data.attendance,
    data.guestCount,
    data.message,
  ]);
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Manual Testing Checklist
- [ ] Responsive layout at 375px, 768px, 1280px
- [ ] Countdown timer ticks every second
- [ ] RSVP validation: empty fields, invalid phone, attending without guest count
- [ ] RSVP success toast after valid submission (with real API URL)
- [ ] RSVP error toast when API URL is missing or invalid
- [ ] Keyboard navigation: mobile menu, gallery lightbox (Escape to close), form fields
- [ ] Screen reader: countdown aria-live, form error announcements

### Optional Enhancements
- [ ] Add favicon with couple monogram
- [ ] Add background music toggle
- [ ] Add multi-language support
- [ ] Deploy to Vercel or preferred hosting

---

## Quick Start

```bash
cp .env.example .env.local
# Edit .env.local with your Google Apps Script URL
npm run dev
```

Open http://localhost:3000

---

## File Structure Summary

```
app/           → layout.tsx, page.tsx, globals.css
components/    → layout/, sections/, ui/
data/          → wedding, timeline, gallery, events mock data
lib/           → rsvp, utils, constants
schemas/       → rsvp Zod schema
types/         → shared TypeScript interfaces
public/images/ → og.jpg
```

---

## Tech Notes

- Next.js 16 with TailwindCSS v4 (CSS-first `@theme` config in globals.css)
- Dark mode explicitly disabled
- Framer Motion respects `prefers-reduced-motion`
- All wedding content editable via `data/` files (`wedding.ts`, `timeline.ts`, `gallery.ts`, `events.ts`, `content.ts`)
- Site language: Vietnamese (`vi-VN`)
