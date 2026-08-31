import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { AiAnalysisResponse } from "@/types/ai";

/**
 * AI 매출 및 운영 분석
 */
export const getAiAnalysis = async (): Promise<AiAnalysisResponse> => {
  const { data } = await api.get<ApiResponse<AiAnalysisResponse>>(
    "/ai/analysis",
    {
      timeout: 30000,
    }
  );

  return data.data;
};