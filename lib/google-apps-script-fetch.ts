/**
 * POST tới Google Apps Script Web App.
 * GAS trả 302 → cần GET URL redirect để nhận JSON (fetch redirect: "follow" thường làm POST hỏng).
 */
export async function postToGoogleAppsScript(
  apiUrl: string,
  payload: unknown,
): Promise<Response> {
  const initial = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "manual",
  });

  const redirectStatuses = new Set([301, 302, 303, 307, 308]);
  if (redirectStatuses.has(initial.status)) {
    const location = initial.headers.get("location");
    if (location) {
      return fetch(location, { method: "GET", redirect: "follow" });
    }
  }

  return initial;
}

export async function readGasJson(
  response: Response,
): Promise<{ success?: boolean; error?: string } | null> {
  const text = await response.text();
  try {
    return JSON.parse(text) as { success?: boolean; error?: string };
  } catch {
    return response.ok ? { success: true } : null;
  }
}
