import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  CreateInventoryRequest,
  InventoryResponse,
  UpdateInventoryRequest,
} from "@/types/inventory";

export const createInventory = async (
  request: CreateInventoryRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>(
    "/inventories",
    request
  );
};

export const getInventoryList = async (): Promise<
  InventoryResponse[]
> => {
  const { data } = await api.get<
    ApiResponse<InventoryResponse[]>
  >("/inventories");

  return data.data;
};

export const getInventory = async (
  inventoryId: number
): Promise<InventoryResponse> => {
  const { data } = await api.get<
    ApiResponse<InventoryResponse>
  >(`/inventories/${inventoryId}`);

  return data.data;
};

export const updateInventory = async (
  inventoryId: number,
  request: UpdateInventoryRequest
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/inventories/${inventoryId}`,
    request
  );
};

export const stockIn = async (
  inventoryId: number,
  quantity: number
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/inventories/${inventoryId}/stock-in`,
    null,
    {
      params: {
        quantity,
      },
    }
  );
};

export const stockOut = async (
  inventoryId: number,
  quantity: number
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/inventories/${inventoryId}/stock-out`,
    null,
    {
      params: {
        quantity,
      },
    }
  );
};