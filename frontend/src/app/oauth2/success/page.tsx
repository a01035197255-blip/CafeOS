"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Coffee, Loader2 } from "lucide-react";

export default function OAuth2SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusText, setStatusText] = useState("구글 로그인 정보를 안전하게 처리 중입니다...");

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      setStatusText("토큰 정보가 유효하지 않습니다. 로그인 화면으로 이동합니다.");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    try {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setStatusText("로그인 성공! 메인 페이지로 이동합니다.");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error(error);
      setStatusText("로그인 처리 중 오류가 발생했습니다.");
      setTimeout(() => router.push("/login"), 2000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* 배경 이미지 및 고급스러운 그라데이션 오버레이 */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center filter blur-[2px] scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2560&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/80 to-[#8B4513]/30" />
      </div>

      {/* 중앙 컨텐츠 카드 */}
      <main className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        {/* 상징 아이콘 */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#8B4513] rounded-full blur-lg opacity-50 animate-pulse" />
          <div className="relative bg-[#1A1A1A] border border-[#8B4513]/50 p-4 rounded-2xl text-white shadow-2xl flex items-center justify-center">
            <Coffee size={36} className="text-[#D2B48C]" />
          </div>
        </div>

        {/* 브랜드 로고 */}
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-8">
          Cafe<span className="text-[#D2B48C]">OS</span>
        </h1>

        {/* 상태 카드 (글래스모피즘) */}
        <div className="w-full bg-black/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center shadow-2xl flex flex-col items-center gap-4">
          <Loader2 className="w-6 h-6 text-[#D2B48C] animate-spin" />
          <p className="text-sm text-gray-200 font-medium tracking-wide">
            {statusText}
          </p>
        </div>
      </main>

      {/* 하단 미니 푸터 */}
      <footer className="absolute bottom-6 z-10 text-xs text-gray-500">
        © 2026 CafeOS. All rights reserved.
      </footer>
    </div>
  );
}