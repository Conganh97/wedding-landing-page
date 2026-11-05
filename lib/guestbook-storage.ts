import type { GuestbookEntry } from "@/types";

const STORAGE_KEY = "wedding-guestbook-entries";

export function loadStoredGuestbook(): GuestbookEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestbookEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGuestbookEntries(entries: GuestbookEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* quota / private mode */
  }
}

/** Gộp nhiều nguồn (API, local), mới nhất trước — không dùng data mock. */
export function mergeGuestbookEntries(
  ...lists: GuestbookEntry[][]
): GuestbookEntry[] {
  const map = new Map<string, GuestbookEntry>();
  for (const list of lists) {
    for (const entry of list) {
      if (!entry?.id) continue;
      map.set(entry.id, entry);
    }
  }
  return Array.from(map.values()).sort((a, b) => {
    const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
    const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
    return tb - ta;
  });
}
