"use client";

import { useEffect, useMemo, useState } from "react";
import { getSalesAnalysis } from "@/services/sales";
import { SalesAnalysisResponse } from "@/types/sales";

const formatPrice = (price: number) => {
  return price.toLocaleString("ko-KR");
};

export default function SalesPage() {
  const [data, setData] = useState<SalesAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await getSalesAnalysis();
        setData(response);
      } catch (error) {
        console.error("매출 분석 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  // 최근 7일 그래프 좌표
  const chartPoints = useMemo(() => {
    if (!data || data.salesChart.length === 0) {
      return [];
    }

    const width = 900;
    const height = 220;
    const paddingX = 40;
    const paddingY = 25;

    const maxSales = Math.max(
      ...data.salesChart.map((item) => item.sales),
      1
    );

    return data.salesChart.map((item, index) => {
      const x =
        paddingX +
        (index * (width - paddingX * 2)) /
          Math.max(data.salesChart.length - 1, 1);

      const y =
        height -
        paddingY -
        (item.sales / maxSales) *
          (height - paddingY * 2);

      return {
        ...item,
        x,
        y,
      };
    });
  }, [data]);

  // 그래프 라인
  const linePath = chartPoints
    .map((point, index) => {
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ");

  // 그래프 영역
  const areaPath =
    chartPoints.length > 0
      ? `${linePath} L ${
          chartPoints[chartPoints.length - 1].x
        } 220 L ${chartPoints[0].x} 220 Z`
      : "";

  // 월별 최대 매출
  const maxMonthlySales = data
    ? Math.max(
        ...data.monthlySalesChart.map((item) => item.sales),
        1
      )
    : 1;

  // 카테고리 전체 매출
  const totalCategorySales = data
    ? data.categorySales.reduce(
        (sum, item) => sum + item.sales,
        0
      )
    : 0;

  // 로딩
  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#6B4226] border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-sm text-gray-400 mt-3">
            매출 데이터를 불러오는 중입니다.
          </p>
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!data) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <p className="text-sm text-gray-400">
          매출 데이터를 불러오지 못했습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8FA] min-h-full px-10 py-8">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* =========================
            페이지 헤더
        ========================= */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[22px] font-black text-[#111827]">
              매출 분석
            </h1>

            <p className="text-sm text-[#98A2B3] mt-1">
              매장의 매출 현황과 판매 데이터를 분석합니다.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-[#E5E8EB] rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#8B4513]" />

            <span className="text-xs font-semibold text-gray-500">
              실시간 매출 현황
            </span>
          </div>
        </div>

        {/* =========================
            KPI 카드
        ========================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* 오늘 매출 */}
          <div className="bg-white rounded-2xl border border-[#E5E8EB] p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-[#98A2B3]">
                  오늘 매출
                </p>

                <p className="text-[23px] font-black text-[#111827] mt-2">
                  ₩{formatPrice(data.todaySales)}
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-[#F7F0EA] flex items-center justify-center text-[#6B4226]">
                ₩
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-2">
              완료된 주문 기준
            </p>
          </div>

          {/* 이번 달 매출 */}
          <div className="bg-white rounded-2xl border border-[#E5E8EB] p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-[#98A2B3]">
                  이번 달 매출
                </p>

                <p className="text-[23px] font-black text-[#111827] mt-2">
                  ₩{formatPrice(data.monthlySales)}
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-[#F7F0EA] flex items-center justify-center text-[#6B4226]">
                ₩
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-2">
              이번 달 누적 매출
            </p>
          </div>

          {/* 주문 건수 */}
          <div className="bg-white rounded-2xl border border-[#E5E8EB] p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-[#98A2B3]">
                  주문 건수
                </p>

                <p className="text-[23px] font-black text-[#111827] mt-2">
                  {data.totalOrders.toLocaleString()}건
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-[#F7F0EA] flex items-center justify-center text-[#6B4226]">
                #
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-2">
              이번 달 완료 주문
            </p>
          </div>

          {/* 평균 주문 금액 */}
          <div className="bg-white rounded-2xl border border-[#E5E8EB] p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-[#98A2B3]">
                  평균 주문 금액
                </p>

                <p className="text-[23px] font-black text-[#111827] mt-2">
                  ₩{formatPrice(data.averageOrderPrice)}
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-[#F7F0EA] flex items-center justify-center text-[#6B4226]">
                ↗
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-2">
              주문 1건당 평균 금액
            </p>
          </div>
        </div>

        {/* =========================
            최근 7일 매출 추이
        ========================= */}
        <div className="bg-white rounded-2xl border border-[#E5E8EB] overflow-hidden">

          <div className="px-6 pt-5 pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#111827]">
                매출 추이
              </h2>

              <p className="text-xs text-[#98A2B3] mt-1">
                최근 7일간 매출 현황
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#F7F0EA] text-xs font-bold text-[#6B4226]">
              최근 7일
            </div>
          </div>

          <div className="px-5 pb-4">
            <div className="relative w-full h-[250px]">

              {/* 가로 기준선 */}
              <div className="absolute inset-x-5 top-[25px] border-t border-[#F1F3F5]" />
              <div className="absolute inset-x-5 top-[91px] border-t border-[#F1F3F5]" />
              <div className="absolute inset-x-5 top-[157px] border-t border-[#F1F3F5]" />
              <div className="absolute inset-x-5 bottom-[25px] border-t border-[#F1F3F5]" />

              <svg
                viewBox="0 0 900 220"
                preserveAspectRatio="none"
                className="absolute inset-x-5 top-0 w-[calc(100%-40px)] h-[220px] overflow-visible"
              >

                {/* 영역 */}
                <path
                  d={areaPath}
                  fill="#F7F0EA"
                  opacity="0.7"
                />

                {/* 라인 */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#8B4513"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 포인트 */}
                {chartPoints.map((point) => (
                  <g key={point.label}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill="white"
                      stroke="#8B4513"
                      strokeWidth="3"
                    />

                    {point.sales > 0 && (
                      <text
                        x={point.x}
                        y={point.y - 13}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill="#8B4513"
                      >
                        ₩{formatPrice(point.sales)}
                      </text>
                    )}
                  </g>
                ))}
              </svg>

              {/* 날짜 */}
              <div className="absolute left-5 right-5 bottom-0 flex justify-between">
                {data.salesChart.map((item) => (
                  <span
                    key={item.label}
                    className="text-[10px] font-semibold text-[#98A2B3]"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            인기 메뉴 + 카테고리
        ========================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* 인기 메뉴 */}
          <div className="bg-white rounded-2xl border border-[#E5E8EB] p-5">

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-black text-[#111827]">
                  인기 메뉴 TOP 5
                </h2>

                <p className="text-xs text-[#98A2B3] mt-1">
                  이번 달 판매 수량 기준
                </p>
              </div>

              <span className="text-xs font-semibold text-[#98A2B3]">
                TOP 5
              </span>
            </div>

            <div className="space-y-1">

              {data.popularMenus.length === 0 ? (
                <div className="py-10 text-center text-xs text-gray-400">
                  판매된 메뉴가 없습니다.
                </div>
              ) : (
                data.popularMenus.map((menu, index) => (
                  <div
                    key={menu.menuId}
                    className="flex items-center gap-3 py-2.5 border-b border-[#F1F3F5] last:border-none"
                  >

                    {/* 순위 */}
                    <div className="w-6 text-center">
                      <span
                        className={`text-xs font-black ${
                          index === 0
                            ? "text-[#8B4513]"
                            : "text-[#98A2B3]"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </div>

                    {/* 이미지 */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F8F6F3] shrink-0">

                      {menu.imageUrl ? (
                        <img
                          src={menu.imageUrl}
                          alt={menu.menuName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">
                          NO
                        </div>
                      )}

                    </div>

                    {/* 메뉴 정보 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#111827] truncate">
                        {menu.menuName}
                      </p>

                      <p className="text-[10px] text-[#98A2B3] mt-1">
                        {menu.quantity.toLocaleString()}개 판매
                      </p>
                    </div>

                    {/* 매출 */}
                    <div className="text-right">
                      <p className="text-xs font-black text-[#111827]">
                        ₩{formatPrice(menu.sales)}
                      </p>

                      <p className="text-[10px] text-[#98A2B3] mt-1">
                        판매 매출
                      </p>
                    </div>

                  </div>
                ))
              )}

            </div>
          </div>

          {/* 카테고리별 매출 */}
          <div className="bg-white rounded-2xl border border-[#E5E8EB] p-5">

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-black text-[#111827]">
                  카테고리별 매출
                </h2>

                <p className="text-xs text-[#98A2B3] mt-1">
                  이번 달 매출 기준
                </p>
              </div>

              <span className="text-xs font-semibold text-[#98A2B3]">
                전체
              </span>
            </div>

            <div className="space-y-4">

              {data.categorySales.length === 0 ? (
                <div className="py-10 text-center text-xs text-gray-400">
                  매출 데이터가 없습니다.
                </div>
              ) : (
                data.categorySales.map((category) => {

                  const percentage =
                    totalCategorySales === 0
                      ? 0
                      : (category.sales /
                          totalCategorySales) *
                        100;

                  return (
                    <div key={category.category}>

                      <div className="flex items-center justify-between mb-2">

                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#8B4513]" />

                          <span className="text-xs font-bold text-[#374151]">
                            {category.category}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-[#111827]">
                            ₩{formatPrice(category.sales)}
                          </span>

                          <span className="text-[10px] text-[#98A2B3] ml-2">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>

                      </div>

                      <div className="h-2 bg-[#F1F3F5] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#8B4513] rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                    </div>
                  );
                })
              )}

            </div>
          </div>
        </div>

        {/* =========================
            월별 매출
        ========================= */}
        <div className="bg-white rounded-2xl border border-[#E5E8EB] p-5">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-black text-[#111827]">
                월별 매출
              </h2>

              <p className="text-xs text-[#98A2B3] mt-1">
                최근 12개월 매출 현황
              </p>
            </div>

            <span className="text-xs font-semibold text-[#98A2B3]">
              최근 12개월
            </span>
          </div>

          <div className="flex items-end gap-2 sm:gap-3 h-[220px]">

            {data.monthlySalesChart.map((item) => {

              const height =
                item.sales === 0
                  ? 3
                  : Math.max(
                      (item.sales / maxMonthlySales) * 100,
                      5
                    );

              return (
                <div
                  key={item.month}
                  className="flex-1 h-full flex flex-col justify-end items-center min-w-0"
                >

                  <div className="w-full flex justify-center items-end h-[185px]">

                    <div
                      className="w-full max-w-[38px] bg-[#8B4513] rounded-t-md hover:bg-[#6B4226] transition-all cursor-default"
                      style={{
                        height: `${height}%`,
                      }}
                      title={`₩${formatPrice(item.sales)}`}
                    />

                  </div>

                  <span className="text-[9px] sm:text-[10px] text-[#98A2B3] mt-3">
                    {item.month.slice(5)}
                  </span>

                </div>
              );
            })}

          </div>
        </div>

        {/* =========================
            매출 상세
        ========================= */}
        <div className="bg-white rounded-2xl border border-[#E5E8EB] p-5">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-black text-[#111827]">
                매출 상세
              </h2>

              <p className="text-xs text-[#98A2B3] mt-1">
                최근 7일 매출 및 전일 대비 증감률
              </p>
            </div>

            <span className="text-xs font-semibold text-[#98A2B3]">
              최근 7일
            </span>
          </div>

          {/* PC 테이블 */}
          <div className="hidden sm:block">

            <div className="grid grid-cols-[120px_120px_1fr_120px] px-3 pb-3 text-xs font-bold text-[#98A2B3] border-b border-[#F1F3F5]">
              <span>날짜</span>
              <span>주문 건수</span>
              <span className="text-right">
                매출
              </span>
              <span className="text-right">
                전일 대비
              </span>
            </div>

            <div>
              {data.dailySales.map((item) => {

                const isPositive = item.changeRate > 0;
                const isNegative = item.changeRate < 0;

                return (
                  <div
                    key={item.date}
                    className="grid grid-cols-[120px_120px_1fr_120px] items-center px-3 py-3 text-xs border-b border-[#F1F3F5] last:border-none"
                  >

                    <span className="font-bold text-[#374151]">
                      {item.date}
                    </span>

                    <span className="text-[#667085]">
                      {item.orderCount.toLocaleString()}건
                    </span>

                    <span className="text-right font-black text-[#111827]">
                      ₩{formatPrice(item.sales)}
                    </span>

                    <span
                      className={`text-right font-bold ${
                        isPositive
                          ? "text-green-600"
                          : isNegative
                          ? "text-red-500"
                          : "text-[#98A2B3]"
                      }`}
                    >
                      {item.changeRate > 0 ? "+" : ""}
                      {item.changeRate.toFixed(1)}%
                    </span>

                  </div>
                );
              })}
            </div>

          </div>

          {/* 모바일 */}
          <div className="sm:hidden space-y-3">

            {data.dailySales.map((item) => {

              const isPositive = item.changeRate > 0;
              const isNegative = item.changeRate < 0;

              return (
                <div
                  key={item.date}
                  className="p-4 rounded-xl bg-[#FAFAFA] border border-[#F1F3F5]"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-xs font-bold text-[#374151]">
                      {item.date}
                    </span>

                    <span
                      className={`text-xs font-bold ${
                        isPositive
                          ? "text-green-600"
                          : isNegative
                          ? "text-red-500"
                          : "text-[#98A2B3]"
                      }`}
                    >
                      {item.changeRate > 0 ? "+" : ""}
                      {item.changeRate.toFixed(1)}%
                    </span>

                  </div>

                  <div className="flex items-end justify-between mt-3">

                    <div>
                      <p className="text-[10px] text-[#98A2B3]">
                        주문
                      </p>

                      <p className="text-sm font-bold text-[#374151] mt-1">
                        {item.orderCount}건
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-[#98A2B3]">
                        매출
                      </p>

                      <p className="text-sm font-black text-[#111827] mt-1">
                        ₩{formatPrice(item.sales)}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </div>
  );
}