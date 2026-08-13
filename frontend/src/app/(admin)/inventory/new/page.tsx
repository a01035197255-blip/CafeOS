"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  ChevronDown,
  Save,
  Loader2,
} from "lucide-react";

import {
  createInventory,
} from "@/services/inventory";

import {
  getIngredientList,
} from "@/services/ingredient";

import type {
  IngredientResponse,
  IngredientUnit,
  CreateInventoryRequest,
} from "@/types/inventory";

const unitLabels: Record<IngredientUnit, string> = {
  G: "g",
  KG: "kg",
  ML: "ml",
  L: "L",
  EA: "개",
  SHOT: "샷",
};

export default function InventoryCreatePage() {
  const router = useRouter();

  const [ingredients, setIngredients] = useState<
    IngredientResponse[]
  >([]);

  const [ingredientId, setIngredientId] = useState("");

  const [quantity, setQuantity] = useState("");

  const [minimumStock, setMinimumStock] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const fetchIngredients = async () => {
    try {
      setLoading(true);

      const data = await getIngredientList();

      // 활성화된 재료만 등록 대상으로 표시
      setIngredients(
        data.filter((ingredient) => ingredient.enabled)
      );
    } catch (error) {
      console.error("재료 목록 조회 실패:", error);
      alert("재료 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const selectedIngredient = ingredients.find(
    (ingredient) =>
      ingredient.id === Number(ingredientId)
  );

  const handleSubmit = async () => {
    if (!ingredientId) {
      alert("재료를 선택해주세요.");
      return;
    }

    const parsedQuantity = Number(quantity);
    const parsedMinimumStock = Number(minimumStock);

    if (
      quantity === "" ||
      Number.isNaN(parsedQuantity) ||
      parsedQuantity < 0
    ) {
      alert("올바른 초기 재고를 입력해주세요.");
      return;
    }

    if (
      minimumStock === "" ||
      Number.isNaN(parsedMinimumStock) ||
      parsedMinimumStock < 0
    ) {
      alert("올바른 최소 재고를 입력해주세요.");
      return;
    }

    try {
      setSaving(true);

      const request: CreateInventoryRequest = {
        ingredientId: Number(ingredientId),
        quantity: parsedQuantity,
        minimumStock: parsedMinimumStock,
      };

      await createInventory(request);

      alert("재고가 등록되었습니다.");

      router.push("/inventory");
    } catch (error) {
      console.error("재고 등록 실패:", error);
      alert("재고 등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7]">
        <main className="max-w-[1000px] mx-auto px-8 py-8">
          <div className="bg-white border border-[#E5E8EB] rounded-2xl h-[500px] flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2
                size={18}
                className="animate-spin"
              />
              재료 목록을 불러오는 중...
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="max-w-[1000px] mx-auto px-8 py-8">

        {/* 상단 */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/inventory")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#5C3A21] transition mb-5"
          >
            <ArrowLeft size={17} />
            재고 목록
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            재고 등록
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            관리할 재료의 초기 재고와 최소 재고를 등록해주세요.
          </p>
        </div>

        {/* 등록 카드 */}
        <div className="bg-white border border-[#E5E8EB] rounded-2xl overflow-hidden">

          {/* 카드 헤더 */}
          <div className="px-7 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F4] flex items-center justify-center">
                <Package
                  size={22}
                  className="text-[#5C3A21]"
                />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  재고 정보
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  재고 관리에 필요한 정보를 입력하세요.
                </p>
              </div>
            </div>
          </div>

          {/* 입력 영역 */}
          <div className="p-7 space-y-7">

            {/* 재료 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                재료
              </label>

              <div className="relative">
                <select
                  value={ingredientId}
                  onChange={(e) =>
                    setIngredientId(e.target.value)
                  }
                  className="appearance-none w-full px-4 py-3.5 pr-10 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 outline-none focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10 transition"
                >
                  <option value="">
                    재료를 선택해주세요
                  </option>

                  {ingredients.map((ingredient) => (
                    <option
                      key={ingredient.id}
                      value={ingredient.id}
                    >
                      {ingredient.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {selectedIngredient && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                  <span>
                    단위
                  </span>

                  <span className="font-semibold text-[#5C3A21]">
                    {unitLabels[selectedIngredient.unit]}
                  </span>
                </div>
              )}
            </div>

            {/* 재고 입력 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* 초기 재고 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  초기 재고
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(e.target.value)
                    }
                    placeholder="예: 10000"
                    className="w-full px-4 py-3.5 pr-14 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10 transition"
                  />

                  {selectedIngredient && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      {unitLabels[selectedIngredient.unit]}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  현재 보유하고 있는 재료의 수량을 입력하세요.
                </p>
              </div>

              {/* 최소 재고 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  최소 재고
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={minimumStock}
                    onChange={(e) =>
                      setMinimumStock(e.target.value)
                    }
                    placeholder="예: 1000"
                    className="w-full px-4 py-3.5 pr-14 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10 transition"
                  />

                  {selectedIngredient && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      {unitLabels[selectedIngredient.unit]}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  이 수량 이하로 내려가면 재고 부족으로 표시됩니다.
                </p>
              </div>

            </div>

            {/* 미리보기 */}
            {selectedIngredient &&
              quantity !== "" &&
              minimumStock !== "" && (
                <div className="rounded-xl bg-[#FAF7F4] border border-[#EFE5DD] p-5">
                  <p className="text-xs font-semibold text-[#8B4513] mb-3">
                    등록 정보 미리보기
                  </p>

                  <div className="grid grid-cols-3 gap-4">

                    <div>
                      <p className="text-xs text-gray-400">
                        재료
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {selectedIngredient.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        초기 재고
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {Number(quantity).toLocaleString()}{" "}
                        {unitLabels[selectedIngredient.unit]}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        최소 재고
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {Number(minimumStock).toLocaleString()}{" "}
                        {unitLabels[selectedIngredient.unit]}
                      </p>
                    </div>

                  </div>
                </div>
              )}

          </div>

          {/* 하단 버튼 */}
          <div className="px-7 py-5 bg-[#FAFAFA] border-t border-gray-100 flex justify-end gap-3">

            <button
              type="button"
              onClick={() => router.push("/inventory")}
              disabled={saving}
              className="px-5 py-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
            >
              취소
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5C3A21] text-white text-sm font-semibold hover:bg-[#4A2E1A] transition disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  등록 중...
                </>
              ) : (
                <>
                  <Save size={17} />
                  재고 등록
                </>
              )}
            </button>

          </div>
        </div>

      </main>
    </div>
  );
}