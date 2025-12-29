"use client";

import MainLayout from "@/components/MainLayout";
import { useState } from "react";
import { MapPin, Trash2, Eye } from "lucide-react";
import clsx from "clsx";
import PokemonHeader from "@/components/PokemonHeader";
import { useSightingMarkers, useCleanupMarkers } from "@/hooks/useMaps";

export default function MapPage() {
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [filterType, setFilterType] = useState<"all" | "sighting" | "cleanup">("all");

  const { data: sightingsMarkers } = useSightingMarkers({ status: "approved" });
  const { data: cleanupsMarkers } = useCleanupMarkers({ status: "approved" });

  const allMarkers = [
    ...(sightingsMarkers?.markers || []),
    ...(cleanupsMarkers?.markers || []),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filtered = allMarkers.filter(m => filterType === "all" || m.type === filterType);

  return (
    <MainLayout>
      <div className="p-4">
        <PokemonHeader className="mb-2" />

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
            {filtered.slice(0, 10).map((marker, idx) => (
              <div
                key={marker.id}
                className={clsx(
                  "absolute w-3 h-3 rounded-full cursor-pointer pointer-events-auto",
                  marker.type === "sighting" ? "bg-blue-500" : "bg-green-500",
                )}
                style={{
                  left: `${10 + (idx * 37) % 80}%`,
                  top: `${20 + (idx * 23) % 60}%`,
                }}
                onClick={() => setSelectedMarker(marker)}
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
                  <p className="font-semibold text-gray-900">
                    {marker.type === "sighting" ? marker.creature_name : `${marker.trash_type} 수거`}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(marker.created_at).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {marker.latitude.toFixed(4)}° N, {marker.longitude.toFixed(4)}° E
                  </p>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-4">활동 기록이 없습니다.</p>
          )}
        </div>

        {/* Selected Marker Modal */}
        {selectedMarker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end">
            <div className="w-full bg-white rounded-t-2xl p-6 animate-slideUp">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedMarker.type === "sighting" ? selectedMarker.creature_name : `${selectedMarker.trash_type} 수거`}
                </h3>
                <button onClick={() => setSelectedMarker(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  ✕
                </button>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                {selectedMarker.type === "sighting" && (
                  <p><span className="font-semibold">희귀도:</span> {selectedMarker.rarity}</p>
                )}
                {selectedMarker.type === "cleanup" && (
                  <p><span className="font-semibold">수거량:</span> {selectedMarker.amount}</p>
                )}
                <p>
                  <span className="font-semibold">시간:</span> {new Date(selectedMarker.created_at).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">위치:</span> {selectedMarker.latitude.toFixed(4)}° N,{" "}
                  {selectedMarker.longitude.toFixed(4)}° E
                </p>
              </div>
              {selectedMarker.type === "sighting" && selectedMarker.photo_url && (
                <img src={selectedMarker.photo_url} alt="Discovery" className="w-full h-40 object-cover rounded-lg mt-4" />
              )}
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
