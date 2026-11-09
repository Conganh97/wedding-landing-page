import type { Metadata } from "next";
import { weddingData } from "@/data/wedding";
import { coupleShortLine } from "@/lib/couple-names";
import { content } from "@/data/content";
import { formatDate } from "@/lib/utils";
import { ToastProvider } from "@/components/ui/ToastProvider";
import "./globals.css";

/**
 * SEO metadata — tự động lấy tên & ngày từ data/wedding.ts, mô tả từ data/content.ts
 * Ảnh share Facebook/Zalo: thay file public/images/og.jpg (khuyến nghị 1200x630px)
 * Domain production: cấu hình NEXT_PUBLIC_SITE_URL trong .env.local
 */

const coupleName = coupleShortLine();
const weddingDate = formatDate(weddingData.weddingDate);

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: `${coupleName} — ${content.seo.titleSuffix}`,
  description: content.seo.description(coupleName, weddingDate),
  keywords: [...content.seo.keywords, coupleName],
  openGraph: {
    title: `${coupleName} — ${content.seo.titleSuffix}`,
    description: content.seo.ogDescription(weddingDate),
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: content.seo.ogImageAlt(coupleName),
      },
    ],
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${coupleName} — ${content.seo.titleSuffix}`,
    description: content.seo.ogDescription(weddingDate),
    images: ["/images/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className="light h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
