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
 *   mapUrl     → Link Google Maps (mở khi bấm "Xem trên Google Maps")
 *
 * Thêm sự kiện: thêm object mới vào mảng eventsData
 */
import type { EventDetail } from "@/types";

export const eventsData: EventDetail[] = [
  {
    id: "ceremony",
    typeLabel: "Lễ cưới",
    title: "Lễ thành hôn",
    date: "Thứ Bảy, 15 tháng 9, 2026",
    time: "16:00",
    venue: "Nhà hàng Vườn Hoa",
    address: "123 Đường Láng, Đống Đa, Hà Nội",
    dressCode: "Trang phục lịch sự",
    mapUrl: "https://maps.google.com/?q=Nha+hang+Vuon+Hoa+Ha+Noi",
  },
  {
    id: "reception",
    typeLabel: "Tiệc cưới",
    title: "Tiệc chiêu đãi",
    date: "Thứ Bảy, 15 tháng 9, 2026",
    time: "18:00",
    venue: "Sảnh tiệc Hoàng Gia",
    address: "456 Phố Huế, Hai Bà Trưng, Hà Nội",
    dressCode: "Trang phục lịch sự",
    mapUrl: "https://maps.google.com/?q=Sanh+tiec+Hoang+Gia+Ha+Noi",
  },
];
