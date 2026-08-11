"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Coffee,
  Pencil,
  Trash2,
} from "lucide-react";

import { getMenuList } from "@/services/menu";
import type { MenuCategory, MenuResponse } from "@/types/menu";

const categoryLabels: Record<MenuCategory, string> = {
  COFFEE: "커피",
  TEA: "티",
  LATTE: "라떼",
  ADE: "에이드",
  JUICE: "주스",
  BLENDED: "블렌디드",
  YOGURT: "요거트",
  DESSERT: "디저트",
  BAKERY: "베이커리",
  SEASON: "시즌",
};

const categories: MenuCategory[] = [
  "COFFEE",
  "TEA",
  "LATTE",
  "ADE",
  "JUICE",
  "BLENDED",
  "YOGURT",
  "DESSERT",
  "BAKERY",
  "SEASON",
];

export default function MenusPage() {
  const [menus, setMenus] = useState<MenuResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<MenuCategory | "ALL">("ALL");

  const fetchMenus = async () => {
    try {
      setLoading(true);

      const data = await getMenuList();

      setMenus(data);
    } catch (error) {
      console.error("메뉴 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      const matchesCategory =
        selectedCategory === "ALL" ||
        menu.category === selectedCategory;

      const keyword = search.trim().toLowerCase();

      const matchesSearch =
        !keyword ||
        menu.name.toLowerCase().includes(keyword) ||
        menu.description?.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [menus, search, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="max-w-[1500px] mx-auto px-8 py-8">

        {/* 페이지 제목 */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              메뉴관리
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              카페에서 판매하는 메뉴를 관리할 수 있습니다.
            </p>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5C3A21] text-white text-sm font-semibold hover:bg-[#4A2E1A] transition shadow-sm"
          >
            <Plus size={17} />
            메뉴 등록
          </button>
        </div>

        {/* 검색 / 카테고리 */}
        <div className="bg-white border border-[#E5E8EB] rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between gap-5">

            {/* 카테고리 */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedCategory("ALL")}
                className={`shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                  selectedCategory === "ALL"
                    ? "bg-[#5C3A21] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                전체
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                    selectedCategory === category
                      ? "bg-[#5C3A21] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>

            {/* 검색 / 새로고침 */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="메뉴 검색"
                  className="w-60 pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#5C3A21]"
                />
              </div>

              <button
                type="button"
                onClick={fetchMenus}
                disabled={loading}
                className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 메뉴 개수 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-bold text-gray-900">
              메뉴 목록
            </span>

            <span className="ml-2 text-sm text-gray-400">
              {filteredMenus.length}개
            </span>
          </div>
        </div>

        {/* 로딩 */}
        {loading ? (
          <div className="bg-white border border-[#E5E8EB] rounded-2xl h-96 flex items-center justify-center text-sm text-gray-400">
            메뉴를 불러오는 중...
          </div>
        ) : filteredMenus.length === 0 ? (
          <div className="bg-white border border-[#E5E8EB] rounded-2xl h-96 flex flex-col items-center justify-center text-gray-400">
            <Coffee size={42} className="mb-4" />

            <p className="text-sm font-medium">
              등록된 메뉴가 없습니다.
            </p>

            <p className="text-xs mt-1">
              검색 조건을 변경하거나 메뉴를 등록해주세요.
            </p>
          </div>
        ) : (
          /* 메뉴 카드 */
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMenus.map((menu) => (
              <div
                key={menu.id}
                className="bg-white border border-[#E5E8EB] rounded-2xl overflow-hidden hover:shadow-md transition"
              >

                {/* 이미지 */}
                <div className="relative h-48 bg-[#F8F6F3] flex items-center justify-center overflow-hidden">

                  {menu.imageUrl ? (
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Coffee
                      size={42}
                      className="text-gray-300"
                    />
                  )}

                  {/* 판매 여부 */}
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      menu.sale
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {menu.sale ? "판매중" : "판매중지"}
                  </span>
                </div>

                {/* 내용 */}
                <div className="p-5">

                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-[#8B4513] font-semibold">
                        {categoryLabels[menu.category]}
                      </p>

                      <h2 className="mt-1 text-base font-bold text-gray-900 truncate">
                        {menu.name}
                      </h2>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-gray-400 line-clamp-2 min-h-[32px]">
                    {menu.description || "메뉴 설명이 없습니다."}
                  </p>

                  <div className="flex items-end justify-between mt-5">
                    <p className="text-lg font-black text-gray-900">
                      {menu.price.toLocaleString()}
                      <span className="text-sm font-medium ml-0.5">
                        원
                      </span>
                    </p>

                    {/* 관리 버튼 */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="p-2 rounded-lg text-gray-400 hover:text-[#5C3A21] hover:bg-[#FAF7F4] transition"
                        title="수정"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}