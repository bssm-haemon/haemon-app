"use client";

import MainLayout from "@/components/MainLayout";
import PokemonHeader from "@/components/PokemonHeader";
import { useUserDetail } from "@/hooks/useUser";
import { useCleanups, useApproveCleanup, useRejectCleanup } from "@/hooks/useCleanups";
import {
  useCreatures,
  useCreateCreature,
  useUpdateCreature,
  useDeleteCreature,
} from "@/hooks/useCreatures";
import { Creature, CreatureCategory, Rarity } from "@/types";
import { CheckCircle, ShieldCheck, XCircle, Loader2, Sparkles, Fish } from "lucide-react";
import clsx from "clsx";
import { FormEvent, useEffect, useMemo, useState } from "react";

const creatureCategories: { value: CreatureCategory; label: string }[] = [
  { value: "cetacean", label: "고래류" },
  { value: "turtle", label: "거북류" },
  { value: "pinniped", label: "기각류" },
  { value: "fish", label: "어류" },
  { value: "jellyfish", label: "해파리류" },
  { value: "crustacean", label: "갑각류" },
  { value: "mollusk", label: "연체류" },
  { value: "bird", label: "조류" },
];

const rarityOptions: { value: Rarity; label: string }[] = [
  { value: "common", label: "일반" },
  { value: "rare", label: "희귀" },
  { value: "legendary", label: "전설" },
];

export default function AdminPage() {
  const { data: user, isLoading: userLoading } = useUserDetail();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const hasToken = mounted && !!localStorage.getItem("token");
  const isAdmin = !!user?.is_admin;
  const canFetchAdmin = hasToken && isAdmin;

  const { data: pendingCleanups, isLoading: cleanupsLoading } = useCleanups(
    { status: "pending", limit: 20 },
    { enabled: canFetchAdmin },
  );

  const { data: creaturesData, isLoading: creaturesLoading } = useCreatures(undefined, { enabled: canFetchAdmin });

  const approveCleanup = useApproveCleanup();
  const rejectCleanup = useRejectCleanup();

  const createCreature = useCreateCreature();
  const updateCreature = useUpdateCreature();
  const deleteCreature = useDeleteCreature();

  const [newCreature, setNewCreature] = useState<Partial<Creature>>({
    name: "",
    name_en: "",
    category: "fish",
    description: "",
    image_url: "",
    rarity: "common",
    points: 30,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Creature>>({});

  const creatureList = useMemo(() => creaturesData?.creatures ?? [], [creaturesData]);

  const handleApproveCleanup = (id: string) => {
    approveCleanup.mutate(id);
  };

  const handleRejectCleanup = (id: string) => {
    rejectCleanup.mutate(id);
  };

  const handleCreateCreature = (e: FormEvent) => {
    e.preventDefault();
    createCreature.mutate(
      { ...newCreature, points: Number(newCreature.points || 0) },
      {
        onSuccess: () => {
          setNewCreature({
            name: "",
            name_en: "",
            category: "fish",
            description: "",
            image_url: "",
            rarity: "common",
            points: 30,
          });
        },
      },
    );
  };

  const startEditCreature = (creature: Creature) => {
    setEditingId(creature.id);
    setEditForm(creature);
  };

  const handleUpdateCreature = (id: string) => {
    updateCreature.mutate(
      { id, ...editForm, points: Number(editForm.points ?? 0) || 0 },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditForm({});
        },
      },
    );
  };

  const handleDeleteCreature = (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    deleteCreature.mutate(id);
  };

  if (!mounted || userLoading) {
    return (
      <MainLayout>
        <div className="p-6 flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin" size={20} />
          불러오는 중...
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="p-6 space-y-4">
          <PokemonHeader />
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            <p className="font-bold">접근 권한이 없습니다.</p>
            <p className="text-sm mt-1">관리자만 접근할 수 있는 페이지입니다.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 space-y-6">
        <PokemonHeader className="mb-2" />

        <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck size={28} />
            <div>
              <p className="text-sm opacity-90">Admin Console</p>
              <p className="text-2xl font-bold">해몬 운영 패널</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/15 rounded-lg p-3">
              <p className="opacity-90">수거 대기</p>
              <p className="text-xl font-bold">{pendingCleanups?.total ?? 0}</p>
            </div>
            <div className="bg-white/15 rounded-lg p-3">
              <p className="opacity-90">생물 수</p>
              <p className="text-xl font-bold">{creaturesData?.total ?? 0}</p>
            </div>
          </div>
        </div>

        <section className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">수거 승인</h2>
            <span className="text-sm text-gray-500">대기 {pendingCleanups?.total ?? 0}건</span>
          </div>
          {cleanupsLoading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="animate-spin" size={18} />
              불러오는 중...
            </div>
          ) : pendingCleanups?.cleanups?.length ? (
            <div className="space-y-4">
              {pendingCleanups.cleanups.map(cleanup => (
                <div key={cleanup.id} className="border border-gray-200 rounded-xl p-3 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      {cleanup.before_photo_url ? (
                        <img src={cleanup.before_photo_url} alt="Before" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">이미지 없음</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold text-gray-900">{cleanup.location_name || "위치 미기입"}</p>
                      <p className="text-sm text-gray-700">종류: {cleanup.trash_type} / 양: {cleanup.amount}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(cleanup.created_at).toLocaleString()} · AI 신뢰도 {Math.round((cleanup.ai_confidence || 0) * 100)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveCleanup(cleanup.id)}
                      className={clsx(
                        "flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-white",
                        "bg-green-600 hover:bg-green-700 transition-colors",
                        approveCleanup.isPending && "opacity-60 cursor-not-allowed",
                      )}
                      disabled={approveCleanup.isPending}
                    >
                      <CheckCircle size={16} />
                      승인
                    </button>
                    <button
                      onClick={() => handleRejectCleanup(cleanup.id)}
                      className={clsx(
                        "flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-white",
                        "bg-red-500 hover:bg-red-600 transition-colors",
                        rejectCleanup.isPending && "opacity-60 cursor-not-allowed",
                      )}
                      disabled={rejectCleanup.isPending}
                    >
                      <XCircle size={16} />
                      거절
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">승인 대기 중인 수거 인증이 없습니다.</p>
          )}
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">생물 도감 관리</h2>
            <span className="text-sm text-gray-500">총 {creaturesData?.total ?? 0}종</span>
          </div>

          <form onSubmit={handleCreateCreature} className="border border-blue-200 rounded-xl p-4 bg-blue-50 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 font-semibold">
              <Sparkles size={18} />
              새로운 생물 추가
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                value={newCreature.name || ""}
                onChange={e => setNewCreature(prev => ({ ...prev, name: e.target.value }))}
                placeholder="이름 (한글)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                required
                value={newCreature.name_en || ""}
                onChange={e => setNewCreature(prev => ({ ...prev, name_en: e.target.value }))}
                placeholder="이름 (영문)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <select
                value={newCreature.category}
                onChange={e => setNewCreature(prev => ({ ...prev, category: e.target.value as CreatureCategory }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {creatureCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <select
                value={newCreature.rarity}
                onChange={e => setNewCreature(prev => ({ ...prev, rarity: e.target.value as Rarity }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {rarityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <input
                required
                type="number"
                value={newCreature.points ?? 0}
                onChange={e => setNewCreature(prev => ({ ...prev, points: Number(e.target.value) }))}
                placeholder="포인트"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                required
                value={newCreature.image_url || ""}
                onChange={e => setNewCreature(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="이미지 URL"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <textarea
              required
              value={newCreature.description || ""}
              onChange={e => setNewCreature(prev => ({ ...prev, description: e.target.value }))}
              placeholder="설명"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              rows={2}
            />
            <button
              type="submit"
              className={clsx(
                "w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white",
                "bg-blue-600 hover:bg-blue-700 transition-colors",
                createCreature.isPending && "opacity-60 cursor-not-allowed",
              )}
              disabled={createCreature.isPending}
            >
              <Fish size={16} />
              생물 추가
            </button>
          </form>

          <div className="space-y-3">
            {creaturesLoading ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="animate-spin" size={18} />
                목록 불러오는 중...
              </div>
            ) : creatureList.length ? (
              creatureList.map(creature => {
                const isEditing = editingId === creature.id;
                return (
                  <div key={creature.id} className="border border-gray-200 rounded-xl p-3">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={editForm.name || ""}
                            onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          />
                          <input
                            value={editForm.name_en || ""}
                            onChange={e => setEditForm(prev => ({ ...prev, name_en: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          />
                          <select
                            value={editForm.category || "fish"}
                            onChange={e => setEditForm(prev => ({ ...prev, category: e.target.value as CreatureCategory }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          >
                            {creatureCategories.map(cat => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                          <select
                            value={editForm.rarity || "common"}
                            onChange={e => setEditForm(prev => ({ ...prev, rarity: e.target.value as Rarity }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          >
                            {rarityOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={editForm.points ?? 0}
                            onChange={e => setEditForm(prev => ({ ...prev, points: Number(e.target.value) }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          />
                          <input
                            value={editForm.image_url || ""}
                            onChange={e => setEditForm(prev => ({ ...prev, image_url: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                        <textarea
                          value={editForm.description || ""}
                          onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateCreature(creature.id)}
                            className={clsx(
                              "flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-white",
                              "bg-blue-600 hover:bg-blue-700 transition-colors",
                              updateCreature.isPending && "opacity-60 cursor-not-allowed",
                            )}
                            disabled={updateCreature.isPending}
                          >
                            저장
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditForm({});
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{creature.name} ({creature.name_en})</p>
                          <p className="text-xs text-gray-500">
                            {creature.category} · {creature.rarity} · {creature.points}p
                          </p>
                          <p className="text-sm text-gray-700 mt-1 line-clamp-2">{creature.description}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => startEditCreature(creature)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteCreature(creature.id)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">등록된 생물이 없습니다.</p>
            )}
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
