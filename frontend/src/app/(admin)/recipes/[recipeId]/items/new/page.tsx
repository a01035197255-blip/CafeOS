"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChefHat,
  Package,
  Save,
} from "lucide-react";

import { getRecipe } from "@/services/recipe";
import { getIngredientList } from "@/services/ingredient";
import { createRecipeItem } from "@/services/recipeItem";

import type {
  RecipeResponse,
  IngredientResponse,
} from "@/types/inventory";

export default function CreateRecipeItemPage() {
  const params = useParams();
  const router = useRouter();

  const recipeId = Number(params.recipeId);

  const [recipe, setRecipe] =
    useState<RecipeResponse | null>(null);

  const [ingredients, setIngredients] =
    useState<IngredientResponse[]>([]);

  const [ingredientId, setIngredientId] =
    useState<number | "">("");

  const [quantity, setQuantity] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  /**
   * 레시피 + 재료 목록 조회
   */
  useEffect(() => {
    if (
      !recipeId ||
      Number.isNaN(recipeId)
    ) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const [recipeData, ingredientData] =
          await Promise.all([
            getRecipe(recipeId),
            getIngredientList(),
          ]);

        setRecipe(recipeData);

        // 사용 가능한 재료만 표시
        setIngredients(
          ingredientData.filter(
            (ingredient) =>
              ingredient.enabled
          )
        );
      } catch (error) {
        console.error(
          "데이터 조회 실패:",
          error
        );

        alert(
          "필요한 정보를 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recipeId]);

  /**
   * 등록
   */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (ingredientId === "") {
      alert("재료를 선택해주세요.");
      return;
    }

    const parsedQuantity =
      Number(quantity);

    if (
      !quantity ||
      Number.isNaN(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      alert(
        "사용량을 1 이상 입력해주세요."
      );
      return;
    }

    try {
      setSaving(true);

      await createRecipeItem({
        recipeId,
        ingredientId,
        quantity: parsedQuantity,
      });

      alert(
        "레시피에 재료가 추가되었습니다."
      );

      router.push(
        `/recipes/${recipeId}`
      );
    } catch (error) {
      console.error(
        "레시피 재료 등록 실패:",
        error
      );

      alert(
        "레시피 재료 등록에 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * 선택된 재료
   */
  const selectedIngredient =
    ingredients.find(
      (ingredient) =>
        ingredient.id === ingredientId
    );

  /**
   * 로딩
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7]">
        <main className="mx-auto max-w-[1100px] px-8 py-8">
          <div className="flex h-96 items-center justify-center rounded-2xl border border-[#E5E8EB] bg-white">
            <p className="text-sm text-gray-400">
              정보를 불러오는 중...
            </p>
          </div>
        </main>
      </div>
    );
  }

  /**
   * 레시피 없음
   */
  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#F4F5F7]">
        <main className="mx-auto max-w-[1100px] px-8 py-8">
          <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-[#E5E8EB] bg-white">

            <ChefHat
              size={42}
              className="text-gray-300"
            />

            <p className="mt-4 text-sm font-semibold text-gray-600">
              레시피를 찾을 수 없습니다.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/menus")
              }
              className="mt-5 rounded-lg bg-[#5C3A21] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4A2E1A]"
            >
              메뉴 관리로 돌아가기
            </button>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="mx-auto max-w-[1100px] px-8 py-8">

        {/* ========================= */}
        {/* 뒤로가기 */}
        {/* ========================= */}

        <button
          type="button"
          onClick={() =>
            router.push(
              `/recipes/${recipeId}`
            )
          }
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-gray-500 transition hover:text-[#5C3A21]"
        >
          <ArrowLeft size={17} />

          {recipe.menuName} 레시피
        </button>

        {/* ========================= */}
        {/* 제목 */}
        {/* ========================= */}

        <div className="mb-7">

          <div className="flex items-center gap-2">

            <ChefHat
              size={22}
              className="text-[#5C3A21]"
            />

            <span className="text-sm font-semibold text-[#8B735D]">
              레시피 관리
            </span>

          </div>

          <h1 className="mt-2 text-3xl font-bold text-[#2F241D]">
            재료 추가
          </h1>

          <p className="mt-2 text-sm text-[#8B8178]">
            <span className="font-semibold text-[#5C3A21]">
              {recipe.menuName}
            </span>
            에 사용할 재료와 사용량을 등록합니다.
          </p>

        </div>

        {/* ========================= */}
        {/* 등록 카드 */}
        {/* ========================= */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white"
        >

          {/* 카드 헤더 */}
          <div className="flex items-center gap-4 border-b border-[#E5E8EB] px-7 py-6">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5EFE9]">
              <Package
                size={23}
                className="text-[#5C3A21]"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                레시피 재료 정보
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                등록되어 있는 재료를 선택하고 사용량을 입력해주세요.
              </p>
            </div>

          </div>

          {/* 입력 */}
          <div className="space-y-7 px-7 py-8">

            {/* 재료 선택 */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-800">
                재료
              </label>

              <select
                value={ingredientId}
                onChange={(e) => {
                  const value =
                    e.target.value;

                  setIngredientId(
                    value === ""
                      ? ""
                      : Number(value)
                  );

                  // 재료를 변경하면 사용량 초기화
                  setQuantity("");
                }}
                className="h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
              >
                <option value="">
                  재료를 선택해주세요
                </option>

                {ingredients.map(
                  (ingredient) => (
                    <option
                      key={ingredient.id}
                      value={ingredient.id}
                    >
                      {ingredient.name}
                    </option>
                  )
                )}
              </select>

              <p className="mt-2 text-xs text-gray-400">
                재료 관리에 등록된 활성 재료만 표시됩니다.
              </p>

            </div>

            {/* 사용량 */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-800">
                사용량
              </label>

              <div className="flex gap-3">

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      e.target.value
                    )
                  }
                  placeholder="예: 18"
                  className="h-12 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
                />

                {/* 단위 */}
                <div className="flex h-12 min-w-[110px] items-center justify-center rounded-xl bg-[#F8F6F2] px-4 text-sm font-semibold text-[#5C3A21]">

                  {selectedIngredient
                    ? selectedIngredient.unit
                    : "단위"}

                </div>

              </div>

              <p className="mt-2 text-xs text-gray-400">
                예: 에스프레소 원두 18g, 우유 250ml
              </p>

            </div>

            {/* 미리보기 */}
            <div className="rounded-xl bg-[#FAF9F7] p-5">

              <p className="mb-4 text-xs font-semibold text-gray-500">
                등록 정보 미리보기
              </p>

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-gray-900">
                    {selectedIngredient
                      ? selectedIngredient.name
                      : "재료를 선택해주세요"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {quantity
                      ? `${quantity} ${
                          selectedIngredient?.unit ??
                          ""
                        }`
                      : "사용량을 입력해주세요"}
                  </p>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F3ECE5]">

                  <Package
                    size={18}
                    className="text-[#5C3A21]"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* ========================= */}
          {/* 버튼 */}
          {/* ========================= */}

          <div className="flex justify-end gap-3 border-t border-[#E5E8EB] bg-[#FCFCFC] px-7 py-5">

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                router.push(
                  `/recipes/${recipeId}`
                )
              }
              className="cursor-pointer rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                ingredientId === "" ||
                !quantity
              }
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#5C3A21] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A2E1A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />

              {saving
                ? "등록 중..."
                : "재료 추가"}
            </button>

          </div>

        </form>

      </main>
    </div>
  );
}