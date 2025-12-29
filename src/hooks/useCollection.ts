import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { CollectionItem } from "@/types";

interface CollectionResponse {
    collection: CollectionItem[];
    total: number;
}

interface CollectionStats {
    total_creatures: number;
    discovered_count: number;
    completion_rate: number;
    by_rarity: {
        [key: string]: {
            total: number;
            discovered: number;
        };
    };
}

export const useCollection = () => {
    return useQuery<CollectionResponse>({
        queryKey: ["collection"],
        queryFn: async () => {
            const { data } = await apiClient.get("/collection");
            return data;
        },
    });
};

export const useCollectionStats = () => {
    return useQuery<CollectionStats>({
        queryKey: ["collection-stats"],
        queryFn: async () => {
            const { data } = await apiClient.get("/collection/stats");
            return data;
        },
    });
};
