import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Sighting } from "@/types";

interface SightingsResponse {
  sightings: Sighting[];
  total: number;
  page: number;
  limit: number;
}

export const useSightings = (
  params?: { page?: number; limit?: number; status?: string; user_id?: string },
  options?: { enabled?: boolean },
) => {
  return useQuery<SightingsResponse>({
    queryKey: ["sightings", params],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/sightings", { params });
      return data;
    },
    enabled: options?.enabled,
  });
};

export const useSightingDetail = (id: string) => {
  return useQuery<Sighting>({
    queryKey: ["sightings", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/sightings/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateSighting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await apiClient.post("/api/sightings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sightings"] });
    },
  });
};

export const useUpdateSightingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, creature_id }: { id: string; status: string; creature_id?: string }) => {
      const { data } = await apiClient.patch(`/api/sightings/${id}/status`, { status, creature_id });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sightings"] });
      queryClient.invalidateQueries({ queryKey: ["sightings", variables.id] });
    },
  });
};
