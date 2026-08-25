"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Coffee, Save } from "lucide-react";

import { createMenu } from "@/services/menu";
import type { CreateMenuRequest, MenuCategory } from "@/types/menu";

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

export default function MenuCreatePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] =
    useState<MenuCategory>("COFFEE");
  const [season, setSeason] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("메뉴명을 입력해주세요.");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("가격을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const request: CreateMenuRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        price: Number(price),
        category,
        season,
        imageUrl: imageUrl.trim() || undefined,
      };

      const menu = await createMenu(request);

      alert("메뉴가 등록되었습니다.");

      router.push(`/recipes/new?menuId=${menu.id}`);
    } catch (error) {
      console.error("메뉴 등록 실패:", error);
      alert("메뉴 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="max-w-[1100px] mx-auto px-8 py-8">

        {/* 상단 */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2.5 rounded-xl border border-[#E5E8EB] bg-white text-gray-500 hover:bg-gray-50 transition"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              메뉴 등록
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              새로운 메뉴를 등록할 수 있습니다.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

            {/* 왼쪽 - 이미지 */}
            <div className="bg-white border border-[#E5E8EB] rounded-2xl p-6 h-fit">

              <h2 className="text-sm font-bold text-gray-900 mb-4">
                메뉴 이미지
              </h2>

              <div className="aspect-square rounded-xl bg-[#F8F6F3] border border-[#E5E8EB] overflow-hidden flex items-center justify-center">

                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="메뉴 이미지 미리보기"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-300">
                    <Coffee size={48} />
                    <p className="mt-3 text-xs">
                      이미지 URL을 입력해주세요.
                    </p>
                  </div>
                )}

              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  이미지 URL
                </label>

                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/menus/americano.jpg"
                  className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#5C3A21] transition"
                />

                <p className="mt-2 text-[11px] text-gray-400 leading-relaxed">
                  예: /images/menus/signature-americano.jpg
                </p>
              </div>
            </div>

            {/* 오른쪽 - 입력 */}
            <div className="bg-white border border-[#E5E8EB] rounded-2xl p-7">

              <h2 className="text-base font-bold text-gray-900">
                메뉴 정보
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                메뉴의 기본 정보를 입력해주세요.
              </p>

              <div className="mt-7 space-y-6">

                {/* 메뉴명 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    메뉴명
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 시그니처 아메리카노"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#5C3A21] focus:ring-1 focus:ring-[#5C3A21] transition"
                  />
                </div>

                {/* 설명 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    메뉴 설명
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="메뉴에 대한 설명을 입력해주세요."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:border-[#5C3A21] focus:ring-1 focus:ring-[#5C3A21] transition"
                  />
                </div>

                {/* 가격 / 카테고리 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* 가격 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      판매 가격
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="4500"
                        className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#5C3A21] focus:ring-1 focus:ring-[#5C3A21] transition"
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        원
                      </span>
                    </div>
                  </div>

                  {/* 카테고리 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      카테고리
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(
                          e.target.value as MenuCategory
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:border-[#5C3A21] focus:ring-1 focus:ring-[#5C3A21] transition"
                    >
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {categoryLabels[item]}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* 시즌 */}
                <div className="border-t border-[#E5E8EB] pt-6">

                  <label className="flex items-center gap-3 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={season}
                      onChange={(e) =>
                        setSeason(e.target.checked)
                      }
                      className="w-4 h-4 accent-[#5C3A21]"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        시즌 메뉴
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        특정 기간에만 판매하는 메뉴입니다.
                      </p>
                    </div>

                  </label>

                </div>

              </div>

              {/* 버튼 */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-[#E5E8EB]">

                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="px-5 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  취소
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#5C3A21] text-white text-sm font-semibold hover:bg-[#4A2E1A] transition shadow-sm disabled:opacity-50"
                >
                  <Save size={17} />

                  {loading ? "등록 중..." : "메뉴 등록"}
                </button>

              </div>

            </div>
          </div>
        </form>
      </main>
    </div>
  );
}