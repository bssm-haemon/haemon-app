import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { User } from "@/types";

export const useGoogleLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (authCode: string) => {
            // 백엔드가 code 필드를 기대하는 경우
            const { data } = await apiClient.post("/auth/google", { code: authCode });
            return data;
        },
        onSuccess: (data) => {
            localStorage.setItem("token", data.access_token);
            queryClient.setQueryData(["user"], data.user);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await apiClient.post("/auth/logout");
        },
        onSuccess: () => {
            localStorage.removeItem("token");
            queryClient.setQueryData(["user"], null);
            queryClient.clear();
        },
    });
};

export const useMe = () => {
    return useQuery<User>({
        queryKey: ["auth-me"],
        queryFn: async () => {
            const { data } = await apiClient.get("/auth/me");
            return data;
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem("token"),
    });
};
