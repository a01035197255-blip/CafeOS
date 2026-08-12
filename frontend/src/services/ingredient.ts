import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  CreateIngredientRequest,
  IngredientResponse,
  UpdateIngredientRequest,
} from "@/types/inventory";

export const createIngredient = async (
  request: CreateIngredientRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>(
    "/ingredients",
    request
  );
};

export const getIngredientList = async (): Promise<
  IngredientResponse[]
> => {
  const { data } = await api.get<
    ApiResponse<IngredientResponse[]>
  >("/ingredients");

  return data.data;
};

export const getIngredient = async (
  ingredientId: number
): Promise<IngredientResponse> => {
  const { data } = await api.get<
    ApiResponse<IngredientResponse>
  >(`/ingredients/${ingredientId}`);

  return data.data;
};

export const updateIngredient = async (
  ingredientId: number,
  request: UpdateIngredientRequest
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/ingredients/${ingredientId}`,
    request
  );
};

export const disableIngredient = async (
  ingredientId: number
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/ingredients/${ingredientId}/disable`
  );
};