/**
 * ============================================================
 * CHỈNH SỬA TEXT GIAO DIỆN (TIẾNG VIỆT)
 * File: data/content.ts
 * Hiển thị tại: Menu, tiêu đề section, form RSVP, toast, SEO
 * ============================================================
 *
 * nav          → Tên menu Header/Footer
 * hero         → Nút "Xác nhận tham dự" trên Hero
 * countdown    → Nhãn đếm ngược (Ngày, Giờ, Phút, Giây)
 * story        → Tiêu đề & subtitle carousel Love Story
 * gallery      → Tiêu đề section Thư viện ảnh
 * events       → Tiêu đề section Thông tin sự kiện
 * rsvp         → Toàn bộ label/placeholder/nút form RSVP + thông báo toast
 * footer       → Dòng chữ cuối Footer
 * header       → Text menu mobile, skip link
 * seo          → Mô tả trang (Google, Facebook share)
 *
 * Lưu ý: Tên & ngày cưới lấy từ data/wedding.ts, không sửa ở đây
 */
export const content = {
  nav: {
    home: "Trang chủ",
    story: "Câu chuyện",
    gallery: "Thư viện ảnh",
    events: "Sự kiện",
    rsvp: "Xác nhận",
  },
  hero: {
    ariaLabel: "Phần giới thiệu đám cưới",
    rsvpCta: "Xác nhận tham dự",
  },
  countdown: {
    ariaLabel: "Đếm ngược đến ngày cưới",
    days: "Ngày",
    hours: "Giờ",
    minutes: "Phút",
    seconds: "Giây",
  },
  story: {
    title: "Chuyện tình yêu",
    subtitle: "Vuốt hoặc bấm để khám phá những khoảnh khắc đáng nhớ của chúng mình",
    prev: "Câu chuyện trước",
    next: "Câu chuyện tiếp",
    goToSlide: "Đến câu chuyện",
    slideOf: (current: number, total: number) =>
      `${current} / ${total}`,
  },
  gallery: {
    title: "Thư viện ảnh",
    subtitle: "Những khoảnh khắc chúng mình trân trọng",
    viewImage: "Xem ảnh",
    closeImage: "Đóng ảnh",
  },
  events: {
    title: "Thông tin sự kiện",
    subtitle: "Hân hạnh được đón tiếp bạn trong ngày vui của chúng mình",
    dressCode: "Trang phục",
    viewMap: "Xem trên Google Maps",
  },
  rsvp: {
    title: "Xác nhận tham dự",
    subtitle: "Vui lòng cho chúng mình biết bạn có thể tham dự không nhé",
    nameLabel: "Họ và tên",
    namePlaceholder: "Nhập họ và tên của bạn",
    phoneLabel: "Số điện thoại",
    phonePlaceholder: "0912 345 678",
    attendanceLegend: "Bạn có tham dự không?",
    attendanceYes: "Vui lòng tham dự",
    attendanceNo: "Rất tiếc không thể tham dự",
    guestCountLabel: "Số lượng khách (bao gồm bạn)",
    guestCountPlaceholder: "Chọn số lượng khách",
    messageLabel: "Lời nhắn (không bắt buộc)",
    messagePlaceholder: "Gửi lời chúc, ghi chú ăn uống hoặc yêu cầu khác...",
    submit: "Gửi xác nhận",
    submitting: "Đang gửi...",
    success: "Cảm ơn bạn! Chúng mình đã nhận được xác nhận tham dự.",
    error: "Đã có lỗi xảy ra. Vui lòng thử lại.",
  },
  footer: {
    tagline: "Được tạo nên bằng tình yêu cho ngày trọng đại của chúng mình",
  },
  header: {
    skipToContent: "Chuyển đến nội dung",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    menu: "Menu",
    close: "Đóng",
    mainNav: "Điều hướng chính",
    mobileNav: "Điều hướng di động",
    footerNav: "Điều hướng chân trang",
  },
  seo: {
    titleSuffix: "Đám cưới",
    description: (coupleName: string, weddingDate: string) =>
      `Trân trọng mời bạn đến dự lễ cưới của ${coupleName} vào ${weddingDate}. Xác nhận tham dự và xem thông tin sự kiện.`,
    ogDescription: (weddingDate: string) =>
      `Hân hạnh mời bạn cùng chung vui trong ngày trọng đại của chúng mình vào ${weddingDate}.`,
    ogImageAlt: (coupleName: string) =>
      `Thiệp mời đám cưới ${coupleName}`,
    keywords: ["đám cưới", "thiệp cưới", "xác nhận tham dự", "lễ cưới"],
  },
} as const;
