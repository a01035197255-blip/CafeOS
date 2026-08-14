"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChefHat,
  Plus,
  Trash2,
  Pencil,
  Coffee,
} from "lucide-react";

import { getRecipe, updateRecipe } from "@/services/recipe";
import {
  getRecipeItemList,
  deleteRecipeItem,
} from "@/services/recipeItem";
import { getMenu } from "@/services/menu";

import type {
  RecipeResponse,
  RecipeItemResponse,
} from "@/types/inventory";

import type { MenuResponse } from "@/types/menu";

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();

  const recipeId = Number(params.recipeId);

  const [recipe, setRecipe] =
    useState<RecipeResponse | null>(null);

  const [menu, setMenu] =
    useState<MenuResponse | null>(null);

  const [items, setItems] =
    useState<RecipeItemResponse[]>([]);

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  /**
   * 레시피 전체 조회
   */
  const fetchData = async () => {
    try {
      setLoading(true);

      // 레시피 + 레시피 재료
      const [recipeData, itemData] =
        await Promise.all([
          getRecipe(recipeId),
          getRecipeItemList(recipeId),
        ]);

      // recipe.menuId를 이용해서 실제 메뉴 조회
      const menuData =
        await getMenu(recipeData.menuId);

      setRecipe(recipeData);
      setItems(itemData);
      setMenu(menuData);

      setDescription(
        recipeData.description ?? ""
      );
    } catch (error) {
      console.error(
        "레시피 조회 실패:",
        error
      );

      alert(
        "레시피를 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      !recipeId ||
      Number.isNaN(recipeId)
    ) {
      return;
    }

    fetchData();
  }, [recipeId]);

  /**
   * 설명 저장
   */
  const handleSaveDescription =
    async () => {
      try {
        setSaving(true);

        await updateRecipe(recipeId, {
          description,
        });

        alert(
          "레시피 설명이 저장되었습니다."
        );
      } catch (error) {
        console.error(
          "레시피 수정 실패:",
          error
        );

        alert(
          "레시피 설명 저장에 실패했습니다."
        );
      } finally {
        setSaving(false);
      }
    };

  /**
   * 재료 삭제
   */
  const handleDeleteItem =
    async (itemId: number) => {
      const confirmed =
        window.confirm(
          "이 재료를 레시피에서 삭제하시겠습니까?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await deleteRecipeItem(itemId);

        setItems((prev) =>
          prev.filter(
            (item) => item.id !== itemId
          )
        );
      } catch (error) {
        console.error(
          "재료 삭제 실패:",
          error
        );

        alert(
          "재료 삭제에 실패했습니다."
        );
      }
    };

  /**
   * 재료 추가
   */
  const handleAddItem = () => {
    router.push(
      `/recipes/${recipeId}/items/new`
    );
  };

  /**
   * 로딩
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7]">
        <main className="mx-auto max-w-[1500px] px-8 py-8">
          <div className="flex h-96 items-center justify-center rounded-2xl border border-[#E5E8EB] bg-white text-sm text-gray-400">
            레시피를 불러오는 중...
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
        <main className="mx-auto max-w-[1500px] px-8 py-8">
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
      <main className="mx-auto max-w-[1500px] px-8 py-8">

        {/* ========================= */}
        {/* 뒤로가기 */}
        {/* ========================= */}

        <button
          type="button"
          onClick={() =>
            router.push("/menus")
          }
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#5C3A21] cursor-pointer"
        >
          <ArrowLeft size={17} />

          메뉴 관리
        </button>

        {/* ========================= */}
        {/* 메뉴 정보 */}
        {/* ========================= */}

        <section className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">

          <div className="grid grid-cols-1 md:grid-cols-[360px_1fr]">

            {/* 이미지 */}
            <div className="flex h-[330px] items-center justify-center bg-[#F8F6F3] p-8">

              <div className="h-full w-full max-w-[300px] overflow-hidden rounded-2xl bg-white">

                {menu?.imageUrl ? (
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
            <div className="flex flex-col justify-center p-10">

              <div className="flex items-center gap-2">

                <ChefHat
                  size={18}
                  className="text-[#8B4513]"
                />

                <span className="text-sm font-semibold text-[#8B4513]">
                  레시피 관리
                </span>

              </div>

              <h1 className="mt-3 text-3xl font-bold text-gray-900">
                {recipe.menuName}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                {menu?.description ||
                  "메뉴 제조에 필요한 재료와 사용량을 관리합니다."}
              </p>

              <div className="mt-6 flex items-center gap-3">

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#5C3A21] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A2E1A]"
                >
                  <Plus size={16} />

                  재료 추가
                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/menus")
                  }
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 cursor-pointer"
                >
                  메뉴로 돌아가기
                </button>

              </div>

            </div>

          </div>
        </section>

        {/* ========================= */}
        {/* 레시피 */}
        {/* ========================= */}

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
                  제조 레시피
                </h2>

              </div>

              <p className="mt-1 text-xs text-gray-400">
                메뉴 1개를 만들 때 필요한 재료입니다.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#F5EFE9] px-4 py-2.5 text-sm font-semibold text-[#5C3A21] transition hover:bg-[#EDE3D9]"
            >
              <Plus size={16} />

              재료 추가
            </button>

          </div>

          {/* 재료 목록 */}
          <div className="p-6">

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16">

                <ChefHat
                  size={38}
                  className="text-gray-300"
                />

                <p className="mt-4 text-sm font-semibold text-gray-600">
                  등록된 재료가 없습니다.
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  이 메뉴를 만드는 데 필요한 재료를 추가해주세요.
                </p>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="mt-5 flex items-center gap-2 rounded-lg bg-[#5C3A21] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Plus size={15} />

                  재료 추가
                </button>

              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">

                {/* 헤더 */}
                <div className="grid grid-cols-[1fr_180px_70px] items-center bg-[#FAF9F7] px-5 py-3.5 text-xs font-semibold text-gray-500">

                  <span>
                    재료명
                  </span>

                  <span>
                    사용량
                  </span>

                  <span />

                </div>

                {/* 목록 */}
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_180px_70px] items-center border-t border-gray-100 px-5 py-4 transition hover:bg-[#FCFBF9]"
                  >

                    {/* 재료 */}
                    <div>

                      <p className="text-sm font-semibold text-gray-900">
                        {item.ingredientName}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        재료 ID #{item.ingredientId}
                      </p>

                    </div>

                    {/* 사용량 */}
                    <div className="text-sm font-semibold text-gray-900">
                      {item.quantity}
                    </div>

                    {/* 삭제 */}
                    <div className="flex justify-end">

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteItem(
                            item.id
                          )
                        }
                        className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                        title="재료 삭제"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        </section>

        {/* ========================= */}
        {/* 제조 방법 */}
        {/* ========================= */}

        <section className="mt-6 rounded-2xl border border-[#E5E8EB] bg-white">

          <div className="border-b border-[#E5E8EB] px-6 py-5">

            <div className="flex items-center gap-2">

              <Pencil
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
                setDescription(
                  e.target.value
                )
              }
              placeholder="예) 에스프레소 2샷을 추출하고 우유를 스팀한 후 잔에 부어 완성합니다."
              className="min-h-[150px] w-full resize-none rounded-xl border border-gray-200 bg-[#FAF9F7] p-4 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21]"
            />

            <div className="mt-4 flex justify-end">

              <button
                type="button"
                onClick={
                  handleSaveDescription
                }
                disabled={saving}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#5C3A21] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A2E1A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Pencil size={15} />

                {saving
                  ? "저장 중..."
                  : "설명 저장"}
              </button>

            </div>

          </div>
        </section>

      </main>
    </div>
  );
}