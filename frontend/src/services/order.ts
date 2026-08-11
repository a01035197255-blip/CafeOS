import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  CreateOrderRequest,
  OrderResponse,
  UpdateOrderStatusRequest,
} from "@/types/order";

/**
 * 주문 생성
 */
export const createOrder = async (
  request: CreateOrderRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>("/orders", request);
};

/**
 * 주문 목록 조회
 */
export const getOrderList = async (): Promise<OrderResponse[]> => {
  const { data } = await api.get<ApiResponse<OrderResponse[]>>(
    "/orders"
  );

  return data.data;
};

/**
 * 주문 상세 조회
 */
export const getOrder = async (
  orderId: number
): Promise<OrderResponse> => {
  const { data } = await api.get<ApiResponse<OrderResponse>>(
    `/orders/${orderId}`
  );

  return data.data;
};

/**
 * 주문 상태 변경
 */
export const changeOrderStatus = async (
  orderId: number,
  request: UpdateOrderStatusRequest
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/orders/${orderId}/status`,
    request
  );
};

/**
 * 주문 취소
 */
export const cancelOrder = async (
  orderId: number
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/orders/${orderId}/cancel`
  );
};