import type { Metadata } from "next";
import { ProfilePageContent } from "./profile.content";

export const metadata: Metadata = {
  title: "해몬 - 프로필",
  description: "사용자 프로필 및 통계",
};

export default function ProfilePage() {
  return <ProfilePageContent />;
}
