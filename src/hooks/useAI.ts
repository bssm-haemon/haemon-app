import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { CreatureCategory, Rarity, TrashType } from "@/types";

export const useAIClassifyCreature = () => {
    return useMutation({
        mutationFn: async (photo: File) => {
            const formData = new FormData();
            formData.append("photo", photo);
            const { data } = await apiClient.post("/ai/classify/creature", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data as {
                suggested_creature: string;
                category: CreatureCategory;
                confidence: number;
                rarity: Rarity;
                is_confident: boolean;
            };
        },
    });
};

export const useAIClassifyTrash = () => {
    return useMutation({
        mutationFn: async (photo: File) => {
            const formData = new FormData();
            formData.append("photo", photo);
            const { data } = await apiClient.post("/ai/classify/trash", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data as {
                trash_type: TrashType;
                confidence: number;
                has_trash: boolean;
            };
        },
    });
};

export const useAIVerifyCleanup = () => {
    return useMutation({
        mutationFn: async ({ before_photo, after_photo }: { before_photo: File; after_photo: File }) => {
            const formData = new FormData();
            formData.append("before_photo", before_photo);
            formData.append("after_photo", after_photo);
            const { data } = await apiClient.post("/ai/verify/cleanup", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data as {
                is_valid: boolean;
                before_had_trash: boolean;
                after_has_trash: boolean;
                confidence: number;
            };
        },
    });
};

export const useAICheckDuplicate = () => {
    return useMutation({
        mutationFn: async (photo: File) => {
            const formData = new FormData();
            formData.append("photo", photo);
            const { data } = await apiClient.post("/ai/check-duplicate", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data as {
                is_duplicate: boolean;
                similar_image_id: string | null;
                hash: string;
            };
        },
    });
};
