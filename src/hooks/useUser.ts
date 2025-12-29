import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { User } from "@/types";

export const useUser = () => {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await apiClient.get("/users/me");
      return data;
    },
  });
};

export const useUserProfile = (userId: string) => {
  return useQuery<User>({
    queryKey: ["users", userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/users/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};
