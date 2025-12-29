"use client";

import { useGoogleLogin } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const googleLogin = useGoogleLogin();
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code && !isProcessing) {
            setIsProcessing(true);
            window.history.replaceState({}, document.title, window.location.pathname);

            googleLogin.mutate(code, {
                onSuccess: () => {
                    router.push("/");
                },
                onError: (error: unknown) => {
                    const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
                    alert("로그인에 실패했습니다: " + message);
                    setIsProcessing(false);
                },
            });
        }
    }, [googleLogin, router, isProcessing]);

    const handleGoogleLogin = () => {
        if (!googleClientId) {
            alert("환경 변수 NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되어 있지 않습니다.");
            return;
        }

        const redirectUri = `${window.location.origin}/login`;
        const scope = "openid email profile";
        const authUrl =
            `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${googleClientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent(scope)}&` +
            `access_type=offline&` +
            `prompt=consent`;

        window.location.href = authUrl;
    };

    if (googleLogin.isPending || isProcessing) {
        return (
            <div
                className="min-h-screen flex items-center justify-center relative"
                style={{ backgroundImage: "url(/loginPageBackground.png)", backgroundSize: "cover", backgroundPosition: "center" }}
            >
                <div className="absolute inset-0 bg-black/40" aria-hidden />
                <div className="relative z-10 text-center text-white flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin" size={48} />
                    <p className="text-lg font-semibold">로그인 처리 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center relative p-6"
            style={{ backgroundImage: "url(/loginPageBackground.png)", backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <div className="absolute inset-0 bg-black/40" aria-hidden />
            <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-10">
                <Image
                    src="/FullLogo.png"
                    alt="해몬도감 로고"
                    width={320}
                    height={120}
                    priority
                    className="drop-shadow-2xl"
                />
                <button
                    onClick={handleGoogleLogin}
                    disabled={googleLogin.isPending}
                    className="w-full bg-white text-gray-900 font-bold py-4 px-6 hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                    <svg className="w-6 h-6" viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        <path fill="none" d="M0 0h48v48H0z" />
                    </svg>
                    <span>Google 계정으로 시작하기</span>
                </button>
            </div>
        </div>
    );
}
