/**
 * Địa điểm chính — section "Đường tới hôn lễ" (bản đồ lớn)
 * Thường trùng tiệc cưới; sửa theo data/events.ts nếu cần
 */
import { eventsData } from "@/data/events";

const reception =
  eventsData.find((e) => e.id === "reception") ?? eventsData[0];

export const primaryVenue = {
  title: reception.title,
  venue: reception.venue,
  address: reception.address,
  mapUrl: reception.mapUrl,
  mapEmbedQuery: reception.mapEmbedQuery,
};
