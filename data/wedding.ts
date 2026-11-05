/**
 * ============================================================
 * CHỈNH SỬA NỘI DUNG CHÍNH — HERO, TÊN, NGÀY CƯỚI, ẢNH BÌA
 * File: data/wedding.ts
 * Hiển thị tại: Hero, Header, Footer, Countdown, SEO metadata
 * ============================================================
 *
 * groom / bride     → Họ tên đầy đủ (Hero, Hai họ / IntroStory)
 * groomShort / brideShort → Tên gọi không họ (còn lại trên site)
 * weddingDate       → Ngày giờ cưới, định dạng ISO: "YYYY-MM-DDTHH:mm:ss"
 *                     Dùng cho Countdown + ngày hiển thị trên Hero/Footer
 * tagline           → Lời mời dưới tên ở Hero
 * heroEyebrow       → Dòng chữ nhỏ phía trên tên (vd: "Chúng mình sắp cưới")
 * heroImage         → Ảnh nền Hero (URL hoặc "/images/ten-anh.jpg" trong public/)
 * heroImageAlt      → Mô tả ảnh Hero (SEO & accessibility)
 */
import type { WeddingData } from "@/types";

export const weddingData: WeddingData = {
  couple: {
    groom: "Bùi Công Anh",
    bride: "Vũ Thuỳ Dương",
    groomShort: "Công Anh",
    brideShort: "Thuỳ Dương",
  },
  weddingDate: "2027-01-17T11:00:00",
  tagline:
    "Cùng với gia đình hai bên, trân trọng kính mời bạn đến chung vui trong ngày trọng đại của chúng mình",
  heroEyebrow: "Chúng mình sắp cưới",
  heroImage:
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
  heroImageAlt: "Cặp đôi trong khung cảnh lãng mạn ngày cưới",
};
