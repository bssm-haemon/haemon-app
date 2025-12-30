"use client";

import { memo, useMemo } from "react";
import MainLayout from "@/components/MainLayout";
import PokemonHeader from "@/components/PokemonHeader";
import { Zap, TrendingUp, Trophy, Award, MapPin, Clock, CheckCircle2, Hourglass } from "lucide-react";
import { useUserDetail } from "@/hooks/useUser";
import { useSightings } from "@/hooks/useSightings";
import { useCollectionStats } from "@/hooks/useCollection";
import { usePointsRanking } from "@/hooks/useRankings";
import { useMyBadges } from "@/hooks/useBadges";
import { useAquarium } from "@/hooks/useAquarium";
import Image from "next/image";
import Link from "next/link";
import { getCreatureById } from "@/data/creatures";

const BadgeSection = memo(function BadgeSection({ myBadges }: { myBadges: any }) {
  const getBadgeImage = (name: string) => `/badges/${encodeURIComponent(name.trim())}.png`;

  if (!myBadges?.badges?.length) {
    return (
      <p className="text-center text-gray-500 text-sm py-4 bg-gray-50 rounded-lg border border-gray-200">
        아직 획득한 뱃지가 없습니다.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {myBadges.badges.map((item: any, idx: number) => (
        <div
          key={`${item.badge?.id}-${idx}`}
          className="rounded-2xl p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 flex flex-col items-center gap-2 border-2 border-yellow-200 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-md"
        >
          {item.badge?.name || item.badge?.name_ko ? (
            <Image
              src={getBadgeImage(item.badge.name_ko || item.badge.name)}
              alt={item.badge.name_ko || item.badge.name}
              width={72}
              height={72}
              className="rounded-lg object-contain drop-shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-yellow-500 shadow-md">
              <Award size={20} />
            </div>
          )}
          <p className="text-xs font-bold text-center text-gray-900 leading-tight">
            {item.badge.name_ko || item.badge.name}
          </p>
        </div>
      ))}
    </div>
  );
});

const RecentActivitySection = memo(function RecentActivitySection({ sightingsData }: { sightingsData: any }) {
  if (!sightingsData?.sightings || sightingsData.sightings.length === 0) {
    return <p className="text-center text-gray-500 text-sm py-4">최근 활동이 없습니다.</p>;
  }

  return (
    <div className="space-y-3">
      {sightingsData.sightings.map((sighting: any) => (
        <div
          key={sighting.id}
          className="bg-white rounded-2xl p-4 border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 space-y-2"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-900">{sighting.memo || "메모 없음"}</p>
            <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
              <Clock size={12} />
              {new Date(sighting.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-xs text-gray-600 flex items-center gap-2">
            <MapPin size={14} className="text-blue-500" />
            <span className="font-medium">{sighting.location_name || "위치 미기입"}</span>
          </p>
          <p className="text-xs text-gray-700 font-semibold">
            {sighting.creature_id
              ? `${getCreatureById(sighting.creature_id)?.name || "미확인"} 발견!`
              : sighting.ai_suggestion
                ? `AI 제안: ${sighting.ai_suggestion}`
                : "AI 분석 대기"}
          </p>
          <div className="flex items-center gap-2 text-xs pt-2 border-t border-gray-100">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold ${sighting.status === "approved"
                ? "bg-green-100 text-green-700"
                : sighting.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
                }`}
            >
              {sighting.status === "approved" ? <CheckCircle2 size={12} /> : <Hourglass size={12} />}
              {sighting.status === "approved" ? "승인됨" : sighting.status === "pending" ? "검수중" : "거절"}
            </span>
            {typeof sighting.points_earned === "number" && sighting.points_earned > 0 && (
              <span className="ml-auto font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                +{sighting.points_earned}p
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

const RankingSection = memo(function RankingSection({ rankingsData }: { rankingsData: any }) {
  if (!rankingsData?.rankings || rankingsData.rankings.length === 0) {
    return <p className="text-center text-gray-500 text-sm py-4">순위 정보를 불러올 수 없습니다.</p>;
  }

  return (
    <div className="space-y-3">
      {rankingsData.rankings.slice(0, 3).map((item: any) => (
        <div
          key={item.user_id}
          className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 hover:scale-102"
        >
          <div className="flex items-center gap-4">
            <span
              className={`font-black text-xl w-10 h-10 flex items-center justify-center rounded-full ${item.rank === 1
                ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white"
                : item.rank === 2
                  ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                  : "bg-gradient-to-br from-orange-400 to-orange-500 text-white"
                }`}
            >
              {item.rank}
            </span>
            <span className="font-bold text-gray-900">{item.nickname}</span>
          </div>
          <span className="font-black text-lg text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
            {item.value.toLocaleString()}p
          </span>
        </div>
      ))}
    </div>
  );
});

export const HomePageContent = memo(function HomePageContent() {
  const { data: user } = useUserDetail();
  const { data: sightingsData } = useSightings({ limit: 3 });
  const { data: stats } = useCollectionStats();
  const { data: rankingsData } = usePointsRanking();
  const { data: myBadges } = useMyBadges();
  const { data: aquariumData } = useAquarium();

  const userLevel = useMemo(() => Math.floor((user?.points ?? 0) / 100) + 1, [user?.points]);
  const recentIncome = useMemo(() => (user?.sighting_count ? user.sighting_count * 30 : 0), [user?.sighting_count]);

  return (
    <MainLayout>
      <div className="p-4 space-y-6 pb-4">
        <PokemonHeader />

        {/* User Stats - Pokémon Go Style */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold opacity-90 uppercase tracking-wider">포인트</p>
              <p className="text-4xl font-black">{user?.points?.toLocaleString() ?? 0}</p>
            </div>
            <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-full p-4 animate-pulse">
              <Zap size={40} className="text-yellow-300" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white border-opacity-40">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-3 text-gray-900">
              <p className="text-xs font-bold opacity-80 uppercase text-gray-800">레벨</p>
              <p className="text-3xl font-black mt-1 text-gray-900">{userLevel}</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-3 text-gray-900">
              <p className="text-xs font-black opacity-80 uppercase text-gray-800">도감</p>
              <p className="text-3xl font-black mt-1 text-gray-900">
                {stats?.discovered_count ?? 0}/{stats?.total_creatures ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <TrendingUp className="text-blue-100 mb-2" size={24} />
            <p className="text-xs font-bold opacity-90 uppercase">최근 소득</p>
            <p className="text-2xl font-black mt-1">+{recentIncome}p</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <Trophy className="text-green-100 mb-2" size={24} />
            <p className="text-xs font-bold opacity-90 uppercase">목격</p>
            <p className="text-2xl font-black mt-1">{user?.sighting_count ?? 0}</p>
          </div>
        </div>

        {/* Aquarium Preview */}
        <div className="bg-white rounded-3xl border-2 border-cyan-200 p-4 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪸</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-cyan-700">내 아쿠아리움</p>
                <p className="text-lg font-black text-gray-900">{aquariumData?.total ?? 0} 마리</p>
              </div>
            </div>
            <Link
              href="/aquarium"
              className="text-sm font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-full px-3 py-1 hover:bg-cyan-100 transition-colors"
            >
              전체보기
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {(aquariumData?.aquarium ?? []).slice(0, 4).map(item => {
              const fallback = getCreatureById(item.creature_id);
              const imageSrc =
                item.creature_image && item.creature_image.trim().length > 0
                  ? item.creature_image
                  : fallback?.image_path || `/poketmon/${fallback?.name || "돌고래"}.png`;
              return (
                <div
                  key={item.id}
                  className="min-w-[100px] rounded-2xl border border-cyan-100 bg-gradient-to-br from-white to-cyan-50 p-2 flex-shrink-0"
                >
                  <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden border border-cyan-100">
                    <Image src={imageSrc} alt={item.creature_name} fill className="object-contain p-2" />
                  </div>
                  <p className="text-xs font-bold text-gray-900 mt-2 truncate">{item.creature_name}</p>
                  <p className="text-[10px] text-gray-500">{item.rarity}</p>
                </div>
              );
            })}
            {(aquariumData?.aquarium?.length ?? 0) === 0 && (
              <p className="text-sm text-gray-500">아직 아쿠아리움이 비었어요. 마켓에서 구매해보세요!</p>
            )}
          </div>
        </div>

        {/* My Badges */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">🏅 뱃지</h2>
          <BadgeSection myBadges={myBadges} />
        </div>

        {/* Recent Feed */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">최근 활동</h2>
          <RecentActivitySection sightingsData={sightingsData} />
        </div>

        {/* Ranking Preview */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">🏆 순위</h2>
          <RankingSection rankingsData={rankingsData} />
        </div>
      </div>
    </MainLayout>
  );
});
