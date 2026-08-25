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
    <div className="min-h-screen bg-[#F7F7F5] p-8">
      <div className="max-w-[1400px] mx-auto">

        {/* =========================
            Header
        ========================= */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              업무 관리
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              직원별 업무를 등록하고 관리합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="px-5 py-3 rounded-xl bg-[#8B4513] text-white text-sm font-bold hover:bg-[#72370F] transition cursor-pointer"
          >
            + 업무 등록
          </button>
        </div>

        {/* =========================
            Summary
        ========================= */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-400 mb-2">
              전체 업무
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {totalCount}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              등록된 전체 업무
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-400 mb-2">
              진행 중
            </p>

            <p className="text-2xl font-bold text-[#8B4513]">
              {incompleteCount}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              아직 완료되지 않은 업무
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-400 mb-2">
              완료
            </p>

            <p className="text-2xl font-bold text-green-600">
              {completedCount}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              완료 처리된 업무
            </p>
          </div>

        </div>

        {/* =========================
            Filter
        ========================= */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <span className="text-sm font-bold text-gray-700 mr-2">
              역할
            </span>

            {/* 전체 */}
            <button
              type="button"
              onClick={() => setRoleFilter("ALL")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                roleFilter === "ALL"
                  ? "bg-[#8B4513] text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              전체
            </button>

            {/* OWNER */}
            <button
              type="button"
              onClick={() => setRoleFilter("OWNER")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                roleFilter === "OWNER"
                  ? "bg-[#8B4513] text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              사장님
            </button>

            {/* MANAGER */}
            <button
              type="button"
              onClick={() => setRoleFilter("MANAGER")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                roleFilter === "MANAGER"
                  ? "bg-[#8B4513] text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              매니저
            </button>

            {/* STAFF */}
            <button
              type="button"
              onClick={() => setRoleFilter("STAFF")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                roleFilter === "STAFF"
                  ? "bg-[#8B4513] text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              직원
            </button>

          </div>

          <p className="text-xs text-gray-400">
            총 {filteredTasks.length}개
          </p>

        </div>

        {/* =========================
            Task List
        ========================= */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">
              업무 목록
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              역할별 업무를 확인하고 관리할 수 있습니다.
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center text-sm text-gray-400">
              업무 목록을 불러오는 중입니다...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-20 text-center">

              <p className="text-sm font-semibold text-gray-500">
                등록된 업무가 없습니다.
              </p>

              <p className="text-xs text-gray-400 mt-2">
                새로운 업무를 등록해주세요.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="px-6 py-5 flex items-center justify-between hover:bg-[#FAFAF8] transition"
                >

                  {/* =========================
                      Task Info
                  ========================= */}
                  <div className="flex items-center gap-4 min-w-0">

                    {/* 완료 버튼 */}
                    <button
                      type="button"
                      onClick={() =>
                        handleComplete(task)
                      }
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition cursor-pointer ${
                        task.completed
                          ? "bg-[#8B4513] border-[#8B4513] text-white"
                          : "border-gray-300 hover:border-[#8B4513]"
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
                          className={`text-sm font-bold truncate ${
                            task.completed
                              ? "text-gray-400 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </h3>

                        {/* 역할 */}
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-[#FFF4E8] text-[#8B4513]">
                          {getRoleName(task.role)}
                        </span>

                      </div>

                      <p
                        className={`text-xs mt-1 truncate ${
                          task.completed
                            ? "text-gray-300"
                            : "text-gray-500"
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
                  <div className="flex items-center gap-2 ml-6 shrink-0">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(task)
                      }
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition cursor-pointer"
                    >
                      수정
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(task.id)
                      }
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
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

          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingTask
                    ? "업무 수정"
                    : "업무 등록"}
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  업무 정보를 입력해주세요.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
              >
                ✕
              </button>

            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">

              {/* 제목 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  업무 제목
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="예: 매출 확인"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#8B4513] transition"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  업무 설명
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="업무 내용을 입력해주세요."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#8B4513] transition resize-none"
                />
              </div>

              {/* 역할 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  담당 역할
                </label>

                <div className="grid grid-cols-3 gap-3">

                  {/* OWNER */}
                  <button
                    type="button"
                    onClick={() =>
                      setRole("OWNER")
                    }
                    className={`py-3 rounded-xl text-sm font-bold border transition cursor-pointer ${
                      role === "OWNER"
                        ? "border-[#8B4513] bg-[#FFF4E8] text-[#8B4513]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
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
                    className={`py-3 rounded-xl text-sm font-bold border transition cursor-pointer ${
                      role === "MANAGER"
                        ? "border-[#8B4513] bg-[#FFF4E8] text-[#8B4513]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
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
                    className={`py-3 rounded-xl text-sm font-bold border transition cursor-pointer ${
                      role === "STAFF"
                        ? "border-[#8B4513] bg-[#FFF4E8] text-[#8B4513]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    직원
                  </button>

                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-5 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition cursor-pointer"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="px-5 py-3 rounded-xl bg-[#8B4513] text-white text-sm font-bold hover:bg-[#72370F] transition cursor-pointer disabled:opacity-50"
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