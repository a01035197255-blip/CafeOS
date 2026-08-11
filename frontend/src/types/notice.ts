export interface NoticeResponse {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  pinned: boolean;
}

export interface UpdateNoticeRequest {
  title: string;
  content: string;
  pinned: boolean;
}