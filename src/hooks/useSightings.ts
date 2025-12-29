import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Sighting } from "@/types";

export const useSightings = () => {
  return useQuery<Sighting[]>({
    queryKey: ["sightings"],
    queryFn: async () => {
      const { data } = await apiClient.get("/sightings");
      return data;
    },
  });
};

export const useSightingDetail = (id: string) => {
  return useQuery<Sighting>({
    queryKey: ["sightings", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/sightings/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
