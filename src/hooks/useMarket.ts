import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { MarketItem } from "@/types";

interface MarketResponse {
  items: MarketItem[];
  total: number;
  user_points: number;
}

export const useMarket = () => {
  return useQuery<MarketResponse>({
    queryKey: ["market"],
    queryFn: async () => {
      const { data } = await apiClient.get("/market");
      return data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });
};

export const usePurchaseMarket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (creatureIds: string[]) => {
      const { data } = await apiClient.post("/market/purchase", { creature_ids: creatureIds });
      return data as {
        success: boolean;
        purchased: string[];
        total_spent: number;
        remaining_points: number;
        message: string;
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market"] });
      queryClient.invalidateQueries({ queryKey: ["aquarium"] });
    },
  });
};
