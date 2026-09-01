"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import {
  ArrowLeft,
  Bot,
  TrendingUp,
  Utensils,
  Package,
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
        console.error(
          "AI 분석 조회 실패:",
          error
        );

        setError(
          "AI 분석을 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF8F5]">

        <div className="mx-auto flex min-h-[70vh] max-w-[1200px] items-center justify-center">

          <div className="flex flex-col items-center gap-4">

            <Loader2
              size={36}
              className="animate-spin text-[#5C3A21]"
            />

            <p className="text-sm text-gray-500">
              AI가 매장 데이터를 분석하고 있습니다...
            </p>

          </div>

        </div>

      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="min-h-screen bg-[#FAF8F5]">

        <div className="mx-auto max-w-[1200px] px-8 py-10">

          <button
            onClick={() => window.history.back()}
            className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-[#5C3A21]"
          >
            <ArrowLeft size={17} />
            돌아가기
          </button>

          <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">

            <p className="font-bold text-gray-900">
              AI 분석을 불러올 수 없습니다.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              잠시 후 다시 시도해주세요.
            </p>

          </div>

        </div>

      </main>
    );
  }

  return (

      <>
                <Header />
    <main className="min-h-screen bg-[#FAF8F5]">

      <div className="mx-auto max-w-[1200px] px-8 py-10">

        {/* =========================
            상단
        ========================= */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <button
              onClick={() => window.history.back()}
              className="mb-4 flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#5C3A21]"
            >
              <ArrowLeft size={17} />
              돌아가기
            </button>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5C3A21] text-white shadow-sm">
                <Bot size={24} />
              </div>

              <div>

                <h1 className="text-2xl font-extrabold text-gray-900">
                  AI 매장 운영 분석
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  CafeOS의 매출 및 운영 데이터를 AI가 분석합니다.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =========================
            전체 요약
        ========================= */}

        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-4 flex items-center gap-2">

            <Bot
              size={19}
              className="text-[#5C3A21]"
            />

            <h2 className="font-bold text-gray-900">
              AI 운영 요약
            </h2>

          </div>

          <p className="text-sm leading-7 text-gray-600">
            {analysis.summary}
          </p>

        </section>

        {/* =========================
            분석 카드
        ========================= */}

        <div className="grid gap-6 md:grid-cols-3">

          {/* 매출 */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-4 flex items-center gap-2">

              <TrendingUp
                size={19}
                className="text-[#5C3A21]"
              />

              <h2 className="font-bold text-gray-900">
                매출 분석
              </h2>

            </div>

            <p className="text-sm leading-7 text-gray-600">
              {analysis.salesAnalysis}
            </p>

          </section>

          {/* 메뉴 */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-4 flex items-center gap-2">

              <Utensils
                size={19}
                className="text-[#5C3A21]"
              />

              <h2 className="font-bold text-gray-900">
                메뉴 분석
              </h2>

            </div>

            <p className="text-sm leading-7 text-gray-600">
              {analysis.menuAnalysis}
            </p>

          </section>

          {/* 재고 */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-4 flex items-center gap-2">

              <Package
                size={19}
                className="text-[#5C3A21]"
              />

              <h2 className="font-bold text-gray-900">
                재고 및 운영 분석
              </h2>

            </div>

            <p className="text-sm leading-7 text-gray-600">
              {analysis.inventoryAnalysis}
            </p>

          </section>

        </div>

        {/* =========================
            추천사항
        ========================= */}

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">

          <div className="mb-5 flex items-center gap-2">

            <Lightbulb
              size={19}
              className="text-[#5C3A21]"
            />

            <h2 className="font-bold text-gray-900">
              AI 운영 개선 제안
            </h2>

          </div>

          <p className="mt-1 text-xs text-gray-500">
                        매출·메뉴·재고 데이터를 종합 분석하여 현재 매장의 우선 업무를 제안합니다.
                      </p>
          </div>

          <div className="space-y-3">

            {analysis.recommendations?.map(
              (recommendation, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl bg-[#FAF8F5] px-4 py-4"
                >

                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5C3A21] text-xs font-bold text-white">
                    {index + 1}
                  </div>

                  <p className="text-sm leading-6 text-gray-700">
                    {recommendation}
                  </p>

                </div>
              )
            )}

          </div>

        </section>

      </div>

    </main>
    </>
  );
}