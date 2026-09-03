"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Clock,
  Users,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  getScheduleListByDate,
  deleteSchedule,
} from "@/services/schedule";

import type { ScheduleResponse } from "@/types/schedule";

export default function SchedulePage() {
  // =========================
  // 오늘 날짜
  // =========================
  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getToday());

  const [schedules, setSchedules] = useState<ScheduleResponse[]>(
    []
  );

  const [loading, setLoading] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(
    null
  );

  const router = useRouter();

  // =========================
  // 시간 표시
  // 09:00:00 -> 09:00
  // =========================
  const formatTime = (time: string) => {
    if (!time) {
      return "-";
    }

    return time.slice(0, 5);
  };

  // =========================
  // 날짜 표시
  // =========================
  const formatSelectedDate = (date: string) => {
    const [year, month, day] = date.split("-");

    return `${year}년 ${Number(month)}월 ${Number(day)}일`;
  };

  // =========================
  // 스케줄 조회
  // =========================
  const fetchSchedules = async () => {
    try {
      setLoading(true);

      const data = await getScheduleListByDate(selectedDate);

      setSchedules(data);
    } catch (error) {
      console.error("스케줄 조회 실패:", error);

      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 날짜 변경
  // =========================
  useEffect(() => {
    fetchSchedules();
  }, [selectedDate]);

  // =========================
  // 근무 직원 수
  // =========================
  const employeeCount = useMemo(() => {
    return new Set(
      schedules.map((schedule) => schedule.userId)
    ).size;
  }, [schedules]);

  // =========================
  // 가장 빠른 출근
  // =========================
  const earliestStartTime = useMemo(() => {
    if (schedules.length === 0) {
      return "-";
    }

    const earliest = schedules.reduce(
      (result, schedule) => {
        return schedule.startTime < result
          ? schedule.startTime
          : result;
      },
      schedules[0].startTime
    );

    return formatTime(earliest);
  }, [schedules]);

  // =========================
  // 가장 늦은 퇴근
  // =========================
  const latestEndTime = useMemo(() => {
    if (schedules.length === 0) {
      return "-";
    }

    const latest = schedules.reduce(
      (result, schedule) => {
        return schedule.endTime > result
          ? schedule.endTime
          : result;
      },
      schedules[0].endTime
    );

    return formatTime(latest);
  }, [schedules]);

  // =========================
  // 스케줄 삭제
  // =========================
  const handleDelete = async (scheduleId: number) => {
    const confirmed = window.confirm(
      "이 스케줄을 삭제하시겠습니까?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(scheduleId);

      await deleteSchedule(scheduleId);

      await fetchSchedules();
    } catch (error) {
      console.error("스케줄 삭제 실패:", error);

      alert("스케줄 삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // 상세 페이지 이동
  // =========================
  const handleDetail = (scheduleId: number) => {
    router.push(
      `/employees/schedule/${scheduleId}/edit`
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      <div className="mx-auto max-w-[1400px]">

        {/* =========================
            Header
        ========================= */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#3E2A1F]">
              스케줄 관리
            </h1>

            <p className="mt-2 text-sm text-[#8B7768]">
              직원들의 근무 스케줄을 등록하고 관리합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/employees/schedule/new")
            }
            className="
              flex
              cursor-pointer
              items-center
              gap-2
              rounded-lg
              bg-[#5C3A21]
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#4A2E19]
            "
          >
            <Plus size={18} />
            스케줄 등록
          </button>
        </div>

        {/* =========================
            Summary Cards
        ========================= */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* 총 근무 예정 */}
          <div
            className="
              rounded-xl
              border
              border-[#E8DED5]
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold text-[#9B8A7D]">
                  총 근무 예정
                </p>

                <p className="text-2xl font-bold text-[#3E2A1F]">
                  {loading ? "-" : `${employeeCount}명`}
                </p>

                <p className="mt-1 text-xs text-[#9B8A7D]">
                  선택 날짜 기준
                </p>
              </div>

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#F4EEE9]
                  text-[#5C3A21]
                "
              >
                <Users size={19} />
              </div>
            </div>
          </div>

          {/* 근무 시작 */}
          <div
            className="
              rounded-xl
              border
              border-[#E8DED5]
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold text-[#9B8A7D]">
                  근무 시작
                </p>

                <p className="text-2xl font-bold text-[#5C3A21]">
                  {loading ? "-" : earliestStartTime}
                </p>

                <p className="mt-1 text-xs text-[#9B8A7D]">
                  가장 빠른 출근
                </p>
              </div>

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#F4EEE9]
                  text-[#5C3A21]
                "
              >
                <Clock size={19} />
              </div>
            </div>
          </div>

          {/* 근무 종료 */}
          <div
            className="
              rounded-xl
              border
              border-[#E8DED5]
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold text-[#9B8A7D]">
                  근무 종료
                </p>

                <p className="text-2xl font-bold text-[#5C3A21]">
                  {loading ? "-" : latestEndTime}
                </p>

                <p className="mt-1 text-xs text-[#9B8A7D]">
                  가장 늦은 퇴근
                </p>
              </div>

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#F4EEE9]
                  text-[#5C3A21]
                "
              >
                <Clock size={19} />
              </div>
            </div>
          </div>

        </div>

        {/* =========================
            날짜 선택
        ========================= */}
        <div
          className="
            mb-5
            rounded-xl
            border
            border-[#E8DED5]
            bg-white
            p-5
            shadow-sm
          "
        >
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#F4EEE9]
                "
              >
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
                  className="
                    mt-1
                    cursor-pointer
                    border-none
                    bg-transparent
                    text-base
                    font-semibold
                    text-[#3E2A1F]
                    outline-none
                  "
                />
              </div>

            </div>

            <div
              className="
                hidden
                rounded-lg
                bg-[#F8F3EF]
                px-3
                py-2
                text-xs
                font-semibold
                text-[#806F63]
                sm:block
              "
            >
              {formatSelectedDate(selectedDate)}
            </div>

          </div>
        </div>

        {/* =========================
            직원 스케줄
        ========================= */}
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-[#E8DED5]
            bg-white
            shadow-sm
          "
        >

          {/* 목록 헤더 */}
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-[#E8DED5]
              px-6
              py-5
            "
          >
            <div>
              <h2 className="text-base font-bold text-[#3E2A1F]">
                직원 스케줄
              </h2>

              <p className="mt-1 text-xs text-[#9B8A7D]">
                {selectedDate} 근무 예정 직원
              </p>
            </div>

            <span
              className="
                rounded-lg
                bg-[#F4EEE9]
                px-3
                py-2
                text-xs
                font-bold
                text-[#5C3A21]
              "
            >
              총 {schedules.length}개
            </span>
          </div>

          {/* =========================
              Loading
          ========================= */}
          {loading ? (

            <div
              className="
                py-20
                text-center
                text-sm
                text-[#9B8A7D]
              "
            >
              스케줄을 불러오는 중입니다...
            </div>

          ) : schedules.length === 0 ? (

            /* =========================
               Empty
            ========================= */
            <div className="py-20 text-center">

              <div
                className="
                  mx-auto
                  mb-4
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#F4EEE9]
                "
              >
                <CalendarDays
                  size={28}
                  className="text-[#B8A99D]"
                />
              </div>

              <p className="text-sm font-semibold text-[#5C3A21]">
                등록된 스케줄이 없습니다.
              </p>

              <p className="mt-2 text-xs text-[#9B8A7D]">
                선택한 날짜에 등록된 근무 스케줄이 없습니다.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/employees/schedule/new")
                }
                className="
                  mt-5
                  cursor-pointer
                  rounded-lg
                  bg-[#F4EEE9]
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-[#5C3A21]
                  transition
                  hover:bg-[#EDE3DC]
                "
              >
                + 스케줄 등록
              </button>

            </div>

          ) : (

            /* =========================
               Schedule List
            ========================= */
            <div className="divide-y divide-[#F0E9E4]">

              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="
                    flex
                    items-center
                    gap-6
                    px-6
                    py-5
                    transition
                    hover:bg-[#FAF8F5]
                  "
                >

                  {/* =========================
                      직원 정보
                  ========================= */}
                  <div
                    className="
                      flex
                      w-[240px]
                      shrink-0
                      items-center
                      gap-4
                    "
                  >

                    {/* 프로필 */}
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#F4EEE9]
                        text-sm
                        font-bold
                        text-[#5C3A21]
                      "
                    >
                      {schedule.userName?.charAt(0)}
                    </div>

                    {/* 이름 + 직원 ID */}
                    <div className="min-w-0">

                      <p
                        className="
                          truncate
                          text-sm
                          font-bold
                          text-[#3E2A1F]
                        "
                      >
                        {schedule.userName}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-[#9B8A7D]
                        "
                      >
                        직원 ID #{schedule.userId}
                      </p>

                    </div>
                  </div>

                  {/* =========================
                      근무 시간
                  ========================= */}
                  <div
                    className="
                      flex
                      min-w-[180px]
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-[#5C3A21]
                    "
                  >
                    <Clock
                      size={17}
                      className="shrink-0"
                    />

                    <span>
                      {formatTime(schedule.startTime)}
                    </span>

                    <span className="text-[#B8A99D]">
                      ~
                    </span>

                    <span>
                      {formatTime(schedule.endTime)}
                    </span>
                  </div>

                  {/* =========================
                      Actions
                  ========================= */}
                  <div
                    className="
                      ml-auto
                      flex
                      shrink-0
                      items-center
                      gap-2
                    "
                  >

                    {/* 상세 */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDetail(schedule.id)
                      }
                      className="
                        cursor-pointer
                        rounded-lg
                        border
                        border-[#E8DED5]
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-[#5C3A21]
                        transition
                        hover:bg-[#F8F3EF]
                      "
                    >
                      상세 →
                    </button>

                    {/* 삭제 */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(schedule.id)
                      }
                      disabled={
                        deletingId === schedule.id
                      }
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-1
                        rounded-lg
                        border
                        border-red-100
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-red-500
                        transition
                        hover:bg-red-50
                        hover:text-red-600
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <Trash2 size={14} />

                      {deletingId === schedule.id
                        ? "삭제 중..."
                        : "삭제"}
                    </button>

                  </div>

                </div>
              ))}

            </div>

          )}

        </div>
      </div>
    </div>
  );
}