/**
 * Sổ chúc phúc trên ảnh cặp đôi
 * - boardImage: ảnh nền (thay public/images/guestbook/couple-board.jpg)
 * - Chữ ký & lời chúc: chỉ từ API (GUESTBOOK_API_URL) + local fallback khi chưa cấu hình
 */
import type { GuestbookBoardConfig } from "@/types";

export const guestbookBoard: GuestbookBoardConfig = {
  imageSrc: "/images/guestbook/couple-board.svg",
  imageAlt:
    "Ảnh cô dâu chú rể — thay bằng couple-board.jpg trong public/images/guestbook/",
  maxPins: 18,
};
