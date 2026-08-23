"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Save,
  UserPlus,
} from "lucide-react";

import { createStaff } from "@/services/user";
import type { CreateStaffRequest } from "@/types/user";
import type {
  Gender,
  UserRole,
} from "@/types/user-role";

export default function CreateEmployeePage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] =
    useState<Gender>("MALE");
  const [role, setRole] =
    useState<UserRole>("STAFF");

  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!phone.trim()) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    if (!birthDate) {
      alert("생년월일을 입력해주세요.");
      return;
    }

    const request: CreateStaffRequest = {
      email: email.trim(),
      password,
      name: name.trim(),
      phone: phone.trim(),
      birthDate,
      gender,
      role,
    };

    try {
      setSaving(true);

      await createStaff(request);

      alert("직원이 등록되었습니다.");

      router.push("/employees");
    } catch (error) {
      console.error("직원 등록 실패:", error);

      alert(
        "직원 등록에 실패했습니다. 입력 정보를 확인해주세요."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="mx-auto max-w-[1000px] px-8 py-8">

        {/* 뒤로가기 */}
        <button
          type="button"
          onClick={() =>
            router.push("/employees")
          }
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-gray-500 transition hover:text-[#5C3A21]"
        >
          <ArrowLeft size={17} />
          직원 관리
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <BriefcaseBusiness
              size={21}
              className="text-[#5C3A21]"
            />

            <span className="text-sm font-medium text-[#8B735D]">
              운영 관리
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            직원 등록
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            매장에서 근무할 새로운 직원을 등록합니다.
          </p>
        </div>

        {/* Form */}
        <section className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">

          {/* Section Header */}
          <div className="flex items-center gap-4 border-b border-gray-100 px-7 py-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5EFE9]">
              <UserPlus
                size={21}
                className="text-[#5C3A21]"
              />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                직원 정보
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                직원의 기본 정보와 계정 정보를 입력해주세요.
              </p>
            </div>
          </div>

          {/* Form Body */}
          <div className="space-y-8 px-7 py-7">

            {/* 계정 정보 */}
            <div>
              <div className="mb-5">
                <h3 className="text-sm font-bold text-gray-900">
                  계정 정보
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  직원이 시스템에 로그인할 때 사용하는 정보입니다.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* 이메일 */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    이메일
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="example@cafeos.com"
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
                  />
                </div>

                {/* 비밀번호 */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    초기 비밀번호
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="초기 비밀번호 입력"
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
                  />
                </div>

              </div>
            </div>

            {/* 기본 정보 */}
            <div className="border-t border-gray-100 pt-8">
              <div className="mb-5">
                <h3 className="text-sm font-bold text-gray-900">
                  기본 정보
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  직원의 개인정보를 입력해주세요.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* 이름 */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    이름
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="직원 이름"
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
                  />
                </div>

                {/* 전화번호 */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    전화번호
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="01012345678"
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
                  />
                </div>

                {/* 생년월일 */}
                <div>
                  <label
                    htmlFor="birthDate"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    생년월일
                  </label>

                  <input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) =>
                      setBirthDate(e.target.value)
                    }
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none transition focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
                  />
                </div>

                {/* 성별 */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    성별
                  </label>

                  <div className="grid grid-cols-2 gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        setGender("MALE")
                      }
                      className={`h-12 cursor-pointer rounded-xl border text-sm font-semibold transition ${
                        gender === "MALE"
                          ? "border-[#5C3A21] bg-[#F5EFE9] text-[#5C3A21]"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      남성
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setGender("FEMALE")
                      }
                      className={`h-12 cursor-pointer rounded-xl border text-sm font-semibold transition ${
                        gender === "FEMALE"
                          ? "border-[#5C3A21] bg-[#F5EFE9] text-[#5C3A21]"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      여성
                    </button>

                  </div>
                </div>

              </div>
            </div>

            {/* 근무 정보 */}
            <div className="border-t border-gray-100 pt-8">
              <div className="mb-5">
                <h3 className="text-sm font-bold text-gray-900">
                  근무 정보
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  직원의 시스템 권한을 설정합니다.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  역할
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  {/* STAFF */}
                  <button
                    type="button"
                    onClick={() =>
                      setRole("STAFF")
                    }
                    className={`cursor-pointer rounded-xl border p-4 text-left transition ${
                      role === "STAFF"
                        ? "border-[#5C3A21] bg-[#F5EFE9]"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <p
                      className={`text-sm font-bold ${
                        role === "STAFF"
                          ? "text-[#5C3A21]"
                          : "text-gray-800"
                      }`}
                    >
                      직원
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      일반적인 매장 업무를 수행합니다.
                    </p>
                  </button>

                  {/* MANAGER */}
                  <button
                    type="button"
                    onClick={() =>
                      setRole("MANAGER")
                    }
                    className={`cursor-pointer rounded-xl border p-4 text-left transition ${
                      role === "MANAGER"
                        ? "border-[#5C3A21] bg-[#F5EFE9]"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <p
                      className={`text-sm font-bold ${
                        role === "MANAGER"
                          ? "text-[#5C3A21]"
                          : "text-gray-800"
                      }`}
                    >
                      매니저
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      매장 운영 및 직원 관리를 담당합니다.
                    </p>
                  </button>

                </div>
              </div>
            </div>

          </div>

          {/* Bottom */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-[#FCFCFC] px-7 py-5">

            <button
              type="button"
              onClick={() =>
                router.push("/employees")
              }
              disabled={saving}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              취소
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#5C3A21] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4A2E1A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {saving
                ? "등록 중..."
                : "직원 등록"}
            </button>

          </div>

        </section>
      </main>
    </div>
  );
}