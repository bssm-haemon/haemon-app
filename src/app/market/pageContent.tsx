"use client";

import MainLayout from "@/components/MainLayout";
import PokemonHeader from "@/components/PokemonHeader";
import { useMarket, usePurchaseMarket } from "@/hooks/useMarket";
import { useAquarium } from "@/hooks/useAquarium";
import { useUserDetail } from "@/hooks/useUser";
import { MarketItem } from "@/types";
import { useMemo, useState } from "react";
import Image from "next/image";
import { ShoppingBag, PiggyBank, Sparkles, CheckCircle2, Coins, Fish } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { getCreatureById } from "@/data/creatures";

export function MarketPageContent() {
  const { data: marketData, isLoading } = useMarket();
  const { data: aquariumData } = useAquarium();
  const { data: user } = useUserDetail();
  const purchaseMutation = usePurchaseMarket();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  const userPoints = marketData?.user_points ?? user?.points ?? 0;

  const availableItems = useMemo(() => marketData?.items ?? [], [marketData]);

  const toggleSelect = (id: string, disabled?: boolean) => {
    if (disabled) return;
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  const totalPrice = selectedIds.reduce((sum, id) => {
    const item = availableItems.find(c => c.creature_id === id);
    return sum + (item?.price || 0);
  }, 0);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2500);
  };

  const handlePurchase = () => {
    if (!selectedIds.length) {
      showToast("구매할 포캣몬을 선택하세요.");
      return;
    }
    if (totalPrice > userPoints) {
      showToast("포인트가 부족합니다.");
      return;
    }

    purchaseMutation.mutate(selectedIds, {
      onSuccess: (data) => {
        showToast(data?.message || "구매가 완료되었습니다!");
        setSelectedIds([]);
      },
      onError: (error: unknown) => {
        const axiosError = error as { response?: { data?: { detail?: string } } };
        const detail = axiosError.response?.data?.detail;
        showToast(detail || "구매 중 오류가 발생했습니다.");
      },
    });
  };

  return (
    <>
      <MainLayout>
        <div className="p-4 pb-24">
          <PokemonHeader className="mb-4" />

          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl p-5 text-white shadow-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-bold opacity-80">보유 포인트</p>
                <p className="text-4xl font-black">{userPoints.toLocaleString()}p</p>
              </div>
              <PiggyBank size={44} className="text-yellow-200 drop-shadow" />
            </div>
            <div className="flex justify-between text-xs mt-3 opacity-90">
              <span>아쿠아리움: {aquariumData?.total ?? 0}마리</span>
              <Link href="/aquarium" className="underline font-semibold text-yellow-100">내 아쿠아리움 보기</Link>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <ShoppingBag size={22} className="text-blue-600" /> 포캣몬 마켓
            </h1>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
              <Coins size={16} className="text-amber-500" />
              <span>선택: {selectedIds.length}마리 / {totalPrice}p</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {isLoading && (
              <div className="col-span-2 text-center text-gray-500">불러오는 중...</div>
            )}
            {!isLoading && availableItems.length === 0 && (
              <div className="col-span-2 text-center text-gray-500">구매 가능한 포캣몬이 없습니다.</div>
            )}
            {availableItems.map((item: MarketItem) => {
              const isSelected = selectedIds.includes(item.creature_id);
              const alreadyOwned = item.in_aquarium;
              const disabled = purchaseMutation.isPending;
              const staticCreature = getCreatureById(item.creature_id);
              const imageSrc =
                item.image_url && item.image_url.trim().length > 0
                  ? item.image_url
                  : staticCreature?.image_path && staticCreature.image_path.trim().length > 0
                    ? staticCreature.image_path
                    : `/poketmon/${staticCreature?.name || "돌고래"}.png`;
              return (
                <div
                  key={item.creature_id}
                  className={clsx(
                    "rounded-2xl border-2 p-3 bg-white shadow-sm transition-all cursor-pointer h-full flex flex-col gap-2",
                    isSelected ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-blue-200",
                    disabled && "opacity-60 cursor-not-allowed"
                  )}
                  onClick={() => toggleSelect(item.creature_id, disabled)}
                >
                  <div className="relative w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                    <Image src={imageSrc} alt={item.name} fill className="object-contain p-4" />
                    {alreadyOwned && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-full inline-flex items-center gap-1">
                        <CheckCircle2 size={10} /> 소장
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                      <p className="text-[10px] uppercase text-gray-500">{item.name_en}</p>
                    </div>
                    <span
                      className={clsx(
                        "text-xs px-2 py-1 rounded-full font-bold",
                        item.rarity === "legendary"
                          ? "bg-purple-100 text-purple-700"
                          : item.rarity === "rare"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      )}
                    >
                      {item.rarity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-blue-600">
                    <span className="flex items-center gap-1">
                      <Fish size={16} className="text-blue-500" /> {item.category}
                    </span>
                    <span>{item.price}p</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handlePurchase}
            disabled={purchaseMutation.isPending || !selectedIds.length}
            className="mt-6 w-full py-4 rounded-2xl font-black text-white text-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={20} /> 선택한 포캣몬 구매하기
          </button>
          <div className="mt-3 text-center">
            <Link href="/aquarium" className="text-sm font-semibold text-blue-700 underline">
              내 아쿠아리움 바로가기
            </Link>
          </div>
        </div>
      </MainLayout>
      {toast.visible && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm md:max-w-md animate-slide-up">
          <div className="relative overflow-hidden rounded-2xl border-4 border-yellow-300 bg-gradient-to-r from-yellow-200 via-amber-100 to-yellow-200 shadow-[0_10px_25px_rgba(0,0,0,0.15)] px-4 py-3 text-sm md:text-base font-bold text-gray-900 text-center">
            <div className="absolute inset-0 pointer-events-none opacity-20" />
            <div className="relative flex items-center justify-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-white font-black shadow-inner">!</span>
              <span className="drop-shadow-sm">{toast.message}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
