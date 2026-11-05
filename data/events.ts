/**
 * ============================================================
 * CHỈNH SỬA THÔNG TIN SỰ KIỆN — LỄ CƯỚI & TIỆC
 * File: data/events.ts
 * Hiển thị tại: Section "Thông tin sự kiện"
 * ============================================================
 *
 * Mỗi object = 1 thẻ sự kiện:
 *   id         → Mã duy nhất ("ceremony" | "reception" hoặc tên tuỳ ý)
 *   typeLabel  → Nhãn loại (vd: "Lễ cưới", "Tiệc cưới")
 *   title      → Tiêu đề (vd: "Lễ thành hôn", "Tiệc chiêu đãi")
 *   date       → Ngày hiển thị (vd: "Thứ Bảy, 15 tháng 9, 2026")
 *   time       → Giờ (vd: "16:00")
 *   venue      → Tên địa điểm
 *   address    → Địa chỉ đầy đủ
 *   dressCode  → Trang phục (vd: "Trang phục lịch sự")
 *   mapUrl     → Link Google Maps (mở app / tab mới)
 *   mapEmbedQuery → (Tuỳ chọn) Địa chỉ hoặc lat,lng cho bản đồ nhúng; bỏ trống = venue + address
 *
 * Thêm sự kiện: thêm object mới vào mảng eventsData
 */
import type { EventDetail } from "@/types";

export const eventsData: EventDetail[] = [
  {
    id: "ceremony",
    typeLabel: "Lễ cưới",
    title: "Lễ thành hôn",
    date: "Chủ Nhật, 17 tháng 1, 2027",
    time: "11:30",
    venue: "Mipec Palace",
    address: "229 Phố Tây Sơn, Kim Liên, Hà Nội",
    dressCode: "Trang phục lịch sự",
    mapUrl: "https://maps.app.goo.gl/Xz9QMHPC6RJjXfby7",
  },
  {
    id: "reception",
    typeLabel: "Tiệc cưới",
    title: "Tiệc chiêu đãi",
    date: "Chủ Nhật, 17 tháng 1, 2027",
    time: "12:00",
    venue: "Mipec Palace",
    address: "229 Phố Tây Sơn, Kim Liên, Hà Nội",
    dressCode: "Trang phục lịch sự",
    mapUrl: "https://maps.app.goo.gl/Xz9QMHPC6RJjXfby7",
  },
];
