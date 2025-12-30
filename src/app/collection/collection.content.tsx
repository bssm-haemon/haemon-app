"use client";

import MainLayout from "@/components/MainLayout";
import PokemonHeader from "@/components/PokemonHeader";
import { useState, memo } from "react";
import { Filter } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { useCollection, useCollectionStats } from "@/hooks/useCollection";
import { STATIC_CREATURES, Rarity } from "@/data/creatures";

const CollectionPageContent = memo(() => {
  const [selectedRarity, setSelectedRarity] = useState<Rarity | "all">("all");
  const { data: collectionData } = useCollection();
  const { data: stats } = useCollectionStats();

  // 발견한 생물 ID 목록
  const discoveredIds = new Set(collectionData?.collection?.map(item => item.creature_id) || []);

  // 필터링된 생물 목록
  const filteredCreatures =
    selectedRarity === "all" ? STATIC_CREATURES : STATIC_CREATURES.filter(c => c.rarity === selectedRarity);

  const rarityColors = {
    common: "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 border-gray-300",
    rare: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 border-blue-400",
    legendary: "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-800 border-purple-400",
  };

  const rarityLabels = {
    common: "일반",
    rare: "희귀",
    legendary: "전설",
  };

  return (
    <MainLayout>
      <div className="p-4 pb-4">
        <PokemonHeader className="mb-6" />

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-3xl p-6 text-white mb-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h2 className="text-lg font-black mb-3 uppercase tracking-wider">도감 완성률</h2>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-black">{stats?.discovered_count || 0}</span>
            <span className="text-xl opacity-90 mb-1 font-bold">
              / {stats?.total_creatures || STATIC_CREATURES.length}
            </span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden border-2 border-white">
            <div
              className="bg-gradient-to-r from-yellow-300 to-yellow-100 h-full rounded-full transition-all duration-500 shadow-inner"
              style={{
                width: `${stats?.completion_rate || 0}%`,
              }}
            />
          </div>
          <p className="text-sm mt-3 opacity-90 font-bold">{stats?.completion_rate?.toFixed(1) || 0}% 완료</p>
        </div>

        {/* Rarity Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(["common", "rare", "legendary"] as Rarity[]).map(rarity => {
            const rarityStats = stats?.by_rarity?.[rarity];
            return (
              <div
                key={rarity}
                className={clsx(
                  "rounded-2xl p-4 text-center border-2 font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105",
                  rarityColors[rarity],
                )}
              >
                <p className="text-xs font-black mb-2 uppercase">{rarityLabels[rarity]}</p>
                <p className="text-2xl font-black">
                  {rarityStats?.discovered || 0}/{rarityStats?.total || 0}
                </p>
              </div>
            );
          })}
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <Filter size={20} className="text-blue-600 font-bold" />
          <div className="flex gap-2 flex-1 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedRarity("all")}
              className={clsx(
                "px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all transform hover:scale-110 hover:shadow-lg",
                selectedRarity === "all"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300",
              )}
            >
              전체
            </button>
            {(["common", "rare", "legendary"] as Rarity[]).map(rarity => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(rarity)}
                className={clsx(
                  "px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all transform hover:scale-110 hover:shadow-lg border-2",
                  selectedRarity === rarity
                    ? clsx(rarityColors[rarity], "shadow-lg")
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
                )}
              >
                {rarityLabels[rarity]}
              </button>
            ))}
          </div>
        </div>

        {/* Creatures Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredCreatures.map(creature => {
            const isDiscovered = discoveredIds.has(creature.id);

            return (
              <div
                key={creature.id}
                className={clsx(
                  "bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer",
                  isDiscovered ? "border-blue-300 shadow-md" : "border-gray-200 opacity-60",
                )}
              >
                {/* Image */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
                  <Image
                    src={creature.image_path}
                    alt={isDiscovered ? creature.name : "???"}
                    fill
                    className={clsx(
                      "object-contain p-3 transition-all",
                      !isDiscovered && "blur-sm grayscale opacity-50",
                    )}
                  />
                  {!isDiscovered && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
                      <span className="text-5xl font-black text-white drop-shadow-lg">?</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 bg-gradient-to-b from-white to-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-black text-gray-900 text-sm">{isDiscovered ? creature.name : "???"}</h3>
                    <span
                      className={clsx(
                        "text-xs px-3 py-1 rounded-full font-bold border-2 shadow-sm",
                        rarityColors[creature.rarity],
                      )}
                    >
                      {rarityLabels[creature.rarity]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 font-medium">
                    {isDiscovered ? creature.description : "아직 발견하지 못한 생물입니다."}
                  </p>
                  {isDiscovered && (
                    <p className="text-xs font-black text-green-600 mt-3 bg-green-50 px-2 py-1 rounded-lg text-center">
                      +{creature.points}p
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
});

CollectionPageContent.displayName = "CollectionPageContent";

export { CollectionPageContent };
