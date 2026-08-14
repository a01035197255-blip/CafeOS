"use client";

import { useEffect, useState } from "react";
import { ChefHat, ChevronRight, Search } from "lucide-react";

import { getRecipeList } from "@/services/recipe";
import type { RecipeResponse } from "@/types/inventory";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipeList();
        setRecipes(data);
      } catch (error) {
        console.error("레시피 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.menuName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F6F2] px-8 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <ChefHat
                size={22}
                className="text-[#5C3A21]"
              />

              <span className="text-sm font-medium text-[#8B735D]">
                메뉴 관리
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#2F241D]">
              레시피 관리
            </h1>

            <p className="mt-1 text-sm text-[#8B8178]">
              메뉴별 레시피와 사용 재료를 관리합니다.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B9188]"
            />

            <input
              type="text"
              placeholder="메뉴명을 검색하세요"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#E5DED6] bg-white pl-11 pr-4 text-sm text-[#2F241D] outline-none transition placeholder:text-[#B2A9A1] focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[#E8E1D9] bg-white">
            <p className="text-sm text-[#8B8178]">
              레시피를 불러오는 중...
            </p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#E8E1D9] bg-white">
            <ChefHat
              size={42}
              className="mb-4 text-[#C8BDB2]"
            />

            <h2 className="text-base font-semibold text-[#4A4038]">
              등록된 레시피가 없습니다.
            </h2>

            <p className="mt-1 text-sm text-[#9B9188]">
              메뉴에 레시피를 등록해주세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="group rounded-2xl border border-[#E8E1D9] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Card Header */}
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-xs font-medium text-[#A18F7E]">
                      RECIPE
                    </p>

                    <h2 className="text-lg font-bold text-[#2F241D]">
                      {recipe.menuName}
                    </h2>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE5]">
                    <ChefHat
                      size={20}
                      className="text-[#5C3A21]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-5 min-h-[48px]">
                  <p className="line-clamp-2 text-sm leading-6 text-[#7E746B]">
                    {recipe.description ||
                      "등록된 레시피 설명이 없습니다."}
                  </p>
                </div>

                {/* Divider */}
                <div className="mb-4 border-t border-[#EEE8E2]" />

                {/* Bottom */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#A49A91]">
                    메뉴 ID #{recipe.menuId}
                  </span>

                  <a
                    href={`/recipes/${recipe.id}`}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#5C3A21] transition hover:bg-[#F5EFE9]"
                  >
                    레시피 관리
                    <ChevronRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Count */}
        {!loading && filteredRecipes.length > 0 && (
          <div className="mt-6 text-sm text-[#8B8178]">
            총{" "}
            <span className="font-semibold text-[#5C3A21]">
              {filteredRecipes.length}
            </span>
            개의 레시피
          </div>
        )}
      </div>
    </div>
  );
}