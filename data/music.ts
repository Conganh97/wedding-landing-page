/**
 * Nhạc nền — đặt file MP3 tại public/audio/wedding-music.mp3
 * (hoặc đổi src bên dưới sang link CDN của bạn)
 */
import type { MusicData } from "@/types";

export const musicData: MusicData = {
  src: "/audio/wedding-music.mp3",
  title: "Nhạc cưới",
  artist: "Thay bằng tên bài hát trong data/music.ts",
};
