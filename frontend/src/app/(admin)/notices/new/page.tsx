"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Pin,
  Save,
} from "lucide-react";

import { createNotice } from "@/services/notice";
import type { CreateNoticeRequest } from "@/types/notice";

export default function NoticeCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);

  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      alert("공지 제목을 입력해주세요.");
      return;
    }

    if (!trimmedContent) {
      alert("공지 내용을 입력해주세요.");
      return;
    }

    const request: CreateNoticeRequest = {
      title: trimmedTitle,
      content: trimmedContent,
      pinned,
    };

    try {
      setSaving(true);

      await createNotice(request);

      alert("공지사항이 등록되었습니다.");

      router.push("/notices");
    } catch (error) {
      console.error("공지사항 등록 실패:", error);
      alert("공지사항 등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="mx-auto max-w-[1100px] px-8 py-8">

        {/* 뒤로가기 */}
        <button
          type="button"
          onClick={() => router.push("/notices")}
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-gray-500 transition hover:text-[#5C3A21]"
        >
          <ArrowLeft size={17} />
          공지사항
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <Bell
              size={21}
              className="text-[#5C3A21]"
            />

            <span className="text-sm font-medium text-[#8B735D]">
              운영 관리
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            공지사항 등록
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            직원들에게 전달할 새로운 공지사항을 등록합니다.
          </p>
        </div>

        {/* Form */}
        <section className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">

          {/* Section Header */}
          <div className="flex items-center gap-4 border-b border-gray-100 px-7 py-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5EFE9]">
              <Bell
                size={21}
                className="text-[#5C3A21]"
              />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                공지 정보
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                공지 제목과 내용을 입력해주세요.
              </p>
            </div>
          </div>

          {/* Form Body */}
          <div className="space-y-7 px-7 py-7">

            {/* 제목 */}
            <div>
              <label
                htmlFor="notice-title"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                제목
              </label>

              <input
                id="notice-title"
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="공지사항 제목을 입력하세요"
                maxLength={100}
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
              />

              <div className="mt-2 flex justify-end">
                <span className="text-xs text-gray-400">
                  {title.length}/100
                </span>
              </div>
            </div>

            {/* 내용 */}
            <div>
              <label
                htmlFor="notice-content"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                내용
              </label>

              <textarea
                id="notice-content"
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="공지사항 내용을 입력하세요"
                rows={12}
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
              />

              <p className="mt-2 text-xs text-gray-400">
                직원들이 이해하기 쉽도록 공지 내용을 작성해주세요.
              </p>
            </div>

            {/* 상단 고정 */}
            <div className="rounded-xl border border-[#E8E1D9] bg-[#FCFAF8] p-5">

              <label className="flex cursor-pointer items-start gap-4">

                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) =>
                    setPinned(e.target.checked)
                  }
                  className="mt-1 h-4 w-4 cursor-pointer accent-[#5C3A21]"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Pin
                      size={16}
                      className="text-[#5C3A21]"
                    />

                    <span className="text-sm font-semibold text-gray-900">
                      상단 고정
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    중요한 공지사항을 목록 상단에 고정합니다.
                  </p>
                </div>

              </label>
            </div>

          </div>

          {/* Bottom */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-[#FCFCFC] px-7 py-5">

            <button
              type="button"
              onClick={() => router.push("/notices")}
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
                : "공지 등록"}
            </button>

          </div>
        </section>

      </main>
    </div>
  );
}