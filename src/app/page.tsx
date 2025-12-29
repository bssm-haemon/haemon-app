"use client";

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

export default function HomePage() {
  const { data: user } = useUserDetail();
  const { data: sightingsData } = useSightings({ limit: 3 });
  const { data: stats } = useCollectionStats();
  const { data: rankingsData } = usePointsRanking();
  const { data: myBadges } = useMyBadges();

  const getBadgeImage = (name: string) =>
    `/badges/${encodeURIComponent(name.trim())}.png`;

  return (
    <MainLayout>
      <div className="p-4 space-y-6">
        <PokemonHeader />

        {/* User Stats */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">내 포인트</p>
              <p className="text-3xl font-bold">{user?.points?.toLocaleString() ?? 0}</p>
            </div>
            <Zap size={32} />
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <p className="opacity-90">레벨</p>
              <p className="font-bold">{Math.floor((user?.points ?? 0) / 100) + 1}</p>
            </div>
            <div>
              <p className="opacity-90">수집한 생물</p>
              <p className="font-bold">
                {stats?.discovered_count ?? 0}/{stats?.total_creatures ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <TrendingUp className="text-blue-600 mb-2" size={20} />
            <p className="text-xs text-gray-600">최근 소득</p>
            <p className="text-xl font-bold text-gray-900">
              +{user?.sighting_count ? user.sighting_count * 30 : 0}p
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <Trophy className="text-purple-600 mb-2" size={20} />
            <p className="text-xs text-gray-600">완료한 목격</p>
            <p className="text-xl font-bold text-gray-900">{user?.sighting_count ?? 0}</p>
          </div>
        </div>

        {/* My Badges */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">🏅 내 뱃지</h2>
          {myBadges?.badges?.length ? (
            <div className="grid grid-cols-3 gap-3">
              {myBadges.badges.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-3 bg-gray-50 flex flex-col items-center gap-2"
                >
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
          ) : (
            <p className="text-center text-gray-500 text-sm py-4 bg-gray-50 rounded-lg border border-gray-200">
              아직 획득한 뱃지가 없습니다.
            </p>
          )}
        </div>

        {/* Recent Feed */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">최근 활동</h2>
          <div className="space-y-3">
            {sightingsData?.sightings?.map(sighting => (
              <div key={sighting.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    {sighting.memo || "메모 없음"}
                  </p>
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
            {(!sightingsData?.sightings || sightingsData.sightings.length === 0) && (
              <p className="text-center text-gray-500 text-sm py-4">최근 활동이 없습니다.</p>
            )}
          </div>
        </div>

        {/* Ranking Preview */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">🏆 순위</h2>
          <div className="space-y-2">
            {rankingsData?.rankings?.slice(0, 3).map(item => (
              <div
                key={item.user_id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold text-lg ${item.rank === 1 ? "text-yellow-500" : item.rank === 2 ? "text-gray-400" : "text-orange-600"
                      }`}
                  >
                    #{item.rank}
                  </span>
                  <span className="font-medium text-sm text-gray-900">{item.nickname}</span>
                </div>
                <span className="font-bold text-blue-600">{item.value.toLocaleString()}p</span>
              </div>
            ))}
            {(!rankingsData?.rankings || rankingsData.rankings.length === 0) && (
              <p className="text-center text-gray-500 text-sm py-4">순위 정보를 불러올 수 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
