import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { AquariumItem } from "@/types";

interface AquariumResponse {
  aquarium: AquariumItem[];
  total: number;
}

export const useAquarium = () => {
  return useQuery<AquariumResponse>({
    queryKey: ["aquarium"],
    queryFn: async () => {
      const { data } = await apiClient.get("/aquarium");
      return data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });
};

export const useRemoveAquarium = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (creatureId: string) => {
      const { data } = await apiClient.delete(`/aquarium/${creatureId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aquarium"] });
      queryClient.invalidateQueries({ queryKey: ["market"] });
    },
  });
};
