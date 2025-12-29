"use client";

import MainLayout from "@/components/MainLayout";
import PokemonHeader from "@/components/PokemonHeader";
import { useState } from "react";
import { Filter } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { useCollection, useCollectionStats } from "@/hooks/useCollection";
import { STATIC_CREATURES, Rarity } from "@/data/creatures";

export default function CollectionPage() {
  const [selectedRarity, setSelectedRarity] = useState<Rarity | "all">("all");
  const { data: collectionData } = useCollection();
  const { data: stats } = useCollectionStats();

  // 발견한 생물 ID 목록
  const discoveredIds = new Set(collectionData?.collection?.map(item => item.creature_id) || []);

  // 필터링된 생물 목록
  const filteredCreatures =
    selectedRarity === "all"
      ? STATIC_CREATURES
      : STATIC_CREATURES.filter((c) => c.rarity === selectedRarity);

  const rarityColors = {
    common: "bg-gray-100 text-gray-700 border-gray-300",
    rare: "bg-blue-100 text-blue-700 border-blue-300",
    legendary: "bg-purple-100 text-purple-700 border-purple-300",
  };

  const rarityLabels = {
    common: "일반",
    rare: "희귀",
    legendary: "전설",
  };

  return (
    <MainLayout>
      <div className="p-4">
        <PokemonHeader className="mb-6" />

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg p-4 text-white mb-6">
          <h2 className="text-lg font-bold mb-2">도감 완성률</h2>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-bold">
              {stats?.discovered_count || 0}
            </span>
            <span className="text-xl opacity-90 mb-1">
              / {stats?.total_creatures || STATIC_CREATURES.length}
            </span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{
                width: `${stats?.completion_rate || 0}%`,
              }}
            />
          </div>
          <p className="text-sm mt-2 opacity-90">
            {stats?.completion_rate?.toFixed(1) || 0}% 완료
          </p>
        </div>

        {/* Rarity Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(["common", "rare", "legendary"] as Rarity[]).map((rarity) => {
            const rarityStats = stats?.by_rarity?.[rarity];
            return (
              <div
                key={rarity}
                className={clsx(
                  "rounded-lg p-3 text-center border-2",
                  rarityColors[rarity]
                )}
              >
                <p className="text-xs font-semibold mb-1">
                  {rarityLabels[rarity]}
                </p>
                <p className="text-lg font-bold">
                  {rarityStats?.discovered || 0}/{rarityStats?.total || 0}
                </p>
              </div>
            );
          })}
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-gray-600" />
          <div className="flex gap-2 flex-1 overflow-x-auto">
            <button
              onClick={() => setSelectedRarity("all")}
              className={clsx(
                "px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all",
                selectedRarity === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              전체
            </button>
            {(["common", "rare", "legendary"] as Rarity[]).map((rarity) => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(rarity)}
                className={clsx(
                  "px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all border-2",
                  selectedRarity === rarity
                    ? rarityColors[rarity]
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                )}
              >
                {rarityLabels[rarity]}
              </button>
            ))}
          </div>
        </div>

        {/* Creatures Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredCreatures.map((creature) => {
            const isDiscovered = discoveredIds.has(creature.id);

            return (
              <div
                key={creature.id}
                className={clsx(
                  "bg-white rounded-lg border-2 overflow-hidden transition-all",
                  isDiscovered
                    ? "border-blue-200 hover:shadow-lg"
                    : "border-gray-200 opacity-75"
                )}
              >
                {/* Image */}
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  <Image
                    src={creature.image_path}
                    alt={isDiscovered ? creature.name : "???"}
                    fill
                    className={clsx(
                      "object-contain p-3 transition-all",
                      !isDiscovered && "blur-md grayscale"
                    )}
                  />
                  {!isDiscovered && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="text-4xl font-bold text-white drop-shadow-lg">
                        ?
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900">
                      {isDiscovered ? creature.name : "???"}
                    </h3>
                    <span
                      className={clsx(
                        "text-xs px-2 py-0.5 rounded-full font-semibold border",
                        rarityColors[creature.rarity]
                      )}
                    >
                      {rarityLabels[creature.rarity]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {isDiscovered ? creature.description : "아직 발견하지 못한 생물입니다."}
                  </p>
                  {isDiscovered && (
                    <p className="text-xs text-blue-600 font-semibold mt-2">
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
}
