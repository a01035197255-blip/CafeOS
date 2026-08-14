"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Save,
} from "lucide-react";

import { createIngredient } from "@/services/ingredient";

import type {
  IngredientUnit,
  CreateIngredientRequest,
} from "@/types/inventory";

const unitOptions: {
  value: IngredientUnit;
  label: string;
}[] = [
  { value: "G", label: "g" },
  { value: "KG", label: "kg" },
  { value: "ML", label: "ml" },
  { value: "L", label: "L" },
  { value: "EA", label: "개" },
  { value: "SHOT", label: "샷" },
];

export default function CreateIngredientPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [unit, setUnit] =
    useState<IngredientUnit>("G");

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("재료명을 입력해주세요.");
      return;
    }

    try {
      setSaving(true);

      const request: CreateIngredientRequest = {
        name: trimmedName,
        unit,
      };

      await createIngredient(request);

      alert("재료가 등록되었습니다.");

      router.push("/inventory");
    } catch (error) {
      console.error(
        "재료 등록 실패:",
        error
      );

      alert(
        "재료 등록에 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="mx-auto max-w-[1000px] px-8 py-8">

        {/* 뒤로가기 */}
        <button
          type="button"
          onClick={() =>
            router.push("/inventory")
          }
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-gray-500 transition hover:text-[#5C3A21]"
        >
          <ArrowLeft size={17} />
          재고 관리
        </button>

        {/* 제목 */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Package
              size={22}
              className="text-[#5C3A21]"
            />

            <span className="text-sm font-semibold text-[#8B735D]">
              재고 관리
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            재료 등록
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            매장에서 사용할 새로운 재료를 등록합니다.
          </p>
        </div>

        {/* 등록 카드 */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white"
        >
          {/* 카드 헤더 */}
          <div className="flex items-center gap-4 border-b border-[#E5E8EB] px-7 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5EEE8]">
              <Package
                size={22}
                className="text-[#5C3A21]"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                재료 정보
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                재료명과 재고 관리에 사용할 단위를 입력해주세요.
              </p>
            </div>
          </div>

          {/* 입력 영역 */}
          <div className="space-y-7 px-7 py-8">

            {/* 재료명 */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                재료명
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="예: 딸기 시럽"
                maxLength={100}
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
              />

              <p className="mt-2 text-xs text-gray-400">
                재고 목록에 표시될 재료 이름입니다.
              </p>
            </div>

            {/* 단위 */}
            <div>
              <label
                htmlFor="unit"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                단위
              </label>

              <select
                id="unit"
                value={unit}
                onChange={(e) =>
                  setUnit(
                    e.target.value as IngredientUnit
                  )
                }
                className="h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
              >
                {unitOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>

              <p className="mt-2 text-xs text-gray-400">
                재고 수량을 계산할 때 사용할 단위입니다.
              </p>
            </div>

            {/* 미리보기 */}
            <div className="rounded-xl bg-[#FAF7F4] p-5">
              <p className="mb-3 text-xs font-semibold text-gray-500">
                미리보기
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-gray-900">
                    {name.trim() || "재료명"}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    단위:{" "}
                    <span className="font-semibold text-[#5C3A21]">
                      {
                        unitOptions.find(
                          (item) =>
                            item.value === unit
                        )?.label
                      }
                    </span>
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                  <Package
                    size={20}
                    className="text-[#8B5E3C]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 border-t border-[#E5E8EB] bg-[#FCFCFC] px-7 py-5">

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                router.push("/inventory")
              }
              className="cursor-pointer rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                !name.trim()
              }
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#5C3A21] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A2E1A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />

              {saving
                ? "등록 중..."
                : "재료 등록"}
            </button>

          </div>
        </form>
      </main>
    </div>
  );
}