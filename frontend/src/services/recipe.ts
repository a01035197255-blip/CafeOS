import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type {
  CreateRecipeRequest,
  RecipeResponse,
  UpdateRecipeRequest,
} from "@/types/inventory";

/**
 * 레시피 등록
 */
export const createRecipe = async (
  request: CreateRecipeRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>(
    "/recipes",
    request
  );
};

/**
 * 레시피 목록
 */
export const getRecipeList = async (): Promise<
  RecipeResponse[]
> => {
  const { data } = await api.get<
    ApiResponse<RecipeResponse[]>
  >("/recipes");

  return data.data;
};

/**
 * 레시피 상세조회
 */
export const getRecipe = async (
  recipeId: number
): Promise<RecipeResponse> => {
  const { data } = await api.get<
    ApiResponse<RecipeResponse>
  >(`/recipes/${recipeId}`);

  return data.data;
};

/**
 * 레시피 수정
 */
export const updateRecipe = async (
  recipeId: number,
  request: UpdateRecipeRequest
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/recipes/${recipeId}`,
    request
  );
};

/**
 * 레시피 삭제
 */
export const deleteRecipe = async (
  recipeId: number
): Promise<void> => {
  await api.delete<ApiResponse<void>>(
    `/recipes/${recipeId}`
  );
};