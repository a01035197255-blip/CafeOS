"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ChefHat,
  Plus,
  Trash2,
  Save,
  Coffee,
} from "lucide-react";

import { createRecipe } from "@/services/recipe";
import { createRecipeItem } from "@/services/recipeItem";
import { getIngredientList } from "@/services/ingredient";
import { getMenu } from "@/services/menu";

import type {
  CreateRecipeRequest,
  CreateRecipeItemRequest,
  IngredientResponse,
} from "@/types/inventory";

import type { MenuResponse } from "@/types/menu";

interface RecipeIngredientRow {
  ingredientId: number | null;
  quantity: string;
}

const unitLabels: Record<string, string> = {
  G: "g",
  KG: "kg",
  ML: "ml",
  L: "L",
  EA: "개",
  SHOT: "샷",
};

export default function RecipeCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const menuId = Number(searchParams.get("menuId"));

  const [menu, setMenu] = useState<MenuResponse | null>(null);
  const [ingredients, setIngredients] = useState<
    IngredientResponse[]
  >([]);

  const [description, setDescription] = useState("");

  const [rows, setRows] = useState<RecipeIngredientRow[]>([
    {
      ingredientId: null,
      quantity: "",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /**
   * 메뉴 + 재료 목록 조회
   */
  useEffect(() => {
    if (!menuId || Number.isNaN(menuId)) {
      alert("메뉴 정보를 찾을 수 없습니다.");
      router.push("/menus");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const [menuData, ingredientData] =
          await Promise.all([
            getMenu(menuId),
            getIngredientList(),
          ]);

        setMenu(menuData);

        setIngredients(
          ingredientData.filter(
            (ingredient) => ingredient.enabled
          )
        );
      } catch (error) {
        console.error(
          "레시피 등록 페이지 조회 실패:",
          error
        );

        alert(
          "메뉴 또는 재료 정보를 불러오지 못했습니다."
        );

        router.push("/menus");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [menuId, router]);

  /**
   * 재료 행 추가
   */
  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        ingredientId: null,
        quantity: "",
      },
    ]);
  };

  /**
   * 재료 행 삭제
   */
  const handleRemoveRow = (index: number) => {
    setRows((prev) =>
      prev.filter((_, rowIndex) => rowIndex !== index)
    );
  };

  /**
   * 재료 선택
   */
  const handleIngredientChange = (
    index: number,
    ingredientId: number
  ) => {
    setRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              ingredientId,
            }
          : row
      )
    );
  };

  /**
   * 사용량 변경
   */
  const handleQuantityChange = (
    index: number,
    quantity: string
  ) => {
    setRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              quantity,
            }
          : row
      )
    );
  };

  /**
   * 선택된 재료
   */
  const getIngredient = (
    ingredientId: number | null
  ) => {
    if (!ingredientId) {
      return undefined;
    }

    return ingredients.find(
      (ingredient) =>
        ingredient.id === ingredientId
    );
  };

  /**
   * 레시피 등록
   */
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!menuId || Number.isNaN(menuId)) {
      alert("메뉴 정보를 찾을 수 없습니다.");
      return;
    }

    // 재료가 하나도 선택되지 않은 경우
    if (rows.length === 0) {
      alert("재료를 하나 이상 추가해주세요.");
      return;
    }

    // 재료 검증
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (!row.ingredientId) {
        alert(`${i + 1}번째 재료를 선택해주세요.`);
        return;
      }

      if (
        !row.quantity ||
        Number(row.quantity) <= 0
      ) {
        alert(
          `${i + 1}번째 재료의 사용량을 입력해주세요.`
        );
        return;
      }
    }

    // 같은 재료 중복 선택 방지
    const ingredientIds = rows
      .map((row) => row.ingredientId)
      .filter(
        (id): id is number => id !== null
      );

    const uniqueIngredientIds =
      new Set(ingredientIds);

    if (
      uniqueIngredientIds.size !==
      ingredientIds.length
    ) {
      alert(
        "같은 재료를 중복해서 추가할 수 없습니다."
      );
      return;
    }

    try {
      setSaving(true);

      /**
       * 1. 레시피 생성
       */
      const recipeRequest: CreateRecipeRequest = {
        menuId,
        description:
          description.trim() || undefined,
      };

      const recipe =
        await createRecipe(recipeRequest);

      /**
       * 2. 레시피 재료 등록
       */
      for (const row of rows) {
        const itemRequest: CreateRecipeItemRequest = {
          recipeId: recipe.id,
          ingredientId: row.ingredientId!,
          quantity: Number(row.quantity),
        };

        await createRecipeItem(itemRequest);
      }

      alert("레시피가 등록되었습니다.");

      /**
       * 3. 기존 레시피 상세/재료 관리 페이지로 이동
       */
      router.push(
        `/recipes/${recipe.id}`
      );
    } catch (error) {
      console.error(
        "레시피 등록 실패:",
        error
      );

      alert(
        "레시피 등록에 실패했습니다."
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
        <main className="mx-auto max-w-[1100px] px-8 py-8">
          <div className="flex h-96 items-center justify-center rounded-2xl border border-[#E5E8EB] bg-white text-sm text-gray-400">
            레시피 등록 정보를 불러오는 중...
          </div>
        </main>
      </div>
    );
  }

  /**
   * 메뉴 없음
   */
  if (!menu) {
    return (
      <div className="min-h-screen bg-[#F4F5F7]">
        <main className="mx-auto max-w-[1100px] px-8 py-8">
          <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-[#E5E8EB] bg-white">
            <ChefHat
              size={42}
              className="text-gray-300"
            />

            <p className="mt-4 text-sm font-semibold text-gray-600">
              메뉴를 찾을 수 없습니다.
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

        {/* 상단 */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#5C3A21]"
        >
          <ArrowLeft size={17} />
          메뉴 관리
        </button>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F6F3] text-[#5C3A21]">
            <ChefHat size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              레시피 등록
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {menu.name} 메뉴의 제조 레시피를 등록합니다.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* 메뉴 정보 */}
          <section className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">

              {/* 이미지 */}
              <div className="flex h-[260px] items-center justify-center bg-[#F8F6F3] p-7">
                <div className="h-full w-full max-w-[220px] overflow-hidden rounded-2xl bg-white">
                  {menu.imageUrl ? (
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Coffee
                        size={50}
                        className="text-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 메뉴 정보 */}
              <div className="flex flex-col justify-center p-8">
                <span className="text-sm font-semibold text-[#8B4513]">
                  레시피 등록
                </span>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {menu.name}
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {menu.description ||
                    "이 메뉴를 만들기 위해 필요한 재료와 사용량을 등록해주세요."}
                </p>

                <div className="mt-5 flex items-center gap-2">
                  <span className="rounded-lg bg-[#F5EFE9] px-3 py-1.5 text-xs font-semibold text-[#5C3A21]">
                    메뉴 ID #{menu.id}
                  </span>

                  <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
                    {menu.price.toLocaleString()}원
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* 제조 방법 */}
          <section className="mt-6 rounded-2xl border border-[#E5E8EB] bg-white">

            <div className="border-b border-[#E5E8EB] px-6 py-5">
              <div className="flex items-center gap-2">
                <ChefHat
                  size={18}
                  className="text-[#5C3A21]"
                />

                <h2 className="text-lg font-bold text-gray-900">
                  제조 방법
                </h2>
              </div>

              <p className="mt-1 text-xs text-gray-400">
                직원이 메뉴를 제조할 때 참고할 내용을 작성합니다.
              </p>
            </div>

            <div className="p-6">
              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="예) 딸기를 깨끗하게 세척한 후 케이크 시트와 생크림을 순서대로 조립하여 완성합니다."
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-200 bg-[#FAF9F7] p-4 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21]"
              />
            </div>
          </section>

          {/* 재료 */}
          <section className="mt-6 rounded-2xl border border-[#E5E8EB] bg-white">

            {/* 헤더 */}
            <div className="flex items-center justify-between border-b border-[#E5E8EB] px-6 py-5">

              <div>
                <div className="flex items-center gap-2">
                  <ChefHat
                    size={19}
                    className="text-[#5C3A21]"
                  />

                  <h2 className="text-lg font-bold text-gray-900">
                    필요한 재료
                  </h2>
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  메뉴 1개를 만들 때 필요한 재료와 사용량을 입력합니다.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddRow}
                disabled={saving}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#F5EFE9] px-4 py-2.5 text-sm font-semibold text-[#5C3A21] transition hover:bg-[#EDE3D9] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={16} />
                재료 추가
              </button>

            </div>

            <div className="p-6">

              <div className="overflow-hidden rounded-xl border border-gray-200">

                {/* 테이블 헤더 */}
                <div className="grid grid-cols-[1fr_220px_60px] items-center bg-[#FAF9F7] px-5 py-3.5 text-xs font-semibold text-gray-500">
                  <span>재료명</span>
                  <span>사용량</span>
                  <span />
                </div>

                {/* 재료 목록 */}
                {rows.map((row, index) => {
                  const selectedIngredient =
                    getIngredient(
                      row.ingredientId
                    );

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_220px_60px] items-center gap-4 border-t border-gray-100 px-5 py-4"
                    >

                      {/* 재료 선택 */}
                      <select
                        value={
                          row.ingredientId ?? ""
                        }
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            Number(e.target.value)
                          )
                        }
                        disabled={saving}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#5C3A21] focus:ring-1 focus:ring-[#5C3A21] disabled:bg-gray-50"
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

                      {/* 사용량 */}
                      <div className="flex items-center gap-2">

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              index,
                              e.target.value
                            )
                          }
                          disabled={saving}
                          placeholder="사용량"
                          className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#5C3A21] focus:ring-1 focus:ring-[#5C3A21] disabled:bg-gray-50"
                        />

                        <span className="w-10 text-center text-xs font-semibold text-gray-400">
                          {selectedIngredient
                            ? unitLabels[
                                selectedIngredient.unit
                              ] ??
                              selectedIngredient.unit
                            : "-"}
                        </span>

                      </div>

                      {/* 삭제 */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveRow(
                              index
                            )
                          }
                          disabled={
                            saving ||
                            rows.length === 1
                          }
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                          title="재료 삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                    </div>
                  );
                })}

              </div>

              {/* 재료가 없는 경우 */}
              {ingredients.length === 0 && (
                <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-[#FAF9F7] px-5 py-8 text-center">
                  <p className="text-sm font-semibold text-gray-600">
                    등록된 재료가 없습니다.
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    먼저 재료 관리에서 사용할 재료를 등록해주세요.
                  </p>
                </div>
              )}

            </div>
          </section>

          {/* 하단 버튼 */}
          <div className="mt-6 flex items-center justify-end gap-3">

            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                loading ||
                ingredients.length === 0
              }
              className="flex items-center gap-2 rounded-xl bg-[#5C3A21] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4A2E1A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {saving
                ? "레시피 등록 중..."
                : "레시피 등록"}
            </button>

          </div>

        </form>
      </main>
    </div>
  );
}