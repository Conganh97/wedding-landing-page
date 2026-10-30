import { NextResponse } from "next/server";
import type { GuestbookEntry } from "@/types";

type GuestbookSubmitBody = {
  name?: string;
  message?: string;
  signatureDataUrl?: string;
  positionX?: number;
  positionY?: number;
  createdAt?: string;
};

function getApiUrl(): string | undefined {
  return (
    process.env.GUESTBOOK_API_URL ?? process.env.NEXT_PUBLIC_GUESTBOOK_API
  );
}

function parseEntriesFromGas(data: unknown): GuestbookEntry[] {
  if (!data || typeof data !== "object") return [];
  const obj = data as { entries?: unknown };
  if (!Array.isArray(obj.entries)) return [];

  const entries: GuestbookEntry[] = [];

  for (let index = 0; index < obj.entries.length; index++) {
    const row = obj.entries[index];
    if (!row || typeof row !== "object") continue;
    const e = row as Record<string, unknown>;
    const message = String(e.message ?? "").trim();
    const signature = String(e.signatureDataUrl ?? "").trim();
    if (!message && !signature) continue;

    const posX = Number(e.positionX);
    const posY = Number(e.positionY);

    entries.push({
      id: String(e.id ?? `sheet-${index}`),
      name: String(e.name ?? "").trim(),
      message,
      ...(signature ? { signatureDataUrl: signature } : {}),
      ...(Number.isFinite(posX) ? { positionX: posX } : {}),
      ...(Number.isFinite(posY) ? { positionY: posY } : {}),
      ...(e.createdAt ? { createdAt: String(e.createdAt) } : {}),
    });
  }

  return entries;
}

export async function GET() {
  const apiUrl = getApiUrl();

  if (!apiUrl) {
    return NextResponse.json({ success: true, entries: [] });
  }

  try {
    const url = apiUrl.includes("?")
      ? `${apiUrl}&action=list`
      : `${apiUrl}?action=list`;

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      next: { revalidate: 0 },
    });

    const text = await response.text();
    let parsed: unknown = null;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { success: response.ok, entries: [] };
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Guestbook API GET failed" },
        { status: 502 },
      );
    }

    const entries = parseEntriesFromGas(parsed);

    return NextResponse.json({ success: true, entries });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to reach guestbook API" },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  let body: GuestbookSubmitBody;

  try {
    body = (await request.json()) as GuestbookSubmitBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const message = body.message?.trim() ?? "";
  const signature = body.signatureDataUrl?.trim() ?? "";

  if (message.length < 2) {
    return NextResponse.json(
      { success: false, error: "Message is required" },
      { status: 400 },
    );
  }

  if (!signature) {
    return NextResponse.json(
      { success: false, error: "Signature is required" },
      { status: 400 },
    );
  }

  const payload = {
    name: body.name?.trim() ?? "",
    message,
    signatureDataUrl: signature,
    positionX: body.positionX ?? 0,
    positionY: body.positionY ?? 0,
    createdAt: body.createdAt ?? new Date().toISOString(),
  };

  const apiUrl = getApiUrl();

  if (!apiUrl) {
    return NextResponse.json({ success: true, stored: "local-only" });
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    const text = await response.text();
    let result: { success?: boolean } | null = null;

    try {
      result = JSON.parse(text) as { success?: boolean };
    } catch {
      result = { success: response.ok };
    }

    if (!response.ok || result?.success === false) {
      return NextResponse.json(
        { success: false, error: "Guestbook API rejected the request" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to reach guestbook API" },
      { status: 502 },
    );
  }
}
