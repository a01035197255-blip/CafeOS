"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Edit3,
  Pin,
  Save,
  Trash2,
  CalendarDays,
  FileText,
} from "lucide-react";

import {
  getNotice,
  updateNotice,
  deleteNotice,
} from "@/services/notice";

import type {
  NoticeResponse,
  UpdateNoticeRequest,
} from "@/types/notice";

export default function NoticeDetailPage() {
  const router = useRouter();
  const params = useParams();

  const noticeId = Number(params.noticeId);

  const [notice, setNotice] =
    useState<NoticeResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);

  /* =========================
     공지 상세 조회
  ========================= */

  useEffect(() => {
    if (!noticeId || Number.isNaN(noticeId)) {
      return;
    }

    const fetchNotice = async () => {
      try {
        setLoading(true);

        const data = await getNotice(noticeId);

        setNotice(data);
        setTitle(data.title);
        setContent(data.content);
        setPinned(data.pinned);
      } catch (error) {
        console.error(
          "공지사항 상세 조회 실패:",
          error
        );

        alert(
          "공지사항을 불러오지 못했습니다."
        );

        router.push("/notices");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [noticeId, router]);

  /* =========================
     날짜 포맷
  ========================= */

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString(
      "ko-KR",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =========================
     수정 취소
  ========================= */

  const handleCancelEdit = () => {
    if (!notice) {
      return;
    }

    setTitle(notice.title);
    setContent(notice.content);
    setPinned(notice.pinned);

    setEditing(false);
  };

  /* =========================
     수정 저장
  ========================= */

  const handleUpdate = async () => {
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

    const request: UpdateNoticeRequest = {
      title: trimmedTitle,
      content: trimmedContent,
      pinned,
    };

    try {
      setSaving(true);

      await updateNotice(
        noticeId,
        request
      );

      const updatedNotice =
        await getNotice(noticeId);

      setNotice(updatedNotice);
      setTitle(updatedNotice.title);
      setContent(updatedNotice.content);
      setPinned(updatedNotice.pinned);

      setEditing(false);

      alert("공지사항이 수정되었습니다.");
    } catch (error) {
      console.error(
        "공지사항 수정 실패:",
        error
      );

      alert(
        "공지사항 수정에 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     삭제
  ========================= */

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "이 공지사항을 삭제하시겠습니까?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      await deleteNotice(noticeId);

      alert("공지사항이 삭제되었습니다.");

      router.push("/notices");
    } catch (error) {
      console.error(
        "공지사항 삭제 실패:",
        error
      );

      alert(
        "공지사항 삭제에 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     Loading
  ========================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7]">
        <main className="mx-auto flex min-h-[650px] max-w-[1100px] items-center justify-center px-8">
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5EFE9]">
              <Bell
                size={25}
                className="text-[#8B735D]"
              />
            </div>

            <p className="text-sm text-gray-400">
              공지사항을 불러오는 중...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!notice) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="mx-auto max-w-[1100px] px-8 py-8">

        {/* =========================
            뒤로가기
        ========================= */}

        <button
          type="button"
          onClick={() =>
            router.push("/notices")
          }
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-gray-500 transition hover:text-[#5C3A21]"
        >
          <ArrowLeft size={17} />
          공지사항
        </button>

        {/* =========================
            페이지 헤더
        ========================= */}

        <div className="mb-7 flex items-end justify-between">
          <div>
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
              공지사항
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              매장 운영에 필요한 공지 내용을 확인할 수 있습니다.
            </p>
          </div>

          <div className="hidden rounded-xl bg-white px-4 py-3 text-right shadow-sm ring-1 ring-[#E5E8EB] sm:block">
            <p className="text-[11px] font-medium text-gray-400">
              NOTICE
            </p>

            <p className="mt-1 text-sm font-bold text-[#5C3A21]">
              #{notice.id}
            </p>
          </div>
        </div>

        {/* =========================
            메인 카드
        ========================= */}

        <section className="overflow-hidden rounded-3xl border border-[#E5E8EB] bg-white shadow-sm">

          {/* =========================
              공지 헤더
          ========================= */}

          <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-[#FBF8F5] to-white px-8 py-9">

            {/* 장식 */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F3EAE1]" />

            <div className="relative">

              {/* 상태 */}
              <div className="mb-5 flex items-center gap-2">

                {notice.pinned && (
                  <span className="flex items-center gap-1.5 rounded-full bg-[#EADCCF] px-3 py-1.5 text-xs font-bold text-[#5C3A21]">
                    <Pin size={13} />
                    상단 고정
                  </span>
                )}

                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-400 ring-1 ring-gray-200">
                  공지사항
                </span>
              </div>

              {!editing ? (
                <>
                  <h2 className="max-w-[850px] text-2xl font-bold leading-10 text-gray-900 md:text-3xl">
                    {notice.title}
                  </h2>

                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <CalendarDays size={14} />

                    <span>
                      {formatDate(
                        notice.createdAt
                      )}
                    </span>
                  </div>
                </>
              ) : (
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
                    maxLength={100}
                    className="h-13 w-full rounded-xl border border-gray-200 bg-white px-4 text-lg font-semibold text-gray-900 outline-none transition focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
                  />

                  <div className="mt-2 text-right text-xs text-gray-400">
                    {title.length}/100
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* =========================
              본문 영역
          ========================= */}

          <div className="px-8 py-8">

            <div className="mb-4 flex items-center gap-2">
              <FileText
                size={17}
                className="text-[#8B735D]"
              />

              <h3 className="text-sm font-bold text-gray-800">
                공지 내용
              </h3>
            </div>

            {!editing ? (
              <div className="min-h-[300px] rounded-2xl border border-[#EEE7E0] bg-[#FAF8F5] px-6 py-7">

                {notice.content ? (
                  <div className="whitespace-pre-wrap text-sm leading-8 text-gray-700">
                    {notice.content}
                  </div>
                ) : (
                  <div className="flex min-h-[250px] items-center justify-center text-sm text-gray-400">
                    등록된 내용이 없습니다.
                  </div>
                )}

              </div>
            ) : (
              <textarea
                id="notice-content"
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                rows={14}
                className="min-h-[300px] w-full resize-none rounded-2xl border border-gray-200 bg-white px-5 py-5 text-sm leading-8 text-gray-900 outline-none transition focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
              />
            )}

            {/* =========================
                수정 모드 고정 설정
            ========================= */}

            {editing && (
              <div className="mt-5 rounded-2xl border border-[#E8E1D9] bg-[#FCFAF8] p-5">

                <label className="flex cursor-pointer items-start gap-4">

                  <input
                    type="checkbox"
                    checked={pinned}
                    onChange={(e) =>
                      setPinned(
                        e.target.checked
                      )
                    }
                    className="mt-1 h-4 w-4 cursor-pointer accent-[#5C3A21]"
                  />

                  <div>
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
                      중요한 공지사항을 목록 상단에 표시합니다.
                    </p>
                  </div>

                </label>
              </div>
            )}

          </div>

          {/* =========================
              공지 정보
          ========================= */}

          <div className="border-t border-gray-100 px-8 py-6">

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <div className="rounded-xl bg-[#F8F7F5] px-5 py-4">
                <p className="text-[11px] font-medium text-gray-400">
                  공지 번호
                </p>

                <p className="mt-1 text-sm font-bold text-gray-800">
                  #{notice.id}
                </p>
              </div>

              <div className="rounded-xl bg-[#F8F7F5] px-5 py-4">
                <p className="text-[11px] font-medium text-gray-400">
                  등록일
                </p>

                <p className="mt-1 text-sm font-bold text-gray-800">
                  {formatDate(
                    notice.createdAt
                  )}
                </p>
              </div>

            </div>

          </div>

          {/* =========================
              하단 버튼
          ========================= */}

          <div className="flex items-center justify-between border-t border-gray-100 bg-[#FCFCFC] px-8 py-5">

            {/* 왼쪽 */}
            <div>
              {!editing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  삭제
                </button>
              )}
            </div>

            {/* 오른쪽 */}
            <div className="flex items-center gap-3">

              {!editing ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setEditing(true)
                    }
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <Edit3 size={16} />
                    수정
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/notices")
                    }
                    className="cursor-pointer rounded-xl bg-[#5C3A21] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A2E1A]"
                  >
                    목록으로
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={
                      handleCancelEdit
                    }
                    disabled={saving}
                    className="cursor-pointer rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    취소
                  </button>

                  <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={saving}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#5C3A21] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A2E1A] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={16} />

                    {saving
                      ? "저장 중..."
                      : "수정 저장"}
                  </button>
                </>
              )}

            </div>
          </div>

        </section>
      </main>
    </div>
  );
}