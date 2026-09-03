"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Users,
  UserCheck,
  UserX,
  Coffee,
  LogIn,
  LogOut,
} from "lucide-react";

import { getStaffList } from "@/services/user";

import {
  getAttendanceList,
  checkIn,
  checkOut,
} from "@/services/attendance";

import {
  getScheduleListByDate,
} from "@/services/schedule";

import type { StaffResponse } from "@/types/user";
import type { AttendanceResponse } from "@/types/attendance";
import type { ScheduleResponse } from "@/types/schedule";

/**
 * 화면 표시용 상태
 *
 * 백엔드 AttendanceStatus를 별도로 복제하지 않고
 * 실제 출퇴근/스케줄 데이터를 기준으로 화면 상태를 계산한다.
 */
type AttendanceDisplayStatus =
  | "OFF_WORK"
  | "ABSENT"
  | "WORKING"
  | "COMPLETED";

interface EmployeeAttendance {
  employee: StaffResponse;
  schedule: ScheduleResponse | null;
  attendance: AttendanceResponse | null;
  status: AttendanceDisplayStatus;
}

export default function AttendancePage() {

  /**
   * 오늘 날짜
   *
   * 브라우저 로컬 시간을 사용해서
   * 한국에서 UTC 때문에 날짜가 밀리는 문제 방지
   */
  const getToday = () => {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] =
    useState(getToday());

  const [employees, setEmployees] =
    useState<StaffResponse[]>([]);

  const [attendance, setAttendance] =
    useState<AttendanceResponse[]>([]);

  const [schedules, setSchedules] =
    useState<ScheduleResponse[]>([]);

  const [loading, setLoading] =
    useState(true);

  /**
   * 출퇴근 처리 중
   */
  const [processing, setProcessing] =
    useState(false);

  /**
   * 직원 / 근태 / 스케줄 조회
   */
  const fetchData = async () => {

    try {

      setLoading(true);

      const [
        staffData,
        attendanceData,
        scheduleData,
      ] = await Promise.all([

        getStaffList(),

        getAttendanceList(),

        getScheduleListByDate(
          selectedDate
        ),

      ]);

      setEmployees(staffData);

      setAttendance(attendanceData);

      setSchedules(scheduleData);

    } catch (error) {

      console.error(
        "근태 정보 조회 실패:",
        error
      );

      alert(
        "근태 정보를 불러오지 못했습니다."
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchData();

  }, [selectedDate]);

  /**
   * 출근
   */
  const handleCheckIn = async () => {

    if (processing) {
      return;
    }

    try {

      setProcessing(true);

      await checkIn();

      alert("출근 처리되었습니다.");

      await fetchData();

    } catch (error) {

      console.error(
        "출근 처리 실패:",
        error
      );

      alert(
        "출근 처리에 실패했습니다."
      );

    } finally {

      setProcessing(false);
    }
  };

  /**
   * 퇴근
   */
  const handleCheckOut = async () => {

    if (processing) {
      return;
    }

    try {

      setProcessing(true);

      await checkOut();

      alert("퇴근 처리되었습니다.");

      await fetchData();

    } catch (error) {

      console.error(
        "퇴근 처리 실패:",
        error
      );

      alert(
        "퇴근 처리에 실패했습니다."
      );

    } finally {

      setProcessing(false);
    }
  };

  /**
   * 선택한 날짜의 근태만 필터링
   */
  const dateAttendance =
    useMemo(() => {

      return attendance.filter(
        (item) => {

          if (!item.checkInTime) {
            return false;
          }

          return (
            item.checkInTime.substring(0, 10) ===
            selectedDate
          );
        }
      );

    }, [
      attendance,
      selectedDate,
    ]);

  /**
   * 직원별 근태 상태 계산
   *
   * 우선순위:
   *
   * 1. 실제 출근 기록이 있으면
   *    → 스케줄과 관계없이 실제 출근 상태를 우선
   *
   * 2. 출근 기록이 없으면
   *    → 스케줄을 기준으로 휴무 / 미출근 판단
   *
   * 지각 여부는 attendance.late로 별도 관리한다.
   */
  const employeeAttendance =
    useMemo<EmployeeAttendance[]>(() => {

      return employees.map((employee) => {

        /**
         * 해당 직원의 스케줄
         */
        const schedule =
          schedules.find(
            (item) =>
              item.userId === employee.id
          ) ?? null;

        /**
         * 해당 직원의 근태 기록
         */
        const attendanceRecord =
          dateAttendance.find(
            (item) =>
              item.userId === employee.id
          ) ?? null;

        /**
         * ========================================
         * 1. 실제 출근 기록이 있는 경우
         * ========================================
         *
         * 휴무날 출근했든
         * 지각해서 출근했든
         * 실제 출근 기록이 있으면
         * 스케줄보다 출퇴근 기록을 우선한다.
         */

        if (attendanceRecord?.checkInTime) {

          /**
           * 출근 + 퇴근
           */
          if (attendanceRecord.checkOutTime) {

            return {
              employee,
              schedule,
              attendance: attendanceRecord,
              status: "COMPLETED",
            };
          }

          /**
           * 출근 + 아직 퇴근하지 않음
           */
          return {
            employee,
            schedule,
            attendance: attendanceRecord,
            status: "WORKING",
          };
        }

        /**
         * ========================================
         * 2. 출근 기록이 없는 경우
         * ========================================
         */

        /**
         * 스케줄 없음
         * → 휴무
         */
        if (!schedule) {

          return {
            employee,
            schedule: null,
            attendance: null,
            status: "OFF_WORK",
          };
        }

        /**
         * 스케줄 있음
         * + 출근 기록 없음
         * → 미출근
         */
        return {
          employee,
          schedule,
          attendance: null,
          status: "ABSENT",
        };
      });

    }, [
      employees,
      schedules,
      dateAttendance,
    ]);

  /**
   * 상태별 직원 수
   */
  const totalCount =
    employeeAttendance.length;

  const offCount =
    employeeAttendance.filter(
      (item) =>
        item.status === "OFF_WORK"
    ).length;

  const absentCount =
    employeeAttendance.filter(
      (item) =>
        item.status === "ABSENT"
    ).length;

  const lateCount =
    employeeAttendance.filter(
      (item) =>
        item.attendance?.late === true
    ).length;

  const workingCount =
    employeeAttendance.filter(
      (item) =>
        item.status === "WORKING"
    ).length;

  const completedCount =
    employeeAttendance.filter(
      (item) =>
        item.status === "COMPLETED"
    ).length;

  /**
   * 날짜 표시
   */
  const formatDate = (
    date: string
  ) => {

    const [
      year,
      month,
      day,
    ] = date.split("-");

    return `${year}.${month}.${day}`;
  };

  /**
   * 시간 표시
   */
  const formatTime = (
    value: string | null
  ) => {

    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;
    }

    return date.toLocaleTimeString(
      "ko-KR",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /**
   * 상태 UI
   */
  const getStatus = (
    status: AttendanceDisplayStatus
  ) => {

    switch (status) {

      case "OFF_WORK":

        return {
          label: "휴무",
          className:
            "bg-gray-100 text-gray-500",
          dotClassName:
            "bg-gray-400",
        };

      case "ABSENT":

        return {
          label: "미출근",
          className:
            "bg-orange-50 text-orange-600",
          dotClassName:
            "bg-orange-500",
        };

      case "WORKING":

        return {
          label: "근무 중",
          className:
            "bg-green-50 text-green-600",
          dotClassName:
            "bg-green-500",
        };

      case "COMPLETED":

        return {
          label: "퇴근 완료",
          className:
            "bg-blue-50 text-blue-600",
          dotClassName:
            "bg-blue-500",
        };
    }
  };

  return (

    <div className="min-h-screen bg-[#F4F5F7]">

      <main className="mx-auto max-w-[1400px] px-8 py-8">

        {/* =========================
            헤더
        ========================= */}

        <div className="mb-8 flex items-start justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2">

              <Clock3
                size={21}
                className="text-[#5C3A21]"
              />

              <span className="text-sm font-medium text-[#8B735D]">
                운영 관리
              </span>

            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              근태 관리
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              날짜별 직원의 출퇴근 및 근무 상태를 확인합니다.
            </p>

          </div>

          {/* 출퇴근 버튼 */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={handleCheckIn}
              disabled={processing}
              className="flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#5C3A21] px-5 text-sm font-semibold text-white transition hover:bg-[#4A2E1A] disabled:cursor-not-allowed disabled:opacity-50"
            >

              <LogIn size={17} />

              {processing
                ? "처리 중..."
                : "출근"}

            </button>

            <button
              type="button"
              onClick={handleCheckOut}
              disabled={processing}
              className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <LogOut size={17} />

              퇴근

            </button>

          </div>

        </div>

        {/* =========================
            날짜 선택
        ========================= */}

        <div className="mb-6 rounded-2xl border border-[#E5E8EB] bg-white p-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5EFE9]">

                <CalendarDays
                  size={21}
                  className="text-[#5C3A21]"
                />

              </div>

              <div>

                <p className="text-xs font-medium text-gray-400">
                  근무일
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatDate(
                    selectedDate
                  )}
                </p>

              </div>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(
                    e.target.value
                  )
                }
                className="ml-2 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
              />

            </div>

            <div className="hidden text-right md:block">

              <p className="text-xs text-gray-400">
                전체 직원
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">

                {totalCount}

                <span className="ml-1 text-sm font-medium text-gray-400">
                  명
                </span>

              </p>

            </div>

          </div>

        </div>

        {/* =========================
            상태 요약
        ========================= */}

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">

          {/* 휴무 */}

          <div className="rounded-2xl border border-[#E5E8EB] bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-gray-400">
                  휴무
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">

                  {offCount}

                  <span className="ml-1 text-sm font-medium text-gray-400">
                    명
                  </span>

                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">

                <Coffee
                  size={19}
                  className="text-gray-500"
                />

              </div>

            </div>

          </div>

          {/* 미출근 */}

          <div className="rounded-2xl border border-[#E5E8EB] bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-gray-400">
                  미출근
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">

                  {absentCount}

                  <span className="ml-1 text-sm font-medium text-gray-400">
                    명
                  </span>

                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">

                <UserX
                  size={19}
                  className="text-orange-500"
                />

              </div>

            </div>

          </div>

          {/* 지각 */}

          <div className="rounded-2xl border border-[#E5E8EB] bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-gray-400">
                  지각
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">

                  {lateCount}

                  <span className="ml-1 text-sm font-medium text-gray-400">
                    명
                  </span>

                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">

                <Clock3
                  size={19}
                  className="text-red-500"
                />

              </div>

            </div>

          </div>

          {/* 근무 중 */}

          <div className="rounded-2xl border border-[#E5E8EB] bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-gray-400">
                  근무 중
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">

                  {workingCount}

                  <span className="ml-1 text-sm font-medium text-gray-400">
                    명
                  </span>

                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">

                <UserCheck
                  size={19}
                  className="text-green-600"
                />

              </div>

            </div>

          </div>

          {/* 퇴근 완료 */}

          <div className="rounded-2xl border border-[#E5E8EB] bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-gray-400">
                  퇴근 완료
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">

                  {completedCount}

                  <span className="ml-1 text-sm font-medium text-gray-400">
                    명
                  </span>

                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                <UserCheck
                  size={19}
                  className="text-blue-500"
                />

              </div>

            </div>

          </div>

        </div>

        {/* =========================
            직원 근태 목록
        ========================= */}

        <section className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">

          {/* 목록 헤더 */}

          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

            <div>

              <h2 className="font-bold text-gray-900">
                직원 근태 현황
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                {formatDate(
                  selectedDate
                )}{" "}
                기준 직원별 근무 상태
              </p>

            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">

              <Users size={16} />

              <span>
                {totalCount}명
              </span>

            </div>

          </div>

          {/* Loading */}

          {loading ? (

            <div className="flex min-h-[420px] items-center justify-center">

              <p className="text-sm text-gray-400">
                근태 정보를 불러오는 중...
              </p>

            </div>

          ) : employeeAttendance.length === 0 ? (

            <div className="flex min-h-[420px] flex-col items-center justify-center">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5EFE9]">

                <Users
                  size={28}
                  className="text-[#8B735D]"
                />

              </div>

              <h3 className="text-base font-semibold text-gray-800">
                등록된 직원이 없습니다.
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                직원 등록 후 근태를 확인할 수 있습니다.
              </p>

            </div>

          ) : (

            <div>

              {employeeAttendance.map(
                ({
                  employee,
                  schedule,
                  attendance: attendanceRecord,
                  status,
                }) => {

                  const statusInfo =
                    getStatus(status);

                  return (

                    <div
                      key={employee.id}
                      className="flex items-center border-b border-gray-100 px-6 py-5 last:border-b-0 hover:bg-[#FCFCFC]"
                    >

                      {/* 직원 */}

                      <div className="flex min-w-0 flex-1 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5EFE9] text-sm font-bold text-[#5C3A21]">

                          {employee.name?.charAt(
                            0
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-bold text-gray-900">
                            {employee.name}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            직원 #{employee.id}
                          </p>

                        </div>

                      </div>

                      {/* 예정 근무시간 */}

                      <div className="hidden w-[230px] md:block">

                        {schedule ? (

                          <div className="flex items-center gap-2">

                            <Clock3
                              size={16}
                              className="text-gray-400"
                            />

                            <span className="text-sm font-medium text-gray-700">
                              {schedule.startTime}
                            </span>

                            <span className="text-gray-300">
                              ~
                            </span>

                            <span className="text-sm font-medium text-gray-700">
                              {schedule.endTime}
                            </span>

                          </div>

                        ) : (

                          <span className="text-sm text-gray-400">
                            근무 일정 없음
                          </span>

                        )}

                      </div>

                      {/* 실제 출근 */}

                      <div className="hidden w-[150px] lg:block">

                        {attendanceRecord?.checkInTime ? (

                          <div>

                            <p className="text-xs text-gray-400">
                              출근
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-700">
                              {formatTime(
                                attendanceRecord.checkInTime
                              )}
                            </p>

                          </div>

                        ) : (

                          <span className="text-sm text-gray-300">
                            -
                          </span>

                        )}

                      </div>

                      {/* 실제 퇴근 */}

                      <div className="hidden w-[150px] lg:block">

                        {attendanceRecord?.checkOutTime ? (

                          <div>

                            <p className="text-xs text-gray-400">
                              퇴근
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-700">
                              {formatTime(
                                attendanceRecord.checkOutTime
                              )}
                            </p>

                          </div>

                        ) : (

                          <span className="text-sm text-gray-300">
                            -
                          </span>

                        )}

                      </div>

                      {/* 상태 */}

                      <div className="flex w-[150px] items-center justify-end gap-2">

                        {/* 지각 여부 */}
                        {attendanceRecord?.late === true && (
                          <span className="inline-flex items-center rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600">
                            지각
                          </span>
                        )}

                        {/* 현재 근무 상태 */}
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${statusInfo.className}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotClassName}`}
                          />

                          {statusInfo.label}
                        </span>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}