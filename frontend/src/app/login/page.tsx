"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Coffee, Eye, EyeOff } from "lucide-react";
import { login } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const response = await login({ email, password });

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      router.push("/");
    } catch (error: any) {
      console.error(error);
      setErrorMessage("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col justify-between relative overflow-x-hidden font-sans">
      {/* 배경 이미지 및 어두운 오버레이 */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2560&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40" />
      </div>

      {/* 상단 로고 헤더 */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="bg-[#8B4513] p-2 rounded-full text-white shadow-md">
            <Coffee size={22} />
          </div>
          {/* 요청하신 브라운 컬러 적용 */}
          <span className="text-xl font-bold tracking-tight text-[#D2B48C]">CafeOS</span>
        </Link>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-grow">

        {/* 왼쪽 안내 문구 */}
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            환영합니다!<br />
            {/* 브라운 컬러 포인트 */}
            <span className="text-[#D2B48C]">CafeOS와 함께</span><br />
            스마트한 카페 운영을<br />
            시작해보세요.
          </h1>
          <p className="text-gray-300 text-base md:text-lg mb-10 leading-relaxed font-light">
            주문, 재고, 매출, 직원 관리까지<br />
            모든 것을 하나의 시스템으로.
          </p>

          <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md">
            <div className="w-12 h-12 bg-[#8B4513] rounded-full flex items-center justify-center text-white shrink-0">
              <Coffee size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">CafeOS AI 시스템</p>
              <p className="text-xs text-gray-400">주문 등록만으로 자동 분석이 시작됩니다.</p>
            </div>
          </div>
        </div>

        {/* 오른쪽 로그인 카드 박스 */}
        <div className="w-full max-w-md bg-white text-black rounded-3xl p-8 shadow-2xl justify-self-center lg:justify-self-end">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">로그인</h2>
            <p className="text-xs text-gray-500">계정에 로그인하여 계속하세요.</p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-[#8B4513] focus:ring-[#8B4513]" />
                로그인 상태 유지
              </label>
              <Link href="/forgot-password" className="hover:text-[#8B4513] transition">
                비밀번호를 잊으셨나요?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#8B4513] hover:bg-[#6F370F] text-white font-medium rounded-xl shadow-md transition text-center disabled:opacity-50 mt-2"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <span className="relative bg-white px-3 text-xs text-gray-400">또는</span>
          </div>

          <button
            type="button"
            className="w-full py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition text-gray-700"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.17 21.31 7.26 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.39-1.5-.39-2.24s.14-1.52.39-2.24V6.6H1.19C.43 8.13 0 9.87 0 11.7s.43 3.57 1.19 5.1l4.08-2.56z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.26 0 3.17 2.69 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            Google로 로그인
          </button>

          <div className="mt-5 text-center text-xs text-gray-500">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-[#8B4513] font-semibold hover:underline">
              회원가입
            </Link>
          </div>

        </div>

      </main>

      {/* 하단 푸터 */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <p>© 2026 CafeOS. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/terms" className="hover:text-white transition">이용약관</Link>
          <Link href="/privacy" className="hover:text-white transition">개인정보처리방침</Link>
          <Link href="/support" className="hover:text-white transition">고객센터</Link>
        </div>
      </footer>
    </div>
  );
}