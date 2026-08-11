import { UserRole } from "./user";

export interface TaskResponse {
  id: number;
  title: string;
  description: string | null;
  role: UserRole;
  completed: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  role: UserRole;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
  role: UserRole;
}