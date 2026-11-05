import { weddingData } from "@/data/wedding";

const { groomShort, brideShort } = weddingData.couple;

/** Một dòng: Công Anh & Thuỳ Dương */
export function coupleShortLine(): string {
  return `${groomShort} & ${brideShort}`;
}

export function coupleShortParts() {
  return { groom: groomShort, bride: brideShort };
}
