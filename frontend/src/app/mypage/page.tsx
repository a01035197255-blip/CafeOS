"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  CalendarDays,
  Save,
  Lock,
} from "lucide-react";

import {
  getMyInfo,
  updateMyInfo,
} from "@/services/user";

import type {
  UserResponse,
  UpdateMyInfoRequest,
} from "@/types/user";

export default function MyPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<UserResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] =
    useState<"MALE" | "FEMALE">("MALE");

  /**
   * 내 정보 조회
   */
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        setLoading(true);

        const data = await getMyInfo();

        setUser(data);

        setName(data.name);
        setPhone(data.phone);
        setBirthDate(data.birthDate);
        setGender(data.gender);
      } catch (error) {
        console.error(
          "내 정보 조회 실패:",
          error
        );

        alert(
          "내 정보를 불러오지 못했습니다."
        );

        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchMyInfo();
  }, [router]);

  /**
   * 역할 이름
   */
  const getRoleLabel = (
    role: UserResponse["role"]
  ) => {
    switch (role) {
      case "OWNER":
        return "사장님";

      case "MANAGER":
        return "매니저";

      case "STAFF":
        return "직원";

      default:
        return role;
    }
  };

  /**
   * 정보 수정
   */
  const handleSubmit = async () => {
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

    const request: UpdateMyInfoRequest = {
      name: name.trim(),
      phone: phone.trim(),
      birthDate,
      gender,
    };

    try {
      setSaving(true);

      await updateMyInfo(request);

      alert("내 정보가 수정되었습니다.");

      const updatedUser = await getMyInfo();

      setUser(updatedUser);

      setName(updatedUser.name);
      setPhone(updatedUser.phone);
      setBirthDate(updatedUser.birthDate);
      setGender(updatedUser.gender);
    } catch (error) {
      console.error(
        "내 정보 수정 실패:",
        error
      );

      alert(
        "내 정보 수정에 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * 로딩
   */
  if (loading) {
    return (


      <div className="min-h-screen bg-[#F4F5F7]">
        <main className="mx-auto flex min-h-[600px] max-w-[1000px] items-center justify-center px-8">
          <p className="text-sm text-gray-400">
            내 정보를 불러오는 중...
          </p>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
      <>
          <Header />

    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="mx-auto max-w-[1000px] px-8 py-8">

        {/* 뒤로가기 */}
        <button
          type="button"
          onClick={() =>
            router.push("/dashboard")
          }
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-gray-500 transition hover:text-[#5C3A21]"
        >
          <ArrowLeft size={17} />

          대시보드
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <User
              size={21}
              className="text-[#5C3A21]"
            />

            <span className="text-sm font-medium text-[#8B735D]">
              계정 관리
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            내 정보
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            로그인한 계정의 정보를 확인하고 수정할 수 있습니다.
          </p>
        </div>

        {/* Profile */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">

          <div className="flex items-center gap-4 border-b border-gray-100 px-7 py-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5C3A21] text-xl text-white">
              ☕
            </div>

            <div>
              <p className="text-lg font-bold text-gray-900">
                {user.name}
              </p>

              <p className="mt-1 text-sm text-gray-400">
                {getRoleLabel(user.role)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 px-7 py-6 md:grid-cols-2">

            {/* 이메일 */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                이메일
              </label>

              <div className="flex h-12 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4">
                <Mail
                  size={17}
                  className="text-gray-400"
                />

                <span className="text-sm text-gray-500">
                  {user.email}
                </span>
              </div>

              <p className="mt-1.5 text-xs text-gray-400">
                이메일은 변경할 수 없습니다.
              </p>
            </div>

            {/* 역할 */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                역할
              </label>

              <div className="flex h-12 items-center rounded-xl border border-gray-200 bg-gray-50 px-4">
                <span className="rounded-lg bg-[#F5EFE9] px-3 py-1 text-xs font-semibold text-[#5C3A21]">
                  {user.role}
                </span>

                <span className="ml-2 text-sm text-gray-500">
                  {getRoleLabel(user.role)}
                </span>
              </div>

              <p className="mt-1.5 text-xs text-gray-400">
                역할은 관리자만 변경할 수 있습니다.
              </p>
            </div>

          </div>
        </section>

        {/* Basic Information */}
        <section className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">

          <div className="flex items-center gap-4 border-b border-gray-100 px-7 py-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5EFE9]">
              <User
                size={20}
                className="text-[#5C3A21]"
              />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                기본 정보
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                필요한 경우 정보를 수정해주세요.
              </p>
            </div>
          </div>

          <div className="space-y-6 px-7 py-7">

            {/* 이름 / 전화번호 */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* 이름 */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  이름
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
                  />
                </div>
              </div>

              {/* 전화번호 */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  전화번호
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="01012345678"
                    className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
                  />
                </div>
              </div>

            </div>

            {/* 생년월일 / 성별 */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* 생년월일 */}
              <div>
                <label
                  htmlFor="birthDate"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  생년월일
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) =>
                      setBirthDate(
                        e.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
                  />
                </div>
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

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 bg-[#FCFCFC] px-7 py-5">

            <button
              type="button"
              onClick={() =>
                router.push("/mypage/password")
              }
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <Lock size={16} />

              비밀번호 변경
            </button>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  router.push("/dashboard")
                }
                disabled={saving}
                className="cursor-pointer rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
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
                  ? "저장 중..."
                  : "변경사항 저장"}
              </button>

            </div>
          </div>

        </section>

      </main>
    </div>
   </>
  );
}