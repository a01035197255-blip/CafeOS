"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Coffee } from "lucide-react";
import {
  sendPasswordResetCode,
  verifyPasswordResetCode,
  resetPassword
} from "@/services/auth";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: 계정 확인, 2: 인증번호 확인, 3: 새 비밀번호 설정, 4: 완료
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 1단계: 인증번호 전송 요청
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await sendPasswordResetCode({ email, phone });
      setStep(2);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "인증번호 전송에 실패했습니다. 입력 정보를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 2단계: 인증번호 확인 요청
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await verifyPasswordResetCode({ email, code });
      setStep(3);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "인증번호가 일치하지 않거나 만료되었습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 3단계: 새 비밀번호 설정 요청
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await resetPassword({ email, newPassword });
      setStep(4);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "비밀번호 재설정에 실패했습니다.");
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
          <span className="text-xl font-bold tracking-tight text-white">CafeOS</span>
        </Link>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-grow">

        {/* 왼쪽 안내 문구 */}
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            비밀번호 찾기<br />
            회원님의 계정을<br />
            <span className="text-[#D2B48C]">안전하게</span> 보호합니다.
          </h1>
          <p className="text-gray-300 text-base md:text-lg mb-10 leading-relaxed font-light">
            가입하신 이메일과 휴대폰 번호를 입력하시면<br />
            비밀번호 재설정 안내를 도와드릴게요.
          </p>

          <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md">
            <div className="w-12 h-12 bg-[#8B4513] rounded-full flex items-center justify-center text-white shrink-0">
              <Coffee size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">도움이 필요하신가요?</p>
              <p className="text-xs text-gray-400">고객센터로 문의하시면 친절히 안내해드리겠습니다.</p>
            </div>
          </div>
        </div>

        {/* 오른쪽 비밀번호 찾기 카드 박스 */}
        <div className="w-full max-w-md bg-white text-black rounded-3xl p-8 shadow-2xl justify-self-center lg:justify-self-end">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">비밀번호 찾기</h2>
            <p className="text-xs text-gray-500">계정을 확인하고 비밀번호를 재설정합니다.</p>
          </div>

          {/* 4단계 스텝 바 */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute top-4 left-4 right-4 h-[2px] bg-gray-200 -z-0" />
            {[
              { num: 1, label: "계정 확인" },
              { num: 2, label: "인증번호" },
              { num: 3, label: "새 비밀번호" },
              { num: 4, label: "완료" },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#8B4513] text-white shadow-md'
                    : step > s.num
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {s.num}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${step === s.num ? 'text-[#8B4513]' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* Step 1: 계정 정보 입력 */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="가입하신 이메일을 입력하세요"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">휴대폰 번호</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="- 없이 숫자만 입력하세요"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition"
                />
                <p className="text-[11px] text-gray-400 mt-1">예: 01012345678</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#8B4513] hover:bg-[#6F370F] text-white font-medium rounded-xl shadow-md transition text-center disabled:opacity-50 mt-2"
              >
                {loading ? "전송 중..." : "인증번호 보내기"}
              </button>
            </form>
          )}

          {/* Step 2: 인증번호 확인 */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">인증번호</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="인증번호를 입력하세요"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#8B4513] hover:bg-[#6F370F] text-white font-medium rounded-xl shadow-md transition text-center disabled:opacity-50 mt-2"
              >
                {loading ? "확인 중..." : "인증번호 확인"}
              </button>
            </form>
          )}

          {/* Step 3: 새 비밀번호 설정 */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">새 비밀번호</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">새 비밀번호 확인</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 한번 더 입력하세요"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#8B4513] hover:bg-[#6F370F] text-white font-medium rounded-xl shadow-md transition text-center disabled:opacity-50 mt-2"
              >
                {loading ? "변경 중..." : "비밀번호 재설정"}
              </button>
            </form>
          )}

          {/* Step 4: 완료 */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-lg font-bold text-gray-900">비밀번호 변경 완료</h3>
              <p className="text-xs text-gray-500">
                비밀번호가 성공적으로 변경되었습니다.<br />새로운 비밀번호로 로그인해주세요.
              </p>
              <Link
                href="/login"
                className="inline-block w-full py-3.5 bg-[#8B4513] hover:bg-[#6F370F] text-white font-medium rounded-xl shadow-md transition text-center text-sm mt-4"
              >
                로그인 하러 가기
              </Link>
            </div>
          )}

          {step < 4 && (
            <div className="mt-5 text-center text-xs text-gray-500">
              <Link href="/login" className="hover:text-[#8B4513] transition">
                ← 로그인 화면으로 돌아가기
              </Link>
            </div>
          )}

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