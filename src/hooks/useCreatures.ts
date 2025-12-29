import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Creature, CreatureCategory, Rarity } from "@/types";

interface CreaturesResponse {
    creatures: Creature[];
    total: number;
}

export const useCreatures = (params?: { category?: CreatureCategory; rarity?: Rarity }) => {
    return useQuery<CreaturesResponse>({
        queryKey: ["creatures", params],
        queryFn: async () => {
            const { data } = await apiClient.get("/creatures", { params });
            return data;
        },
    });
};

export const useCreatureDetail = (id: string) => {
    return useQuery<Creature>({
        queryKey: ["creatures", id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/creatures/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useCreateCreature = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (creature: Partial<Creature>) => {
            const { data } = await apiClient.post("/creatures", creature);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["creatures"] });
        },
    });
};

export const useUpdateCreature = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...creature }: Partial<Creature> & { id: string }) => {
            const { data } = await apiClient.put(`/creatures/${id}`, creature);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["creatures"] });
            queryClient.invalidateQueries({ queryKey: ["creatures", variables.id] });
        },
    });
};

export const useDeleteCreature = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/creatures/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["creatures"] });
        },
    });
};
