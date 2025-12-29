"use client";

import MainLayout from "@/components/MainLayout";
import { useState } from "react";
import { Camera, Trash2, MapPin, Plus } from "lucide-react";
import clsx from "clsx";

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<"creature" | "cleanup">("creature");

  return (
    <MainLayout>
      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">활동 등록</h1>
          <p className="text-sm text-gray-600">해양 생물을 발견하거나 쓰레기를 수거하세요</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("creature")}
            className={clsx(
              "flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2",
              activeTab === "creature" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            )}
          >
            <Camera size={20} />
            생물 목격
          </button>
          <button
            onClick={() => setActiveTab("cleanup")}
            className={clsx(
              "flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2",
              activeTab === "cleanup" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            )}
          >
            <Trash2 size={20} />
            쓰레기 수거
          </button>
        </div>

        {/* Creature Sighting Form */}
        {activeTab === "creature" && (
          <div className="space-y-4">
            {/* Camera Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <Camera className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="font-semibold text-gray-900">사진 촬영</p>
              <p className="text-xs text-gray-600">생물의 사진을 촬영하세요</p>
            </div>

            {/* Creature Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">생물 종류</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                <option>생물 선택...</option>
                <option>해파리</option>
                <option>불가사리</option>
                <option>문어</option>
                <option>해양 거북</option>
                <option>돌고래</option>
                <option>기타</option>
              </select>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <MapPin size={20} className="text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">현재 위치</p>
                <p className="font-semibold text-sm text-gray-900">37.4979° N, 127.0276° E</p>
              </div>
            </div>

            {/* Memo */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">메모</label>
              <textarea
                placeholder="생물에 대한 추가 정보를 입력하세요..."
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                rows={4}
              />
            </div>

            {/* Submit */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
              등록하기
            </button>
          </div>
        )}

        {/* Cleanup Form */}
        {activeTab === "cleanup" && (
          <div className="space-y-4">
            {/* Before Photo */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">수거 전</p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Camera className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-xs text-gray-600">사진 촬영하기</p>
              </div>
            </div>

            {/* After Photo */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">수거 후</p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Camera className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-xs text-gray-600">사진 촬영하기</p>
              </div>
            </div>

            {/* Trash Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">쓰레기 종류</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                <option>선택...</option>
                <option>플라스틱</option>
                <option>유리</option>
                <option>금속</option>
                <option>종이/목재</option>
                <option>혼합 쓰레기</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">수거량 (kg)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <MapPin size={20} className="text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">현재 위치</p>
                <p className="font-semibold text-sm text-gray-900">37.4979° N, 127.0276° E</p>
              </div>
            </div>

            {/* Submit */}
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">
              등록하기
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
