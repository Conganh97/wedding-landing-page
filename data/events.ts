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
