"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import {
  ArrowLeft,
  Bot,
  TrendingUp,
  Utensils,
  Package,
  Users,
  Lightbulb,
  Loader2,
} from "lucide-react";

import { getAiAnalysis } from "@/services/ai";
import type { AiAnalysisResponse } from "@/types/ai";

export default function AiAnalysisPage() {
  const [analysis, setAnalysis] =
    useState<AiAnalysisResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);

        const data = await getAiAnalysis();

        setAnalysis(data);
      } catch (error) {
        console.error("AI 분석 조회 실패:", error);

        setError(
          "AI 분석을 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  // =========================================================
  // 로딩
  // =========================================================

  if (loading) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-[#FAF8F5]">
          <div className="mx-auto flex min-h-[70vh] max-w-[1200px] items-center justify-center">

            <div className="flex flex-col items-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5C3A21] text-white shadow-sm">
                <Loader2
                  size={27}
                  className="animate-spin"
                />
              </div>

              <p className="mt-5 font-semibold text-gray-900">
                AI가 매장 데이터를 분석하고 있습니다
              </p>

              <p className="mt-2 text-sm text-gray-500">
                매출·메뉴·재고·인력 데이터를 종합적으로 분석하는 중입니다.
              </p>

            </div>

          </div>
        </main>
      </>
    );
  }

  // =========================================================
  // 에러
  // =========================================================

  if (error || !analysis) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-[#FAF8F5]">

          <div className="mx-auto max-w-[1200px] px-8 py-10">

            <button
              onClick={() => window.history.back()}
              className="mb-8 flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#5C3A21]"
            >
              <ArrowLeft size={17} />
              돌아가기
            </button>

            <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Bot size={22} />
              </div>

              <p className="mt-4 font-bold text-gray-900">
                AI 분석을 불러올 수 없습니다.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                잠시 후 다시 시도해주세요.
              </p>

            </div>

          </div>

        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#FAF8F5]">

        <div className="mx-auto max-w-[1200px] px-8 py-10">

          {/* =====================================================
              상단
          ===================================================== */}

          <div className="mb-8">

            <button
              onClick={() => window.history.back()}
              className="mb-5 flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#5C3A21]"
            >
              <ArrowLeft size={17} />
              돌아가기
            </button>

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5C3A21] text-white shadow-sm">
                <Bot size={27} />
              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    AI 매장 운영 분석
                  </h1>

                  <span className="rounded-full bg-[#F4EEE9] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#5C3A21]">
                    AI
                  </span>

                </div>

                <p className="mt-1.5 text-sm text-gray-500">
                  CafeOS의 매출·메뉴·재고·인력 데이터를 AI가 종합적으로 분석합니다.
                </p>

              </div>

            </div>

          </div>


          {/* =====================================================
              AI 운영 요약
          ===================================================== */}

          <section className="relative mb-6 overflow-hidden rounded-2xl border border-[#E8DED5] bg-white shadow-sm">

            <div className="absolute left-0 top-0 h-full w-1 bg-[#5C3A21]" />

            <div className="p-7">

              <div className="flex items-start gap-5">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4EEE9] text-[#5C3A21]">
                  <Bot size={21} />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-center gap-2">

                    <h2 className="font-bold text-gray-900">
                      오늘의 AI 운영 진단
                    </h2>

                    <span className="rounded-full bg-[#F7F3EF] px-2 py-0.5 text-[10px] font-semibold text-[#8B735F]">
                      종합 분석
                    </span>

                  </div>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {analysis.summary}
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* =====================================================
              분석 영역
          ===================================================== */}

          <div className="mb-3 flex items-end justify-between">

            <div>

              <h2 className="text-base font-bold text-gray-900">
                운영 데이터 분석
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                CafeOS의 주요 운영 영역을 AI가 분석한 결과입니다.
              </p>

            </div>

          </div>


          {/* =====================================================
              분석 카드
          ===================================================== */}

          <div className="grid gap-5 md:grid-cols-2">

            <AnalysisCard
              number="01"
              icon={<TrendingUp size={20} />}
              title="매출 분석"
              description="최근 매출 흐름과 변화"
              content={analysis.salesAnalysis}
            />

            <AnalysisCard
              number="02"
              icon={<Utensils size={20} />}
              title="메뉴 분석"
              description="인기 메뉴 및 판매 흐름"
              content={analysis.menuAnalysis}
            />

            <AnalysisCard
              number="03"
              icon={<Package size={20} />}
              title="재고 및 운영 분석"
              description="재고 소진 및 발주 위험"
              content={analysis.inventoryAnalysis}
            />

            <AnalysisCard
              number="04"
              icon={<Users size={20} />}
              title="인력 운영 분석"
              description="역할별 업무 및 운영 상태"
              content={analysis.workforceAnalysis}
            />

          </div>


          {/* =====================================================
              AI 운영 개선 제안
          ===================================================== */}

          <section className="mt-7 overflow-hidden rounded-2xl border border-[#E8DED5] bg-white shadow-sm">

            {/* 헤더 */}

            <div className="border-b border-gray-100 px-7 py-6">

              <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5C3A21] text-white">
                  <Lightbulb size={20} />
                </div>

                <div>

                  <h2 className="font-bold text-gray-900">
                    AI 운영 개선 제안
                  </h2>

                  <p className="mt-1.5 text-xs leading-5 text-gray-500">
                    매출·메뉴·재고·인력 데이터를 종합하여
                    현재 우선적으로 확인할 운영 사항을 제안합니다.
                  </p>

                </div>

              </div>

            </div>


            {/* 추천 목록 */}

            <div className="p-6">

              <div className="grid gap-3 md:grid-cols-2">

                {analysis.recommendations?.map(
                  (recommendation, index) => (

                    <div
                      key={index}
                      className="flex gap-4 rounded-xl border border-[#EEE7E1] bg-[#FAF8F5] px-5 py-5 transition hover:border-[#DCCFC4] hover:bg-[#F8F4F0]"
                    >

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#5C3A21] text-[11px] font-bold text-white">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <p className="pt-0.5 text-sm leading-6 text-gray-700">
                        {recommendation}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

          </section>


          {/* =====================================================
              하단
          ===================================================== */}

          <div className="mt-5 flex items-center justify-between px-1">

            <p className="text-xs text-gray-400">
              AI 분석 결과는 CafeOS에 저장된 운영 데이터를 기반으로 생성됩니다.
            </p>

            <p className="text-xs font-semibold tracking-wide text-[#8B735F]">
              CafeOS AI
            </p>

          </div>

        </div>

      </main>
    </>
  );
}


// =============================================================
// 분석 카드
// =============================================================

function AnalysisCard({
  number,
  icon,
  title,
  description,
  content,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  content: string;
}) {
  return (
    <section className="group rounded-2xl border border-[#E8DED5] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-[2px] hover:border-[#DCCFC4] hover:shadow-md">

      {/* 카드 상단 */}

      <div className="flex items-start justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4EEE9] text-[#5C3A21] transition group-hover:bg-[#5C3A21] group-hover:text-white">
            {icon}
          </div>

          <div>

            <h3 className="font-bold text-gray-900">
              {title}
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              {description}
            </p>

          </div>

        </div>

        <span className="text-xs font-bold tracking-wide text-[#D5C8BD]">
          {number}
        </span>

      </div>


      {/* 구분선 */}

      <div className="my-5 h-px bg-gray-100" />


      {/* 분석 내용 */}

      <p className="text-sm leading-7 text-gray-600">
        {content}
      </p>

    </section>
  );
}