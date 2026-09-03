"use client";

import { useEffect, useState } from "react";
import {
  createTask,
  getTaskList,
  updateTask,
  deleteTask,
  completeTask,
  cancelCompleteTask,
} from "@/services/task";
import type {
  TaskResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "@/types/task";
import type { UserRole } from "@/types/user";

type RoleFilter = "ALL" | UserRole;

export default function TaskPage() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("ALL");

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] =
    useState<TaskResponse | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState<UserRole>("STAFF");

  const [saving, setSaving] = useState(false);

  /**
   * 역할 이름
   */
  const getRoleName = (role: UserRole) => {
    switch (role) {
      case "OWNER":
        return "사장님";
      case "MANAGER":
        return "매니저";
      case "STAFF":
        return "직원";
    }
  };

  /**
   * 업무 목록 조회
   */
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await getTaskList();

      setTasks(response);
    } catch (error) {
      console.error(
        "업무 목록을 불러오지 못했습니다.",
        error
      );

      alert("업무 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * 역할 필터
   */
  const filteredTasks =
    roleFilter === "ALL"
      ? tasks
      : tasks.filter(
          (task) => task.role === roleFilter
        );

  /**
   * 통계
   */
  const totalCount = tasks.length;

  const completedCount =
    tasks.filter((task) => task.completed).length;

  const incompleteCount =
    tasks.filter((task) => !task.completed).length;

  /**
   * 폼 초기화
   */
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRole("STAFF");
    setEditingTask(null);
  };

  /**
   * 업무 등록
   */
  const handleCreate = () => {
    resetForm();
    setShowModal(true);
  };

  /**
   * 업무 수정
   */
  const handleEdit = (task: TaskResponse) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description ?? "");
    setRole(task.role);
    setShowModal(true);
  };

  /**
   * 업무 저장
   */
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("업무 제목을 입력해주세요.");
      return;
    }

    if (!description.trim()) {
      alert("업무 설명을 입력해주세요.");
      return;
    }

    try {
      setSaving(true);

      if (editingTask) {
        const request: UpdateTaskRequest = {
          title: title.trim(),
          description: description.trim(),
          role,
        };

        await updateTask(
          editingTask.id,
          request
        );
      } else {
        const request: CreateTaskRequest = {
          title: title.trim(),
          description: description.trim(),
          role,
        };

        await createTask(request);
      }

      setShowModal(false);
      resetForm();

      await fetchTasks();
    } catch (error) {
      console.error(
        "업무 저장에 실패했습니다.",
        error
      );

      alert("업무 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  /**
   * 업무 삭제
   */
  const handleDelete = async (taskId: number) => {
    const confirmed = window.confirm(
      "정말 이 업무를 삭제하시겠습니까?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(taskId);

      await fetchTasks();
    } catch (error) {
      console.error(
        "업무 삭제에 실패했습니다.",
        error
      );

      alert("업무 삭제에 실패했습니다.");
    }
  };

  /**
   * 업무 완료 / 완료 취소
   */
  const handleComplete = async (
    task: TaskResponse
  ) => {
    try {
      if (task.completed) {
        await cancelCompleteTask(task.id);
      } else {
        await completeTask(task.id);
      }

      await fetchTasks();
    } catch (error) {
      console.error(
        "업무 상태 변경에 실패했습니다.",
        error
      );

      alert("업무 상태 변경에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      <div className="mx-auto max-w-[1400px]">

        {/* =========================
            Header
        ========================= */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#3E2A1F]">
              업무 관리
            </h1>

            <p className="mt-2 text-sm text-[#8B7768]">
              직원별 업무를 등록하고 관리합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="cursor-pointer rounded-lg bg-[#5C3A21] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4A2E19]"
          >
            + 업무 등록
          </button>
        </div>

        {/* =========================
            Summary
        ========================= */}
        <div className="mb-6 grid grid-cols-3 gap-4">

          <div className="rounded-xl border border-[#E8DED5] bg-white p-5 shadow-sm">
            <p className="mb-2 text-xs font-semibold text-[#9B8A7D]">
              전체 업무
            </p>

            <p className="text-2xl font-bold text-[#3E2A1F]">
              {totalCount}
            </p>

            <p className="mt-1 text-xs text-[#9B8A7D]">
              등록된 전체 업무
            </p>
          </div>

          <div className="rounded-xl border border-[#E8DED5] bg-white p-5 shadow-sm">
            <p className="mb-2 text-xs font-semibold text-[#9B8A7D]">
              진행 중
            </p>

            <p className="text-2xl font-bold text-[#5C3A21]">
              {incompleteCount}
            </p>

            <p className="mt-1 text-xs text-[#9B8A7D]">
              아직 완료되지 않은 업무
            </p>
          </div>

          <div className="rounded-xl border border-[#E8DED5] bg-white p-5 shadow-sm">
            <p className="mb-2 text-xs font-semibold text-[#9B8A7D]">
              완료
            </p>

            <p className="text-2xl font-bold text-green-600">
              {completedCount}
            </p>

            <p className="mt-1 text-xs text-[#9B8A7D]">
              완료 처리된 업무
            </p>
          </div>

        </div>

        {/* =========================
            Filter
        ========================= */}
        <div className="mb-5 flex items-center justify-between rounded-xl border border-[#E8DED5] bg-white p-4 shadow-sm">

          <div className="flex items-center gap-2">

            <span className="mr-2 text-sm font-bold text-[#5C3A21]">
              역할
            </span>

            {/* 전체 */}
            <button
              type="button"
              onClick={() => setRoleFilter("ALL")}
              className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition ${
                roleFilter === "ALL"
                  ? "bg-[#5C3A21] text-white"
                  : "bg-[#F4EEE9] text-[#806F63] hover:bg-[#EDE3DC]"
              }`}
            >
              전체
            </button>

            {/* OWNER */}
            <button
              type="button"
              onClick={() => setRoleFilter("OWNER")}
              className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition ${
                roleFilter === "OWNER"
                  ? "bg-[#5C3A21] text-white"
                  : "bg-[#F4EEE9] text-[#806F63] hover:bg-[#EDE3DC]"
              }`}
            >
              사장님
            </button>

            {/* MANAGER */}
            <button
              type="button"
              onClick={() => setRoleFilter("MANAGER")}
              className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition ${
                roleFilter === "MANAGER"
                  ? "bg-[#5C3A21] text-white"
                  : "bg-[#F4EEE9] text-[#806F63] hover:bg-[#EDE3DC]"
              }`}
            >
              매니저
            </button>

            {/* STAFF */}
            <button
              type="button"
              onClick={() => setRoleFilter("STAFF")}
              className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition ${
                roleFilter === "STAFF"
                  ? "bg-[#5C3A21] text-white"
                  : "bg-[#F4EEE9] text-[#806F63] hover:bg-[#EDE3DC]"
              }`}
            >
              직원
            </button>

          </div>

          <p className="text-xs text-[#9B8A7D]">
            총 {filteredTasks.length}개
          </p>

        </div>

        {/* =========================
            Task List
        ========================= */}
        <div className="overflow-hidden rounded-xl border border-[#E8DED5] bg-white shadow-sm">

          <div className="border-b border-[#E8DED5] px-6 py-5">
            <h2 className="text-base font-bold text-[#3E2A1F]">
              업무 목록
            </h2>

            <p className="mt-1 text-xs text-[#9B8A7D]">
              역할별 업무를 확인하고 관리할 수 있습니다.
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center text-sm text-[#9B8A7D]">
              업무 목록을 불러오는 중입니다...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-20 text-center">

              <p className="text-sm font-semibold text-[#5C3A21]">
                등록된 업무가 없습니다.
              </p>

              <p className="mt-2 text-xs text-[#9B8A7D]">
                새로운 업무를 등록해주세요.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-[#F0E9E4]">

              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between px-6 py-5 transition hover:bg-[#FAF8F5]"
                >

                  {/* =========================
                      Task Info
                  ========================= */}
                  <div className="flex min-w-0 items-center gap-4">

                    {/* 완료 버튼 */}
                    <button
                      type="button"
                      onClick={() =>
                        handleComplete(task)
                      }
                      className={`flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition ${
                        task.completed
                          ? "border-[#5C3A21] bg-[#5C3A21] text-white"
                          : "border-[#CFC2B9] hover:border-[#5C3A21]"
                      }`}
                    >
                      {task.completed && (
                        <span className="text-xs">
                          ✓
                        </span>
                      )}
                    </button>

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <h3
                          className={`truncate text-sm font-bold ${
                            task.completed
                              ? "text-[#B0A096] line-through"
                              : "text-[#3E2A1F]"
                          }`}
                        >
                          {task.title}
                        </h3>

                        {/* 역할 */}
                        <span className="rounded-md bg-[#F8F3EF] px-2 py-1 text-[10px] font-bold text-[#5C3A21]">
                          {getRoleName(task.role)}
                        </span>

                      </div>

                      <p
                        className={`mt-1 truncate text-xs ${
                          task.completed
                            ? "text-[#C2B5AC]"
                            : "text-[#806F63]"
                        }`}
                      >
                        {task.description ||
                          "설명이 없습니다."}
                      </p>

                    </div>

                  </div>

                  {/* =========================
                      Actions
                  ========================= */}
                  <div className="ml-6 flex shrink-0 items-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(task)
                      }
                      className="cursor-pointer rounded-lg border border-[#E8DED5] bg-white px-3 py-2 text-xs font-semibold text-[#5C3A21] transition hover:bg-[#F8F3EF]"
                    >
                      수정
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(task.id)
                      }
                      className="cursor-pointer rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      삭제
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

      {/* =========================
          Modal
      ========================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E8DED5] px-6 py-5">

              <div>
                <h2 className="text-lg font-bold text-[#3E2A1F]">
                  {editingTask
                    ? "업무 수정"
                    : "업무 등록"}
                </h2>

                <p className="mt-1 text-xs text-[#9B8A7D]">
                  업무 정보를 입력해주세요.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="h-8 w-8 cursor-pointer rounded-lg text-[#9B8A7D] transition hover:bg-[#F4EEE9] hover:text-[#5C3A21]"
              >
                ✕
              </button>

            </div>

            {/* Modal Body */}
            <div className="space-y-5 p-6">

              {/* 제목 */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#5C3A21]">
                  업무 제목
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="예: 매출 확인"
                  className="w-full rounded-xl border border-[#E8DED5] px-4 py-3 text-sm text-[#3E2A1F] outline-none transition focus:border-[#5C3A21]"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#5C3A21]">
                  업무 설명
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="업무 내용을 입력해주세요."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#E8DED5] px-4 py-3 text-sm text-[#3E2A1F] outline-none transition focus:border-[#5C3A21]"
                />
              </div>

              {/* 역할 */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#5C3A21]">
                  담당 역할
                </label>

                <div className="grid grid-cols-3 gap-3">

                  {/* OWNER */}
                  <button
                    type="button"
                    onClick={() =>
                      setRole("OWNER")
                    }
                    className={`cursor-pointer rounded-xl border py-3 text-sm font-bold transition ${
                      role === "OWNER"
                        ? "border-[#5C3A21] bg-[#F4EEE9] text-[#5C3A21]"
                        : "border-[#E8DED5] text-[#806F63] hover:bg-[#FAF8F5]"
                    }`}
                  >
                    사장님
                  </button>

                  {/* MANAGER */}
                  <button
                    type="button"
                    onClick={() =>
                      setRole("MANAGER")
                    }
                    className={`cursor-pointer rounded-xl border py-3 text-sm font-bold transition ${
                      role === "MANAGER"
                        ? "border-[#5C3A21] bg-[#F4EEE9] text-[#5C3A21]"
                        : "border-[#E8DED5] text-[#806F63] hover:bg-[#FAF8F5]"
                    }`}
                  >
                    매니저
                  </button>

                  {/* STAFF */}
                  <button
                    type="button"
                    onClick={() =>
                      setRole("STAFF")
                    }
                    className={`cursor-pointer rounded-xl border py-3 text-sm font-bold transition ${
                      role === "STAFF"
                        ? "border-[#5C3A21] bg-[#F4EEE9] text-[#5C3A21]"
                        : "border-[#E8DED5] text-[#806F63] hover:bg-[#FAF8F5]"
                    }`}
                  >
                    직원
                  </button>

                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-[#E8DED5] px-6 py-5">

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="cursor-pointer rounded-xl bg-[#F4EEE9] px-5 py-3 text-sm font-bold text-[#806F63] transition hover:bg-[#EDE3DC]"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="cursor-pointer rounded-xl bg-[#5C3A21] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4A2E19] disabled:opacity-50"
              >
                {saving
                  ? "저장 중..."
                  : editingTask
                    ? "수정하기"
                    : "등록하기"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}