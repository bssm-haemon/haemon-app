"use client";

import MainLayout from "@/components/MainLayout";
import { memo, useState } from "react";
import {
  ChevronLeft,
  Bell,
  Lock,
  Trash2,
  HelpCircle,
  FileText,
  Mail,
  Globe,
  Volume2,
  Eye,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const SettingsPageContent = memo(() => {
  const router = useRouter();
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    privateProfile: false,
    shareLocation: true,
    darkMode: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const settingItems = [
    {
      group: "알림 및 사운드",
      items: [
        {
          icon: Bell,
          label: "푸시 알림",
          description: "새 뱃지 및 업데이트 알림",
          key: "notifications" as const,
          invert: false,
        },
        {
          icon: Volume2,
          label: "사운드",
          description: "효과음 및 배경음",
          key: "soundEnabled" as const,
          invert: false,
        },
      ],
    },
    {
      group: "개인정보",
      items: [
        {
          icon: Eye,
          label: "프로필 공개",
          description: "다른 사용자에게 프로필 표시",
          key: "privateProfile" as const,
          invert: true,
        },
        {
          icon: Globe,
          label: "위치 공유",
          description: "플레이 위치 공유 동의",
          key: "shareLocation" as const,
          invert: false,
        },
      ],
    },
  ];

  return (
    <MainLayout>
      <div className="p-4 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-blue-100 rounded-full transition-all hover:scale-110"
          >
            <ChevronLeft size={24} className="text-blue-600" />
          </button>
          <h1 className="text-3xl font-black uppercase text-gray-900 drop-shadow-sm">설정</h1>
        </div>

        {/* Settings Groups */}
        <div className="space-y-7">
          {settingItems.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4 px-2">{group.group}</h2>
              <div className="space-y-3">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isToggled = item.invert ? !settings[item.key] : settings[item.key];

                  return (
                    <div
                      key={itemIdx}
                      className="flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 hover:scale-102"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
                          <Icon size={22} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-gray-900 text-sm">{item.label}</p>
                          <p className="text-xs text-gray-500 font-medium">{item.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle(item.key)}
                        className="transition-all duration-300 hover:scale-125"
                      >
                        {isToggled ? (
                          <ToggleRight size={32} className="text-blue-600 drop-shadow-md" />
                        ) : (
                          <ToggleLeft size={32} className="text-gray-300" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Display Settings */}
          <div>
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4 px-2">디스플레이</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 opacity-75 cursor-not-allowed">
                <div className="flex items-center gap-4 flex-1">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl">
                    <Eye size={22} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 text-sm">다크 모드</p>
                    <p className="text-xs text-gray-500 font-medium">어두운 테마 활성화 (개발 중)</p>
                  </div>
                </div>
                <button disabled className="transition-all opacity-50 cursor-not-allowed">
                  <ToggleLeft size={32} className="text-gray-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Account & Security */}
          <div>
            <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3 px-1">계정</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all text-left">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Lock size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">비밀번호 변경</p>
                  <p className="text-xs text-gray-500">계정 보안 강화</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <button className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all text-left">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Mail size={20} className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">이메일 변경</p>
                  <p className="text-xs text-gray-500">계정 이메일 주소 변경</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>
          </div>

          {/* Support & Info */}
          <div>
            <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3 px-1">도움말 및 정보</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all text-left">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <HelpCircle size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">도움말 및 FAQ</p>
                  <p className="text-xs text-gray-500">자주 묻는 질문</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <button className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all text-left">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <FileText size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">이용약관</p>
                  <p className="text-xs text-gray-500">서비스 약관 보기</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <button className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all text-left">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <FileText size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">개인정보처리방침</p>
                  <p className="text-xs text-gray-500">개인정보 보호 정책</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <h2 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3 px-1">위험 영역</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition-all text-left">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-red-600 text-sm">계정 삭제</p>
                  <p className="text-xs text-red-500">모든 데이터 삭제 (복구 불가)</p>
                </div>
                <span className="text-red-400">›</span>
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100 text-center">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">해몬도감</p>
            <p className="text-2xl font-black text-blue-600 mb-2">v1.0.0</p>
            <p className="text-xs text-gray-500">해양생물 목격 및 보존 게임</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
});

SettingsPageContent.displayName = "SettingsPageContent";

export { SettingsPageContent };
