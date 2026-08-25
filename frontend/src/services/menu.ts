import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  CreateMenuRequest,
  MenuResponse,
  UpdateMenuRequest,
} from "@/types/menu";

/**
 * 메뉴 등록
 */
export const createMenu = async (
  request: CreateMenuRequest
): Promise<MenuResponse> => {
  const { data } = await api.post<ApiResponse<MenuResponse>>(
    "/menus",
    request
  );

  return data.data;
};

/**
 * 메뉴 목록 조회
 */
export const getMenuList = async (): Promise<MenuResponse[]> => {
  const { data } = await api.get<ApiResponse<MenuResponse[]>>(
    "/menus"
  );

  return data.data;
};

/**
 * 메뉴 상세 조회
 */
export const getMenu = async (
  menuId: number
): Promise<MenuResponse> => {
  const { data } = await api.get<ApiResponse<MenuResponse>>(
    `/menus/${menuId}`
  );

  return data.data;
};

/**
 * 메뉴 수정
 */
export const updateMenu = async (
  menuId: number,
  request: UpdateMenuRequest
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/menus/${menuId}`,
    request
  );
};

/**
 * 메뉴 삭제
 */
export const deleteMenu = async (
  menuId: number
): Promise<void> => {
  await api.delete<ApiResponse<void>>(
    `/menus/${menuId}`
  );
};

/**
 * 메뉴 판매 여부 변경
 */
export const changeMenuSale = async (
  menuId: number,
  sale: boolean
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/menus/${menuId}/sale`,
    null,
    {
      params: {
        sale,
      },
    }
  );
};