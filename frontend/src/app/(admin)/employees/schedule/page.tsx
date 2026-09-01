"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Plus, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  getScheduleListByDate,
} from "@/services/schedule";

import type {
  ScheduleResponse,
} from "@/types/schedule";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [schedules, setSchedules] = useState<
    ScheduleResponse[]
  >([]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchSchedules = async () => {
    try {
      setLoading(true);

      const data = await getScheduleListByDate(
        selectedDate
      );

      setSchedules(data);
    } catch (error) {
      console.error(
        "스케줄 조회 실패:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3E2A1F]">
            스케줄 관리
          </h1>

          <p className="mt-2 text-sm text-[#8B7768]">
            직원들의 근무 스케줄을 관리할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/employees/schedule/new")}
          className="flex items-center gap-2 rounded-lg bg-[#5C3A21] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4A2E19] cursor-pointer"
        >
          <Plus size={18} />
          스케줄 등록
        </button>
      </div>

      {/* 날짜 선택 */}
      <div className="mb-6 rounded-xl border border-[#E8DED5] bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4EEE9]">
            <CalendarDays
              size={20}
              className="text-[#5C3A21]"
            />
          </div>

          <div>
            <p className="text-xs font-medium text-[#9B8A7D]">
              근무일
            </p>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(e.target.value)
              }
              className="mt-1 border-none bg-transparent text-base font-semibold text-[#3E2A1F] outline-none"
            />
          </div>
        </div>
      </div>

      {/* 스케줄 목록 */}
      <div className="overflow-hidden rounded-xl border border-[#E8DED5] bg-white">
        <div className="border-b border-[#E8DED5] px-6 py-5">
          <h2 className="font-semibold text-[#3E2A1F]">
            직원 스케줄
          </h2>

          <p className="mt-1 text-sm text-[#9B8A7D]">
            {selectedDate} 근무 예정 직원
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-[#9B8A7D]">
            스케줄을 불러오는 중...
          </div>
        ) : schedules.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarDays
              size={40}
              className="mx-auto mb-4 text-[#D8C9BE]"
            />

            <p className="font-medium text-[#5C3A21]">
              등록된 스케줄이 없습니다.
            </p>

            <p className="mt-1 text-sm text-[#9B8A7D]">
              선택한 날짜에 등록된 근무 스케줄이 없습니다.
            </p>
          </div>
        ) : (
          <div>
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between border-b border-[#F0E9E4] px-6 py-5 last:border-b-0"
              >
                {/* 직원 */}
                <div>
                  <p className="font-semibold text-[#3E2A1F]">
                    {schedule.userName}
                  </p>

                  <p className="mt-1 text-xs text-[#9B8A7D]">
                    직원 ID #{schedule.userId}
                  </p>
                </div>

                {/* 근무시간 */}
                <div className="flex items-center gap-2 text-sm font-semibold text-[#5C3A21]">
                  <Clock size={17} />

                  <span>
                    {schedule.startTime}
                  </span>

                  <span className="text-[#B8A99D]">
                    ~
                  </span>

                  <span>
                    {schedule.endTime}
                  </span>
                </div>

                {/* 메모 */}
                <div className="w-48 text-right">
                  {schedule.memo ? (
                    <span className="text-sm text-[#806F63]">
                      {schedule.memo}
                    </span>
                  ) : (
                    <span className="text-sm text-[#C2B5AC]">
                      -
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}