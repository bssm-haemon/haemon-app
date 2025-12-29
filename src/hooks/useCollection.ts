import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

// 새로운 Collection 응답 타입 (정적 ID만 포함)
export interface CollectionItem {
    creature_id: string;  // 예: "creature-001"
    discovered_at: string;
    first_sighting_id: string;
}

export interface CollectionResponse {
    collection: CollectionItem[];
    total: number;
}

export interface CollectionStats {
    total_creatures: number;
    discovered_count: number;
    completion_rate: number;
    by_rarity: {
        common: { total: number; discovered: number };
        rare: { total: number; discovered: number };
        legendary: { total: number; discovered: number };
    };
}

export const useCollection = () => {
    return useQuery<CollectionResponse>({
        queryKey: ["collection"],
        queryFn: async () => {
            const { data } = await apiClient.get("/collection");
            return data;
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem("token"),
    });
};

export const useCollectionStats = () => {
    return useQuery<CollectionStats>({
        queryKey: ["collection", "stats"],
        queryFn: async () => {
            const { data } = await apiClient.get("/collection/stats");
            return data;
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem("token"),
    });
};
