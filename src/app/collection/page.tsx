"use client";

import MainLayout from "@/components/MainLayout";
import { useState } from "react";
import { Filter, X } from "lucide-react";
import clsx from "clsx";

interface CollectionCard {
  id: string;
  name: string;
  rarity: "common" | "rare" | "legend";
  image: string;
  discovered: boolean;
}

const creatures: CollectionCard[] = [
  { id: "1", name: "해파리", rarity: "common", image: "🪼", discovered: true },
  { id: "2", name: "불가사리", rarity: "common", image: "⭐", discovered: true },
  { id: "3", name: "문어", rarity: "rare", image: "🐙", discovered: true },
  { id: "4", name: "거북이", rarity: "rare", image: "🐢", discovered: false },
  { id: "5", name: "돌고래", rarity: "legend", image: "🐬", discovered: false },
  { id: "6", name: "산호", rarity: "common", image: "🪸", discovered: false },
  { id: "7", name: "나팔고둥", rarity: "common", image: "🐚", discovered: false },
  { id: "8", name: "해마", rarity: "rare", image: "🐴", discovered: false },
  { id: "9", name: "고래", rarity: "legend", image: "🐋", discovered: false },
  { id: "10", name: "가재", rarity: "common", image: "🦞", discovered: false },
  { id: "11", name: "게", rarity: "common", image: "🦀", discovered: false },
  { id: "12", name: "상어", rarity: "legend", image: "🦈", discovered: false },
];

export default function CollectionPage() {
  const [filter, setFilter] = useState<"all" | "common" | "rare" | "legend">("all");
  const [showFilter, setShowFilter] = useState(false);

  const rarityColors = {
    common: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-800" },
    rare: { bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-100 text-purple-800" },
    legend: { bg: "bg-yellow-50", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-800" },
  };

  const rarityLabels = {
    common: "일반",
    rare: "희귀",
    legend: "전설",
  };

  const filtered = creatures.filter(c => filter === "all" || c.rarity === filter);
  const discovered = filtered.filter(c => c.discovered).length;

  return (
    <MainLayout>
      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">도감</h1>
          <p className="text-sm text-gray-600">
            발견한 생물:{" "}
            <span className="font-bold">
              {discovered}/{filtered.length}
            </span>
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-4">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter size={18} />
            <span className="text-sm font-semibold">필터</span>
          </button>

          {showFilter && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-wrap gap-2">
                {(["all", "common", "rare", "legend"] as const).map(rarity => (
                  <button
                    key={rarity}
                    onClick={() => setFilter(rarity)}
                    className={clsx(
                      "px-3 py-1 rounded-full text-xs font-semibold transition-all",
                      filter === rarity
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400",
                    )}
                  >
                    {rarity === "all" ? "전체" : rarityLabels[rarity]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-3 gap-3">
          {filtered.map(creature => {
            const colors = rarityColors[creature.rarity];
            return (
              <div
                key={creature.id}
                className={clsx(
                  "rounded-lg border-2 p-3 text-center cursor-pointer transition-transform hover:scale-105",
                  colors.bg,
                  colors.border,
                )}
              >
                {creature.discovered ? (
                  <>
                    <div className="text-4xl mb-2">{creature.image}</div>
                    <p className="text-xs font-semibold text-gray-900">{creature.name}</p>
                    <span className={clsx("inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold", colors.badge)}>
                      {rarityLabels[creature.rarity]}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2 blur-sm opacity-30">?</div>
                    <p className="text-xs font-semibold text-gray-400">미발견</p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {(["common", "rare", "legend"] as const).map(rarity => {
            const count = creatures.filter(c => c.rarity === rarity).length;
            const discoveredCount = creatures.filter(c => c.rarity === rarity && c.discovered).length;
            return (
              <div key={rarity} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <p className="text-xs text-gray-600 font-semibold">{rarityLabels[rarity]}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {discoveredCount}/{count}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
