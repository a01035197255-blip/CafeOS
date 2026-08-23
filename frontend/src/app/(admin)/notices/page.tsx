"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  Pin,
  Plus,
  Search,
  RefreshCw,
} from "lucide-react";

import { getNoticeList } from "@/services/notice";
import type { NoticeResponse } from "@/types/notice";

export default function NoticesPage() {
  const router = useRouter();

  const [notices, setNotices] = useState<NoticeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchNotices = async () => {
    try {
      setLoading(true);

      const data = await getNoticeList();

      setNotices(data);
    } catch (error) {
      console.error("공지사항 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return notices;
    }

    return notices.filter(
      (notice) =>
        notice.title.toLowerCase().includes(keyword) ||
        notice.content.toLowerCase().includes(keyword)
    );
  }, [notices, search]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="mx-auto max-w-[1400px] px-8 py-8">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Bell
                size={20}
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
              직원들에게 전달할 매장 공지사항을 관리할 수 있습니다.
            </p>
          </div>

          {/* 공지 등록 */}
          <button
            type="button"
            onClick={() => router.push("/notices/new")}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#5C3A21] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4A2E1A]"
          >
            <Plus size={17} />
            공지 등록
          </button>
        </div>

        {/* Search */}
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
                placeholder="공지사항 검색"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
              />
            </div>

            <button
              type="button"
              onClick={fetchNotices}
              disabled={loading}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={
                  loading ? "animate-spin" : ""
                }
              />
            </button>
          </div>
        </div>

        {/* Notice List */}
        <section className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">

          {/* List Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="font-bold text-gray-900">
                공지사항 목록
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                총 {filteredNotices.length}개의 공지사항
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[450px] items-center justify-center">
              <p className="text-sm text-gray-400">
                공지사항을 불러오는 중...
              </p>
            </div>
          ) : filteredNotices.length === 0 ? (
            /* Empty */
            <div className="flex min-h-[450px] flex-col items-center justify-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5EFE9]">
                <Bell
                  size={28}
                  className="text-[#8B735D]"
                />
              </div>

              <h3 className="text-base font-semibold text-gray-800">
                등록된 공지사항이 없습니다.
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                새로운 공지사항을 등록해주세요.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/notices/new")
                }
                className="mt-5 flex cursor-pointer items-center gap-2 rounded-xl bg-[#5C3A21] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A2E1A]"
              >
                <Plus size={16} />
                공지 등록
              </button>
            </div>
          ) : (
            /* List */
            <div>
              {filteredNotices.map(
                (notice, index) => (
                  <button
                    key={notice.id}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/notices/${notice.id}`
                      )
                    }
                    className={`group flex w-full cursor-pointer items-center gap-5 px-6 py-5 text-left transition hover:bg-[#FCFAF8] ${
                      index !==
                      filteredNotices.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5EFE9]">
                      {notice.pinned ? (
                        <Pin
                          size={19}
                          className="text-[#5C3A21]"
                        />
                      ) : (
                        <Bell
                          size={19}
                          className="text-[#8B735D]"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">

                      <div className="mb-1 flex items-center gap-2">
                        {notice.pinned && (
                          <span className="rounded-md bg-[#F5EDE5] px-2 py-0.5 text-[11px] font-bold text-[#5C3A21]">
                            PIN
                          </span>
                        )}

                        <h3 className="truncate text-sm font-bold text-gray-900">
                          {notice.title}
                        </h3>
                      </div>

                      <p className="line-clamp-1 text-sm text-gray-500">
                        {notice.content}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        {formatDate(
                          notice.createdAt
                        )}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight
                      size={19}
                      className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[#5C3A21]"
                    />
                  </button>
                )
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}