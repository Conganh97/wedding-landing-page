/**
 * Hai bên gia đình + khung ảnh cô dâu/chú rể ở giữa
 * Thay ảnh: public/images/family/groom-portrait.jpg & bride-portrait.jpg
 * rồi đổi src trong groomPortrait / bridePortrait bên dưới
 */
import type { FamilyData } from "@/types";

export const familyData: FamilyData = {
  announcement: "Trân trọng báo tin lễ thành hôn của con chúng tôi",
  groomSide: {
    label: "Nhà trai",
    father: "Ông Bùi Văn ...",
    mother: "Bà Nguyễn Thị ...",
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
