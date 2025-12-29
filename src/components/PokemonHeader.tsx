"use client";

import Image from "next/image";
import clsx from "clsx";
import React from "react";

interface PokemonHeaderProps {
  className?: string;
}

export default function PokemonHeader({ className }: PokemonHeaderProps) {
  return (
    <div className={clsx("flex justify-start pt-3 pb-2", className)}>
      <div className="relative w-24 h-12">
        <Image src="/Logo.png" alt="로고" fill sizes="160px" className="object-contain drop-shadow-lg" priority />
      </div>
    </div>
  );
}
