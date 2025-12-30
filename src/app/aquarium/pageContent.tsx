"use client";

import MainLayout from "@/components/MainLayout";
import PokemonHeader from "@/components/PokemonHeader";
import { useAquarium } from "@/hooks/useAquarium";
import { AquariumItem } from "@/types";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { getCreatureById } from "@/data/creatures";

export function AquariumPageContent() {
  const { data, isLoading } = useAquarium();
  const [poses, setPoses] = useState<Record<string, { x: number; y: number; scale: number; heading: number }>>({});
  const swimParamsRef = useRef<
    Record<string, { dir: 1 | -1; speed: number; amplitude: number; phase: number; baseY: number }>
  >({});
  const lastFrameRef = useRef<number | null>(null);
  const [activeCard, setActiveCard] = useState<AquariumItem | null>(null);
  const [isClient, setIsClient] = useState(false);

  const randomPose = () => ({
    x: 10 + Math.random() * 80,
    y: 15 + Math.random() * 70,
    scale: 0.85 + Math.random() * 0.4,
    heading: 0,
  });

  const randomSwimParams = (baseY: number) => {
    return {
      dir: (Math.random() > 0.5 ? 1 : -1) as 1 | -1,
      speed: 3.5 + Math.random() * 2.5, // horizontal percent per second
      amplitude: 4 + Math.random() * 4, // vertical bob amplitude
      phase: Math.random() * Math.PI * 2,
      baseY,
    };
  };

  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  const aquariumItems = useMemo(() => data?.aquarium ?? [], [data?.aquarium]);

  useEffect(() => {
    if (!aquariumItems.length) return;
    setPoses(prev => {
      const next = { ...prev };
      aquariumItems.forEach(item => {
        if (!next[item.id]) {
          const initialPose = randomPose();
          next[item.id] = initialPose;
          swimParamsRef.current[item.id] = randomSwimParams(initialPose.y);
        }
      });
      return next;
    });
  }, [aquariumItems]);

  useEffect(() => {
    if (!aquariumItems.length) return;
    let raf: number;
    const step = (timestamp: number) => {
      if (lastFrameRef.current === null) lastFrameRef.current = timestamp;
      const deltaSeconds = (timestamp - (lastFrameRef.current ?? timestamp)) / 1000;
      lastFrameRef.current = timestamp;

      setPoses(prev => {
        const next: typeof prev = { ...prev };
        aquariumItems.forEach(item => {
          const current = prev[item.id] || randomPose();
          const params = swimParamsRef.current[item.id] || randomSwimParams(current.y);
          params.phase += deltaSeconds * 0.9;

          let nextX = current.x + params.dir * params.speed * deltaSeconds;
          let nextDir: 1 | -1 = params.dir;
          const minX = 6;
          const maxX = 94;
          if (nextX < minX || nextX > maxX) {
            nextDir = (params.dir === 1 ? -1 : 1) as 1 | -1;
            nextX = clamp(nextX, minX, maxX);
          }

          const minY = 12;
          const maxY = 88;
          const bob = Math.sin(params.phase) * params.amplitude;
          const nextY = clamp(params.baseY + bob, minY, maxY);

          const targetHeading = nextDir * 8 + Math.sin(params.phase * 2) * 2;
          const heading = clamp(current.heading + (targetHeading - current.heading) * 0.12, -14, 14);

          next[item.id] = { x: nextX, y: nextY, scale: current.scale, heading };
          swimParamsRef.current[item.id] = {
            ...params,
            dir: nextDir,
          };
        });
        return next;
      });

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [aquariumItems]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <MainLayout fullWidth backgroundClassName="bg-transparent">
        <div className="min-h-screen" />
      </MainLayout>
    );
  }

  return (
    <MainLayout fullWidth backgroundClassName="bg-transparent">
      <div
        className="relative w-full overflow-hidden min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url(/aquariumBackground.png)" }}
      >
        <div className="absolute inset-0 bg-cyan-600/15 pointer-events-none" />

        <div className="relative z-10 w-full px-4 pt-4">
          <div className="max-w-screen-lg mx-auto">
            <div className="flex items-center justify-between">
              <PokemonHeader className="mb-0" />
              <div className="flex items-center gap-2">
                <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-2xl font-black text-cyan-800 border border-cyan-100 shadow">
                  {data?.total ?? 0} 마리
                </div>
                <Link
                  href="/market"
                  className="bg-white text-blue-600 font-black px-4 py-2 rounded-2xl shadow-md hover:shadow-lg transition-all border border-blue-100"
                >
                  마켓가기
                </Link>
              </div>
            </div>

            <div className="relative w-full h-[65vh] md:h-[70vh] overflow-hidden mt-2">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg bg-black/20">
                  불러오는 중...
                </div>
              )}
              {!isLoading && aquariumItems.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg bg-black/30">
                  아직 아쿠아리움이 비었습니다. 마켓에서 포캣몬을 구매해보세요!
                </div>
              )}

              {aquariumItems.map((item: AquariumItem) => {
                const fallback = getCreatureById(item.creature_id);
                const src =
                  item.creature_image && item.creature_image.trim().length > 0
                    ? item.creature_image
                    : fallback?.image_path || `/poketmon/${fallback?.name || "돌고래"}.png`;
                const pose = poses[item.id] || { x: 50, y: 50, scale: 1, heading: 0 };
                return (
                  <div
                    key={item.id}
                    className="absolute will-change-transform"
                    style={{
                      left: `${pose.x}%`,
                      top: `${pose.y}%`,
                      transform: `translate(-50%, -50%) scale(${pose.scale}) rotate(${pose.heading}deg)`,
                    }}
                    onClick={() => setActiveCard(item)}
                  >
                    <div className="relative w-28 h-28 md:w-32 md:h-32">
                      <Image src={src} alt={item.creature_name} fill className="object-contain drop-shadow-xl" />
                    </div>
              </div>
            );
          })}
            </div>
          </div>
        </div>
      </div>
      {activeCard && (() => {
        const creature = getCreatureById(activeCard.creature_id);
        const rarityLabels: Record<string, string> = {
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
        const rarityColors: Record<string, string> = {
          common: "bg-gray-100 text-gray-700 border-gray-300",
          rare: "bg-blue-100 text-blue-700 border-blue-300",
          legendary: "bg-purple-100 text-purple-700 border-purple-300",
        };
        const imgSrc =
          (activeCard.creature_image && activeCard.creature_image.trim().length > 0
            ? activeCard.creature_image
            : creature?.image_path) || "/poketmon/고래상어.png";
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setActiveCard(null)} />
            <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
              <button
                className="absolute top-4 right-4 rounded-full bg-black/5 p-2 hover:bg-black/10 transition"
                onClick={() => setActiveCard(null)}
                aria-label="닫기"
              >
                ✕
              </button>

              <div className="grid md:grid-cols-2 gap-6 items-center px-6 py-8">
                {/* Left: Artwork */}
                <div className="flex justify-center md:justify-start">
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <Image src={imgSrc} alt={creature?.name || activeCard.creature_name} fill className="object-contain drop-shadow-2xl" />
                  </div>
                </div>

                {/* Right: Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span className="font-semibold">No.{creature?.id.split("-")[1]}</span>
                    <span className="text-gray-400">·</span>
                    <span>{creature?.name_en}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{creature?.name || activeCard.creature_name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={clsx(
                        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold",
                        rarityColors[creature?.rarity || "common"],
                      )}
                    >
                      {rarityLabels[creature?.rarity || "common"]}
                    </span>
                    {creature?.category && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                        {categoryLabels[creature.category]}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      도감 No. {creature?.id.split("-")[1]}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {creature?.summary || "바다에서 자유롭게 헤엄치는 친구입니다."}
                  </p>

                  <div className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">타입</p>
                        <div className="mt-1 flex gap-1">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold">
                            물
                          </span>
                          {creature?.category && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 text-xs font-semibold">
                              {categoryLabels[creature.category]}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">포인트</p>
                        <p className="text-base font-semibold text-gray-900 mt-1">{creature?.points ?? "?"}p</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">발견 상태</p>
                        <p className="text-base font-semibold text-gray-900 mt-1">발견됨</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">희귀도</p>
                        <p className="text-base font-semibold text-gray-900 mt-1">{rarityLabels[creature?.rarity || "common"]}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">분류</p>
                        <p className="text-base font-semibold text-gray-900 mt-1">
                          {creature?.category ? categoryLabels[creature.category] : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">도감 번호</p>
                        <p className="text-base font-semibold text-gray-900 mt-1">{creature?.id.split("-")[1]}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {creature?.description || "상세 정보가 없습니다."}
                    </p>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => setActiveCard(null)}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </MainLayout>
  );
}
