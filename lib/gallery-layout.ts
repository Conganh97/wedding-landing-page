import type { GalleryLayout } from "@/types";
import { cn } from "@/lib/utils";

export function galleryTileClass(layout: GalleryLayout = "default"): string {
  return cn(
    "group relative min-h-[140px] overflow-hidden rounded-md border border-champagne/20 bg-pearl shadow-sm focus-within:ring-2 focus-within:ring-champagne",
    layout === "feature" &&
      "col-span-2 row-span-2 min-h-[200px] md:min-h-[280px]",
    layout === "tall" && "row-span-2 min-h-[200px] md:min-h-[260px]",
    layout === "wide" && "col-span-2 min-h-[140px] md:min-h-[160px]",
    layout === "default" && "min-h-[140px] md:min-h-[160px]",
  );
}
