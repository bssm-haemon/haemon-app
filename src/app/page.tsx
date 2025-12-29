"use client";

import MainLayout from "@/components/MainLayout";
import PokemonHeader from "@/components/PokemonHeader";
import { Zap, TrendingUp, Trophy } from "lucide-react";
import { useUserDetail } from "@/hooks/useUser";
import { useSightings } from "@/hooks/useSightings";
import { useCollectionStats } from "@/hooks/useCollection";
import { usePointsRanking } from "@/hooks/useRankings";

export default function HomePage() {
  const { data: user } = useUserDetail();
  const { data: sightingsData } = useSightings({ limit: 3 });
  const { data: stats } = useCollectionStats();
  const { data: rankingsData } = usePointsRanking();

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

        {/* Recent Feed */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">최근 활동</h2>
          <div className="space-y-3">
            {sightingsData?.sightings?.map(sighting => (
              <div key={sighting.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                    {sighting.user_nickname?.[0] || "?"}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">{sighting.user_nickname || "익명"}</p>
                    <p className="text-xs text-gray-600">
                      {sighting.creature_name ? `${sighting.creature_name} 발견!` : "새로운 생물 탐색 중"}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(sighting.created_at).toLocaleDateString()}
                  </span>
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
