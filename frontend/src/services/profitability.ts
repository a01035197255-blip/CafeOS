import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

export const getProfitability = async (): Promise<MenuProfitabilityResponse[]> => {
  const { data } = await api.get<
    ApiResponse<MenuProfitabilityResponse[]>
  >("/profitability");

  return data.data;
};

export const getMenuProfitability = async (
  menuId: number
): Promise<MenuProfitabilityResponse> => {
  const { data } = await api.get<
    ApiResponse<MenuProfitabilityResponse>
  >(`/profitability/${menuId}`);

  return data.data;
};