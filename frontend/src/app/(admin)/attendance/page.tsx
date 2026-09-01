"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Clock3,
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import { getMyInfo } from "@/services/user";

import {
  checkIn,
  checkOut,
  getAttendanceList,
  getMyAttendance,
} from "@/services/attendance";

import type { AttendanceResponse } from "@/types/attendance";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<
    AttendanceResponse[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [search, setSearch] = useState("");

  /**
   * 근태 목록 조회
   */
  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const me = await getMyInfo();

      const data =
        me?.role === "STAFF"
          ? await getMyAttendance()
          : await getAttendanceList();

      setAttendance(data);
    } catch (error) {
      console.error(
        "근태 목록 조회 실패:",
        error
      );

      alert(
        "근태 목록을 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

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

      await fetchAttendance();
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

      await fetchAttendance();
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
   * 직원 검색
   */
  const filteredAttendance = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {
      return attendance;
    }

    return attendance.filter((item) =>
      item.employee
        .toLowerCase()
        .includes(keyword)
    );
  }, [attendance, search]);

  /**
   * 현재 근무 중인 직원
   */
  const workingCount = attendance.filter(
    (item) =>
      item.checkInTime &&
      !item.checkOutTime
  ).length;

  /**
   * 퇴근 완료
   */
  const completedCount = attendance.filter(
    (item) =>
      item.checkInTime &&
      item.checkOutTime
  ).length;

  /**
   * 날짜/시간 표시
   */
  const formatDateTime = (
    value: string | null
  ) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * 근무 시간 표시
   */
  const formatWorkMinutes = (
    minutes: number | null
  ) => {
    if (
      minutes === null ||
      minutes === undefined
    ) {
      return "-";
    }

    const hours = Math.floor(
      minutes / 60
    );

    const remain = minutes % 60;

    if (hours === 0) {
      return `${remain}분`;
    }

    if (remain === 0) {
      return `${hours}시간`;
    }

    return `${hours}시간 ${remain}분`;
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="mx-auto max-w-[1400px] px-8 py-8">

        {/* =========================
            Page Header
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
              직원들의 출퇴근 및 근무 시간을 관리합니다.
            </p>
          </div>

          {/* 출퇴근 버튼 */}
          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={handleCheckIn}
              disabled={processing}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#5C3A21] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4A2E1A] disabled:cursor-not-allowed disabled:opacity-50"
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
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={17} />

              퇴근
            </button>

          </div>
        </div>

        {/* =========================
            Summary Cards
        ========================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* 전체 */}
          <div className="rounded-2xl border border-[#E5E8EB] bg-white p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-gray-400">
                  전체 근태
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {attendance.length}

                  <span className="ml-1 text-sm font-medium text-gray-400">
                    건
                  </span>
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5EFE9]">
                <Users
                  size={20}
                  className="text-[#5C3A21]"
                />
              </div>

            </div>
          </div>

          {/* 근무 중 */}
          <div className="rounded-2xl border border-[#E5E8EB] bg-white p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-gray-400">
                  현재 근무 중
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {workingCount}

                  <span className="ml-1 text-sm font-medium text-gray-400">
                    명
                  </span>
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <Clock3
                  size={20}
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

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                <LogOut
                  size={20}
                  className="text-gray-500"
                />
              </div>

            </div>
          </div>

        </div>

        {/* =========================
            Search
        ========================= */}

        <div className="mb-6 rounded-2xl border border-[#E5E8EB] bg-white p-5">

          <div className="flex items-center justify-between gap-4">

            <div className="relative max-w-md flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="직원명을 검색하세요"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
              />

            </div>

            <button
              type="button"
              onClick={fetchAttendance}
              disabled={loading}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

          </div>

        </div>

        {/* =========================
            Attendance Table
        ========================= */}

        <section className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">

          <div className="border-b border-gray-100 px-6 py-5">

            <h2 className="font-bold text-gray-900">
              근태 기록
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              검색 결과{" "}
              {filteredAttendance.length}
              건
            </p>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-sm text-gray-400">
                근태 정보를 불러오는 중...
              </p>
            </div>
          ) : filteredAttendance.length === 0 ? (

            /* Empty */
            <div className="flex min-h-[400px] flex-col items-center justify-center">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5EFE9]">
                <Clock3
                  size={28}
                  className="text-[#8B735D]"
                />
              </div>

              <h3 className="text-base font-semibold text-gray-800">
                근태 기록이 없습니다.
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                등록된 출퇴근 기록이 없습니다.
              </p>

            </div>

          ) : (

            /* Table */
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b border-gray-100 bg-[#FAFAFA]">

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">
                      직원
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">
                      출근 시간
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">
                      퇴근 시간
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">
                      근무 시간
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">
                      상태
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredAttendance.map(
                    (item) => {

                      const working =
                        Boolean(
                          item.checkInTime &&
                          !item.checkOutTime
                        );

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-gray-100 last:border-b-0 hover:bg-[#FCFCFC]"
                        >

                          {/* 직원 */}
                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EFE9] text-sm font-bold text-[#5C3A21]">
                                {item.employee.charAt(
                                  0
                                )}
                              </div>

                              <div>

                                <p className="text-sm font-bold text-gray-900">
                                  {item.employee}
                                </p>

                                <p className="mt-0.5 text-xs text-gray-400">
                                  근태 #{item.id}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* 출근 */}
                          <td className="px-6 py-5">
                            <span className="text-sm text-gray-600">
                              {formatDateTime(
                                item.checkInTime
                              )}
                            </span>
                          </td>

                          {/* 퇴근 */}
                          <td className="px-6 py-5">
                            <span className="text-sm text-gray-600">
                              {formatDateTime(
                                item.checkOutTime
                              )}
                            </span>
                          </td>

                          {/* 근무 시간 */}
                          <td className="px-6 py-5">
                            <span className="text-sm font-medium text-gray-700">
                              {formatWorkMinutes(
                                item.workMinutes
                              )}
                            </span>
                          </td>

                          {/* 상태 */}
                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                working
                                  ? "bg-green-50 text-green-600"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >

                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  working
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                }`}
                              />

                              {working
                                ? "근무 중"
                                : "퇴근 완료"}

                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </main>
    </div>
  );
}