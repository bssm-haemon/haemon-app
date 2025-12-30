"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Maximize, Box } from "lucide-react";
import { getCreatureById } from "@/data/creatures";

export default function ARPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // ALL HOOKS AT TOP LEVEL
  const [creatureId, setCreatureId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false); // For hydration fix
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isIOS, setIsIOS] = useState<boolean | null>(null);
  const [modelViewerReady, setModelViewerReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modelViewerRef = useRef<HTMLElement | null>(null);

  const resolvedParams = use(params);

  // 1. Mark as mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Load model-viewer web component
  useEffect(() => {
    import("@google/model-viewer")
      .then(() => {
        console.log("✅ model-viewer web component registered");
        setModelViewerReady(true);
      })
      .catch((err) => {
        console.error("❌ Failed to load model-viewer:", err);
        setLoadError("AR 라이브러리 로딩 실패");
      });
  }, []);

  // 3. Set creature ID and detect device
  useEffect(() => {
    setCreatureId(resolvedParams.id);
    
    // Simple mobile detection
    const userAgent = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/i.test(userAgent);
    const mobile = /Android|iPhone|iPad|iPod/i.test(userAgent);
    
    console.log("🔍 Device Detection:", { userAgent: userAgent.substring(0, 80), isMobile: mobile, isIOS: ios });
    
    setIsMobile(mobile);
    setIsIOS(ios);
  }, [resolvedParams]);

  // 3. Start webcam (for PC AR simulation)
  useEffect(() => {
    if (isMobile !== false) return;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log("Webcam not available or denied:", err);
      }
    };
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isMobile]);

  // 4. Attach event listeners to model-viewer AFTER it's ready
  useEffect(() => {
    if (!modelViewerReady) return;

    // Wait for the DOM to update
    const timer = setTimeout(() => {
      const viewer = document.querySelector('model-viewer');
      if (viewer) {
        modelViewerRef.current = viewer as HTMLElement;
        
        viewer.addEventListener('load', () => {
          console.log("✅ 3D Model loaded successfully!");
          setModelLoaded(true);
        });

        viewer.addEventListener('error', (e: any) => {
          console.error("❌ Model load error:", e);
          setLoadError("3D 모델 로딩 실패 (파일 손상/호환성 문제)");
        });

        viewer.addEventListener('progress', (e: any) => {
          const progress = e.detail.totalProgress;
          console.log(`Model download: ${Math.round(progress * 100)}%`);
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [modelViewerReady]);

  // Derived state
  const creature = creatureId ? getCreatureById(creatureId) : null;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const modelMap: { [key: string]: string } = {
    'creature-005': 'squid',
    'creature-006': 'octopus',
    'creature-010': 'seal',
  };

  const modelName = creature ? modelMap[creature.id] : null;
  const modelUrl = modelName ? `${origin}/models/${modelName}.glb` : null;
  const modelUsdZUrl = modelName ? `${origin}/models/${modelName}.usdz` : null;

  // Early return AFTER all hooks
  if (!creature) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-4">
        <p>생물 정보를 불러올 수 없습니다.</p>
        <button onClick={() => router.back()} className="mt-4 px-6 py-2 bg-white text-black rounded-full font-bold">
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden flex flex-col">
      {/* Background Webcam Feed */}
      {isMobile === false && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
        />
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex items-center justify-between z-20 pointer-events-none">
        <button
          onClick={() => router.back()}
          className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition pointer-events-auto"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
          <p className="text-white font-bold flex items-center gap-2">
            <Box size={16} className="text-blue-400" /> 
            {modelLoaded ? "AR Ready ✓" : "Loading..."}
          </p>
        </div>
        <div className="w-12"></div>
      </div>

      {modelUrl && modelViewerReady ? (
        <div className="w-full h-full relative z-10">
          {/* @ts-ignore - model-viewer is a web component */}
          <model-viewer
            src={modelUrl}
            ios-src={modelUsdZUrl} // iOS AR Quick Look 지원
            alt={`3D model of ${creature.name}`}
            ar
            ar-modes="quick-look webxr scene-viewer"
            ar-placement="floor"
            ar-scale="auto"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            environment-image="neutral"
            exposure="1.2"
            style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
          >
            {/* AR Button - Always render, model-viewer shows it only when AR is supported */}
            <button
              slot="ar-button"
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-full shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all z-30 border-2 border-white/20 whitespace-nowrap"
            >
              <Maximize size={24} />
              <span className="text-lg">내 공간에 소환하기</span>
            </button>
            {/* @ts-ignore */}
          </model-viewer>

          {/* Error Overlay */}
          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
              <div className="bg-red-600 text-white p-6 rounded-2xl text-center max-w-sm mx-4">
                <p className="text-xl font-bold mb-2">오류 발생</p>
                <p>{loadError}</p>
                <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-white text-red-600 rounded-full font-bold">
                  돌아가기
                </button>
              </div>
            </div>
          )}

          {/* Loading Overlay - Show until model is loaded */}
          {!modelLoaded && !loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-40 pointer-events-none">
              <div className="bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center max-w-xs">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white font-bold mb-1">3D 모델 다운로드 중...</p>
                <p className="text-gray-400 text-sm">파일 용량이 커서 시간이 걸릴 수 있습니다</p>
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl z-20 text-center border border-white/20 w-max max-w-[90%] pointer-events-none">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{creature.name_en}</p>
            <h2 className="text-2xl font-black text-white">{creature.name}</h2>
            <p className="text-xs text-blue-200 mt-2 font-medium">
              {!isMobile ? "PC 모드: 마우스로 돌려보세요" : "하단 버튼을 눌러 실제 공간에 배치하세요"}
            </p>
          </div>

          {/* PC Mode Hint */}
          {!isMobile && modelLoaded && (
            <div className="absolute bottom-12 left-0 right-0 text-center pointer-events-none text-gray-400 text-sm">
              <p>마우스 드래그로 360도 회전 · 휠로 확대/축소</p>
            </div>
          )}
        </div>
      ) : !modelUrl ? (
        <div className="flex items-center justify-center w-full h-full z-10">
          <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md text-center max-w-sm mx-4 border border-white/10">
            <div className="text-6xl mb-4 animate-bounce">🚧</div>
            <p className="text-white text-xl font-bold mb-2">3D 모델 준비 중</p>
            <p className="text-gray-300">일부 생물만 AR 기능을 지원합니다.</p>
            <button onClick={() => router.back()} className="mt-6 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition text-sm">
              돌아가기
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full z-10">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
