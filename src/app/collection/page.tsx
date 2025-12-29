"use client";

import MainLayout from "@/components/MainLayout";
import { useState } from "react";
import { Filter } from "lucide-react";
import clsx from "clsx";
import PokemonHeader from "@/components/PokemonHeader";
import { useCreatures } from "@/hooks/useCreatures";
import { useCollection, useCollectionStats } from "@/hooks/useCollection";
import { Rarity } from "@/types";

export default function CollectionPage() {
  const [filter, setFilter] = useState<"all" | Rarity>("all");
  const [showFilter, setShowFilter] = useState(false);

  const { data: creaturesData } = useCreatures(filter !== "all" ? { rarity: filter } : {});
  const { data: collectionData } = useCollection();
  const { data: stats } = useCollectionStats();

  const rarityColors = {
    common: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-800" },
    rare: { bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-100 text-purple-800" },
    legendary: { bg: "bg-yellow-50", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-800" },
  };

  const rarityLabels = {
    common: "일반",
    rare: "희귀",
    legendary: "전설",
  };

  const isDiscovered = (creatureId: string) => {
    return collectionData?.collection.some(item => item.creature.id === creatureId);
  };

  return (
    <MainLayout>
      <div className="p-4">
        <PokemonHeader className="mb-4" />

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
                {(["all", "common", "rare", "legendary"] as const).map(rarity => (
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
                    {rarity === "all" ? "전체" : rarityLabels[rarity as Rarity]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-3 gap-3">
          {creaturesData?.creatures.map(creature => {
            const discovered = isDiscovered(creature.id);
            const colors = rarityColors[creature.rarity];
            return (
              <div
                key={creature.id}
                className={clsx(
                  "rounded-lg border-2 p-3 text-center cursor-pointer transition-transform hover:scale-105 aspect-square flex flex-col items-center justify-center",
                  colors.bg,
                  colors.border,
                )}
              >
                {discovered ? (
                  <>
                    <img src={creature.image_url} alt={creature.name} className="w-12 h-12 object-contain mb-2" />
                    <p className="text-[10px] font-semibold text-gray-900 truncate w-full">{creature.name}</p>
                    <span className={clsx("inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold", colors.badge)}>
                      {rarityLabels[creature.rarity]}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2 blur-sm opacity-30 grayscale saturate-0">?</div>
                    <p className="text-[10px] font-semibold text-gray-400">미발견</p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {(["common", "rare", "legendary"] as const).map(rarity => {
            const stat = stats?.by_rarity?.[rarity];
            return (
              <div key={rarity} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <p className="text-[10px] text-gray-600 font-semibold">{rarityLabels[rarity]}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {stat?.discovered ?? 0}/{stat?.total ?? 0}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
