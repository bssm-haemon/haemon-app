import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { RankingItem } from "@/types";

interface RankingResponse {
    rankings: RankingItem[];
    my_rank: number;
    total_users: number;
}

export const useCollectionRanking = (limit: number = 100) => {
    return useQuery<RankingResponse>({
        queryKey: ["rankings-collection", limit],
        queryFn: async () => {
            const { data } = await apiClient.get("/rankings/collection", { params: { limit } });
            return data;
        },
    });
};

export const useCleanupRanking = () => {
    return useQuery<RankingResponse>({
        queryKey: ["rankings-cleanup"],
        queryFn: async () => {
            const { data } = await apiClient.get("/rankings/cleanup");
            return data;
        },
    });
};

export const usePointsRanking = () => {
    return useQuery<RankingResponse>({
        queryKey: ["rankings-points"],
        queryFn: async () => {
            const { data } = await apiClient.get("/rankings/points");
            return data;
        },
    });
};
