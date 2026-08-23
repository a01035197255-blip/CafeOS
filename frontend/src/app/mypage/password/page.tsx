"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

import { changePassword } from "@/services/user";
import Header from "@/components/layout/Header";
import type { ChangePasswordRequest } from "@/types/user";

export default function PasswordPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const handleSubmit = async () => {
    if (!currentPassword) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }

    if (!newPassword) {
      alert("새 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword.length < 8) {
      alert(
        "새 비밀번호는 8자 이상 입력해주세요."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert(
        "새 비밀번호가 서로 일치하지 않습니다."
      );
      return;
    }

    if (currentPassword === newPassword) {
      alert(
        "현재 비밀번호와 다른 비밀번호를 입력해주세요."
      );
      return;
    }

    const request: ChangePasswordRequest = {
      currentPassword,
      newPassword,
    };

    try {
      setSaving(true);

      await changePassword(request);

      alert("비밀번호가 변경되었습니다.");

      router.push("/mypage");
    } catch (error) {
      console.error(
        "비밀번호 변경 실패:",
        error
      );

      alert(
        "비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요."
      );
    } finally {
      setSaving(false);
    }
  };

  return (

      <>
            {/* Header */}
            <Header />
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="mx-auto max-w-[800px] px-8 py-8">

        {/* 뒤로가기 */}
        <button
          type="button"
          onClick={() =>
            router.push("/mypage")
          }
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-gray-500 transition hover:text-[#5C3A21]"
        >
          <ArrowLeft size={17} />
          내 정보
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <Lock
              size={21}
              className="text-[#5C3A21]"
            />

            <span className="text-sm font-medium text-[#8B735D]">
              계정 관리
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            비밀번호 변경
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            계정의 비밀번호를 안전하게 변경할 수 있습니다.
          </p>
        </div>

        {/* Card */}
        <section className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">

          {/* Card Header */}
          <div className="flex items-center gap-4 border-b border-gray-100 px-7 py-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5EFE9]">
              <Lock
                size={20}
                className="text-[#5C3A21]"
              />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                비밀번호 변경
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                현재 비밀번호와 새로운 비밀번호를 입력해주세요.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6 px-7 py-7">

            {/* 현재 비밀번호 */}
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                현재 비밀번호
              </label>

              <div className="relative">
                <input
                  id="currentPassword"
                  type={
                    showCurrent
                      ? "text"
                      : "password"
                  }
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                  placeholder="현재 비밀번호"
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrent(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-100" />

            {/* 새 비밀번호 */}
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                새 비밀번호
              </label>

              <div className="relative">
                <input
                  id="newPassword"
                  type={
                    showNew
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="새 비밀번호"
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNew(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                새 비밀번호는 8자 이상 입력해주세요.
              </p>
            </div>

            {/* 새 비밀번호 확인 */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                새 비밀번호 확인
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={
                    showConfirm
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="새 비밀번호 다시 입력"
                  className={`h-12 w-full rounded-xl border px-4 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-[#5C3A21]/10 ${
                    confirmPassword &&
                    confirmPassword !==
                      newPassword
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-[#5C3A21]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {confirmPassword &&
                confirmPassword !==
                  newPassword && (
                  <p className="mt-2 text-xs text-red-500">
                    새 비밀번호가 일치하지 않습니다.
                  </p>
                )}
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-100 bg-[#FCFCFC] px-7 py-5">

            <button
              type="button"
              onClick={() =>
                router.push("/mypage")
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
                ? "변경 중..."
                : "비밀번호 변경"}
            </button>

          </div>

        </section>

      </main>
    </div>
  </>
 );
}