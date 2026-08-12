"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Coffee } from "lucide-react";

import { getMenu, updateMenu } from "@/services/menu";
import type {
  MenuCategory,
  UpdateMenuRequest,
} from "@/types/menu";

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

export default function MenuEditPage() {
  const router = useRouter();
  const params = useParams();

  const menuId = Number(params.menuId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] =
    useState<MenuCategory>("COFFEE");
  const [sale, setSale] = useState(true);
  const [season, setSeason] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 기존 메뉴 불러오기
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menu = await getMenu(menuId);

        setName(menu.name);
        setDescription(menu.description ?? "");
        setPrice(String(menu.price));
        setCategory(menu.category);
        setSale(menu.sale);
        setImageUrl(menu.imageUrl ?? "");
      } catch (error) {
        console.error("메뉴 조회 실패:", error);
        alert("메뉴 정보를 불러오지 못했습니다.");
        router.push("/menus");
      } finally {
        setLoading(false);
      }
    };

    if (!Number.isNaN(menuId)) {
      fetchMenu();
    }
  }, [menuId, router]);

  // 수정
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
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
      setSaving(true);

      const request: UpdateMenuRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        price: Number(price),
        category,
        sale,
        season,
        imageUrl: imageUrl.trim() || undefined,
      };

      await updateMenu(menuId, request);

      alert("메뉴가 수정되었습니다.");

      router.push("/menus");
    } catch (error) {
      console.error("메뉴 수정 실패:", error);
      alert("메뉴 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
        <p className="text-sm text-gray-400">
          메뉴 정보를 불러오는 중...
        </p>
      </div>
    );
  }

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
              메뉴 수정
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              등록된 메뉴 정보를 수정할 수 있습니다.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

            {/* 이미지 */}
            <div className="bg-white border border-[#E5E8EB] rounded-2xl p-6 h-fit">
              <h2 className="text-sm font-bold text-gray-900 mb-4">
                메뉴 이미지
              </h2>

              <div className="aspect-square rounded-xl bg-[#F8F6F3] border border-[#E5E8EB] overflow-hidden flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Coffee
                    size={48}
                    className="text-gray-300"
                  />
                )}
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  이미지 URL
                </label>

                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) =>
                    setImageUrl(e.target.value)
                  }
                  placeholder="/images/menus/strawberry-cake.jpg"
                  className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#5C3A21] transition"
                />
              </div>
            </div>

            {/* 정보 */}
            <div className="bg-white border border-[#E5E8EB] rounded-2xl p-7">

              <h2 className="text-base font-bold text-gray-900">
                메뉴 정보
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                메뉴 정보를 수정해주세요.
              </p>

              <div className="mt-7 space-y-6">

                {/* 이름 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    메뉴명
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:border-[#5C3A21] focus:ring-1 focus:ring-[#5C3A21] transition"
                  />
                </div>

                {/* 가격 / 카테고리 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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
                        onChange={(e) =>
                          setPrice(e.target.value)
                        }
                        className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#5C3A21] focus:ring-1 focus:ring-[#5C3A21] transition"
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        원
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      카테고리
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

                {/* 판매 상태 */}
                <div className="border-t border-[#E5E8EB] pt-6">
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        판매 상태
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        현재 메뉴의 판매 여부입니다.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSale((prev) => !prev)}
                      className={`relative w-12 h-6 rounded-full transition ${
                        sale
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition ${
                          sale
                            ? "left-7"
                            : "left-1"
                        }`}
                      />
                    </button>

                  </div>

                  <p
                    className={`mt-3 text-xs font-semibold ${
                      sale
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    {sale ? "판매중" : "판매중지"}
                  </p>
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

                      <p className="mt-1 text-xs text-gray-400">
                        시즌 메뉴로 설정합니다.
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
                  disabled={saving}
                  className="px-5 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  취소
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#5C3A21] text-white text-sm font-semibold hover:bg-[#4A2E1A] transition shadow-sm disabled:opacity-50"
                >
                  <Save size={17} />
                  {saving ? "저장 중..." : "변경사항 저장"}
                </button>

              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}