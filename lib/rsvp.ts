import type { RsvpFormValues } from "@/schemas/rsvp";
import type { RsvpPayload } from "@/types";

export async function submitRsvp(values: RsvpFormValues): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_RSVP_API;

  if (!apiUrl) {
    throw new Error("RSVP API URL is not configured");
  }

  const payload: RsvpPayload = {
    timestamp: new Date().toISOString(),
    name: values.name,
    phone: values.phone,
    attendance: values.attendance,
    guestCount: values.attendance === "yes" ? (values.guestCount ?? null) : null,
    message: values.message ?? "",
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`RSVP submission failed with status ${response.status}`);
  }
}
