import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

interface SightingMarker {
    id: string;
    latitude: number;
    longitude: number;
    type: "sighting";
    created_at: string;
    creature_name: string;
    rarity: string;
    photo_url: string;
}

interface CleanupMarker {
    id: string;
    latitude: number;
    longitude: number;
    type: "cleanup";
    created_at: string;
    trash_type: string;
    amount: string;
}

type MapMarker = SightingMarker | CleanupMarker;

interface MarkersResponse<T> {
    markers: T[];
    total: number;
}

export const useSightingMarkers = (params?: { status?: string; category?: string; rarity?: string; limit?: number }) => {
    return useQuery<MarkersResponse<SightingMarker>>({
        queryKey: ["map-sightings", params],
        queryFn: async () => {
            const { data } = await apiClient.get("/maps/sightings", { params });
            return data;
        },
    });
};

export const useCleanupMarkers = (params?: { status?: string; trash_type?: string; limit?: number }) => {
    return useQuery<MarkersResponse<CleanupMarker>>({
        queryKey: ["map-cleanups", params],
        queryFn: async () => {
            const { data } = await apiClient.get("/maps/cleanups", { params });
            return data;
        },
    });
};

export const useHeatmap = (type: "sighting" | "cleanup" | "combined" = "combined") => {
    return useQuery({
        queryKey: ["map-heatmap", type],
        queryFn: async () => {
            const { data } = await apiClient.get("/maps/heatmap", { params: { type } });
            return data;
        },
    });
};
