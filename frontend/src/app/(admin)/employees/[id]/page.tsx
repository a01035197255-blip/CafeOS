"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  CalendarDays,
  UserRound,
  ShieldCheck,
  CircleCheck,
  CircleX,
  Pencil,
  X,
} from "lucide-react";

import {
  getStaff,
  updateStaff,
  disableStaff,
} from "@/services/user";

import type {
  StaffResponse,
  UpdateStaffRequest,
} from "@/types/user";

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();

  const staffId = Number(params.id);

  const [staff, setStaff] = useState<StaffResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // 수정 모드
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [disabling, setDisabling] = useState(false);

  // 수정 폼
  const [form, setForm] = useState<UpdateStaffRequest>({
    name: "",
    phone: "",
    birthDate: "",
    gender: "MALE",
    role: "STAFF",
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);

        const data = await getStaff(staffId);

        setStaff(data);

        setForm({
          name: data.name,
          phone: data.phone,
          birthDate: data.birthDate,
          gender: data.gender,
          role: data.role,
        });
      } catch (error) {
        console.error("직원 상세 조회 실패:", error);
        alert("직원 정보를 불러오지 못했습니다.");
        router.push("/employees");
      } finally {
        setLoading(false);
      }
    };

    if (!Number.isNaN(staffId)) {
      fetchStaff();
    }
  }, [staffId, router]);

  const getRoleLabel = (role: StaffResponse["role"]) => {
    switch (role) {
      case "OWNER":
        return "점주";

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

  const formatBirthDate = (birthDate: string) => {
    if (!birthDate) return "-";

    return birthDate.replace(
      /^(\d{4})-(\d{2})-(\d{2})$/,
      "$1년 $2월 $3일"
    );
  };

  // 수정 모드 시작
  const handleEdit = () => {
    if (!staff) return;

    setForm({
      name: staff.name,
      phone: staff.phone,
      birthDate: staff.birthDate,
      gender: staff.gender,
      role: staff.role,
    });

    setIsEditing(true);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    if (!staff) return;

    setForm({
      name: staff.name,
      phone: staff.phone,
      birthDate: staff.birthDate,
      gender: staff.gender,
      role: staff.role,
    });

    setIsEditing(false);
  };

  // 폼 변경
  const handleChange = (
    field: keyof UpdateStaffRequest,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 직원 정보 수정
  const handleUpdate = async () => {
    if (!staff) return;

    if (!form.name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!form.phone.trim()) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    if (!form.birthDate) {
      alert("생년월일을 입력해주세요.");
      return;
    }

    try {
      setSaving(true);

      await updateStaff(staff.id, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        birthDate: form.birthDate,
        gender: form.gender,
        role: form.role,
      });

      const updatedStaff = await getStaff(staff.id);

      setStaff(updatedStaff);

      setForm({
        name: updatedStaff.name,
        phone: updatedStaff.phone,
        birthDate: updatedStaff.birthDate,
        gender: updatedStaff.gender,
        role: updatedStaff.role,
      });

      setIsEditing(false);

      alert("직원 정보가 수정되었습니다.");
    } catch (error) {
      console.error("직원 정보 수정 실패:", error);
      alert("직원 정보 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 직원 비활성화
  const handleDisable = async () => {
    if (!staff) return;

    if (!staff.enabled) {
      alert("이미 비활성화된 직원입니다.");
      return;
    }

    const confirmed = window.confirm(
      `${staff.name} 직원을 비활성화하시겠습니까?\n\n비활성화 후에는 직원 계정을 사용할 수 없습니다.`
    );

    if (!confirmed) return;

    try {
      setDisabling(true);

      await disableStaff(staff.id);

      setStaff((prev) =>
        prev
          ? {
              ...prev,
              enabled: false,
            }
          : prev
      );

      alert("직원이 비활성화되었습니다.");
    } catch (error) {
      console.error("직원 비활성화 실패:", error);
      alert("직원 비활성화에 실패했습니다.");
    } finally {
      setDisabling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7]">
        <main className="mx-auto max-w-[1200px] px-8 py-8">
          <div className="flex min-h-[500px] items-center justify-center">
            <p className="text-sm text-gray-400">
              직원 정보를 불러오는 중...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!staff) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="mx-auto max-w-[1200px] px-8 py-8">

        {/* 상단 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                type="button"
                onClick={() => router.push("/employees")}
                className="mb-5 flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#5C3A21]"
              >
                <ArrowLeft size={17} />
                직원 목록
              </button>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <User
                    size={21}
                    className="text-[#5C3A21]"
                  />

                  <span className="text-sm font-medium text-[#8B735D]">
                    직원 관리
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900">
                  직원 상세
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  직원의 기본 정보와 근무 상태를 확인합니다.
                </p>
              </div>
            </div>

            {/* 상단 버튼 */}
            <div className="flex items-center gap-3">
              {!isEditing && (
                <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#E5E8EB] bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#D8C8B8] hover:bg-[#FAF8F6]"
                  >
                    <Pencil size={16} />
                    수정
                  </button>

                  {staff.enabled && (
                    <button
                      type="button"
                      onClick={handleDisable}
                      disabled={disabling}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CircleX size={16} />
                      {disabling
                        ? "처리 중..."
                        : "직원 비활성화"}
                    </button>
                  )}
                </>
              )}

              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#E5E8EB] bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    <X size={16} />
                    취소
                  </button>

                  <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={saving}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#5C3A21] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4B2F1B] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "저장 중..." : "저장"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 직원 프로필 */}
        <section className="mb-6 rounded-2xl border border-[#E5E8EB] bg-white p-7">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-5">
              {/* 프로필 */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F5EFE9] text-2xl font-bold text-[#5C3A21]">
                {staff.name.charAt(0)}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {staff.name}
                  </h2>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      staff.enabled
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        staff.enabled
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />

                    {staff.enabled ? "활성" : "비활성"}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-400">
                  직원 ID #{staff.id}
                </p>
              </div>
            </div>

            {/* 역할 */}
            <div className="text-right">
              <p className="mb-2 text-xs font-medium text-gray-400">
                역할
              </p>

              <span className="inline-flex rounded-lg bg-[#F5EDE5] px-3 py-1.5 text-sm font-semibold text-[#5C3A21]">
                {getRoleLabel(staff.role)}
              </span>
            </div>

          </div>
        </section>

        {/* 기본 정보 */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">

          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="font-bold text-gray-900">
              기본 정보
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              직원 등록 정보를 확인할 수 있습니다.
            </p>
          </div>

          {isEditing ? (
            /* =========================
               수정 폼
            ========================= */
            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* 이름 */}
              <div className="border-b border-gray-100 p-6 md:border-r">
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  이름
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    handleChange("name", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-[#8B735D] focus:ring-2 focus:ring-[#F5EFE9]"
                  placeholder="이름"
                />
              </div>

              {/* 이메일 */}
              <div className="border-b border-gray-100 p-6">
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  이메일
                </label>

                <input
                  type="text"
                  value={staff.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-400"
                />

                <p className="mt-2 text-xs text-gray-400">
                  이메일은 수정할 수 없습니다.
                </p>
              </div>

              {/* 전화번호 */}
              <div className="border-b border-gray-100 p-6 md:border-r">
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  연락처
                </label>

                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    handleChange("phone", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-[#8B735D] focus:ring-2 focus:ring-[#F5EFE9]"
                  placeholder="010-0000-0000"
                />
              </div>

              {/* 생년월일 */}
              <div className="border-b border-gray-100 p-6">
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  생년월일
                </label>

                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) =>
                    handleChange(
                      "birthDate",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-[#8B735D] focus:ring-2 focus:ring-[#F5EFE9]"
                />
              </div>

              {/* 성별 */}
              <div className="border-b border-gray-100 p-6 md:border-r md:border-b-0">
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  성별
                </label>

                <select
                  value={form.gender}
                  onChange={(e) =>
                    handleChange(
                      "gender",
                      e.target.value
                    )
                  }
                  className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-[#8B735D] focus:ring-2 focus:ring-[#F5EFE9]"
                >
                  <option value="MALE">남성</option>
                  <option value="FEMALE">여성</option>
                </select>
              </div>

              {/* 역할 */}
              <div className="p-6">
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  권한
                </label>

                <select
                  value={form.role}
                  onChange={(e) =>
                    handleChange(
                      "role",
                      e.target.value
                    )
                  }
                  className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-[#8B735D] focus:ring-2 focus:ring-[#F5EFE9]"
                >
                  <option value="STAFF">직원</option>
                  <option value="MANAGER">매니저</option>
                  <option value="OWNER">점주</option>
                </select>
              </div>

            </div>
          ) : (
            /* =========================
               기존 상세 정보
            ========================= */
            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* 이름 */}
              <div className="border-b border-gray-100 p-6 md:border-r">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5EFE9]">
                    <UserRound
                      size={18}
                      className="text-[#5C3A21]"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      이름
                    </p>

                    <p className="mt-1.5 text-sm font-semibold text-gray-900">
                      {staff.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* 이메일 */}
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5EFE9]">
                    <Mail
                      size={18}
                      className="text-[#5C3A21]"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      이메일
                    </p>

                    <p className="mt-1.5 text-sm font-semibold text-gray-900">
                      {staff.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* 전화번호 */}
              <div className="border-b border-gray-100 p-6 md:border-r">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5EFE9]">
                    <Phone
                      size={18}
                      className="text-[#5C3A21]"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      연락처
                    </p>

                    <p className="mt-1.5 text-sm font-semibold text-gray-900">
                      {formatPhone(staff.phone)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 생년월일 */}
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EFE9]">
                    <CalendarDays
                      size={18}
                      className="text-[#5C3A21]"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      생년월일
                    </p>

                    <p className="mt-1.5 text-sm font-semibold text-gray-900">
                      {formatBirthDate(
                        staff.birthDate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 성별 */}
              <div className="p-6 md:border-r">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EFE9]">
                    <User
                      size={18}
                      className="text-[#5C3A21]"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      성별
                    </p>

                    <p className="mt-1.5 text-sm font-semibold text-gray-900">
                      {getGenderLabel(staff.gender)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 역할 */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EFE9]">
                    <ShieldCheck
                      size={18}
                      className="text-[#5C3A21]"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      권한
                    </p>

                    <p className="mt-1.5 text-sm font-semibold text-gray-900">
                      {getRoleLabel(staff.role)}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </section>

        {/* 근무 상태 */}
        <section className="rounded-2xl border border-[#E5E8EB] bg-white">

          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="font-bold text-gray-900">
              근무 상태
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              현재 직원의 계정 및 근무 상태입니다.
            </p>
          </div>

          <div className="p-6">
            <div
              className={`flex items-center justify-between rounded-xl px-5 py-4 ${
                staff.enabled
                  ? "bg-green-50"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">

                {staff.enabled ? (
                  <CircleCheck
                    size={22}
                    className="text-green-600"
                  />
                ) : (
                  <CircleX
                    size={22}
                    className="text-gray-400"
                  />
                )}

                <div>
                  <p
                    className={`text-sm font-bold ${
                      staff.enabled
                        ? "text-green-700"
                        : "text-gray-600"
                    }`}
                  >
                    {staff.enabled
                      ? "활성 직원"
                      : "비활성 직원"}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {staff.enabled
                      ? "현재 정상적으로 근무 가능한 상태입니다."
                      : "현재 비활성화된 직원입니다."}
                  </p>
                </div>

              </div>

              <span
                className={`text-sm font-semibold ${
                  staff.enabled
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {staff.enabled ? "활성" : "비활성"}
              </span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}