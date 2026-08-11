import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { DashboardResponse } from "@/types/dashboard";

export const getDashboard = async (): Promise<DashboardResponse> => {
  const { data } = await api.get<ApiResponse<DashboardResponse>>(
    "/dashboard"
  );

  return data.data;
};