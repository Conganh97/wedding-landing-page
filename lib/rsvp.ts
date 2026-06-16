import type { RsvpFormValues } from "@/schemas/rsvp";
import type { RsvpPayload } from "@/types";

function buildPayload(values: RsvpFormValues): RsvpPayload {
  const attending = values.attendance === "yes";

  return {
    name: values.name.trim(),
    phone: values.phone.trim(),
    attendance: attending ? "YES" : "NO",
    guestCount: attending ? (values.guestCount ?? 1) : 0,
    message: values.message?.trim() ?? "",
  };
}

export async function submitRsvp(values: RsvpFormValues): Promise<void> {
  const payload = buildPayload(values);

  const response = await fetch("/api/rsvp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => null)) as {
    success?: boolean;
    error?: string;
  } | null;

  if (!response.ok || result?.success === false) {
    throw new Error(result?.error ?? "RSVP submission failed");
  }
}
