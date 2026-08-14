"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Package,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { getInventoryList } from "@/services/inventory";
import type {
  IngredientUnit,
  InventoryResponse,
} from "@/types/inventory";

const unitLabels: Record<IngredientUnit, string> = {
  G: "g",
  KG: "kg",
  ML: "ml",
  L: "L",
  EA: "개",
  SHOT: "샷",
};

type StockStatus = "NORMAL" | "LOW" | "OUT";

const getStockStatus = (
  quantity: number,
  minimumStock: number
): StockStatus => {
  if (quantity <= 0) {
    return "OUT";
  }

  if (quantity <= minimumStock) {
    return "LOW";
  }

  return "NORMAL";
};

const statusLabels: Record<StockStatus, string> = {
  NORMAL: "정상",
  LOW: "부족",
  OUT: "품절",
};

export default function InventoryPage() {
  const router = useRouter();

  const [inventories, setInventories] = useState<
    InventoryResponse[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedStatus, setSelectedStatus] =
    useState<StockStatus | "ALL">("ALL");

  const fetchInventories = async () => {
    try {
      setLoading(true);

      const data = await getInventoryList();

      setInventories(data);
    } catch (error) {
      console.error("재고 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  const filteredInventories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return inventories.filter((inventory) => {
      const status = getStockStatus(
        inventory.quantity,
        inventory.minimumStock
      );

      const matchesStatus =
        selectedStatus === "ALL" ||
        status === selectedStatus;

      const matchesSearch =
        !keyword ||
        inventory.ingredientName
          .toLowerCase()
          .includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [inventories, search, selectedStatus]);

  const normalCount = inventories.filter(
    (item) =>
      getStockStatus(item.quantity, item.minimumStock) === "NORMAL"
  ).length;

  const lowCount = inventories.filter(
    (item) =>
      getStockStatus(item.quantity, item.minimumStock) === "LOW"
  ).length;

  const outCount = inventories.filter(
    (item) =>
      getStockStatus(item.quantity, item.minimumStock) === "OUT"
  ).length;

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="max-w-[1500px] mx-auto px-8 py-8">

        {/* 페이지 제목 */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              재고관리
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              매장에서 사용하는 재료의 재고를 관리할 수 있습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/inventory/new")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5C3A21] text-white text-sm font-semibold hover:bg-[#4A2E1A] transition shadow-sm cursor-pointer"
          >
            <Plus size={17} />
            재고 등록
          </button>
        </div>

        {/* 요약 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          <div className="bg-white border border-[#E5E8EB] rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                  전체 재고
                </p>

                <p className="mt-2 text-2xl font-black text-gray-900">
                  {inventories.length}
                  <span className="ml-1 text-sm font-medium text-gray-400">
                    개
                  </span>
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#F5EEE8] flex items-center justify-center">
                <Package
                  size={21}
                  className="text-[#5C3A21]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E8EB] rounded-2xl p-5">
            <p className="text-xs font-semibold text-gray-400">
              정상
            </p>

            <p className="mt-2 text-2xl font-black text-green-600">
              {normalCount}
              <span className="ml-1 text-sm font-medium text-gray-400">
                개
              </span>
            </p>
          </div>

          <div className="bg-white border border-[#E5E8EB] rounded-2xl p-5">
            <p className="text-xs font-semibold text-gray-400">
              주의 필요
            </p>

            <p className="mt-2 text-2xl font-black text-red-500">
              {lowCount + outCount}
              <span className="ml-1 text-sm font-medium text-gray-400">
                개
              </span>
            </p>
          </div>
        </div>

        {/* 검색 / 필터 */}
        <div className="bg-white border border-[#E5E8EB] rounded-2xl p-5 mb-6">

          <div className="flex items-center justify-between gap-5">

            {/* 상태 필터 */}
            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() => setSelectedStatus("ALL")}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                  selectedStatus === "ALL"
                    ? "bg-[#5C3A21] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                전체
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus("NORMAL")}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                  selectedStatus === "NORMAL"
                    ? "bg-[#5C3A21] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                정상
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus("LOW")}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                  selectedStatus === "LOW"
                    ? "bg-[#5C3A21] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                부족
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus("OUT")}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                  selectedStatus === "OUT"
                    ? "bg-[#5C3A21] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                품절
              </button>
            </div>

            {/* 검색 */}
            <div className="flex items-center gap-2">

              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="재료 검색"
                  className="w-60 pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#5C3A21]"
                />
              </div>

              <button
                type="button"
                onClick={fetchInventories}
                disabled={loading}
                className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    loading ? "animate-spin" : ""
                  }
                />
              </button>

            </div>
          </div>
        </div>

        {/* 목록 */}
        <div className="bg-white border border-[#E5E8EB] rounded-2xl overflow-hidden">

          <div className="px-6 py-5 border-b border-[#E5E8EB] flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-gray-900">
                재고 목록
              </span>

              <span className="ml-2 text-sm text-gray-400">
                {filteredInventories.length}개
              </span>
            </div>
          </div>

          {loading ? (
            <div className="h-80 flex items-center justify-center text-sm text-gray-400">
              재고를 불러오는 중...
            </div>
          ) : filteredInventories.length === 0 ? (
            <div className="h-80 flex flex-col items-center justify-center text-gray-400">
              <Package
                size={42}
                className="mb-4"
              />

              <p className="text-sm font-medium">
                등록된 재고가 없습니다.
              </p>

              <p className="text-xs mt-1">
                검색 조건을 변경하거나 재고를 등록해주세요.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead>
                  <tr className="bg-[#FAFAF9] border-b border-[#E5E8EB]">

                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500">
                      재료명
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500">
                      현재 재고
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500">
                      최소 재고
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500">
                      단위
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500">
                      상태
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500">
                      관리
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredInventories.map(
                    (inventory) => {
                      const status = getStockStatus(
                        inventory.quantity,
                        inventory.minimumStock
                      );

                      return (
                        <tr
                          key={inventory.id}
                          className="border-b border-[#F0F0EE] last:border-b-0 hover:bg-[#FCFBF9] transition"
                        >

                          {/* 재료명 */}
                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-xl bg-[#F5EEE8] flex items-center justify-center">
                                <Package
                                  size={18}
                                  className="text-[#8B5E3C]"
                                />
                              </div>

                              <div>
                                <p className="text-sm font-bold text-gray-900">
                                  {inventory.ingredientName}
                                </p>

                                <p className="text-xs text-gray-400 mt-0.5">
                                  재고 ID #{inventory.id}
                                </p>
                              </div>

                            </div>

                          </td>

                          {/* 수량 */}
                          <td className="px-6 py-5 text-right">

                            <span
                              className={`text-base font-black ${
                                status === "OUT"
                                  ? "text-red-500"
                                  : status === "LOW"
                                  ? "text-orange-500"
                                  : "text-gray-900"
                              }`}
                            >
                              {inventory.quantity.toLocaleString()}
                            </span>

                          </td>

                          <td className="px-6 py-5 text-right">
                            <span className="text-sm font-semibold text-gray-500">
                              {inventory.minimumStock.toLocaleString()}
                            </span>
                          </td>

                          {/* 단위 */}
                          <td className="px-6 py-5 text-center">
                            <span className="text-sm font-medium text-gray-500">
                              {unitLabels[inventory.unit]}
                            </span>
                          </td>

                          {/* 상태 */}
                          <td className="px-6 py-5 text-center">

                            <span
                              className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${
                                status === "NORMAL"
                                  ? "bg-green-50 text-green-600"
                                  : status === "LOW"
                                  ? "bg-orange-50 text-orange-600"
                                  : "bg-red-50 text-red-500"
                              }`}
                            >
                              {statusLabels[status]}
                            </span>

                          </td>

                          {/* 관리 */}
                          <td className="px-6 py-5 text-center">

                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/inventory/${inventory.id}`
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:text-[#5C3A21] hover:bg-[#FAF7F4] transition cursor-pointer"
                            >
                              <Pencil size={14} />
                              재고 조정
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>
              </table>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}