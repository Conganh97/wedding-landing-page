/** Vị trí chữ ký trên ảnh cặp đôi (phần trăm, xoay nhẹ) */
export const GUESTBOOK_PIN_SLOTS = [
  { top: 10, left: 6, rotate: -10 },
  { top: 18, left: 58, rotate: 8 },
  { top: 32, left: 22, rotate: -6 },
  { top: 28, left: 72, rotate: 12 },
  { top: 44, left: 8, rotate: 5 },
  { top: 48, left: 48, rotate: -8 },
  { top: 42, left: 78, rotate: -12 },
  { top: 58, left: 28, rotate: 9 },
  { top: 55, left: 62, rotate: -5 },
  { top: 68, left: 12, rotate: 7 },
  { top: 72, left: 44, rotate: -9 },
  { top: 66, left: 74, rotate: 6 },
  { top: 82, left: 20, rotate: -7 },
  { top: 78, left: 52, rotate: 10 },
  { top: 84, left: 68, rotate: -4 },
  { top: 14, left: 36, rotate: 4 },
  { top: 62, left: 88, rotate: -11 },
  { top: 38, left: 88, rotate: 8 },
] as const;

export function slotForIndex(index: number) {
  const slots = GUESTBOOK_PIN_SLOTS;
  return slots[index % slots.length];
}

export function nextSlotIndex(existing: { slotIndex?: number }[]): number {
  const used = new Set(
    existing.map((e, i) => e.slotIndex ?? i % GUESTBOOK_PIN_SLOTS.length),
  );
  for (let i = 0; i < GUESTBOOK_PIN_SLOTS.length; i++) {
    if (!used.has(i)) return i;
  }
  return existing.length % GUESTBOOK_PIN_SLOTS.length;
}
