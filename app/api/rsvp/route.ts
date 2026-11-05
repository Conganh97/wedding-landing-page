import { NextResponse } from "next/server";
import type { RsvpPayload } from "@/types";
import {
  postToGoogleAppsScript,
  readGasJson,
} from "@/lib/google-apps-script-fetch";

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
    const response = await postToGoogleAppsScript(apiUrl, payload);
    const result = await readGasJson(response);

    if (!response.ok || result?.success === false) {
      const detail =
        result?.error ??
        (response.ok ? undefined : `Upstream HTTP ${response.status}`);
      return NextResponse.json(
        {
          success: false,
          error: detail ?? "Google Apps Script rejected the request",
        },
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
