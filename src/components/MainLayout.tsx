"use client";

import BottomNavBar from "./BottomNavBar";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  fullWidth?: boolean;
  backgroundClassName?: string;
}

export default function MainLayout({
  children,
  showNav = true,
  fullWidth = false,
  backgroundClassName = "bg-white",
}: MainLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && pathname !== "/login") {
      router.push("/login");
    }
  }, [router, pathname]);

  return (
    <div className={`min-h-screen flex flex-col ${backgroundClassName}`}>
      <main className={`flex-1 pb-24 w-full overflow-x-hidden ${fullWidth ? "" : "max-w-screen-sm mx-auto"}`}>
        {children}
      </main>
      {showNav && <BottomNavBar />}
    </div>
  );
}
