"use client";

import MainLayout from "@/components/MainLayout";
import { useState } from "react";
import { MapPin, Trash2, Eye } from "lucide-react";
import clsx from "clsx";

interface Marker {
  id: string;
  type: "sighting" | "cleanup";
  lat: number;
  lng: number;
  title: string;
  user: string;
  timestamp: string;
}

const markers: Marker[] = [
  {
    id: "1",
    type: "sighting",
    lat: 37.4979,
    lng: 127.0276,
    title: "해파리 목격",
    user: "사용자1",
    timestamp: "2시간 전",
  },
  {
    id: "2",
    type: "cleanup",
    lat: 37.4985,
    lng: 127.0285,
    title: "플라스틱 수거 (5kg)",
    user: "사용자2",
    timestamp: "1시간 전",
  },
  {
    id: "3",
    type: "sighting",
    lat: 37.4975,
    lng: 127.027,
    title: "거북이 목격",
    user: "사용자3",
    timestamp: "30분 전",
  },
];

export default function MapPage() {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [filterType, setFilterType] = useState<"all" | "sighting" | "cleanup">("all");

  const filtered = markers.filter(m => filterType === "all" || m.type === filterType);

  return (
    <MainLayout>
      <div className="p-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">지도</h1>
          <p className="text-sm text-gray-600">주변의 활동 위치를 확인하세요</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {(["all", "sighting", "cleanup"] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
                filterType === type ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              {type === "all" && "전체"}
              {type === "sighting" && "생물 목격"}
              {type === "cleanup" && "쓰레기 수거"}
            </button>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg border-2 border-blue-300 mb-4 flex items-center justify-center relative overflow-hidden">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 text-blue-600" size={32} />
            <p className="text-gray-700 font-semibold">Kakao Maps</p>
            <p className="text-xs text-gray-600">배포 시 지도 API 연동</p>
          </div>

          {/* Marker Indicators */}
          <div className="absolute inset-0 pointer-events-none">
            {filtered.map((marker, idx) => (
              <div
                key={marker.id}
                className={clsx(
                  "absolute w-3 h-3 rounded-full cursor-pointer pointer-events-auto",
                  marker.type === "sighting" ? "bg-blue-500" : "bg-green-500",
                )}
                style={{
                  left: `${30 + idx * 20}%`,
                  top: `${40 + idx * 15}%`,
                }}
                onClick={() => setSelectedMarker(marker)}
                title={marker.title}
              />
            ))}
          </div>
        </div>

        {/* Activity List */}
        <h2 className="text-lg font-bold text-gray-900 mb-3">주변 활동</h2>
        <div className="space-y-3">
          {filtered.map(marker => (
            <div
              key={marker.id}
              onClick={() => setSelectedMarker(marker)}
              className={clsx(
                "p-4 rounded-lg border-2 cursor-pointer transition-all",
                selectedMarker?.id === marker.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={clsx(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
                    marker.type === "sighting" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600",
                  )}
                >
                  {marker.type === "sighting" ? <Eye size={20} /> : <Trash2 size={20} />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{marker.title}</p>
                  <p className="text-xs text-gray-600">
                    {marker.user} · {marker.timestamp}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {marker.lat.toFixed(4)}° N, {marker.lng.toFixed(4)}° E
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Marker Modal */}
        {selectedMarker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end">
            <div className="w-full bg-white rounded-t-2xl p-6 animate-slideUp">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{selectedMarker.title}</h3>
                <button onClick={() => setSelectedMarker(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  ✕
                </button>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-semibold">사용자:</span> {selectedMarker.user}
                </p>
                <p>
                  <span className="font-semibold">시간:</span> {selectedMarker.timestamp}
                </p>
                <p>
                  <span className="font-semibold">위치:</span> {selectedMarker.lat.toFixed(4)}° N,{" "}
                  {selectedMarker.lng.toFixed(4)}° E
                </p>
              </div>
              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors">
                상세보기
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
