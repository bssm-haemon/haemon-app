"use client";

import MainLayout from "@/components/MainLayout";
import PokemonHeader from "@/components/PokemonHeader";
import { useState, useEffect } from "react";
import { Camera, Trash2, MapPin, Loader2, Info } from "lucide-react";
import clsx from "clsx";
import { useCreateSighting } from "@/hooks/useSightings";
import { useCreateCleanup } from "@/hooks/useCleanups";
import { useAIClassifyCreature, useAIClassifyTrash } from "@/hooks/useAI";
import { TrashType, CleanupAmount } from "@/types";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<"creature" | "cleanup">("creature");
  const router = useRouter();

  // Location state
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  // States for Creature
  const [creaturePhoto, setCreaturePhoto] = useState<File | null>(null);
  const [creatureId, setCreatureId] = useState("");
  const [memo, setMemo] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [aiConfidence, setAiConfidence] = useState<number>(0);

  // States for Cleanup
  const [beforePhoto, setBeforePhoto] = useState<File | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<File | null>(null);
  const [trashType, setTrashType] = useState<TrashType>("plastic");
  const [amount, setAmount] = useState<CleanupAmount>("one_bag");
  const [trashAiVerified, setTrashAiVerified] = useState(false);
  const [trashAiConfidence, setTrashAiConfidence] = useState(0);

  const createSighting = useCreateSighting();
  const createCleanup = useCreateCleanup();
  const classifyCreature = useAIClassifyCreature();
  const classifyTrash = useAIClassifyTrash();

  const onCreaturePhotoChange = async (file: File | null) => {
    setCreaturePhoto(file);
    if (file) {
      classifyCreature.mutate(file, {
        onSuccess: (data) => {
          setAiSuggestion(data.suggested_creature);
          setAiConfidence(data.confidence);
        }
      });
    }
  };

  const onBeforePhotoChange = async (file: File | null) => {
    setBeforePhoto(file);
    if (file) {
      classifyTrash.mutate(file, {
        onSuccess: (data) => {
          setTrashType(data.trash_type);
          setTrashAiVerified(data.has_trash);
          setTrashAiConfidence(data.confidence);
        }
      });
    }
  };

  const handleCreatureSubmit = async () => {
    if (!creaturePhoto || !coords) return alert("사진과 위치 정보가 필요합니다.");

    const formData = new FormData();
    formData.append("photo", creaturePhoto);
    formData.append("latitude", coords.lat.toString());
    formData.append("longitude", coords.lng.toString());
    formData.append("location_name", "현재 위치");
    if (creatureId) formData.append("creature_id", creatureId);
    formData.append("memo", memo);
    formData.append("ai_suggestion", aiSuggestion);
    formData.append("ai_confidence", aiConfidence.toString());

    createSighting.mutate(formData, {
      onSuccess: () => {
        alert("목격 정보가 등록되었습니다!");
        router.push("/");
      }
    });
  };

  const handleCleanupSubmit = async () => {
    if (!beforePhoto || !afterPhoto || !coords) return alert("사진 2장과 위치 정보가 필요합니다.");

    const formData = new FormData();
    formData.append("before_photo", beforePhoto);
    formData.append("after_photo", afterPhoto);
    formData.append("latitude", coords.lat.toString());
    formData.append("longitude", coords.lng.toString());
    formData.append("location_name", "현재 위치");
    formData.append("trash_type", trashType);
    formData.append("amount", amount);
    formData.append("ai_verified", trashAiVerified.toString());
    formData.append("ai_confidence", trashAiConfidence.toString());

    createCleanup.mutate(formData, {
      onSuccess: () => {
        alert("수거 인증이 등록되었습니다!");
        router.push("/");
      }
    });
  };

  return (
    <MainLayout>
      <div className="p-4 pb-24">
        <PokemonHeader className="mb-6" />

        {/* Tab Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("creature")}
            className={clsx(
              "flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
              activeTab === "creature" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-gray-200",
            )}
          >
            <Camera size={20} />
            생물 목격
          </button>
          <button
            onClick={() => setActiveTab("cleanup")}
            className={clsx(
              "flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
              activeTab === "cleanup" ? "bg-green-600 text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-gray-200",
            )}
          >
            <Trash2 size={20} />
            쓰레기 수거
          </button>
        </div>

        {/* Form Content */}
        {activeTab === "creature" ? (
          <div className="space-y-5">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onCreaturePhotoChange(e.target.files?.[0] || null)}
                className="hidden"
                id="creatureInput"
              />
              <label htmlFor="creatureInput" className="block border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-all cursor-pointer aspect-video flex flex-col items-center justify-center overflow-hidden bg-gray-50">
                {creaturePhoto ? (
                  <img src={URL.createObjectURL(creaturePhoto)} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="mx-auto mb-2 text-gray-400" size={40} />
                    <p className="font-bold text-gray-900">사진 등록</p>
                    <p className="text-xs text-gray-500 mt-1">발견한 생물을 찍어주세요</p>
                  </>
                )}
              </label>
              {classifyCreature.isPending && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center animate-fade-in">
                  <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                  <p className="text-sm font-bold text-blue-800">AI 분석 중...</p>
                </div>
              )}
            </div>

            {aiSuggestion && (
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3 animate-slide-up">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                  <Info size={20} />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">AI 분석 결과</p>
                  <p className="text-sm text-blue-900">
                    <span className="font-bold">"{aiSuggestion}"</span>일 확률이 {Math.round(aiConfidence * 100)}%입니다.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 px-1">메모</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="특이사항이나 발견 당시 상황을 기록해주세요."
                className="w-full p-4 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
              <MapPin size={20} className="text-blue-600" />
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase">현재 위치</p>
                <p className="font-bold text-sm text-gray-700">
                  {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "위치를 가져오는 중..."}
                </p>
              </div>
            </div>

            <button
              onClick={handleCreatureSubmit}
              disabled={createSighting.isPending || !coords || !creaturePhoto}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {createSighting.isPending && <Loader2 className="animate-spin" size={20} />}
              목격 등록하기
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input type="file" accept="image/*" onChange={(e) => onBeforePhotoChange(e.target.files?.[0] || null)} className="hidden" id="beforeInput" />
                <label htmlFor="beforeInput" className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-green-500 cursor-pointer aspect-square flex flex-col items-center justify-center overflow-hidden bg-gray-50 transition-all">
                  {beforePhoto ? (
                    <img src={URL.createObjectURL(beforePhoto)} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="mx-auto mb-1 text-gray-400" size={28} />
                      <p className="text-[11px] font-bold text-gray-700">수거 전</p>
                      <p className="text-[9px] text-gray-400">쓰레기가 있는 상태</p>
                    </>
                  )}
                </label>
                {classifyTrash.isPending && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-green-600" size={24} />
                  </div>
                )}
              </div>

              <input type="file" accept="image/*" onChange={(e) => setAfterPhoto(e.target.files?.[0] || null)} className="hidden" id="afterInput" />
              <label htmlFor="afterInput" className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-green-500 cursor-pointer aspect-square flex flex-col items-center justify-center overflow-hidden bg-gray-50 transition-all">
                {afterPhoto ? (
                  <img src={URL.createObjectURL(afterPhoto)} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="mx-auto mb-1 text-gray-400" size={28} />
                    <p className="text-[11px] font-bold text-gray-700">수거 후</p>
                    <p className="text-[9px] text-gray-400">깨끗해진 상태</p>
                  </>
                )}
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 px-1">쓰레기 종류</label>
                <select
                  value={trashType}
                  onChange={(e) => setTrashType(e.target.value as TrashType)}
                  className="w-full p-4 border border-gray-200 rounded-2xl text-gray-900 bg-gray-50 focus:ring-2 focus:ring-green-600 outline-none transition-all font-medium"
                >
                  <option value="plastic">플라스틱</option>
                  <option value="styrofoam">스티로폼</option>
                  <option value="fishing_gear">그물/어구</option>
                  <option value="glass">유리</option>
                  <option value="metal">금속</option>
                  <option value="other">기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 px-1">수거량</label>
                <select
                  value={amount}
                  onChange={(e) => setAmount(e.target.value as CleanupAmount)}
                  className="w-full p-4 border border-gray-200 rounded-2xl text-gray-900 bg-gray-50 focus:ring-2 focus:ring-green-600 outline-none transition-all font-medium"
                >
                  <option value="handful">한 줌</option>
                  <option value="one_bag">봉지 하나</option>
                  <option value="large">대량</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <MapPin size={20} className="text-green-600" />
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase">현재 위치</p>
                <p className="font-bold text-sm text-gray-700">
                  {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "위치를 가져오는 중..."}
                </p>
              </div>
            </div>

            <button
              onClick={handleCleanupSubmit}
              disabled={createCleanup.isPending || !coords || !beforePhoto || !afterPhoto}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {createCleanup.isPending && <Loader2 className="animate-spin" size={20} />}
              인증 등록하기
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
      `}</style>
    </MainLayout>
  );
}
