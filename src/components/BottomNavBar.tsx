"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, BookOpen, Map, User, ShieldCheck } from "lucide-react";
import clsx from "clsx";
import { useUserDetail } from "@/hooks/useUser";

export default function BottomNavBar() {
  const pathname = usePathname();
  const { data: user } = useUserDetail();

  const navItems = [
    { href: "/", icon: Home, label: "홈" },
    { href: "/register", icon: Plus, label: "등록" },
    { href: "/collection", icon: BookOpen, label: "도감" },
    { href: "/map", icon: Map, label: "지도" },
    ...(user?.is_admin ? [{ href: "/admin", icon: ShieldCheck, label: "관리" }] : []),
    { href: "/profile", icon: User, label: "프로필" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around items-center h-16 max-w-screen-sm mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full transition-colors",
                isActive ? "text-blue-600 border-t-2 border-blue-600" : "text-gray-500 hover:text-gray-700",
              )}
            >
              <Icon size={24} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
