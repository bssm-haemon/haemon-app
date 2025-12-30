import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "해몬도감 | 바다를 지키며 도감을 채우자",
  description: "해양 ESG 게이미피케이션 앱 - 바다 생물을 수집하고 해양 환경을 보호하세요",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "해몬도감",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
