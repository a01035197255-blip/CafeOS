"use client";

import { FormEvent, useEffect, useState } from "react";
import { CalendarDays, Clock, ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import { getStaffList } from "@/services/user";
import type { StaffResponse } from "@/types/user";

import { createSchedule } from "@/services/schedule";

export default function ScheduleNewPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [workDate, setWorkDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [memo, setMemo] = useState("");

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<StaffResponse[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getStaffList();
        setEmployees(data);
      } catch (error) {
        console.error("직원 목록 조회 실패:", error);
      }
    };

    fetchEmployees();
  }, []);

  /**
   * 스케줄 등록
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      alert("직원을 선택해주세요.");
      return;
    }

    if (!workDate) {
      alert("근무일을 선택해주세요.");
      return;
    }

    if (!startTime || !endTime) {
      alert("근무 시간을 입력해주세요.");
      return;
    }

    if (startTime >= endTime) {
      alert("퇴근 시간은 출근 시간보다 늦어야 합니다.");
      return;
    }

    try {
      setLoading(true);

      await createSchedule({
        userId: Number(userId),
        workDate,
        startTime,
        endTime,
        memo: memo.trim() || undefined,
      });

      alert("스케줄이 등록되었습니다.");

      router.push("/employees/schedule");
    } catch (error) {
      console.error("스케줄 등록 실패:", error);

      alert("스케줄 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      {/* =========================
          헤더
      ========================= */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3E2A1F]">
            스케줄 등록
          </h1>

          <p className="mt-2 text-sm text-[#8B7768]">
            직원의 근무 스케줄을 등록할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/employees/schedule")}
          className="flex items-center gap-2 rounded-lg border border-[#E8DED5] bg-white px-5 py-3 text-sm font-semibold text-[#5C3A21] transition hover:bg-[#F8F3EF] cursor-pointer"
        >
          <ArrowLeft size={17} />
          목록으로
        </button>
      </div>

      {/* =========================
          등록 폼
      ========================= */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-[#E8DED5] bg-white overflow-hidden">
          {/* 카드 헤더 */}
          <div className="border-b border-[#E8DED5] px-6 py-5">
            <h2 className="font-semibold text-[#3E2A1F]">
              근무 스케줄 정보
            </h2>

            <p className="mt-1 text-sm text-[#9B8A7D]">
              등록할 직원과 근무 시간을 입력해주세요.
            </p>
          </div>

          {/* 입력 영역 */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* 직원 선택 */}
              <div>
                <label
                  htmlFor="userId"
                  className="mb-2 block text-sm font-semibold text-[#3E2A1F]"
                >
                  직원
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <select
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full rounded-lg border border-[#E8DED5] bg-white px-4 py-3 text-sm font-medium text-[#3E2A1F] outline-none transition focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10"
                >
                  <option value="">직원을 선택하세요</option>

                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-[#9B8A7D]">
                  근무할 직원을 선택해주세요.
                </p>
             </div>

              {/* 근무일 */}
              <div>
                <label
                  htmlFor="workDate"
                  className="mb-2 block text-sm font-semibold text-[#3E2A1F]"
                >
                  근무일
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7768]"
                  />

                  <input
                    id="workDate"
                    type="date"
                    value={workDate}
                    onChange={(e) => setWorkDate(e.target.value)}
                    className="w-full rounded-lg border border-[#E8DED5] bg-white py-3 pl-11 pr-4 text-sm font-medium text-[#3E2A1F] outline-none transition focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10"
                  />
                </div>
              </div>

              {/* 출근 시간 */}
              <div>
                <label
                  htmlFor="startTime"
                  className="mb-2 block text-sm font-semibold text-[#3E2A1F]"
                >
                  출근 시간
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <Clock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7768]"
                  />

                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-lg border border-[#E8DED5] bg-white py-3 pl-11 pr-4 text-sm font-medium text-[#3E2A1F] outline-none transition focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10"
                  />
                </div>
              </div>

              {/* 퇴근 시간 */}
              <div>
                <label
                  htmlFor="endTime"
                  className="mb-2 block text-sm font-semibold text-[#3E2A1F]"
                >
                  퇴근 시간
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <Clock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7768]"
                  />

                  <input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-lg border border-[#E8DED5] bg-white py-3 pl-11 pr-4 text-sm font-medium text-[#3E2A1F] outline-none transition focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10"
                  />
                </div>
              </div>

              {/* 메모 */}
              <div className="md:col-span-2">
                <label
                  htmlFor="memo"
                  className="mb-2 block text-sm font-semibold text-[#3E2A1F]"
                >
                  메모
                </label>

                <textarea
                  id="memo"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="스케줄 관련 메모를 입력하세요."
                  rows={4}
                  maxLength={200}
                  className="w-full resize-none rounded-lg border border-[#E8DED5] bg-white px-4 py-3 text-sm text-[#3E2A1F] outline-none transition placeholder:text-[#C2B5AC] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10"
                />

                <div className="mt-1 text-right text-xs text-[#B8A99D]">
                  {memo.length}/200
                </div>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex items-center justify-end gap-3 border-t border-[#E8DED5] bg-[#FCFAF8] px-6 py-4">
            <button
              type="button"
              onClick={() => router.push("/employees/schedule")}
              disabled={loading}
              className="rounded-lg border border-[#E8DED5] bg-white px-5 py-2.5 text-sm font-semibold text-[#806F63] transition hover:bg-[#F8F3EF] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-[#5C3A21] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A2E19] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <Save size={17} />

              {loading ? "등록 중..." : "스케줄 등록"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}