import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  CreateNoticeRequest,
  NoticeResponse,
  UpdateNoticeRequest,
} from "@/types/notice";

/**
 * 공지 등록
 */
export const createNotice = async (
  request: CreateNoticeRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>("/notices", request);
};

/**
 * 공지 목록 조회
 */
export const getNoticeList = async (): Promise<NoticeResponse[]> => {
  const { data } = await api.get<ApiResponse<NoticeResponse[]>>(
    "/notices"
  );

  return data.data;
};

/**
 * 공지 상세 조회
 */
export const getNotice = async (
  noticeId: number
): Promise<NoticeResponse> => {
  const { data } = await api.get<ApiResponse<NoticeResponse>>(
    `/notices/${noticeId}`
  );

  return data.data;
};

/**
 * 공지 수정
 */
export const updateNotice = async (
  noticeId: number,
  request: UpdateNoticeRequest
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/notices/${noticeId}`,
    request
  );
};

/**
 * 공지 삭제
 */
export const deleteNotice = async (
  noticeId: number
): Promise<void> => {
  await api.delete<ApiResponse<void>>(
    `/notices/${noticeId}`
  );
};