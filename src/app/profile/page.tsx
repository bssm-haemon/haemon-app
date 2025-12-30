"use client";

import MainLayout from "@/components/MainLayout";
import { Award, Calendar, Zap, Settings, LogOut, ShieldCheck } from "lucide-react";
import { useUserDetail } from "@/hooks/useUser";
import { useLogout } from "@/hooks/useAuth";
import { useMyBadges } from "@/hooks/useBadges";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { data: user } = useUserDetail();
  const { data: badgesData } = useMyBadges();
  const logoutMutation = useLogout();
  const router = useRouter();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  const joinDays = user?.created_at
    ? Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const getBadgeImage = (name: string) => `/badges/${encodeURIComponent(name.trim())}.png`;

  return (
    <MainLayout>
      <div className="p-4 pb-4">
        {/* Profile Header - Pokémon Go Style */}
        <div className="bg-gradient-to-br from-red-500 via-yellow-400 to-orange-500 rounded-3xl p-8 text-white mb-6 text-center shadow-2xl border-4 border-yellow-300">
          <div className="w-24 h-24 bg-white bg-opacity-20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-black overflow-hidden border-4 border-white">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user.nickname} className="w-full h-full object-cover" />
            ) : (
              user?.nickname?.[0] || "?"
            )}
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wider">{user?.nickname || "플레이어"}</h1>
          <p className="text-sm opacity-90 font-bold">{user?.email}</p>
          {user?.is_admin && (
            <div className="flex items-center justify-center gap-2 mt-2 bg-black bg-opacity-30 rounded-full py-1 px-3 w-fit mx-auto">
              <ShieldCheck size={16} />
              <span className="text-xs font-bold">관리자</span>
            </div>
          )}
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl p-4 text-center border-4 border-red-500 shadow-lg text-white">
            <Zap className="mx-auto text-red-100 mb-2" size={24} />
            <p className="text-xs font-black uppercase">포인트</p>
            <p className="text-2xl font-black">{user?.points?.toLocaleString() ?? 0}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 text-center border-4 border-blue-500 shadow-lg text-white">
            <Award className="mx-auto text-blue-100 mb-2" size={24} />
            <p className="text-xs font-black uppercase">레벨</p>
            <p className="text-2xl font-black">{Math.floor((user?.points ?? 0) / 100) + 1}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-4 text-center border-4 border-yellow-500 shadow-lg text-white">
            <Calendar className="mx-auto text-yellow-100 mb-2" size={24} />
            <p className="text-xs font-black uppercase">일수</p>
            <p className="text-2xl font-black">{joinDays}</p>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">📊 활동</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-semibold text-gray-900">생물 목격</span>
              <span className="text-lg font-bold text-blue-600">{user?.sighting_count ?? 0}회</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-semibold text-gray-900">쓰레기 수거</span>
              <span className="text-lg font-bold text-green-600">{user?.cleanup_count ?? 0}회</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-semibold text-gray-900">도감 등록</span>
              <span className="text-lg font-bold text-orange-600">{user?.creature_count ?? 0}종</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">🏆 뱃지</h2>
          {badgesData?.badges && badgesData.badges.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {badgesData.badges.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
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
                  <span className="text-[11px] font-semibold text-center text-gray-900 leading-tight">
                    {item.badge.name_ko || item.badge.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm py-4 bg-gray-50 rounded-lg border border-gray-200">
              획득한 뱃지가 없습니다.
            </p>
          )}
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
          {user?.is_admin && (
            <button
              onClick={() => router.push("/admin")}
              className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-blue-600" />
                <span className="font-semibold text-blue-700">관리자 콘솔</span>
              </div>
              <span className="text-blue-400">›</span>
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
          >
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
