export interface MenuProfitabilityResponse {
  menuId: number;
  menuName: string;
  sellingPrice: number;
  salesQuantity: number;
  salesAmount: number;
  ingredientCost: number;
  profit: number;
  costRate: number;
  profitRate: number;
}