import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Cleanup } from "@/types";

export const useCleanups = () => {
  return useQuery<Cleanup[]>({
    queryKey: ["cleanups"],
    queryFn: async () => {
      const { data } = await apiClient.get("/cleanups");
      return data;
    },
  });
};

export const useCleanupDetail = (id: string) => {
  return useQuery<Cleanup>({
    queryKey: ["cleanups", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/cleanups/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
