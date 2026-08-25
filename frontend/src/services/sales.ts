import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { SalesAnalysisResponse } from "@/types/sales";

export const getSalesAnalysis = async (): Promise<SalesAnalysisResponse> => {
  const { data } = await api.get<ApiResponse<SalesAnalysisResponse>>(
    "/sales/analysis"
  );

  return data.data;
};