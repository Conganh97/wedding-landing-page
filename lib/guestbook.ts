import type { GuestbookFormValues } from "@/schemas/guestbook";
import type { GuestbookEntry } from "@/types";

export type GuestbookSubmitPayload = {
  name: string;
  message: string;
  signatureDataUrl: string;
  positionX: number;
  positionY: number;
  createdAt: string;
};

export async function fetchGuestbookEntries(): Promise<GuestbookEntry[]> {
  const response = await fetch("/api/guestbook", {
    method: "GET",
    cache: "no-store",
  });

  const result = (await response.json().catch(() => null)) as {
    success?: boolean;
    entries?: GuestbookEntry[];
    error?: string;
  } | null;

  if (!response.ok || result?.success === false) {
    throw new Error(result?.error ?? "Failed to load guestbook");
  }

  return result?.entries ?? [];
}

export async function submitGuestbookEntry(
  payload: GuestbookSubmitPayload,
): Promise<{ mode: "remote" | "local-only" }> {
  const response = await fetch("/api/guestbook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => null)) as {
    success?: boolean;
    stored?: string;
    error?: string;
  } | null;

  if (!response.ok || result?.success === false) {
    throw new Error(result?.error ?? "Guestbook submission failed");
  }

  return {
    mode: result?.stored === "local-only" ? "local-only" : "remote",
  };
}

/** @deprecated — dùng submitGuestbookEntry cho luồng ký tay */
export async function submitGuestbook(
  values: GuestbookFormValues,
): Promise<void> {
  await submitGuestbookEntry({
    name: values.name?.trim() ?? "",
    message: values.message.trim(),
    signatureDataUrl: "",
    positionX: 0,
    positionY: 0,
    createdAt: new Date().toISOString(),
  });
}
