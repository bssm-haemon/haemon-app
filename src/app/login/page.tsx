"use client";

import { useGoogleLogin } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import React, { useEffect, useRef } from "react";

export default function LoginPage() {
    const router = useRouter();
    const googleLogin = useGoogleLogin();
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    const isProcessing = useRef(false);

    // Handle OAuth callback
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code && !isProcessing.current) {
            isProcessing.current = true;

            // URL에서 code 파라미터 즉시 제거 (무한 루프 방지)
            window.history.replaceState({}, document.title, window.location.pathname);

            // Exchange code for token via backend
            googleLogin.mutate(code, {
                onSuccess: () => {
                    router.push("/");
                },
                onError: (error: any) => {
                    alert("로그인에 실패했습니다: " + error.message);
                    isProcessing.current = false;
                }
            });
        }
    }, []);

    const handleGoogleLogin = () => {
        if (!googleClientId) {
            alert("환경 변수 NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되어 있지 않습니다.");
            return;
        }

        // OAuth 2.0 Authorization Code Flow
        const redirectUri = `${window.location.origin}/login`;
        const scope = "openid email profile";
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${googleClientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent(scope)}&` +
            `access_type=offline&` +
            `prompt=consent`;

        window.location.href = authUrl;
    };

    if (googleLogin.isPending || isProcessing.current) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-400 flex items-center justify-center">
                <div className="text-center text-white">
                    <Loader2 className="animate-spin mx-auto mb-4" size={48} />
                    <p className="text-lg font-semibold">로그인 처리 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-400 flex flex-col items-center justify-center p-6 text-white">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-teal-200 opacity-20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-sm text-center">
                {/* Logo/Icon Area */}
                <div className="mb-8 animate-bounce">
                    <div className="w-24 h-24 bg-white rounded-3xl mx-auto shadow-2xl flex items-center justify-center text-5xl">
                        🌊
                    </div>
                </div>

                {/* Text Area */}
                <h1 className="text-4xl font-extrabold mb-3 tracking-tight">해몬도감</h1>
                <p className="text-blue-50 text-lg mb-10 font-medium opacity-90">
                    바다 생물을 수집하고,<br />깨끗한 바다를 함께 만들어요.
                </p>

                {/* Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={googleLogin.isPending}
                    className="w-full bg-white text-gray-900 font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                    <svg className="w-6 h-6" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        <path fill="none" d="M0 0h48v48H0z" />
                    </svg>
                    <span>Google 계정으로 시작하기</span>
                </button>

                <p className="mt-8 text-blue-100 text-sm opacity-70">
                    계속 진행하면 이용 약관 및<br />개인정보 처리방침에 동의하게 됩니다.
                </p>
            </div>
        </div>
    );
}
