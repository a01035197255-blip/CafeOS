"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Coffee, Wallet, Users, Package, AlertTriangle, CheckSquare, Square, ChevronDown } from "lucide-react";

import { getDashboard } from "@/services/dashboard";
import { getMyInfo } from "@/services/user";
import { useRouter } from "next/navigation";

import type { DashboardResponse, SalesChartResponse } from "@/types/dashboard";
import type { UserResponse } from "@/types/user";
import { OrderStatus } from "@/types/order-status";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  /**
   * 대시보드 데이터 조회
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardResponse, userResponse] = await Promise.all([
          getDashboard(),
          getMyInfo(),
        ]);

        setData(dashboardResponse);
        setUser(userResponse);
      } catch (error) {
        console.error("대시보드 데이터를 불러오지 못했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  /**
   * 주문 상태 표시
   */
  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.RECEIVED:
        return { text: "접수대기", style: "bg-blue-50 text-blue-600" };
      case OrderStatus.MAKING:
        return { text: "제조중", style: "bg-amber-50 text-amber-600" };
      case OrderStatus.COMPLETED:
        return { text: "완료", style: "bg-emerald-50 text-emerald-600" };
      case OrderStatus.CANCELLED:
        return { text: "취소", style: "bg-red-50 text-red-500" };
      default:
        return { text: status, style: "bg-gray-50 text-gray-600" };
    }
  };

  /**
   * 매출 그래프 데이터
   */
  const salesChart: SalesChartResponse[] = data?.salesChart ?? [];

  /**
   * 그래프 최대값
   */
  const maxSales = useMemo(() => {
    if (salesChart.length === 0) return 0;
    return Math.max(...salesChart.map((item) => item.sales), 0);
  }, [salesChart]);

  /**
   * 그래프 Y축
   */
  const chartMax = useMemo(() => {
    if (maxSales <= 0) return 100000;
    const unit = 100000;
    return Math.ceil(maxSales / unit) * unit;
  }, [maxSales]);

  const chartYAxis = useMemo(() => {
    const step = chartMax / 5;
    return Array.from({ length: 6 }, (_, index) => chartMax - step * index);
  }, [chartMax]);

  /**
   * 역할 표시
   */
  const roleText = useMemo(() => {
    if (!user?.role) return "";

    switch (user.role) {
      case "OWNER":
        return "사장님";
      case "MANAGER":
        return "매니저";
      case "STAFF":
        return "직원";
      default:
        return user.role;
    }
  }, [user]);

  /**
   * 날짜 포맷
   */
  const formatDate = (date: string) => {
    if (!date) return "-";
    return date;
  };

  /**
   * 금액 포맷
   */
  const formatPrice = (price: number | null | undefined) => {
    return (price ?? 0).toLocaleString();
  };

  /**
   * 시간 포맷
   */
  const formatTime = (dateTime: string | null | undefined) => {
    if (!dateTime) return "-";
    return dateTime.substring(11, 19);
  };

  /**
   * 매출 그래프 날짜
   */
  const chartLabels = salesChart.map((item) => item.label);

  return (
    <div className="max-w-[1450px] mx-auto px-8 pt-8 space-y-6">

      {/* =========================
          환영 인사 및 날짜
      ========================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
            안녕하세요,{" "}
            {loading ? "불러오는 중" : user?.name ?? "사용자"}
            님! <span>👋</span>
          </h1>

          <p className="text-xs text-gray-500 mt-1 font-medium">
            오늘도 CafeOS와 함께 즐거운 하루 보내세요.
          </p>
        </div>

        <div className="bg-white border border-[#E5E8EB] px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs flex items-center gap-2 cursor-pointer hover:border-gray-300 transition">
          <span>
            📅{" "}
            {loading || !data?.today ? "불러오는 중..." : formatDate(data.today)}
          </span>

          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>

      {/* =========================
          상단 요약 카드
      ========================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* 오늘 매출 */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">오늘 매출</span>

            <div className="p-3 bg-[#FDF8F5] text-[#8B4513] rounded-2xl">
              <Wallet size={20} />
            </div>
          </div>

          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight mb-1">
              ₩ {loading || !data ? "0" : formatPrice(data.todaySales)}
            </div>

            <p className="text-[11px] text-gray-400 font-medium">
              오늘 완료된 주문 기준
            </p>
          </div>
        </div>

        {/* 오늘 주문 */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">오늘 주문</span>

            <div className="p-3 bg-[#FDF8F5] text-[#8B4513] rounded-2xl">
              <Coffee size={20} />
            </div>
          </div>

          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight mb-1">
              {loading || !data ? "0" : data.todayOrderCount} 건
            </div>

            <p className="text-[11px] text-gray-400 font-medium">
              오늘 접수된 주문 기준
            </p>
          </div>
        </div>

        {/* 출근 직원 */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">출근 직원</span>

            <div className="p-3 bg-[#FDF8F5] text-[#8B4513] rounded-2xl">
              <Users size={20} />
            </div>
          </div>

          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight mb-1">
              {loading || !data ? "0" : data.workingEmployeeCount} 명
            </div>

            <p className="text-[11px] text-gray-400 font-medium">
              현재 출근 중인 직원
            </p>
          </div>
        </div>

        {/* 재고 부족 */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">재고 부족</span>

            <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
              <Package size={20} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-gray-900 tracking-tight mb-1">
                {loading || !data ? "0" : data.lowStockCount} 개
              </div>

              <p className="text-[11px] text-red-500 font-bold">확인 필요</p>
            </div>

            <AlertTriangle className="text-red-500 animate-pulse" size={24} />
          </div>
        </div>
      </div>

      {/* =========================
          중단
      ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* 매출 현황 */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-900">매출 현황</h2>

              <div className="px-3 py-1.5 bg-[#F1F3F5] rounded-xl text-xs font-semibold text-gray-600">
                최근 7일
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#8B4513]" />
              <span>매출액(원)</span>
            </div>

            {/* 그래프 */}
            <div className="relative h-48 w-full mt-2">

              {/* Y축 + 가이드라인 */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {chartYAxis.map((value) => (
                  <div key={value} className="relative border-b border-[#F1F3F5] w-full h-0">
                    <span className="absolute -top-[7px] left-0 text-[10px] text-gray-400 font-medium">
                      {Math.round(value).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {salesChart.length > 0 ? (
                <div className="absolute left-10 right-1 top-2 bottom-5">
                  <svg
                    viewBox="0 0 700 200"
                    preserveAspectRatio="none"
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      {/* 아래쪽으로 갈수록 자연스럽게 사라지는 영역 */}
                      <linearGradient id="salesAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B4513" stopOpacity="0.18" />
                        <stop offset="70%" stopColor="#8B4513" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#8B4513" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {(() => {
                      const width = 700;
                      const height = 200;

                      const points = salesChart.map((item, index) => {
                        const x =
                          salesChart.length === 1
                            ? width / 2
                            : (index / (salesChart.length - 1)) * width;

                        const y =
                          chartMax === 0
                            ? height
                            : height - (item.sales / chartMax) * height;

                        return { x, y, sales: item.sales, label: item.label };
                      });

                      /*
                       * 부드러운 곡선 생성
                       */
                      const createSmoothPath = () => {
                        if (points.length === 1) {
                          return `M ${points[0].x} ${points[0].y}`;
                        }

                        let path = `M ${points[0].x} ${points[0].y}`;

                        for (let i = 0; i < points.length - 1; i++) {
                          const current = points[i];
                          const next = points[i + 1];
                          const controlX = (current.x + next.x) / 2;

                          path += `
                            C
                            ${controlX} ${current.y},
                            ${controlX} ${next.y},
                            ${next.x} ${next.y}
                          `;
                        }

                        return path;
                      };

                      const linePath = createSmoothPath();

                      /*
                       * 그래프 아래 영역
                       */
                      const areaPath = `
                        ${linePath}
                        L ${width} ${height}
                        L 0 ${height}
                        Z
                      `;

                      return (
                        <>
                          {/* 영역 채움 */}
                          <path d={areaPath} fill="url(#salesAreaGradient)" />

                          {/* 메인 라인 */}
                          <path
                            d={linePath}
                            fill="none"
                            stroke="#8B4513"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* 데이터 포인트 */}
                          {points.map((point, index) => (
                            <g key={`${point.label}-${index}`} className="group">

                              {/* hover 영역 */}
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="14"
                                fill="transparent"
                                className="cursor-pointer"
                              />

                              {/* 바깥쪽 링 */}
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="7"
                                fill="white"
                                stroke="#8B4513"
                                strokeWidth="2.5"
                              />

                              {/* 중앙 점 */}
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="3"
                                fill="#8B4513"
                              />

                              {/* 금액 */}
                              {point.sales > 0 && (
                                <g>
                                  <rect
                                    x={point.x - 34}
                                    y={point.y - 34}
                                    width="68"
                                    height="22"
                                    rx="7"
                                    fill="#5C3A21"
                                    opacity="0.95"
                                  />

                                  <text
                                    x={point.x}
                                    y={point.y - 19}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="700"
                                    fill="white"
                                  >
                                    ₩{point.sales.toLocaleString()}
                                  </text>
                                </g>
                              )}
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-gray-400">
                    매출 데이터가 없습니다.
                  </span>
                </div>
              )}
            </div>

            {/* X축 */}
            <div className="ml-10 flex justify-between text-[11px] text-gray-400 font-semibold pt-3">
              {chartLabels.length > 0 ? (
                chartLabels.map((label) => <span key={label}>{label}</span>)
              ) : (
                <span className="w-full text-center">-</span>
              )}
            </div>
          </div>
        </div>

        {/* 오늘 할 일 */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-900">직원 오늘 할 일</h2>

              <button
                type="button"
                onClick={() => router.push("/employees/tasks")}
                className="text-xs text-[#8B4513] font-semibold hover:underline cursor-pointer"
              >
                전체 보기 &gt;
              </button>
            </div>

            <div className="space-y-3">
              {loading || !data || data.tasks.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">
                  등록된 할 일이 없습니다.
                </p>
              ) : (
                data.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between text-xs py-1 border-b border-[#F1F3F5] last:border-none"
                  >
                    <div className="flex items-center gap-2.5">
                      {task.completed ? (
                        <CheckSquare size={16} className="text-[#8B4513]" />
                      ) : (
                        <Square size={16} className="text-gray-300" />
                      )}

                      <span
                        className={`font-semibold ${
                          task.completed
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                      {task.role}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 공지사항 */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-900">공지사항</h2>

              <button
                type="button"
                onClick={() => router.push("/notices")}
                className="text-xs text-gray-400 font-semibold hover:text-[#8B4513] cursor-pointer"
              >
                전체 보기 &gt;
              </button>
            </div>

            <div className="space-y-3.5">
              {loading || !data || data.notices.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">
                  공지사항이 없습니다.
                </p>
              ) : (
                data.notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="text-xs border-b border-[#F1F3F5] pb-2.5 last:border-none"
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {notice.pinned && (
                        <span className="bg-red-50 text-red-500 font-bold px-1 py-0.2 rounded text-[9px]">
                          PIN
                        </span>
                      )}

                      <span className="font-bold text-gray-800 truncate">
                        {notice.title}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 truncate font-medium">
                      {notice.content}
                    </p>

                    <div className="text-[10px] text-gray-300 mt-0.5 font-medium">
                      {notice.createdAt?.substring(0, 10)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          하단
      ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* 최근 주문 */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-900">최근 주문</h2>

          </div>

            <div className="grid grid-cols-[1fr_100px_100px_70px] text-xs font-bold text-gray-400 border-b border-[#F1F3F5] pb-3 mb-2">
              <span>메뉴</span>
              <span>주문시간</span>
              <span className="text-right">금액</span>
              <span className="text-right">상태</span>
            </div>
          </div>

          {/* my-auto 제거 */}
          <div className="space-y-3 mt-1">
            {loading || !data || data.recentOrders.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">
                최근 주문 내역이 없습니다.
              </p>
            ) : (
              data.recentOrders.map((order) => {
                const badge = getOrderStatusBadge(order.status);

                const firstItem = order.items?.[0];

                return (
                  <div
                    key={order.id}
                    className="grid grid-cols-[1fr_100px_100px_70px] text-xs text-gray-700 items-center py-2.5 border-b border-[#F1F3F5]/50 last:border-none"
                  >
                    {/* 메뉴 */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#F8F6F3] shrink-0">
                        {firstItem?.menuImageUrl ? (
                          <img
                            src={firstItem.menuImageUrl}
                            alt={firstItem.menuName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Coffee
                              size={17}
                              className="text-gray-300"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">
                          {firstItem?.menuName ?? "주문 메뉴"}
                        </p>

                        {order.items?.length > 1 && (
                          <p className="text-[10px] text-gray-400">
                            외 {order.items.length - 1}건
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 주문시간 */}
                    <span className="text-gray-400 text-[11px]">
                      {formatTime(order.createdAt)}
                    </span>

                    {/* 금액 */}
                    <span className="text-right font-bold">
                      ₩{formatPrice(order.totalPrice)}
                    </span>

                    {/* 상태 */}
                    <div className="text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.style}`}
                      >
                        {badge.text}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 오늘 출근 직원 */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-900">
                오늘 출근 직원 현황
              </h2>

              <span className="text-xs text-gray-400 font-medium">
                근태 기록
              </span>
            </div>

            <div className="grid grid-cols-4 text-xs font-bold text-gray-400 border-b border-[#F1F3F5] pb-3 mb-1">
              <span>직원번호</span>
              <span>이름</span>
              <span>출근 시간</span>
              <span className="text-right">근무 시간</span>
            </div>
          </div>

          {/* my-auto 제거 */}
          <div className="mt-1">
            {loading || !data || data.workingEmployees.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-xs text-gray-400">
                  현재 출근한 직원이 없습니다.
                </p>
              </div>
            ) : (
              data.workingEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="grid grid-cols-4 items-center text-xs text-gray-700 py-4 border-b border-[#F1F3F5]/60 last:border-none"
                >
                  {/* 직원번호 */}
                  <span className="font-bold text-gray-900">#{emp.id}</span>

                  {/* 이름 */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#FDF8F5] text-[#8B4513] rounded-full flex items-center justify-center text-[11px] font-bold">
                      👤
                    </div>

                    <span className="font-semibold text-gray-800">
                      {emp.employee}
                    </span>
                  </div>

                  {/* 출근시간 */}
                  <span className="text-gray-500 text-[11px]">
                    {formatTime(emp.checkInTime)}
                  </span>

                  {/* 근무시간 */}
                  <div className="text-right">
                    {emp.workMinutes !== null && emp.workMinutes !== undefined ? (
                      <span className="font-bold text-gray-700">
                        {Math.floor(emp.workMinutes / 60)}시간 {emp.workMinutes % 60}분
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[#8B4513] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B4513] animate-pulse" />
                        근무 중
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}