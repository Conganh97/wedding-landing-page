import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const htmlPath = path.join(root, "lib/mau21/template.html");
const cssPath = path.join(root, "lib/mau21/template.css");

let html = fs.readFileSync(htmlPath, "utf8");
let css = fs.readFileSync(cssPath, "utf8");

function removeBlocks(source, className) {
  const needle = `class="${className}"`;
  let out = "";
  let i = 0;
  while (i < source.length) {
    const at = source.indexOf(needle, i);
    if (at < 0) {
      out += source.slice(i);
      break;
    }
    const divStart = source.lastIndexOf("<div", at);
    let depth = 0;
    let j = divStart;
    while (j < source.length) {
      const nextOpen = source.indexOf("<div", j);
      const nextClose = source.indexOf("</div>", j);
      if (nextClose < 0) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth += 1;
        j = nextOpen + 4;
      } else {
        depth -= 1;
        j = nextClose + 6;
        if (depth === 0) break;
      }
    }
    out += source.slice(i, divStart);
    i = j;
  }
  return out;
}

html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
html = html.replace(/<link\b[^>]*>/gi, "");
html = removeBlocks(html, "edit-hint-overlay");
html = removeBlocks(html, "sec-vip-watermark");
html = html.replace(/\sdata-cursor-ref="[^"]*"/g, "");
html = html.replace(/\sinert=""/g, "");
html = html.replace(
  /id="GROUP119"([^>]*?)style="([^"]*)"/,
  (_match, attrs, style) =>
    `id="GROUP119"${attrs}style="${style.replace(/display:\s*none\s*!important;?\s*/g, "")}"`,
);
html = html.replace(
  /<div class="wb-feedback"[^>]*>\[[^\]]*\]<\/div>/g,
  "",
);

const replaceAll = (from, to) => {
  html = html.split(from).join(to);
};

replaceAll("Hoàng Long", "Công Anh");
replaceAll("Minh Nguyệt", "Thuỳ Dương");
replaceAll("20.12.2026", "17.01.2027");
replaceAll("20.12", "17.01");
replaceAll("18.09.2026", "17.01.2027");
replaceAll("Restaurant &amp; Lounge", "Mipec Palace");
replaceAll("Restaurant & Lounge", "Mipec Palace");
replaceAll("16 P. Lê Thái Tổ, Hoàn Kiếm<br>\n                                    Hà Nội", "229 Phố Tây Sơn, Kim Liên<br>\n                                    Hà Nội");
replaceAll("16 P. Lê Thái Tổ, Hoàn Kiếm", "229 Phố Tây Sơn, Kim Liên");
replaceAll("TẠI TƯ GIA NHÀ TRAI", "MIPEC PALACE");
html = html.replace(
  /Thượng Thuỵ - Phú Thượng\s*<br>\s*Tây Hồ - Hà Nội\s*<br>/,
  "229 Phố Tây Sơn, Kim Liên<br>Hà Nội<br>",
);
replaceAll("VÀO LÚC 10:00 - CHỦ NHẬT", "VÀO LÚC 12:00 - CHỦ NHẬT");
replaceAll(
  "(Tức ngày 20 tháng 08 năm Bính Ngọ)",
  "(Nhằm ngày 10 tháng 12 năm Bính Ngọ)",
);
replaceAll(">Tháng 06<", ">Tháng 01<");
replaceAll(">Ăn hỏi<", ">Đón khách<");
replaceAll(">Nghi lễ<", ">Lễ thành hôn<");
replaceAll(">Nhập tiệc<", ">Khai tiệc<");
replaceAll(">10:00<", ">10:30<");
replaceAll(">11:00<", ">11:30<");

html = html.replace(
  "Ông: Tạ Duy Hiển<br>Bà: Trần Thị Hòa<br>",
  "Ông: Bùi Đức Công<br>Bà: Phùng Ngọc Thoa<br>",
);
html = html.replace(
  "Ông: Tạ Duy Hiển<br>Bà: Trần Thị Hòa<br>",
  "Ông: Vũ Văn ...<br>Bà: Trần Thị ...<br>",
);

html = html.replace(
  /<div id="HEADLINE79"[\s\S]*?<h1 class="ladi-headline">01<\/h1>/,
  (block) => block.replace(">01<", ">17<"),
);
html = html.replace(
  /<div id="HEADLINE75"[\s\S]*?<h1 class="ladi-headline">20<\/h1>/,
  (block) => block.replace(">20<", ">01<"),
);
html = html.replace(
  /<div id="HEADLINE80"[\s\S]*?<h1 class="ladi-headline">2026<\/h1>/,
  (block) => block.replace(">2026<", ">2027<"),
);
html = html.replace(
  /<div id="HEADLINE283"[\s\S]*?<h1 class="ladi-headline">02<\/h1>/,
  (block) => block.replace(">02<", ">17<"),
);
html = html.replace(/>Năm<br>2026</g, ">Năm<br>2027<");
html = html.replace(/>Năm \/ 2026</g, ">Năm<br>2027<");

const stories = [
  "Cùng với gia đình hai bên, chúng mình trân trọng kính mời bạn đến chung vui trong ngày trọng đại.",
  "Thật vui nếu ngày ấy có bạn ở bên, chung vui và chúc phúc cho chúng mình.",
  "Cùng với gia đình hai bên, trân trọng kính mời bạn đến chung vui trong ngày trọng đại của chúng mình.",
];
const storyRe = /<div class="ladi-paragraph">Hôm đó[\s\S]*?<br><\/div>/;
html = html.replace(storyRe, `<div class="ladi-paragraph">${stories[0]}<br></div>`);
html = html.replace(
  /<div class="ladi-paragraph">Ban đầu[\s\S]*?<br><\/div>/,
  `<div class="ladi-paragraph">${stories[1]}<br></div>`,
);
html = html.replace(
  /<div class="ladi-paragraph">Anh không phải kiểu[\s\S]*?<br><\/div>/,
  `<div class="ladi-paragraph">${stories[2]}<br></div>`,
);

html = html.replace(
  /CTK:[\s\S]*?Vietcombank<\/span>/,
  "Công Anh · Thuỳ Dương<br>Ngân hàng · STK · Tên chủ TK",
);

html = html.replace(
  /src="https:\/\/www\.google\.com\/maps\/embed\?[^"]+"/,
  'src="https://maps.google.com/maps?q=Mipec%20Palace%2C%20229%20Ph%E1%BB%91%20T%C3%A2y%20S%C6%A1n%2C%20Kim%20Li%C3%AAn%2C%20H%C3%A0%20N%E1%BB%99i&z=16&output=embed"',
);
html = html.replace(
  /https:\/\/calendar\.app\.google\/fDziABrmq4B4vifHA/g,
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=L%E1%BB%85%20th%C3%A0nh%20h%C3%B4n%20C%C3%B4ng%20Anh%20%26%20Thu%E1%BB%B3%20D%C6%B0%C6%A1ng&dates=20270117T043000Z/20270117T070000Z&location=Mipec%20Palace%2C%20229%20Ph%E1%BB%91%20T%C3%A2y%20S%C6%A1n%2C%20H%C3%A0%20N%E1%BB%99i",
);

const days = [];
for (let day = 28; day <= 31; day += 1) days.push({ day, empty: true, selected: false });
for (let day = 1; day <= 31; day += 1) days.push({ day, empty: false, selected: day === 17 });
const cells = days
  .map(({ day, empty, selected }) => {
    const cls = `calendar-day${empty ? " empty" : ""}${selected ? " selected" : ""}`;
    const style = selected
      ? "background: #c06b4c; color: #fff;"
      : "background: #ecdbd4; color: #fff;";
    return `<div class="${cls}" style="${style}">${day}</div>`;
  })
  .join("");
html = html.replace(
  /<div class="calendar-body" id="calendar-body">[\s\S]*?<\/div>/,
  `<div class="calendar-body" id="calendar-body">${cells}</div>`,
);

html = html.replace(
  /(<label class="wb-form-label"[^>]*>Tên khách mời<\/label> <input type="text" class="wb-form-input" placeholder="Nhập tên của bạn"> <\/div>)/,
  `$1 <div class="wb-form-field"> <label class="wb-form-label">Số điện thoại</label> <input type="tel" class="wb-form-input mau-phone" placeholder="0912 345 678"> </div> <div class="wb-form-field mau-guests"> <label class="wb-form-label">Số lượng khách</label> <select class="wb-form-input mau-guest-count">${Array.from({ length: 10 }, (_, index) => `<option value="${index + 1}">${index + 1}</option>`).join("")}</select> </div>`,
);

html = html.replace("/1500", "/120");
html = html.replace(
  /(<textarea class="wb-form-textarea" placeholder="Viết lời chúc của bạn...")/,
  `$1 maxlength="120"`,
);

css = css.replaceAll("url('/assets/", "url('https://builder.27biggroup.com/assets/");
css = css.replaceAll('url("/assets/', 'url("https://builder.27biggroup.com/assets/');
css = css.replace("#SECTION1,#BOX92{display: none !important;}", "");

const extra = `
${fs.readFileSync("/tmp/mau21/calendar.css", "utf8")}
${fs.readFileSync("/tmp/mau21/code.css", "utf8")}

html, body { background: #f7efe9 !important; color: #5c463c; }
.ladi-wraper { margin: 0 auto; background: transparent; }
#SECTION18 { display: none !important; }
#SECTION1 { display: block !important; }
.ladi-animation-hidden { visibility: visible !important; opacity: 1 !important; }
#HEADLINE92 { display: none !important; }
.mau-root:not(.is-open) { height: 100vh; overflow: hidden; }
.mau-root:not(.is-open) #SECTION8 {
  position: fixed;
  inset: 0;
  z-index: 80;
  height: 100% !important;
  background: linear-gradient(180deg, #f8f1ec, #f3e4dc);
}
.mau-root:not(.is-open) #GROUP119 {
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
}
.mau-root.is-open #SECTION8 { display: none !important; }
#GROUP119 { display: block !important; }
.wbls-design-btn, .wbls-rowct { display: none !important; }
body { background: #f7efe9 !important; }
.ladi-wraper { width: 100%; max-width: 960px; }
@media (max-width: 767px) { .ladi-wraper { max-width: 420px; } }
#PARAGRAPH35, #BUTTON69, #BUTTON72, #BUTTON357 { cursor: pointer; }
.mau-sig {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(92, 70, 60, 0.45);
}
.mau-sig-card {
  width: min(420px, 100%);
  padding: 22px 18px 16px;
  border-radius: 18px;
  background: #fffaf7;
  color: #5c463c;
}
.mau-sig-card h3 { margin: 0 0 8px; font-size: 28px; text-align: center; }
.mau-sig-card p { margin: 0 0 12px; text-align: center; font-size: 14px; }
.mau-sig-card canvas { width: 100%; height: 150px; background: #fff; border-radius: 12px; border: 1px solid #e7d5cc; touch-action: none; }
.mau-sig-actions { display: flex; gap: 8px; margin-top: 12px; }
.mau-sig-actions button { flex: 1; height: 42px; border-radius: 999px; border: 1px solid #c06b4c; background: #fff; color: #c06b4c; }
.mau-sig-actions button.primary { background: #c06b4c; color: #fff; }
`;

fs.writeFileSync(path.join(root, "lib/mau21/body.html"), html);
fs.writeFileSync(path.join(root, "public/mau21.css"), css + extra);
console.log("html", html.length, "css", (css + extra).length);
console.log("leftover Hoàng", html.includes("Hoàng"));
console.log("leftover Tạ Duy", html.includes("Tạ Duy"));
console.log("leftover script", /<script/i.test(html));
