"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Plus,
  Minus,
  Save,
  RefreshCw,
} from "lucide-react";

import {
  getInventory,
  updateInventory,
  stockIn,
  stockOut,
} from "@/services/inventory";

import type { IngredientUnit, InventoryResponse } from "@/types/inventory";

const unitLabels: Record<IngredientUnit, string> = {
  G: "g",
  KG: "kg",
  ML: "ml",
  L: "L",
  EA: "개",
  SHOT: "샷",
};

export default function InventoryDetailPage() {
  const router = useRouter();
  const params = useParams();

  const inventoryId = Number(params.id);

  const [inventory, setInventory] =
    useState<InventoryResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 입고 / 출고 수량
  const [stockQuantity, setStockQuantity] = useState("");

  // 직접 수정할 재고
  const [editQuantity, setEditQuantity] = useState("");

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const data = await getInventory(inventoryId);

      setInventory(data);
      setEditQuantity(String(data.quantity));
    } catch (error) {
      console.error("재고 조회 실패:", error);
      alert("재고 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isNaN(inventoryId)) {
      fetchInventory();
    }
  }, [inventoryId]);

  /**
   * 입고
   */
  const handleStockIn = async () => {
    const quantity = Number(stockQuantity);

    if (!quantity || quantity <= 0) {
      alert("입고 수량을 입력해주세요.");
      return;
    }

    try {
      setSaving(true);

      await stockIn(inventoryId, quantity);

      alert("입고 처리되었습니다.");

      setStockQuantity("");

      await fetchInventory();
    } catch (error) {
      console.error("입고 처리 실패:", error);
      alert("입고 처리에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  /**
   * 출고
   */
  const handleStockOut = async () => {
    const quantity = Number(stockQuantity);

    if (!quantity || quantity <= 0) {
      alert("출고 수량을 입력해주세요.");
      return;
    }

    if (inventory && quantity > inventory.quantity) {
      alert("현재 재고보다 많은 수량을 출고할 수 없습니다.");
      return;
    }

    try {
      setSaving(true);

      await stockOut(inventoryId, quantity);

      alert("출고 처리되었습니다.");

      setStockQuantity("");

      await fetchInventory();
    } catch (error) {
      console.error("출고 처리 실패:", error);
      alert("출고 처리에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  /**
   * 재고 직접 수정
   */
  const handleUpdateQuantity = async () => {
    const quantity = Number(editQuantity);

    if (Number.isNaN(quantity) || quantity < 0) {
      alert("올바른 재고 수량을 입력해주세요.");
      return;
    }

    try {
      setSaving(true);

      await updateInventory(inventoryId, {
        quantity,
      });

      alert("재고가 수정되었습니다.");

      await fetchInventory();
    } catch (error) {
      console.error("재고 수정 실패:", error);
      alert("재고 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7]">
        <main className="max-w-[1200px] mx-auto px-8 py-8">
          <div className="h-[500px] bg-white border border-[#E5E8EB] rounded-2xl flex items-center justify-center text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <RefreshCw size={17} className="animate-spin" />
              재고 정보를 불러오는 중...
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!inventory) {
    return (
      <div className="min-h-screen bg-[#F4F5F7]">
        <main className="max-w-[1200px] mx-auto px-8 py-8">
          <div className="bg-white border border-[#E5E8EB] rounded-2xl h-[500px] flex flex-col items-center justify-center">
            <Package size={42} className="text-gray-300 mb-4" />

            <p className="text-sm font-semibold text-gray-700">
              재고 정보를 찾을 수 없습니다.
            </p>

            <button
              type="button"
              onClick={() => router.push("/inventory")}
              className="mt-5 px-4 py-2.5 rounded-lg bg-[#5C3A21] text-white text-sm font-semibold hover:bg-[#4A2E1A] transition"
            >
              재고 목록으로
            </button>
          </div>
        </main>
      </div>
    );
  }

  const unit = unitLabels[inventory.unit];

  const isOut = inventory.quantity <= 0;

  const isLow =
    inventory.quantity > 0 &&
    inventory.quantity <= inventory.minimumStock;

  const status = isOut
    ? "품절"
    : isLow
      ? "재고 부족"
      : "정상";

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="max-w-[1200px] mx-auto px-8 py-8">

        {/* 상단 */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/inventory")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#5C3A21] transition mb-5"
          >
            <ArrowLeft size={17} />
            재고 목록
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                재고 조정
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                재고 입고, 출고 및 현재 수량을 관리할 수 있습니다.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchInventory}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              <RefreshCw size={16} />
              새로고침
            </button>
          </div>
        </div>

        {/* 재료 정보 */}
        <div className="bg-white border border-[#E5E8EB] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F4] flex items-center justify-center">
              <Package
                size={24}
                className="text-[#5C3A21]"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#8B4513]">
                재료
              </p>

              <h2 className="mt-1 text-lg font-bold text-gray-900">
                {inventory.ingredientName}
              </h2>
            </div>

            <div className="ml-auto">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  isOut
                    ? "bg-red-50 text-red-600"
                    : isLow
                      ? "bg-orange-50 text-orange-600"
                      : "bg-green-50 text-green-600"
                }`}
              >
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* 현재 재고 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

          <div className="bg-white border border-[#E5E8EB] rounded-2xl p-6">
            <p className="text-sm font-medium text-gray-500">
              현재 재고
            </p>

            <div className="mt-3 flex items-end gap-1">
              <span className="text-3xl font-black text-gray-900">
                {inventory.quantity.toLocaleString()}
              </span>

              <span className="mb-1 text-sm text-gray-500">
                {unit}
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#E5E8EB] rounded-2xl p-6">
            <p className="text-sm font-medium text-gray-500">
              최소 재고
            </p>

            <div className="mt-3 flex items-end gap-1">
              <span className="text-3xl font-black text-gray-900">
                {inventory.minimumStock.toLocaleString()}
              </span>

              <span className="mb-1 text-sm text-gray-500">
                {unit}
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#E5E8EB] rounded-2xl p-6">
            <p className="text-sm font-medium text-gray-500">
              재고 상태
            </p>

            <p
              className={`mt-3 text-2xl font-black ${
                isOut
                  ? "text-red-500"
                  : isLow
                    ? "text-orange-500"
                    : "text-green-600"
              }`}
            >
              {status}
            </p>
          </div>
        </div>

        {/* 입고 / 출고 */}
        <div className="bg-white border border-[#E5E8EB] rounded-2xl p-6 mb-6">

          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900">
              입고 / 출고
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              재고의 입고 및 출고 수량을 입력해주세요.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">

            <div className="relative flex-1">
              <input
                type="number"
                min="1"
                value={stockQuantity}
                onChange={(e) =>
                  setStockQuantity(e.target.value)
                }
                placeholder="수량 입력"
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {unit}
              </span>
            </div>

            <button
              type="button"
              onClick={handleStockIn}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#5C3A21] text-white text-sm font-semibold hover:bg-[#4A2E1A] transition disabled:opacity-50"
            >
              <Plus size={17} />
              입고
            </button>

            <button
              type="button"
              onClick={handleStockOut}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              <Minus size={17} />
              출고
            </button>
          </div>
        </div>

        {/* 직접 수정 */}
        <div className="bg-white border border-[#E5E8EB] rounded-2xl p-6">

          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900">
              현재 재고 직접 수정
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              현재 재고 수량을 직접 지정할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">

            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                value={editQuantity}
                onChange={(e) =>
                  setEditQuantity(e.target.value)
                }
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#5C3A21] focus:ring-2 focus:ring-[#5C3A21]/10"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {unit}
              </span>
            </div>

            <button
              type="button"
              onClick={handleUpdateQuantity}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#5C3A21] text-white text-sm font-semibold hover:bg-[#4A2E1A] transition disabled:opacity-50"
            >
              <Save size={17} />
              재고 저장
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}