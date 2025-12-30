"use client";

import MainLayout from "@/components/MainLayout";
import PokemonHeader from "@/components/PokemonHeader";
import { useState, useEffect, useRef } from "react";
import { Filter } from "lucide-react";
import clsx from "clsx";
import { useSightingMarkers, useCleanupMarkers } from "@/hooks/useMaps";
import Script from "next/script";

type FilterType = "all" | "sighting" | "cleanup";

export default function MapPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const { data: sightingData } = useSightingMarkers();
  const { data: cleanupData } = useCleanupMarkers();

  const kakaoApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

  // 지도 초기화
  useEffect(() => {
    if (!mapLoaded || !window.kakao?.maps || mapError) return;

    const container = document.getElementById("map");
    if (!container) return;

    // 컨테이너 크기 확인
    if (container.offsetWidth === 0 || container.offsetHeight === 0) {
      setTimeout(() => {}, 100);
      return;
    }

    try {
      const options = {
        center: new window.kakao.maps.LatLng(37.4979, 127.0276),
        level: 8,
      };

      mapRef.current = new window.kakao.maps.Map(container, options);
    } catch (error) {
      console.error("지도 초기화 오류:", error);
    }
  }, [mapLoaded, mapError]);

  // 마커 업데이트
  useEffect(() => {
    if (!mapRef.current || !window.kakao?.maps || mapError) return;

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const markers: any[] = [];

    // 목격 마커 추가
    if ((filter === "all" || filter === "sighting") && sightingData?.markers) {
      sightingData.markers.forEach(item => {
        const position = new window.kakao.maps.LatLng(item.latitude, item.longitude);
        const marker = new window.kakao.maps.Marker({
          position,
          map: mapRef.current,
          image: new window.kakao.maps.MarkerImage(
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='40' viewBox='0 0 32 40'%3E%3Cpath fill='%233B82F6' d='M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z'/%3E%3Ccircle cx='16' cy='16' r='6' fill='white'/%3E%3C/svg%3E",
            new window.kakao.maps.Size(32, 40),
            { offset: new window.kakao.maps.Point(16, 40) },
          ),
        });

        // 인포윈도우
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:10px;min-width:150px;text-align:center;">
            <strong>${item.creature_name || "알 수 없음"}</strong><br/>
            <span style="color:#666;font-size:12px;">${new Date(item.created_at).toLocaleDateString()}</span>
          </div>`,
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          infowindow.open(mapRef.current, marker);
        });

        markers.push(marker);
      });
    }

    // 수거 마커 추가
    if ((filter === "all" || filter === "cleanup") && cleanupData?.markers) {
      cleanupData.markers.forEach(item => {
        const position = new window.kakao.maps.LatLng(item.latitude, item.longitude);
        const marker = new window.kakao.maps.Marker({
          position,
          map: mapRef.current,
          image: new window.kakao.maps.MarkerImage(
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='40' viewBox='0 0 32 40'%3E%3Cpath fill='%2310B981' d='M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z'/%3E%3Ccircle cx='16' cy='16' r='6' fill='white'/%3E%3C/svg%3E",
            new window.kakao.maps.Size(32, 40),
            { offset: new window.kakao.maps.Point(16, 40) },
          ),
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:10px;min-width:150px;text-align:center;">
            <strong>쓰레기 수거</strong><br/>
            <span style="color:#666;font-size:12px;">${item.trash_type} · ${item.amount}</span>
          </div>`,
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          infowindow.open(mapRef.current, marker);
        });

        markers.push(marker);
      });
    }

    markersRef.current = markers;
  }, [filter, sightingData, cleanupData, mapError]);

  if (!kakaoApiKey) {
    return (
      <MainLayout>
        <div className="p-4">
          <PokemonHeader className="mb-6" />
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600 font-semibold">환경 변수 NEXT_PUBLIC_KAKAO_MAP_API_KEY가 설정되지 않았습니다.</p>
            <p className="text-sm text-red-500 mt-2">.env 파일에 Kakao Maps API 키를 추가해주세요.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => {
          const kakao = (window as any).kakao;
          if (!kakao?.maps?.load) {
            const domain = typeof window !== "undefined" ? window.location.origin : "현재 도메인";
            setMapError(
              `Kakao Maps SDK를 불러오지 못했습니다. 개발자 콘솔에서 등록된 도메인(${domain})을 확인해주세요.`,
            );
            return;
          }
          kakao.maps.load(() => setMapLoaded(true));
        }}
        onError={() => {
          const domain = typeof window !== "undefined" ? window.location.origin : "현재 도메인";
          setMapError(
            `Kakao Maps SDK 요청이 차단되었습니다. 카카오 개발자 콘솔에 현재 도메인(${domain})과 Redirect URI를 등록해주세요.`,
          );
        }}
      />

      <MainLayout>
        <div className="p-4 pb-4">
          <PokemonHeader className="mb-6" />

          {mapError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{mapError}</div>
          )}

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 mb-4">
            <Filter size={18} className="text-gray-600" />
            <div className="flex gap-2 flex-1">
              <button
                onClick={() => setFilter("all")}
                className={clsx(
                  "px-4 py-2 rounded-lg font-semibold text-sm transition-all",
                  filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                전체
              </button>
              <button
                onClick={() => setFilter("sighting")}
                className={clsx(
                  "px-4 py-2 rounded-lg font-semibold text-sm transition-all",
                  filter === "sighting" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                🐟 목격
              </button>
              <button
                onClick={() => setFilter("cleanup")}
                className={clsx(
                  "px-4 py-2 rounded-lg font-semibold text-sm transition-all",
                  filter === "cleanup" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                ♻️ 수거
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div
            className="relative w-full rounded-lg border-4 border-gray-300 overflow-hidden bg-gray-100"
            style={{ height: "400px", minHeight: "300px" }}
          >
            <div id="map" className="w-full h-full" />
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
              <p className="text-xs text-blue-600 font-semibold">생물 목격</p>
              <p className="text-2xl font-bold text-blue-700">{sightingData?.total || 0}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
              <p className="text-xs text-green-600 font-semibold">쓰레기 수거</p>
              <p className="text-2xl font-bold text-green-700">{cleanupData?.total || 0}</p>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
