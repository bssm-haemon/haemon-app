import type { Metadata } from "next";
import { HomePageContent } from "./page.content";

export const metadata: Metadata = {
  title: "해몬 - 홈",
  description: "해양생물 목격 및 보존 게임플레이",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function HomePage() {
  return <HomePageContent />;
}
