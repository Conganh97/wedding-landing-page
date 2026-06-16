import { NextResponse } from "next/server";
import type { RsvpPayload } from "@/types";

function getApiUrl(): string | undefined {
  return process.env.RSVP_API_URL ?? process.env.NEXT_PUBLIC_RSVP_API;
}

export async function POST(request: Request) {
  const apiUrl = getApiUrl();

  if (!apiUrl) {
    return NextResponse.json(
      { success: false, error: "RSVP API URL is not configured" },
      { status: 500 },
    );
  }

  let payload: RsvpPayload;

  try {
    payload = (await request.json()) as RsvpPayload;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
        { success: false, error: "Google Apps Script rejected the request" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to reach Google Apps Script" },
      { status: 502 },
    );
  }
}
