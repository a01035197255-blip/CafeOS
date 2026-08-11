import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  CreateTaskRequest,
  TaskResponse,
  UpdateTaskRequest,
} from "@/types/task";

/**
 * 업무 등록
 */
export const createTask = async (
  request: CreateTaskRequest
): Promise<void> => {
  await api.post<ApiResponse<void>>("/tasks", request);
};

/**
 * 전체 업무 조회
 */
export const getTaskList = async (): Promise<TaskResponse[]> => {
  const { data } = await api.get<ApiResponse<TaskResponse[]>>("/tasks");

  return data.data;
};

/**
 * 내 역할 업무 조회
 */
export const getMyTaskList = async (): Promise<TaskResponse[]> => {
  const { data } = await api.get<ApiResponse<TaskResponse[]>>("/tasks/my");

  return data.data;
};

/**
 * 업무 상세 조회
 */
export const getTask = async (
  taskId: number
): Promise<TaskResponse> => {
  const { data } = await api.get<ApiResponse<TaskResponse>>(
    `/tasks/${taskId}`
  );

  return data.data;
};

/**
 * 업무 수정
 */
export const updateTask = async (
  taskId: number,
  request: UpdateTaskRequest
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/tasks/${taskId}`,
    request
  );
};

/**
 * 업무 삭제
 */
export const deleteTask = async (
  taskId: number
): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/tasks/${taskId}`);
};

/**
 * 업무 완료
 */
export const completeTask = async (
  taskId: number
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/tasks/${taskId}/complete`
  );
};

/**
 * 업무 완료 취소
 */
export const cancelCompleteTask = async (
  taskId: number
): Promise<void> => {
  await api.patch<ApiResponse<void>>(
    `/tasks/${taskId}/cancel-complete`
  );
};