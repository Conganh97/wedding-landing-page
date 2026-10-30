/**
 * Google Maps — nhúng iframe + link mở app
 * Tuỳ chọn: NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY trong .env.local (Maps Embed API)
 */
export function getMapSearchQuery(
  venue: string,
  address: string,
  mapEmbedQuery?: string,
): string {
  if (mapEmbedQuery?.trim()) return mapEmbedQuery.trim();
  return `${venue}, ${address}`.trim();
}

export function buildGoogleMapsEmbedUrl(query: string): string {
  const q = encodeURIComponent(query.trim());
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;

  if (key?.trim()) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key.trim())}&q=${q}&language=vi`;
  }

  return `https://maps.google.com/maps?q=${q}&hl=vi&z=16&output=embed`;
}

export function buildGoogleMapsDirectionsUrl(query: string): string {
  const q = encodeURIComponent(query.trim());
  return `https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`;
}
