"use client";

import BottomNavBar from "./BottomNavBar";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export default function MainLayout({ children, showNav = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <main className="pb-20 max-w-screen-sm mx-auto">{children}</main>
      {showNav && <BottomNavBar />}
    </div>
  );
}
