export type MenuCategory =
  | "COFFEE"
  | "TEA"
  | "LATTE"
  | "ADE"
  | "JUICE"
  | "BLENDED"
  | "YOGURT"
  | "DESSERT"
  | "BAKERY"
  | "SEASON";

export interface CreateMenuRequest {
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  season?: boolean;
  imageUrl?: string;
}

export interface MenuResponse {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: MenuCategory;
  sale: boolean;
  imageUrl: string | null;
}

export interface UpdateMenuRequest {
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  sale: boolean;
  season?: boolean;
  imageUrl?: string;
}