"use client";

import React, { useEffect, useState } from "react";
import {
  Coffee,
  Wallet,
  Users,
  Package,
  AlertTriangle,
  CheckSquare,
  Square,
  ArrowUpRight,
  ChevronDown
} from "lucide-react";
import { getDashboard } from "@/services/dashboard";
import { DashboardResponse } from "@/types/dashboard";
import { OrderStatus } from "@/types/order-status";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [salesTab, setSalesTab] = useState<"오늘" | "이번 주" | "이번 달" | "올해">("이번 주");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboard();
        setData(response);
      } catch (error) {
        console.error("대시보드 데이터를 불러오지 못했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 주문 상태(OrderStatus)에 따른 한글 텍스트 및 스타일 매핑 함수
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

  return (
    <div className="max-w-[1450px] mx-auto px-8 pt-8 space-y-6">

      {/* 환영 인사 및 날짜 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
            안녕하세요, 사장님! <span>👋</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">오늘도 CafeOS와 함께 즐거운 하루 보내세요.</p>
        </div>
        <div className="bg-white border border-[#E5E8EB] px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs flex items-center gap-2 cursor-pointer hover:border-gray-300 transition">
          <span>📅 {loading || !data?.today ? "불러오는 중..." : data.today}</span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>

      {/* 상단 4가지 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">오늘 매출</span>
            <div className="p-3 bg-[#FDF8F5] text-[#8B4513] rounded-2xl"><Wallet size={20} /></div>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight mb-1">
              ₩ {loading || !data ? "0" : (data.todaySales?.toLocaleString() ?? "0")}
            </div>
            <p className="text-[11px] text-red-500 font-bold flex items-center gap-1">
              <ArrowUpRight size={14} /> 12.5% 어제 대비
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">오늘 주문</span>
            <div className="p-3 bg-[#FDF8F5] text-[#8B4513] rounded-2xl"><Coffee size={20} /></div>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight mb-1">
              {loading || !data ? "0" : data.todayOrderCount} 건
            </div>
            <p className="text-[11px] text-red-500 font-bold flex items-center gap-1">
              <ArrowUpRight size={14} /> 8.3% 어제 대비
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">출근 직원</span>
            <div className="p-3 bg-[#FDF8F5] text-[#8B4513] rounded-2xl"><Users size={20} /></div>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 tracking-tight mb-1">
              {loading || !data ? "0" : data.workingEmployeeCount} 명
            </div>
            <p className="text-[11px] text-gray-400 font-medium">
              출근 리스트 인원: {data?.workingEmployees?.length ?? 0}명
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">재고 부족</span>
            <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><Package size={20} /></div>
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

      {/* 중단 섹션: 매출 현황 / 직원 오늘 할 일 / 공지사항 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* 매출 현황 그래프 (6칸) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-900">매출 현황</h2>
              <div className="flex items-center gap-1 bg-[#F1F3F5] p-1 rounded-xl text-xs font-semibold">
                {(["오늘", "이번 주", "이번 달", "올해"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSalesTab(tab)}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      salesTab === tab ? "bg-white text-gray-900 shadow-2xs font-bold" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#8B4513]"></span>
              <span>매출액(원)</span>
            </div>

            <div className="relative h-44 w-full pt-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-gray-400 font-medium">
                <div className="border-b border-[#F1F3F5] w-full pb-0.5">1,500,000</div>
                <div className="border-b border-[#F1F3F5] w-full pb-0.5">1,200,000</div>
                <div className="border-b border-[#F1F3F5] w-full pb-0.5">900,000</div>
                <div className="border-b border-[#F1F3F5] w-full pb-0.5">600,000</div>
                <div className="border-b border-[#F1F3F5] w-full pb-0.5">300,000</div>
                <div className="border-b border-[#F1F3F5] w-full pb-0.5">0</div>
              </div>

              <svg className="absolute inset-x-0 bottom-4 w-full h-28 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 100">
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B4513" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#8B4513" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 0 75 Q 80 85, 150 60 T 300 70 T 420 40 T 500 45" fill="url(#gradient)" />
                <path d="M 0 75 Q 80 85, 150 60 T 300 70 T 420 40 T 500 45" fill="none" stroke="#8B4513" strokeWidth="2.5" />
                <circle cx="0" cy="75" r="3.5" fill="#8B4513" />
                <circle cx="100" cy="68" r="3.5" fill="#8B4513" />
                <circle cx="180" cy="55" r="3.5" fill="#8B4513" />
                <circle cx="280" cy="70" r="3.5" fill="#8B4513" />
                <circle cx="380" cy="50" r="3.5" fill="#8B4513" />
                <circle cx="500" cy="45" r="4" fill="#8B4513" stroke="white" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="flex justify-between text-[11px] text-gray-400 font-semibold pt-4 border-t border-[#F1F3F5] mt-2">
            <span>5/9 (목)</span>
            <span>5/10 (금)</span>
            <span>5/11 (토)</span>
            <span>5/12 (일)</span>
            <span>5/13 (월)</span>
            <span>5/14 (화)</span>
            <span>5/15 (수)</span>
          </div>
        </div>

        {/* 직원 오늘 할 일 (3칸) - tasks 연동 */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-900">직원 오늘 할 일</h2>
              <button className="text-xs text-[#8B4513] font-semibold hover:underline">전체 보기 &gt;</button>
            </div>
            <div className="space-y-3">
              {loading || !data || data.tasks.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">등록된 할 일이 없습니다.</p>
              ) : (
                data.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between text-xs py-1 border-b border-[#F1F3F5] last:border-none">
                    <div className="flex items-center gap-2.5">
                      {task.completed ? <CheckSquare size={16} className="text-[#8B4513]" /> : <Square size={16} className="text-gray-300" />}
                      <span className={`font-semibold ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{task.role}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 공지사항 (3칸) - notices 연동 */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-900">공지사항</h2>
              <button className="text-xs text-gray-400 font-semibold hover:text-[#8B4513]">전체 보기 &gt;</button>
            </div>
            <div className="space-y-3.5">
              {loading || !data || data.notices.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">공지사항이 없습니다.</p>
              ) : (
                data.notices.map((notice) => (
                  <div key={notice.id} className="text-xs border-b border-[#F1F3F5] pb-2.5 last:border-none">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {notice.pinned && (
                        <span className="bg-red-50 text-red-500 font-bold px-1 py-0.2 rounded text-[9px]">
                          PIN
                        </span>
                      )}
                      <span className="font-bold text-gray-800 truncate">{notice.title}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 truncate font-medium">{notice.content}</p>
                    <div className="text-[10px] text-gray-300 mt-0.5 font-medium">{notice.createdAt?.substring(0, 10)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 하단 섹션: 최근 주문 / 출근 직원 / 인기 메뉴 등 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* 최근 주문 (6칸) - recentOrders 연동 */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-900">최근 주문</h2>
              <button className="text-xs text-[#8B4513] font-semibold hover:underline">전체 보기 &gt;</button>
            </div>
            <div className="grid grid-cols-5 text-xs font-bold text-gray-400 border-b border-[#F1F3F5] pb-3 mb-2">
              <span>주문번호</span>
              <span>직원명</span>
              <span>주문시간</span>
              <span className="text-right">금액</span>
              <span className="text-right">상태</span>
            </div>
          </div>

          <div className="space-y-3 my-auto">
            {loading || !data || data.recentOrders.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">최근 주문 내역이 없습니다.</p>
            ) : (
              data.recentOrders.map((order) => {
                const badge = getOrderStatusBadge(order.status);
                return (
                  <div key={order.id} className="grid grid-cols-5 text-xs text-gray-700 items-center py-1 border-b border-[#F1F3F5]/50 last:border-none">
                    <span className="font-bold text-gray-900">#{order.id}</span>
                    <span className="truncate">{order.employeeName}</span>
                    <span className="text-gray-400 text-[11px]">{order.createdAt?.substring(11, 19)}</span>
                    <span className="text-right font-bold">₩{order.totalPrice?.toLocaleString()}</span>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.style}`}>{badge.text}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div />
        </div>

        {/* 오늘 출근 직원 (6칸) - workingEmployees 연동 */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E5E8EB] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-900">오늘 출근 직원 현황</h2>
              <span className="text-xs text-gray-400 font-medium">근태 기록</span>
            </div>
            <div className="grid grid-cols-4 text-xs font-bold text-gray-400 border-b border-[#F1F3F5] pb-3 mb-2">
              <span>직원번호</span>
              <span>이름</span>
              <span>출근 시간</span>
              <span className="text-right">근무 시간</span>
            </div>
          </div>

          <div className="space-y-3 my-auto">
            {loading || !data || data.workingEmployees.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">현재 출근한 직원이 없습니다.</p>
            ) : (
              data.workingEmployees.map((emp) => (
                <div key={emp.id} className="grid grid-cols-4 text-xs text-gray-700 items-center py-1 border-b border-[#F1F3F5]/50 last:border-none">
                  <span className="font-bold text-gray-900">#{emp.id}</span>
                  <div className="flex items-center gap-1.5 truncate">
                    <div className="w-5 h-5 bg-[#FDF8F5] text-[#8B4513] rounded-full flex items-center justify-center text-[10px] font-bold">👤</div>
                    <span className="truncate font-semibold">{emp.employee}</span>
                  </div>
                  <span className="text-gray-500 text-[11px]">{emp.checkInTime ? emp.checkInTime.substring(11, 19) : "-"}</span>
                  <span className="text-right font-bold text-[#8B4513]">
                    {emp.workMinutes ? `${Math.floor(emp.workMinutes / 60)}시간 ${emp.workMinutes % 60}분` : "근무 중"}
                  </span>
                </div>
              ))
            )}
          </div>
          <div />
        </div>

      </div>

    </div>
  );
}