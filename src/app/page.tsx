"use client";

import MainLayout from "@/components/MainLayout";
import { Zap, TrendingUp, Trophy } from "lucide-react";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-gray-900">해몬도감</h1>
          <p className="text-sm text-gray-600">바다를 지키며 도감을 채우자</p>
        </div>

        {/* User Stats */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">내 포인트</p>
              <p className="text-3xl font-bold">2,450</p>
            </div>
            <Zap size={32} />
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <p className="opacity-90">레벨</p>
              <p className="font-bold">12</p>
            </div>
            <div>
              <p className="opacity-90">수집한 생물</p>
              <p className="font-bold">24/100</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <TrendingUp className="text-blue-600 mb-2" size={20} />
            <p className="text-xs text-gray-600">최근 활동</p>
            <p className="text-xl font-bold text-gray-900">+320p</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <Trophy className="text-purple-600 mb-2" size={20} />
            <p className="text-xs text-gray-600">완료한 미션</p>
            <p className="text-xl font-bold text-gray-900">8/15</p>
          </div>
        </div>

        {/* Recent Feed */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">최근 활동</h2>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">사용자 {i}</p>
                    <p className="text-xs text-gray-600">멋진 해양 생물을 발견했습니다!</p>
                  </div>
                  <span className="text-xs text-gray-500">방금</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranking Preview */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">🏆 순위</h2>
          <div className="space-y-2">
            {[1, 2, 3].map(rank => (
              <div
                key={rank}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold text-lg ${
                      rank === 1 ? "text-yellow-500" : rank === 2 ? "text-gray-400" : "text-orange-600"
                    }`}
                  >
                    #{rank}
                  </span>
                  <span className="font-medium text-sm text-gray-900">플레이어 {rank}</span>
                </div>
                <span className="font-bold text-blue-600">{5000 - rank * 500}p</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
