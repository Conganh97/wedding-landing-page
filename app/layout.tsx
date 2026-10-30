import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Lato } from "next/font/google";
import { weddingData } from "@/data/wedding";
import { content } from "@/data/content";
import { formatDate } from "@/lib/utils";
import { ToastProvider } from "@/components/ui/ToastProvider";
import "./globals.css";

/**
 * SEO metadata — tự động lấy tên & ngày từ data/wedding.ts, mô tả từ data/content.ts
 * Ảnh share Facebook/Zalo: thay file public/images/og.jpg (khuyến nghị 1200x630px)
 * Domain production: cấu hình NEXT_PUBLIC_SITE_URL trong .env.local
 */

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const coupleName = `${weddingData.couple.groom} & ${weddingData.couple.bride}`;
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
      className={`light ${cormorant.variable} ${lato.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
