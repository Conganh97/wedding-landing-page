/**
 * Gia đình + ảnh cặp đôi
 * - couplePortrait: ảnh chung (section Lời mời / intro)
 * - groomPortrait / bridePortrait: ảnh riêng (section Gia đình, phía trên nhà trai/gái)
 * Thay ảnh: public/images/family/couple.jpg, groom-portrait.jpg, bride-portrait.jpg
 */
import type { FamilyData } from "@/types";
import { weddingData } from "@/data/wedding";

export const familyData: FamilyData = {
  announcement: "Trân trọng báo tin lễ thành hôn của con chúng tôi",
  couplePortrait: {
    src: weddingData.heroImage,
    alt: "Ảnh cô dâu chú rể — thay bằng couple.jpg trong public/images/family/",
    caption: "Cô dâu & Chú rể",
  },
  groomSide: {
    label: "Nhà trai",
    father: "Ông Bùi Đức Công",
    mother: "Bà Phùng Ngọc Thoa",
    address: "Hà Nội",
  },
  brideSide: {
    label: "Nhà gái",
    father: "Ông Vũ Văn ...",
    mother: "Bà Trần Thị ...",
    address: "Hà Nội",
  },
  groomPortrait: {
    src: "/images/family/groom-portrait.svg",
    alt: "Ảnh chú rể — thay bằng groom-portrait.jpg trong public/images/family/",
    caption: "Chú rể",
  },
  bridePortrait: {
    src: "/images/family/bride-portrait.svg",
    alt: "Ảnh cô dâu — thay bằng bride-portrait.jpg trong public/images/family/",
    caption: "Cô dâu",
  },
};
