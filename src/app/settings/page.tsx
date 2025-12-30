import type { Metadata } from "next";
import { SettingsPageContent } from "./settings.content";

export const metadata: Metadata = {
  title: "해몬 - 설정",
  description: "앱 설정 및 개인정보",
};

export default function SettingsPage() {
  return <SettingsPageContent />;
}
