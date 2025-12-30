import type { Metadata } from "next";
import { AquariumPageContent } from "./pageContent";

export const metadata: Metadata = {
  title: "해몬 - 아쿠아리움",
  description: "구매한 포캣몬을 아쿠아리움에서 관리하세요",
};

export default function AquariumPage() {
  return <AquariumPageContent />;
}
