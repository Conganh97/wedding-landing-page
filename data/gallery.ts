/**
 * ============================================================
 * CHỈNH SỬA THƯ VIỆN ẢNH
 * File: data/gallery.ts
 * Hiển thị tại: Section "Thư viện ảnh"
 * ============================================================
 *
 * Mỗi object = 1 ảnh trong gallery:
 *   id     → Mã duy nhất (vd: "1", "2"...)
 *   src    → URL ảnh hoặc "/images/ten-anh.jpg" (đặt file trong public/images/)
 *   alt    → Mô tả ảnh (SEO & accessibility)
 *   width  → Chiều rộng gốc (giữ tỉ lệ, vd: 800)
 *   height → Chiều cao gốc (vd: 1000 cho ảnh dọc, 600 cho ảnh ngang)
 *
 * Thêm/bớt ảnh: copy/xoá object trong mảng galleryData
 * Ảnh local: copy vào public/images/ rồi dùng src: "/images/anh-cuoi-1.jpg"
 */
import type { GalleryImage } from "@/types";

export const galleryData: GalleryImage[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
    alt: "Cô dâu cầm bó hoa hồng trắng",
    width: 800,
    height: 1000,
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    alt: "Nhẫn cưới trên nền nhung",
    width: 800,
    height: 600,
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
    alt: "Cặp đôi nắm tay dưới ánh hoàng hôn",
    width: 800,
    height: 1000,
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1520854221256-17451cc791c6?w=800&q=80",
    alt: "Bàn tiệc cưới trang trí tinh tế với nến",
    width: 800,
    height: 600,
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    alt: "Cổng hoa trong khu vườn tiệc cưới",
    width: 800,
    height: 1000,
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1469371670807-b013c17210d0?w=800&q=80",
    alt: "Nâng ly champagne chúc mừng",
    width: 800,
    height: 600,
  },
];
