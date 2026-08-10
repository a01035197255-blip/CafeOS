"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Coffee, Eye, EyeOff } from "lucide-react";
import { signup, sendEmailCode } from "@/services/auth";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendEmailCode = async () => {
    if (!email) {
      setErrorMessage("이메일을 먼저 입력해주세요.");
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");

    try {
      setSendingEmail(true);
      await sendEmailCode({ email });
      setSuccessMessage("인증 코드가 이메일로 전송되었습니다.");
    } catch (error: any) {
      console.error(error);
      setErrorMessage("인증 코드 전송에 실패했습니다. 이메일을 확인해주세요.");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password || !name || !phone || !birthDate || !code) {
      setErrorMessage("모든 필수 정보를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("이용약관 및 개인정보처리방침에 동의해주세요.");
      return;
    }

    try {
      setLoading(true);

      await signup({
        email,
        password,
        name,
        phone,
        birthDate,
        gender,
        code,
      });

      alert("회원가입이 완료되었습니다!");
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      setErrorMessage("회원가입에 실패했습니다. 입력한 정보를 확인해주세요.");
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
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

      {/* 메인 컨텐츠 영역: items-start를 주어 긴 폼 박스와 상단 정렬을 맞춤 */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start flex-grow">

        {/* 왼쪽 안내 문구 (sticky를 적용해 스크롤 시에도 자연스럽게 위치 고정) */}
        <div className="flex flex-col items-start justify-center lg:sticky lg:top-12">
          <div className="inline-block bg-[#8B4513]/30 border border-[#8B4513]/50 text-[#D2B48C] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4">
            회원가입
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            <span className="text-[#D2B48C]">CafeOS</span>와 함께<br />
            성장하는 카페<br />
            운영을 시작해보세요.
          </h1>
          <p className="text-gray-300 text-sm md:text-base mb-8 leading-relaxed font-light">
            간편한 가입으로 모든 기능을<br />
            무료로 체험해보세요.
          </p>

          <div className="space-y-3 w-full max-w-md">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md">
              <div className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center text-white shrink-0">
                <Coffee size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">간편한 카페 관리</p>
                <p className="text-xs text-gray-400">주문, 재고, 매출을 한눈에 관리</p>
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md">
              <div className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center text-white shrink-0">
                <Coffee size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">실시간 데이터 분석</p>
                <p className="text-xs text-gray-400">정확한 데이터로 더 나은 의사결정</p>
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md">
              <div className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center text-white shrink-0">
                <Coffee size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">안전한 서비스</p>
                <p className="text-xs text-gray-400">소중한 데이터를 안전하게 보호</p>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 회원가입 화이트 카드 박스 */}
        <div className="w-full max-w-md bg-white text-black rounded-3xl p-7 shadow-2xl justify-self-center lg:justify-self-end">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">회원가입</h2>
            <p className="text-xs text-gray-500">정보를 입력하여 가입을 완료하세요.</p>
          </div>

          {errorMessage && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 text-green-600 text-xs rounded-xl">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">이메일</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition"
                />
                <button
                  type="button"
                  onClick={handleSendEmailCode}
                  disabled={sendingEmail}
                  className="px-3 py-2.5 bg-gray-800 hover:bg-black text-white text-xs font-medium rounded-xl whitespace-nowrap transition disabled:opacity-50"
                >
                  {sendingEmail ? "전송 중" : "코드 전송"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">인증 코드</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="이메일로 받은 코드를 입력하세요"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition"
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
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">비밀번호 확인</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">이름</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">전화번호</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">생년월일</label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">성별</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B4513] transition"
              >
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
                <option value="OTHER">기타</option>
              </select>
            </div>

            <div className="flex items-center text-xs text-gray-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-gray-300 text-[#8B4513] focus:ring-[#8B4513]"
                />
                <span>
                  <span className="text-[#8B4513] underline font-medium">이용약관</span> 및 <span className="text-[#8B4513] underline font-medium">개인정보처리방침</span> 동의
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8B4513] hover:bg-[#6F370F] text-white font-medium rounded-xl shadow-md transition text-center disabled:opacity-50 mt-1"
            >
              {loading ? "가입 처리 중..." : "회원가입"}
            </button>
          </form>

          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <span className="relative bg-white px-3 text-xs text-gray-400">또는</span>
          </div>



          <div className="mt-3 text-center text-xs text-gray-500">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-[#8B4513] font-semibold hover:underline">
              로그인
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