import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Badge, MyBadge } from "@/types";

interface BadgesResponse {
    badges: Badge[];
    total: number;
}

interface MyBadgesResponse {
    badges: MyBadge[];
    total: number;
}

export const useAllBadges = () => {
    return useQuery<BadgesResponse>({
        queryKey: ["badges"],
        queryFn: async () => {
            const { data } = await apiClient.get("/badges");
            return data;
        },
    });
};

export const useMyBadges = () => {
    return useQuery<MyBadgesResponse>({
        queryKey: ["my-badges"],
        queryFn: async () => {
            const { data } = await apiClient.get("/badges/my");
            return data;
        },
    });
};

export const useCreateBadge = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (badge: Partial<Badge>) => {
            const { data } = await apiClient.post("/badges", badge);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["badges"] });
        },
    });
};

export const useAwardBadge = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ badge_id, user_id }: { badge_id: string; user_id: string }) => {
            const { data } = await apiClient.post(`/badges/${badge_id}/award/${user_id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-badges"] });
        },
    });
};
