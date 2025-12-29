"use client";

import MainLayout from "@/components/MainLayout";
import { Award, Calendar, Zap, Settings, LogOut } from "lucide-react";

export default function ProfilePage() {
  return (
    <MainLayout>
      <div className="p-4">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg p-6 text-white mb-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-blue-600">
            K
          </div>
          <h1 className="text-2xl font-bold">떼루</h1>
          <p className="text-sm opacity-90">@user123</p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
            <Zap className="mx-auto text-blue-600 mb-1" size={20} />
            <p className="text-xs text-gray-600">포인트</p>
            <p className="text-xl font-bold text-gray-900">2,450</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
            <Award className="mx-auto text-purple-600 mb-1" size={20} />
            <p className="text-xs text-gray-600">레벨</p>
            <p className="text-xl font-bold text-gray-900">12</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
            <Calendar className="mx-auto text-green-600 mb-1" size={20} />
            <p className="text-xs text-gray-600">가입 일수</p>
            <p className="text-xl font-bold text-gray-900">145</p>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">활동 통계</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-semibold text-gray-900">생물 목격</span>
              <span className="text-lg font-bold text-blue-600">24회</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-semibold text-gray-900">쓰레기 수거</span>
              <span className="text-lg font-bold text-green-600">18회</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-semibold text-gray-900">총 수거량</span>
              <span className="text-lg font-bold text-orange-600">89.5kg</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">🏆 뱃지</h2>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: "🌊", label: "첫 발견" },
              { icon: "🌱", label: "에코전사" },
              { icon: "⚡", label: "활동가" },
              { icon: "🎯", label: "수집가" },
              { icon: "🔥", label: "5일 연속" },
              { icon: "💯", label: "백퍼센트" },
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-2xl mb-1">{badge.icon}</span>
                <span className="text-xs font-semibold text-center text-gray-900">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings & Actions */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-gray-600" />
              <span className="font-semibold text-gray-900">설정</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors">
            <div className="flex items-center gap-3">
              <LogOut size={20} className="text-red-600" />
              <span className="font-semibold text-red-600">로그아웃</span>
            </div>
            <span className="text-red-400">›</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
