import { OrderStatus } from "./order-status";

export interface CreateOrderItemRequest {
  menuId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
}

export interface OrderItemResponse {
  id: number;
  menuId: number;
  menuName: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  id: number;
  employeeName: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;

  items: OrderItemResponse[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}