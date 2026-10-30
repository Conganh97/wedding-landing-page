/**
 * Sổ chúc phúc trên ảnh cặp đôi
 * - boardImage: ảnh nền (thay public/images/guestbook/couple-board.jpg)
 * - guestbookSeed: lời chúc mẫu hiển thị trên ảnh
 * - API: GUESTBOOK_API_URL (tuỳ chọn)
 */
import type { GuestbookBoardConfig, GuestbookEntry } from "@/types";

export const guestbookBoard: GuestbookBoardConfig = {
  imageSrc: "/images/guestbook/couple-board.svg",
  imageAlt:
    "Ảnh cô dâu chú rể — thay bằng couple-board.jpg trong public/images/guestbook/",
  maxPins: 18,
};

export const guestbookSeed: GuestbookEntry[] = [
  {
    id: "seed-1",
    name: "Gia đình họ Nguyễn",
    message: "Chúc hai con trăm năm hạnh phúc!",
    slotIndex: 0,
  },
  {
    id: "seed-2",
    name: "Bạn Linh",
    message: "Mãi yêu thương nhé!",
    slotIndex: 1,
  },
  {
    id: "seed-3",
    name: "Anh em lớp",
    message: "Hẹn gặp ở tiệc cưới!",
    slotIndex: 2,
  },
];
