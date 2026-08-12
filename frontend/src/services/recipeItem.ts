import { api } from "@/services/api";
import type { ApiResponse } from "@/types/api";
import type {
  CreateRecipeItemRequest,
  RecipeItemResponse,
  UpdateRecipeItemRequest,
} from "@/types/inventory";

/**
 * 레시피 재료 등록
 */
export const createRecipeItem = async (
  request: CreateRecipeItemRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>(
    "/recipe-items",
    request
  );
};

/**
 * 특정 레시피의 재료 목록
 */
export const getRecipeItemList = async (
  recipeId: number
): Promise<RecipeItemResponse[]> => {
  const { data } = await api.get<
    ApiResponse<RecipeItemResponse[]>
  >(`/recipe-items/recipe/${recipeId}`);

  return data.data;
};

/**
 * 레시피 재료 상세조회
 */
export const getRecipeItem = async (
  recipeItemId: number
): Promise<RecipeItemResponse> => {
  const { data } = await api.get<
    ApiResponse<RecipeItemResponse>
  >(`/recipe-items/${recipeItemId}`);

  return data.data;
};

/**
 * 레시피 재료 수정
 */
export const updateRecipeItem = async (
  recipeItemId: number,
  request: UpdateRecipeItemRequest
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/recipe-items/${recipeItemId}`,
    request
  );
};

/**
 * 레시피 재료 삭제
 */
export const deleteRecipeItem = async (
  recipeItemId: number
): Promise<void> => {
  await api.delete<ApiResponse<void>>(
    `/recipe-items/${recipeItemId}`
  );
};