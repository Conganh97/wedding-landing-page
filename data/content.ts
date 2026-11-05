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
    intro: "Lời mời",
    family: "Gia đình",
    gallery: "Thư viện ảnh",
    events: "Sự kiện",
    gifts: "Mừng cưới",
    guestbook: "Sổ chúc",
    rsvp: "Xác nhận",
  },
  hero: {
    ariaLabel: "Phần giới thiệu đám cưới",
    saveTheDate: "Save the date",
    rsvpCta: "Xác nhận tham dự",
  },
  intro: {
    ariaLabel: "Lời chúc và giới thiệu",
  },
  formalInvitation: {
    subtitle: "Trân trọng kính mời",
    saveTheDate: "Save the date",
    receptionLabel: "Tiệc cưới",
    venueLabel: "Địa điểm",
    addToCalendar: "Thêm vào lịch",
  },
  calendar: {
    title: "Lịch tháng",
    subtitle: "Đánh dấu ngày trọng đại của chúng mình",
  },
  countdownSection: {
    title: "Đếm ngược",
    subtitle: "Chỉ còn một chút nữa thôi",
  },
  venue: {
    title: "Đường tới hôn lễ",
    subtitle: "Bản đồ và chỉ đường đến địa điểm tổ chức",
  },
  wishes: {
    title: "Lời chúc",
    subtitle: "Những lời chúc phúc từ bạn bè và người thân",
    anonymous: "Khách mời",
    empty: "Chưa có lời chúc nào — hãy là người đầu tiên ký tên và gửi lời chúc nhé!",
  },
  invitation: {
    groomRole: "Chú rể",
    brideRole: "Cô dâu",
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
    prev: "Ảnh trước",
    next: "Ảnh tiếp",
    goToSlide: "Xem ảnh",
    slideOf: (current: number, total: number) => `${current} / ${total}`,
  },
  events: {
    title: "Thông tin sự kiện",
    subtitle: "Hân hạnh được đón tiếp bạn trong ngày vui của chúng mình",
    dressCode: "Trang phục",
    mapHeading: "Vị trí",
    mapEmbedTitle: (venue: string) => `Bản đồ — ${venue}`,
    showMap: "Xem bản đồ",
    mapTapHint: "Nhấn để tải và xem vị trí trên Google Maps",
    viewMap: "Mở Google Maps",
    getDirections: "Chỉ đường",
    viewVenueMap: "Xem bản đồ & chỉ đường",
  },
  family: {
    title: "Hai bên gia đình",
    subtitle: "Trân trọng báo tin lễ thành hôn",
  },
  gifts: {
    title: "Gửi quà mừng",
    subtitle:
      "Sự hiện diện của bạn là món quà quý giá nhất — nếu tiện, có thể gửi lời chúc qua tài khoản bên dưới",
    dialogTitle: "Mừng cưới cô dâu & chú rể",
    dialogSubtitle: "Quét mã QR hoặc chuyển khoản theo thông tin từng bên",
    close: "Đóng",
  },
  guestbook: {
    title: "Ký tên chúc phúc",
    subtitle: "Lưu giữ ngày vui cùng chúng mình",
    poeticLine:
      "Để lại chữ ký của bạn, cùng chúng mình lưu giữ ngày vui này mãi mãi.",
    signCta: "Ký tên của bạn",
    openFormHint: "Ký tay gắn lên ảnh — lời chúc của bạn sẽ hiện ngay bên dưới sau khi gửi.",
    drawTitle: "Ký tên của bạn",
    drawHint: "Ký tay trong khung — lời chúc điền bên dưới (không in trên ảnh)",
    nameLabel: "Họ tên (tuỳ chọn)",
    namePlaceholder: "Tên của bạn",
    messageLabel: "Lời chúc ngắn",
    messagePlaceholder: "Viết vài dòng chúc phúc...",
    clearSignature: "Xóa",
    adjustPosition: "Chỉnh vị trí",
    placementTitle: "Chỉnh vị trí trên ảnh",
    placementHint: "Chạm hoặc kéo trên ảnh để đặt chữ ký",
    confirmPlace: "Gắn lên ảnh",
    backToDraw: "Ký lại",
    submitting: "Đang gửi...",
    cancel: "Hủy",
    signatureRequired: "Vui lòng ký tên trong khung",
    messageRequired: "Vui lòng viết lời chúc ngắn",
    success: "Cảm ơn bạn! Chữ ký đã được gắn lên ảnh.",
    error: "Không gửi được. Vui lòng thử lại.",
  },
  music: {
    play: "Bật nhạc cưới",
    pause: "Tắt nhạc cưới",
    missingFile:
      "Thêm file public/audio/wedding-music.mp3 (xem data/music.ts)",
  },
  schedule: {
    title: "Chương trình hôn lễ",
    subtitle: "Timeline ngày trọng đại của chúng mình",
  },
  thanks: {
    title: "Thank You",
    message:
      "Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng mình. Hẹn gặp bạn trong ngày vui!",
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
