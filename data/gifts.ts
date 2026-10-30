/**
 * Mừng cưới — thay ảnh trong public/images/gifts/
 * card-envelope.jpg  → ảnh thiệp trên UI (bấm mở QR)
 * groom-portrait.jpg, bride-portrait.jpg → ảnh cô dâu chú rể trong modal
 * qr-groom.png, qr-bride.png → mã QR chuyển khoản
 */
import type { GiftData } from "@/types";
import { weddingData } from "@/data/wedding";

const { groom, bride } = weddingData.couple;

export const giftData: GiftData = {
  title: "Gửi quà mừng",
  subtitle: "Sự hiện diện của bạn là món quà ý nghĩa nhất — nếu tiện, có thể gửi lời chúc qua tài khoản bên dưới",
  cardImageSrc: "/images/gifts/card-envelope.svg",
  cardImageAlt: "Thiệp mừng cưới — bấm để xem mã QR",
  cardHint: "Chạm vào thiệp để xem QR chuyển khoản",
  groom: {
    name: groom,
    roleLabel: "Chú rể",
    portraitSrc: "/images/gifts/groom-portrait.svg",
    portraitAlt: `Ảnh ${groom}`,
    qrSrc: "/images/gifts/qr-groom.svg",
    qrAlt: `Mã QR mừng cưới ${groom}`,
    bankInfo: "Ngân hàng · STK · Tên chủ TK (cập nhật trong data/gifts.ts)",
  },
  bride: {
    name: bride,
    roleLabel: "Cô dâu",
    portraitSrc: "/images/gifts/bride-portrait.svg",
    portraitAlt: `Ảnh ${bride}`,
    qrSrc: "/images/gifts/qr-bride.svg",
    qrAlt: `Mã QR mừng cưới ${bride}`,
    bankInfo: "Ngân hàng · STK · Tên chủ TK (cập nhật trong data/gifts.ts)",
  },
};
