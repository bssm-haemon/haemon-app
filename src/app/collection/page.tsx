"use client";

import MainLayout from "@/components/MainLayout";
import PokemonHeader from "@/components/PokemonHeader";
import { useState } from "react";
import { Filter, X, Sparkles, Star, Shield } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { useCollection, useCollectionStats } from "@/hooks/useCollection";
import { STATIC_CREATURES, Rarity } from "@/data/creatures";

export default function CollectionPage() {
  const [selectedRarity, setSelectedRarity] = useState<Rarity | "all">("all");
  const [selectedCreatureId, setSelectedCreatureId] = useState<string | null>(null);
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

  const categoryLabels: Record<string, string> = {
    cetacean: "고래류",
    turtle: "거북류",
    pinniped: "기각류",
    fish: "어류",
    jellyfish: "해파리류",
    crustacean: "갑각류",
    mollusk: "연체류",
    bird: "조류",
  };

  const selectedCreature = selectedCreatureId
    ? STATIC_CREATURES.find(c => c.id === selectedCreatureId)
    : null;
  const isSelectedDiscovered = selectedCreature ? discoveredIds.has(selectedCreature.id) : false;

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
                  "bg-white rounded-lg border-2 overflow-hidden transition-all cursor-pointer",
                  isDiscovered
                    ? "border-blue-200 hover:shadow-lg"
                    : "border-gray-200 opacity-75"
                )}
                onClick={() => setSelectedCreatureId(creature.id)}
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
                    {isDiscovered ? creature.summary : "아직 발견하지 못한 생물입니다."}
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

      {/* Detail Modal */}
      {selectedCreature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            <button
              className="absolute top-4 right-4 rounded-full bg-black/5 p-2 hover:bg-black/10 transition"
              onClick={() => setSelectedCreatureId(null)}
              aria-label="닫기"
            >
              <X size={18} />
            </button>

            <div className="grid md:grid-cols-2 gap-6 items-center px-6 py-8">
              {/* Left: Artwork */}
              <div className="flex justify-center md:justify-start">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <Image
                    src={selectedCreature.image_path}
                    alt={selectedCreature.name}
                    fill
                    className={clsx(
                      "object-contain drop-shadow-2xl",
                      !isSelectedDiscovered && "blur-md grayscale"
                    )}
                  />
                  {!isSelectedDiscovered && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-2xl">
                      <span className="text-4xl font-bold text-gray-800">?</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <span className="font-semibold">No.{selectedCreature.id.split("-")[1]}</span>
                  <span className="text-gray-400">·</span>
                  <span>{selectedCreature.name_en}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {isSelectedDiscovered ? selectedCreature.name : "???"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold",
                      rarityColors[selectedCreature.rarity]
                    )}
                  >
                    {rarityLabels[selectedCreature.rarity]}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                    {categoryLabels[selectedCreature.category]}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    도감 No. {selectedCreature.id.split("-")[1]}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {isSelectedDiscovered
                    ? selectedCreature.summary
                    : "아직 발견하지 못했습니다. 탐험을 계속해 도감을 채워보세요!"}
                </p>

                <div className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">타입</p>
                      <div className="mt-1 flex gap-1">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold">
                          물
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 text-xs font-semibold">
                          {categoryLabels[selectedCreature.category]}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">포인트</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">{selectedCreature.points}p</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">발견 상태</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">
                        {isSelectedDiscovered ? "발견됨" : "미발견"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">희귀도</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">{rarityLabels[selectedCreature.rarity]}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">분류</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">{categoryLabels[selectedCreature.category]}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">도감 번호</p>
                      <p className="text-base font-semibold text-gray-900 mt-1">
                        {selectedCreature.id.split("-")[1]}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-amber-500" />
                    <p className="text-sm font-semibold text-gray-900">상세 설명</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {isSelectedDiscovered
                      ? selectedCreature.description
                      : "발견 후 상세 능력치와 기술을 확인할 수 있습니다."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
