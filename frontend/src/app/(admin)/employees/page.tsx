"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  RefreshCw,
  Plus,
  Users,
  ChevronRight,
  UserCheck,
  UserX,
} from "lucide-react";

import { getStaffList } from "@/services/user";
import type { StaffResponse } from "@/types/user";

export default function EmployeesPage() {
  const router = useRouter();

  const [staff, setStaff] = useState<StaffResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const fetchStaff = async () => {
    try {
      setLoading(true);

      const data = await getStaffList();

      setStaff(data);
    } catch (error) {
      console.error("직원 목록 조회 실패:", error);
      alert("직원 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return staff.filter((employee) => {
      const matchesSearch =
        !keyword ||
        employee.name.toLowerCase().includes(keyword) ||
        employee.email.toLowerCase().includes(keyword) ||
        employee.phone.includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && employee.enabled) ||
        (statusFilter === "INACTIVE" && !employee.enabled);

      return matchesSearch && matchesStatus;
    });
  }, [staff, search, statusFilter]);

  const activeCount = staff.filter(
    (employee) => employee.enabled
  ).length;

  const inactiveCount = staff.filter(
    (employee) => !employee.enabled
  ).length;

  const getRoleLabel = (role: StaffResponse["role"]) => {
    switch (role) {
      case "MANAGER":
        return "매니저";
      case "STAFF":
        return "직원";
      default:
        return role;
    }
  };

  const getGenderLabel = (
    gender: StaffResponse["gender"]
  ) => {
    return gender === "MALE" ? "남성" : "여성";
  };

  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, "");

    if (numbers.length === 11) {
      return numbers.replace(
        /(\d{3})(\d{4})(\d{4})/,
        "$1-$2-$3"
      );
    }

    return phone;
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="mx-auto max-w-[1400px] px-8 py-8">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Users
                size={21}
                className="text-[#5C3A21]"
              />

              <span className="text-sm font-medium text-[#8B735D]">
                운영 관리
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              직원 관리
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              매장 직원의 정보와 근무 상태를 관리합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/employees/new")
            }
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#5C3A21] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4A2E1A]"
          >
            <Plus size={17} />
            직원 등록
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-[#E5E8EB] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400">
                  전체 직원
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {staff.length}
                  <span className="ml-1 text-sm font-medium text-gray-400">
                    명
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

          <div className="rounded-2xl border border-[#E5E8EB] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400">
                  활성 직원
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {activeCount}
                  <span className="ml-1 text-sm font-medium text-gray-400">
                    명
                  </span>
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <UserCheck
                  size={20}
                  className="text-green-600"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E8EB] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400">
                  비활성 직원
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {inactiveCount}
                  <span className="ml-1 text-sm font-medium text-gray-400">
                    명
                  </span>
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                <UserX
                  size={20}
                  className="text-gray-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Search / Filter */}
        <div className="mb-6 rounded-2xl border border-[#E5E8EB] bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

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
                placeholder="이름, 이메일, 전화번호 검색"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
              />
            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() =>
                  setStatusFilter("ALL")
                }
                className={`cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  statusFilter === "ALL"
                    ? "bg-[#5C3A21] text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                전체
              </button>

              <button
                type="button"
                onClick={() =>
                  setStatusFilter("ACTIVE")
                }
                className={`cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  statusFilter === "ACTIVE"
                    ? "bg-[#5C3A21] text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                활성
              </button>

              <button
                type="button"
                onClick={() =>
                  setStatusFilter("INACTIVE")
                }
                className={`cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  statusFilter === "INACTIVE"
                    ? "bg-[#5C3A21] text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                비활성
              </button>

              <button
                type="button"
                onClick={fetchStaff}
                disabled={loading}
                className="ml-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
        </div>

        {/* Employee Table */}
        <section className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">

          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="font-bold text-gray-900">
                직원 목록
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                검색 결과 {filteredStaff.length}명
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[450px] items-center justify-center">
              <p className="text-sm text-gray-400">
                직원 목록을 불러오는 중...
              </p>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="flex min-h-[450px] flex-col items-center justify-center">

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
                새로운 직원을 등록해주세요.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/employees/new")
                }
                className="mt-5 flex cursor-pointer items-center gap-2 rounded-xl bg-[#5C3A21] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A2E1A]"
              >
                <Plus size={16} />
                직원 등록
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FAFAFA]">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">
                      직원
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">
                      이메일
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">
                      연락처
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">
                      성별
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">
                      역할
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">
                      상태
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400">
                      관리
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStaff.map(
                    (employee) => (
                      <tr
                        key={employee.id}
                        onClick={() =>
                          router.push(
                            `/employees/${employee.id}`
                          )
                        }
                        className="cursor-pointer border-b border-gray-100 transition last:border-b-0 hover:bg-[#FCFAF8]"
                      >

                        {/* 직원 */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EFE9] text-sm font-bold text-[#5C3A21]">
                              {employee.name
                                .charAt(0)}
                            </div>

                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {employee.name}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-400">
                                #{employee.id}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* 이메일 */}
                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-600">
                            {employee.email}
                          </span>
                        </td>

                        {/* 연락처 */}
                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-600">
                            {formatPhone(
                              employee.phone
                            )}
                          </span>
                        </td>

                        {/* 성별 */}
                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-600">
                            {getGenderLabel(
                              employee.gender
                            )}
                          </span>
                        </td>

                        {/* 역할 */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
                              employee.role ===
                              "MANAGER"
                                ? "bg-[#F5EDE5] text-[#5C3A21]"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {getRoleLabel(
                              employee.role
                            )}
                          </span>
                        </td>

                        {/* 상태 */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                              employee.enabled
                                ? "bg-green-50 text-green-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                employee.enabled
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            />

                            {employee.enabled
                              ? "활성"
                              : "비활성"}
                          </span>
                        </td>

                        {/* 관리 */}
                        <td className="px-6 py-5 text-right">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#5C3A21]">
                            상세
                            <ChevronRight
                              size={16}
                            />
                          </span>
                        </td>

                      </tr>
                    )
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