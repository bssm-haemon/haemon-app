"use client";

import BottomNavBar from "./BottomNavBar";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export default function MainLayout({ children, showNav = true }: MainLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && pathname !== "/login") {
      router.push("/login");
    }
  }, [router, pathname]);

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      <main className="flex-1 pb-24 max-w-screen-sm mx-auto w-full overflow-x-hidden">{children}</main>
      {showNav && <BottomNavBar />}
    </div>
  );
}
