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
import Image from "next/image";
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
        <div key={`${item.badge?.id}-${idx}`} className="rounded-lg p-3 bg-gray-50 flex flex-col items-center gap-2">
          {item.badge?.name || item.badge?.name_ko ? (
            <Image
              src={getBadgeImage(item.badge.name_ko || item.badge.name)}
              alt={item.badge.name_ko || item.badge.name}
              width={72}
              height={72}
              className="rounded-lg object-contain"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              <Award size={20} />
            </div>
          )}
          <p className="text-sm font-semibold text-center text-gray-900 leading-tight">
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
        <div key={sighting.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">{sighting.memo || "메모 없음"}</p>
            <span className="text-[11px] text-gray-500 flex items-center gap-1">
              <Clock size={12} />
              {new Date(sighting.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <MapPin size={12} className="text-gray-400" />
            {sighting.location_name || "위치 미기입"}
          </p>
          <p className="text-xs text-gray-700">
            {sighting.creature_id
              ? `${getCreatureById(sighting.creature_id)?.name || "미확인"} 발견!`
              : sighting.ai_suggestion
              ? `AI 제안: ${sighting.ai_suggestion}`
              : "AI 분석 대기"}
          </p>
          <div className="flex items-center gap-2 text-[11px]">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                sighting.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : sighting.status === "pending"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {sighting.status === "approved" ? <CheckCircle2 size={12} /> : <Hourglass size={12} />}
              {sighting.status === "approved" ? "승인됨" : sighting.status === "pending" ? "검수중" : "거절"}
            </span>
            {typeof sighting.points_earned === "number" && sighting.points_earned > 0 && (
              <span className="text-blue-600 font-semibold">+{sighting.points_earned}p</span>
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
    <div className="space-y-2">
      {rankingsData.rankings.slice(0, 3).map((item: any) => (
        <div
          key={item.user_id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <span
              className={`font-bold text-lg ${
                item.rank === 1 ? "text-yellow-500" : item.rank === 2 ? "text-gray-400" : "text-orange-600"
              }`}
            >
              #{item.rank}
            </span>
            <span className="font-medium text-sm text-gray-900">{item.nickname}</span>
          </div>
          <span className="font-bold text-blue-600">{item.value.toLocaleString()}p</span>
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

  const userLevel = useMemo(() => Math.floor((user?.points ?? 0) / 100) + 1, [user?.points]);
  const recentIncome = useMemo(() => (user?.sighting_count ? user.sighting_count * 30 : 0), [user?.sighting_count]);

  return (
    <MainLayout>
      <div className="p-4 space-y-6 pb-4">
        <PokemonHeader />

        {/* User Stats - Pokémon Go Style */}
        <div className="bg-gradient-to-br from-red-500 via-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold opacity-95 uppercase tracking-wide">포인트</p>
              <p className="text-4xl font-black">{user?.points?.toLocaleString() ?? 0}</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
              <Zap size={40} className="text-yellow-200" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white border-opacity-30">
            <div>
              <p className="text-xs font-bold opacity-90 uppercase">레벨</p>
              <p className="text-3xl font-black">{userLevel}</p>
            </div>
            <div>
              <p className="text-xs font-bold opacity-90 uppercase">도감</p>
              <p className="text-3xl font-black">
                {stats?.discovered_count ?? 0}/{stats?.total_creatures ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 border-4 border-blue-500 shadow-lg text-white">
            <TrendingUp className="text-blue-100 mb-2" size={24} />
            <p className="text-xs font-bold opacity-90 uppercase">최근 소득</p>
            <p className="text-2xl font-black">+{recentIncome}p</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-4 border-4 border-purple-500 shadow-lg text-white">
            <Trophy className="text-purple-100 mb-2" size={24} />
            <p className="text-xs font-bold opacity-90 uppercase">목격</p>
            <p className="text-2xl font-black">{user?.sighting_count ?? 0}</p>
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
