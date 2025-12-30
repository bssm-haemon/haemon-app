"use client";

import MainLayout from "@/components/MainLayout";
import { Award, Calendar, Zap, Settings, LogOut, ShieldCheck } from "lucide-react";
import { useUserDetail } from "@/hooks/useUser";
import { useLogout } from "@/hooks/useAuth";
import { useMyBadges } from "@/hooks/useBadges";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { memo } from "react";

const ProfilePageContent = memo(() => {
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
        <div className="bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-500 rounded-3xl p-8 text-white mb-6 text-center shadow-2xl border-4 border-yellow-300">
          <div className="w-24 h-24 bg-white bg-opacity-30 backdrop-blur-md rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-black overflow-hidden border-4 border-white shadow-lg">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user.nickname} className="w-full h-full object-cover" />
            ) : (
              user?.nickname?.[0] || "?"
            )}
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wider drop-shadow-lg">
            {user?.nickname || "플레이어"}
          </h1>
          <p className="text-sm opacity-95 font-bold mt-1">{user?.email}</p>
          {user?.is_admin && (
            <div className="flex items-center justify-center gap-2 mt-3 bg-white bg-opacity-20 backdrop-blur-md rounded-full py-2 px-4 w-fit mx-auto border-2 border-white">
              <ShieldCheck size={16} />
              <span className="text-xs font-black">관리자</span>
            </div>
          )}
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-center border-2 border-red-400 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-white">
            <Zap className="mx-auto text-yellow-300 mb-2" size={28} />
            <p className="text-xs font-black uppercase">포인트</p>
            <p className="text-2xl font-black mt-1">{user?.points?.toLocaleString() ?? 0}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-center border-2 border-blue-400 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-white">
            <Award className="mx-auto text-yellow-300 mb-2" size={28} />
            <p className="text-xs font-black uppercase">레벨</p>
            <p className="text-2xl font-black mt-1">{Math.floor((user?.points ?? 0) / 100) + 1}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-center border-2 border-green-400 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-white">
            <Calendar className="mx-auto text-yellow-300 mb-2" size={28} />
            <p className="text-xs font-black uppercase">일수</p>
            <p className="text-2xl font-black mt-1">{joinDays}</p>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">📊 활동</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-white rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300">
              <span className="text-sm font-black text-gray-900">생물 목격</span>
              <span className="text-lg font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                {user?.sighting_count ?? 0}회
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white rounded-2xl border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300">
              <span className="text-sm font-black text-gray-900">쓰레기 수거</span>
              <span className="text-lg font-black text-green-600 bg-green-50 px-4 py-2 rounded-full">
                {user?.cleanup_count ?? 0}회
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white rounded-2xl border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300">
              <span className="text-sm font-black text-gray-900">도감 등록</span>
              <span className="text-lg font-black text-yellow-600 bg-yellow-50 px-4 py-2 rounded-full">
                {user?.creature_count ?? 0}종
              </span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">🏆 뱃지</h2>
          {badgesData?.badges && badgesData.badges.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {badgesData.badges.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300 cursor-pointer"
                >
                  {item.badge?.name || item.badge?.name_ko ? (
                    <Image
                      src={getBadgeImage(item.badge.name_ko || item.badge.name)}
                      alt={item.badge.name_ko || item.badge.name}
                      width={72}
                      height={72}
                      className="rounded-xl object-contain drop-shadow-lg hover:drop-shadow-2xl transition-all"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-500 shadow-md hover:shadow-lg transition-all">
                      <Award size={24} />
                    </div>
                  )}
                  <span className="text-xs font-black text-center text-gray-900 leading-tight">
                    {item.badge.name_ko || item.badge.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-sm py-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 font-semibold">
              획득한 뱃지가 없습니다.
            </p>
          )}
        </div>

        {/* Settings & Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/settings")}
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-gray-400 transition-all hover:shadow-lg hover:scale-102 transform"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Settings size={20} className="text-blue-600" />
              </div>
              <span className="font-black text-gray-900">설정</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          {user?.is_admin && (
            <button
              onClick={() => router.push("/admin")}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-2xl border-2 border-blue-300 transition-all hover:shadow-lg hover:scale-102 transform"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-200 p-3 rounded-lg">
                  <ShieldCheck size={20} className="text-blue-700" />
                </div>
                <span className="font-black text-blue-900">관리자 콘솔</span>
              </div>
              <span className="text-blue-500">›</span>
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 rounded-2xl border-2 border-red-300 transition-all hover:shadow-lg hover:scale-102 transform"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-200 p-3 rounded-lg">
                <LogOut size={20} className="text-red-700" />
              </div>
              <span className="font-black text-red-700">로그아웃</span>
            </div>
            <span className="text-red-500">›</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
});

ProfilePageContent.displayName = "ProfilePageContent";

export { ProfilePageContent };
