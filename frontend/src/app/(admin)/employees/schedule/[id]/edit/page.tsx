"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  ArrowLeft,
  Save,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  getScheduleList,
  updateSchedule,
  deleteSchedule,
} from "@/services/schedule";

import type { ScheduleResponse } from "@/types/schedule";

export default function ScheduleEditPage() {
  const router = useRouter();
  const params = useParams();

  const scheduleId = Number(params.id);

  const [schedule, setSchedule] =
    useState<ScheduleResponse | null>(null);

  const [workDate, setWorkDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [memo, setMemo] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /**
   * 스케줄 조회
   */
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getScheduleList();

        const found = data.find(
          (item) => item.id === scheduleId
        );

        if (!found) {
          alert("스케줄을 찾을 수 없습니다.");
          router.push("/employees/schedule");
          return;
        }

        setSchedule(found);
        setWorkDate(found.workDate);
        setStartTime(found.startTime);
        setEndTime(found.endTime);
        setMemo(found.memo ?? "");
      } catch (error) {
        console.error("스케줄 조회 실패:", error);
        alert("스케줄을 불러오지 못했습니다.");
        router.push("/employees/schedule");
      } finally {
        setLoading(false);
      }
    };

    if (!Number.isNaN(scheduleId)) {
      fetchSchedule();
    }
  }, [scheduleId, router]);

  /**
   * 스케줄 수정
   */
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!workDate) {
      alert("근무일을 선택해주세요.");
      return;
    }

    if (!startTime || !endTime) {
      alert("근무 시간을 입력해주세요.");
      return;
    }

    if (startTime >= endTime) {
      alert(
        "퇴근 시간은 출근 시간보다 늦어야 합니다."
      );
      return;
    }

    try {
      setSaving(true);

      await updateSchedule(scheduleId, {
        workDate,
        startTime,
        endTime,
        memo: memo.trim() || undefined,
      });

      alert("스케줄이 수정되었습니다.");

      router.push("/employees/schedule");
    } catch (error) {
      console.error("스케줄 수정 실패:", error);

      alert("스케줄 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  /**
   * 스케줄 삭제
   */
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "이 스케줄을 삭제하시겠습니까?"
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      await deleteSchedule(scheduleId);

      alert("스케줄이 삭제되었습니다.");

      router.push("/employees/schedule");
    } catch (error) {
      console.error("스케줄 삭제 실패:", error);

      alert("스케줄 삭제에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  /**
   * 로딩
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-8">
        <div className="flex min-h-[400px] items-center justify-center text-sm text-[#9B8A7D]">
          스케줄을 불러오는 중...
        </div>
      </div>
    );
  }

  /**
   * 스케줄 없음
   */
  if (!schedule) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3E2A1F]">
            스케줄 수정
          </h1>

          <p className="mt-2 text-sm text-[#8B7768]">
            직원의 근무 스케줄을 수정할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            router.push("/employees/schedule")
          }
          disabled={saving}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#E8DED5] bg-white px-5 py-3 text-sm font-semibold text-[#5C3A21] transition hover:bg-[#F8F3EF] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={17} />
          목록으로
        </button>
      </div>

      {/* 수정 폼 */}
      <form onSubmit={handleSubmit}>
        <div className="overflow-hidden rounded-xl border border-[#E8DED5] bg-white">
          {/* 카드 헤더 */}
          <div className="border-b border-[#E8DED5] px-6 py-5">
            <h2 className="font-semibold text-[#3E2A1F]">
              근무 스케줄 정보
            </h2>

            <p className="mt-1 text-sm text-[#9B8A7D]">
              직원 정보를 확인하고 근무 내용을 수정해주세요.
            </p>
          </div>

          {/* 입력 영역 */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* 직원 */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#3E2A1F]">
                  직원
                </label>

                <div className="rounded-lg border border-[#E8DED5] bg-[#FCFAF8] px-4 py-3">
                  <p className="text-sm font-semibold text-[#3E2A1F]">
                    {schedule.userName}
                  </p>

                  <p className="mt-1 text-xs text-[#9B8A7D]">
                    직원 ID #{schedule.userId}
                  </p>
                </div>

                <p className="mt-2 text-xs text-[#9B8A7D]">
                  직원 정보는 수정할 수 없습니다.
                </p>
              </div>

              {/* 근무일 */}
              <div>
                <label
                  htmlFor="workDate"
                  className="mb-2 block text-sm font-semibold text-[#3E2A1F]"
                >
                  근무일
                  <span className="ml-1 text-red-500">
                    *
                  </span>
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
                    onChange={(e) =>
                      setWorkDate(e.target.value)
                    }
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
                  <span className="ml-1 text-red-500">
                    *
                  </span>
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
                    onChange={(e) =>
                      setStartTime(e.target.value)
                    }
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
                  <span className="ml-1 text-red-500">
                    *
                  </span>
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
                    onChange={(e) =>
                      setEndTime(e.target.value)
                    }
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
                  onChange={(e) =>
                    setMemo(e.target.value)
                  }
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
          <div className="flex items-center justify-between border-t border-[#E8DED5] bg-[#FCFAF8] px-6 py-4">
            {/* 삭제 */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={16} />
              삭제
            </button>

            {/* 오른쪽 버튼 */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  router.push("/employees/schedule")
                }
                disabled={saving}
                className="cursor-pointer rounded-lg border border-[#E8DED5] bg-white px-5 py-2.5 text-sm font-semibold text-[#806F63] transition hover:bg-[#F8F3EF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                취소
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#5C3A21] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A2E19] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={17} />

                {saving ? "저장 중..." : "수정 저장"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}