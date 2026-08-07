import Link from "next/link";
import { Coffee, BarChart3, Package, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col justify-between relative overflow-x-hidden font-sans">
      {/* 선명한 배경 이미지 및 어두운 오버레이 레이어 */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2560&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40" />
      </div>

      {/* 헤더 네비게이션 */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-[#8B4513] p-2 rounded-full text-white shadow-md">
            <Coffee size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">CafeOS</span>
        </div>

        <div>
          <Link
            href="/login"
            className="px-5 py-2 border border-white/30 rounded-full text-sm font-medium hover:bg-white/10 transition"
          >
            로그인
          </Link>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 pt-12 pb-24 flex flex-col items-start">
        <div className="inline-block bg-[#5C3A21]/90 border border-[#8B4513] text-[#F3E5AB] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-md shadow-sm">
          카페 운영을 더 쉽고 스마트하게
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          카페 운영의 모든 것,<br />
          <span className="text-white">CafeOS 하나로</span>
        </h1>

        <p className="text-gray-200 text-base md:text-lg max-w-xl mb-10 leading-relaxed font-light">
          주문, 재고, 매출, 직원 관리까지<br />
          효율적인 카페 운영을 경험해보세요.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/login"
            className="px-8 py-3.5 bg-[#8B4513] hover:bg-[#6F370F] text-white font-medium rounded-xl shadow-lg transition text-center"
          >
            지금 시작하기
          </Link>
          <Link
            href="#features"
            className="px-8 py-3.5 bg-black/40 hover:bg-black/60 border border-white/20 text-white font-medium rounded-xl backdrop-blur-md transition text-center"
          >
            기능 둘러보기
          </Link>
        </div>
      </main>

      {/* 하단 카드 섹션 (문구 보완) */}
      <section className="relative z-20 bg-white text-black rounded-t-[2.5rem] pt-12 pb-16 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* 카드 1 */}
          <div className="bg-[#FAF6F0] p-6 rounded-2xl flex flex-col items-center text-center border border-[#F0E6D8] transition hover:shadow-md">
            <div className="w-14 h-14 bg-[#F3E5AB]/70 rounded-full flex items-center justify-center text-[#5C3A21] mb-4">
              <Coffee size={28} />
            </div>
            <h3 className="font-bold text-lg mb-1 text-gray-900">POS 주문 관리</h3>
            <p className="text-xs text-gray-600 leading-relaxed">터치 몇 번으로 주문부터 결제까지 빠르게 처리합니다.</p>
          </div>

          {/* 카드 2 */}
          <div className="bg-[#FAF6F0] p-6 rounded-2xl flex flex-col items-center text-center border border-[#F0E6D8] transition hover:shadow-md">
            <div className="w-14 h-14 bg-[#F3E5AB]/70 rounded-full flex items-center justify-center text-[#5C3A21] mb-4">
              <BarChart3 size={28} />
            </div>
            <h3 className="font-bold text-lg mb-1 text-gray-900">실시간 매출 및 리포트</h3>
            <p className="text-xs text-gray-600 leading-relaxed"> 일별·월별 매출과 인기 메뉴를 그래프로 확인할 수 있습니다.</p>
          </div>

          {/* 카드 3 */}
          <div className="bg-[#FAF6F0] p-6 rounded-2xl flex flex-col items-center text-center border border-[#F0E6D8] transition hover:shadow-md">
            <div className="w-14 h-14 bg-[#F3E5AB]/70 rounded-full flex items-center justify-center text-[#5C3A21] mb-4">
              <Package size={28} />
            </div>
            <h3 className="font-bold text-lg mb-1 text-gray-900">자동 재고 소모 알림</h3>
            <p className="text-xs text-gray-600 leading-relaxed">원두와 우유 등 재고를 실시간으로
                                                                   관리하고 부족 시 알림을 제공합니다.</p>
          </div>

          {/* 카드 4 */}
          <div className="bg-[#FAF6F0] p-6 rounded-2xl flex flex-col items-center text-center border border-[#F0E6D8] transition hover:shadow-md">
            <div className="w-14 h-14 bg-[#F3E5AB]/70 rounded-full flex items-center justify-center text-[#5C3A21] mb-4">
              <Users size={28} />
            </div>
            <h3 className="font-bold text-lg mb-1 text-gray-900">직원 근태 및 권한 설정</h3>
            <p className="text-xs text-gray-600 leading-relaxed">직원별 권한 설정과 근무 관리를
                                                                   간편하게 할 수 있습니다.</p>
          </div>

        </div>
      </section>
    </div>
  );
}