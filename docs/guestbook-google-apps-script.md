# Sổ ký tên chúc phúc — Google Sheets + Apps Script

Luồng giống RSVP: website gọi `/api/guestbook` → server proxy → Google Apps Script → Google Sheet.

Mọi khách mở trang sẽ **GET** danh sách chữ ký từ Sheet và thấy chung trên ảnh.

---

## Bước 1: Tạo Google Sheet

1. Vào [Google Sheets](https://sheets.google.com) → **Tạo bảng tính mới**.
2. Đặt tên sheet (tab dưới): `Guestbook` (hoặc dùng sheet mặc định `Sheet1` — sửa tên trong script nếu cần).
3. **Hàng 1 — tiêu đề cột** (copy đúng thứ tự):

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| createdAt | name | message | signatureDataUrl | positionX | positionY |

---

## Bước 2: Dán Apps Script

1. Trong Sheet: **Extensions → Apps Script**.
2. Xóa code mặc định, dán toàn bộ script bên dưới.
3. **Save** (Ctrl/Cmd + S), đặt tên project (vd: `Wedding Guestbook`).

```javascript
const SHEET_NAME = "Guestbook"; // đổi nếu tab khác tên

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "createdAt",
        "name",
        "message",
        "signatureDataUrl",
        "positionX",
        "positionY",
      ]);
    }

    sheet.appendRow([
      data.createdAt || new Date().toISOString(),
      data.name || "",
      data.message || "",
      data.signatureDataUrl || "",
      data.positionX ?? "",
      data.positionY ?? "",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: String(err) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = getSheet_();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, entries: [] }),
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const rows = sheet.getRange(2, 1, lastRow, 6).getValues();
    const entries = rows
      .map(function (row, index) {
        return {
          id: "sheet-" + index + "-" + (row[0] || ""),
          createdAt: row[0] ? String(row[0]) : "",
          name: row[1] ? String(row[1]) : "",
          message: row[2] ? String(row[2]) : "",
          signatureDataUrl: row[3] ? String(row[3]) : "",
          positionX: row[4] !== "" ? Number(row[4]) : undefined,
          positionY: row[5] !== "" ? Number(row[5]) : undefined,
        };
      })
      .filter(function (entry) {
        return entry.message || entry.signatureDataUrl;
      })
      .reverse();

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, entries: entries }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: String(err) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## Bước 3: Deploy Web App

1. **Deploy → New deployment**.
2. Type: **Web app**.
3. **Execute as:** Me  
4. **Who has access:** Anyone  
5. **Deploy** → copy **Web app URL** (dạng `https://script.google.com/macros/s/.../exec`).

---

## Bước 4: Cấu hình website

Trong `.env.local` (cùng file với `RSVP_API_URL`):

```bash
GUESTBOOK_API_URL=https://script.google.com/macros/s/XXXX/exec
```

**Restart** `npm run dev` sau khi sửa env.

---

## Bước 5: Kiểm tra

### POST (giống form gửi lên)

```bash
curl -X POST "http://localhost:3000/api/guestbook" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Khách thử",
    "message": "Chúc mừng hạnh phúc!",
    "signatureDataUrl": "data:image/png;base64,iVBORw0KGgo=",
    "positionX": 40,
    "positionY": 35,
    "createdAt": "2026-09-15T10:00:00.000Z"
  }'
```

Kỳ vọng: `{"success":true}` và một dòng mới trong Sheet.

### GET (load chữ ký cho mọi khách)

```bash
curl "http://localhost:3000/api/guestbook"
```

Kỳ vọng: `{"success":true,"entries":[...]}`.

---

## Lưu ý

- Cột **signatureDataUrl** là ảnh chữ ký dạng base64 — có thể dài. Google Sheet giới hạn ~50.000 ký tự/ô; chữ ký quá phức tạp có thể không lưu được (khách nên ký gọn).
- **Không commit** URL script hoặc Sheet vào git công khai nếu không muốn lộ.
- Production: thêm `GUESTBOOK_API_URL` trên Vercel/hosting giống RSVP.

---

## Payload (tham khảo)

| Field | Mô tả |
|-------|--------|
| `name` | Họ tên (tuỳ chọn) |
| `message` | Lời chúc ngắn (bắt buộc) |
| `signatureDataUrl` | PNG base64 từ canvas ký tay (bắt buộc) |
| `positionX`, `positionY` | Vị trí % trên ảnh |
| `createdAt` | ISO timestamp |
