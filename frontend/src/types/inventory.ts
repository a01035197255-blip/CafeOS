export type IngredientUnit =
  | "G"
  | "KG"
  | "ML"
  | "L"
  | "EA"
  | "SHOT";

export interface CreateIngredientRequest {
  name: string;
  unit: IngredientUnit;
}

export interface IngredientResponse {
  id: number;
  name: string;
  unit: IngredientUnit;
  enabled: boolean;
}

export interface UpdateIngredientRequest {
  name: string;
  unit: IngredientUnit;
  enabled: boolean;
}

export interface CreateInventoryRequest {
  ingredientId: number;
  quantity: number;
}

export interface InventoryResponse {
  id: number;
  ingredientId: number;
  ingredientName: string;
  unit: IngredientUnit;
  quantity: number;
  minimumStock: number;
}

export interface UpdateInventoryRequest {
  quantity: number;
}

export interface RecipeResponse {
  id: number;
  menuId: number;
  menuName: string;
  description: string | null;
}

export interface UpdateRecipeRequest {
  description?: string;
}

export interface CreateRecipeItemRequest {
  recipeId: number;
  ingredientId: number;
  quantity: number;
}

export interface RecipeItemResponse {
  id: number;
  recipeId: number;
  ingredientId: number;
  ingredientName: string;
  quantity: number;
}

export interface UpdateRecipeItemRequest {
  quantity: number;
}