import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Cleanup } from "@/types";

interface CleanupsResponse {
  cleanups: Cleanup[];
  total: number;
  page: number;
  limit: number;
}

export const useCleanups = (
  params?: { page?: number; limit?: number; status?: string; user_id?: string; trash_type?: string },
  options?: { enabled?: boolean },
) => {
  return useQuery<CleanupsResponse>({
    queryKey: ["cleanups", params],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/cleanups", { params });
      return data;
    },
    enabled: options?.enabled,
  });
};

export const useCleanupDetail = (id: string) => {
  return useQuery<Cleanup>({
    queryKey: ["cleanups", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/cleanups/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateCleanup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await apiClient.post("/api/cleanups", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleanups"] });
    },
  });
};

export const useApproveCleanup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch(`/api/cleanups/${id}/approve`);
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["cleanups"] });
      queryClient.invalidateQueries({ queryKey: ["cleanups", id] });
    },
  });
};

export const useRejectCleanup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch(`/api/cleanups/${id}/reject`);
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["cleanups"] });
      queryClient.invalidateQueries({ queryKey: ["cleanups", id] });
    },
  });
};
