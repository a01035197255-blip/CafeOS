import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  CreateInventoryRequest,
  InventoryResponse,
  UpdateInventoryRequest,
  InventoryPredictionResponse,
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

/**
 * 최소 재고 기준 수정
 */
export const updateMinimumStock = async (
  inventoryId: number,
  minimumStock: number
): Promise<void> => {
  await api.patch(
    `/inventories/${inventoryId}/minimum-stock`,
    null,
    {
      params: {
        minimumStock,
      },
    }
  );
};

/**
 * 전체 재고 AI 발주 예측
 */
export const getInventoryPredictions = async (): Promise<
  InventoryPredictionResponse[]
> => {
  const { data } = await api.get<
    ApiResponse<InventoryPredictionResponse[]>
  >("/inventories/prediction", {
                               timeout: 30000,
                             });

  return data.data;
};

export const getInventoryPrediction = async (
  inventoryId: number
): Promise<InventoryPredictionResponse> => {
  const { data } = await api.get<
    ApiResponse<InventoryPredictionResponse>
  >(
    `/inventories/${inventoryId}/prediction`
  );

  return data.data;
};