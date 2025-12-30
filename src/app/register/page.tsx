import type { Metadata } from "next";
import { RegisterPageContent } from "./register.content";

export const metadata: Metadata = {
  title: "해몬 - 등록",
  description: "해양생물 목격 및 쓰레기 수거 등록",
};

export default function RegisterPage() {
  return <RegisterPageContent />;
}
