import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { User } from "@/types";

export const useUserDetail = () => {
  return useQuery<User>({
    queryKey: ["user-me"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/users/me");
      return data;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem("token"),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { nickname?: string; profile_image?: string }) => {
      const { data } = await apiClient.patch("/api/users/me", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-me"] });
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
  });
};

export const useUserProfile = (userId: string) => {
  return useQuery<User>({
    queryKey: ["users", userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/users/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};
