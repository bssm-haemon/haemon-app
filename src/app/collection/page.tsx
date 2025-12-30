import type { Metadata } from "next";
import { CollectionPageContent } from "./collection.content";

export const metadata: Metadata = {
  title: "해몬 - 도감",
  description: "발견한 해양생물 도감",
};

export default function CollectionPage() {
  return <CollectionPageContent />;
}
