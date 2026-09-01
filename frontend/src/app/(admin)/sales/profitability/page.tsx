"use client";

import { useEffect, useState } from "react";
import { getProfitability } from "@/services/profitability";
import { MenuProfitabilityResponse } from "@/types/profitability";

const formatPrice = (price: number) => {
  return price.toLocaleString("ko-KR");
};

export default function ProfitabilityPage() {
  const [data, setData] = useState<MenuProfitabilityResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfitability = async () => {
      try {
        const response = await getProfitability();
        setData(response);
      } catch (error) {
        console.error("수익성 분석 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfitability();
  }, []);

  const totalSales = data.reduce(
    (sum, item) => sum + item.salesAmount,
    0
  );

  const totalProfit = data.reduce(
    (sum, item) => sum + item.profit,
    0
  );

  const totalQuantity = data.reduce(
    (sum, item) => sum + item.salesQuantity,
    0
  );

  const averageProfitRate =
    totalSales > 0
      ? Math.round((totalProfit / totalSales) * 10000) / 100
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] px-8 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-[#E8E0D7] bg-white p-10 text-center">
            <p className="text-sm text-gray-500">
              수익성 분석 데이터를 불러오는 중입니다...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] px-8 py-10">
      <div className="mx-auto max-w-7xl">

        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>매출분석</span>
            <span>›</span>
            <span className="text-[#5C3A21]">수익성 분석</span>
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2F241E]">
                수익성 분석
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                메뉴별 판매량과 원가를 기준으로 수익성을 확인하세요.
              </p>
            </div>

            <div className="rounded-xl bg-[#5C3A21] px-4 py-2 text-sm font-medium text-white">
              최근 30일
            </div>
          </div>
        </div>

        {/* 요약 카드 */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-[#E8E0D7] bg-white p-6">
            <p className="text-sm text-gray-500">
              총 판매수량
            </p>

            <div className="mt-3 flex items-end gap-1">
              <span className="text-3xl font-bold text-[#2F241E]">
                {formatPrice(totalQuantity)}
              </span>
              <span className="mb-1 text-sm text-gray-400">
                개
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8E0D7] bg-white p-6">
            <p className="text-sm text-gray-500">
              총 매출
            </p>

            <div className="mt-3 flex items-end gap-1">
              <span className="text-3xl font-bold text-[#2F241E]">
                {formatPrice(totalSales)}
              </span>
              <span className="mb-1 text-sm text-gray-400">
                원
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8E0D7] bg-white p-6">
            <p className="text-sm text-gray-500">
              총 이익률
            </p>

            <div className="mt-3 flex items-end gap-1">
              <span className="text-3xl font-bold text-[#5C3A21]">
                {averageProfitRate}
              </span>
              <span className="mb-1 text-sm text-gray-400">
                %
              </span>
            </div>
          </div>

        </div>

        {/* 메뉴별 수익성 */}
        <div className="overflow-hidden rounded-2xl border border-[#E8E0D7] bg-white">

          <div className="flex items-center justify-between border-b border-[#EEE7DF] px-6 py-5">
            <div>
              <h2 className="font-bold text-[#2F241E]">
                메뉴별 수익성
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                수익률이 높은 메뉴부터 표시됩니다.
              </p>
            </div>

            <span className="text-sm text-gray-400">
              {data.length}개 메뉴
            </span>
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">

              <thead className="bg-[#FAF8F5]">
                <tr className="border-b border-[#EEE7DF] text-gray-500">
                  <th className="px-6 py-4 text-left font-medium">
                    메뉴
                  </th>
                  <th className="px-4 py-4 text-right font-medium">
                    판매가
                  </th>
                  <th className="px-4 py-4 text-right font-medium">
                    판매량
                  </th>
                  <th className="px-4 py-4 text-right font-medium">
                    매출
                  </th>
                  <th className="px-4 py-4 text-right font-medium">
                    원가
                  </th>
                  <th className="px-4 py-4 text-right font-medium">
                    이익
                  </th>
                  <th className="px-6 py-4 text-right font-medium">
                    이익률
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-gray-400"
                    >
                      분석할 매출 데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.menuId}
                      className="border-b border-[#F1ECE7] last:border-0 hover:bg-[#FCFAF8]"
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold text-[#2F241E]">
                          {item.menuName}
                        </div>
                      </td>

                      <td className="px-4 py-5 text-right text-gray-600">
                        {formatPrice(item.sellingPrice)}원
                      </td>

                      <td className="px-4 py-5 text-right text-gray-600">
                        {formatPrice(item.salesQuantity)}개
                      </td>

                      <td className="px-4 py-5 text-right text-gray-600">
                        {formatPrice(item.salesAmount)}원
                      </td>

                      <td className="px-4 py-5 text-right text-gray-600">
                        {formatPrice(item.ingredientCost)}원
                      </td>

                      <td className="px-4 py-5 text-right font-medium text-[#2F241E]">
                        {formatPrice(item.profit)}원
                      </td>

                      <td className="px-6 py-5 text-right">
                        <span
                          className={`inline-flex min-w-[64px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${
                            item.profitRate >= 60
                              ? "bg-[#EAF4EC] text-[#39754A]"
                              : item.profitRate >= 30
                                ? "bg-[#F7F0E5] text-[#8A6238]"
                                : "bg-[#FBEAEA] text-[#A94A4A]"
                          }`}
                        >
                          {item.profitRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
}