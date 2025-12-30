import type { Metadata } from "next";
import { MarketPageContent } from "./pageContent";

export const metadata: Metadata = {
  title: "해몬 - 마켓",
  description: "포인트로 포캣몬을 구매하고 아쿠아리움에 추가하세요",
};

export default function MarketPage() {
  return <MarketPageContent />;
}
