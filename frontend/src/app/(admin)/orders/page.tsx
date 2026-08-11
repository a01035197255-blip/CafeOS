"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Clock3,
  CheckCircle2,
  XCircle,
  LoaderCircle,
  ShoppingBag,
} from "lucide-react";

import { api } from "@/lib/api";
import type { OrderResponse, OrderStatus } from "@/types/order";

type FilterStatus = "ALL" | OrderStatus;

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [selectedOrder, setSelectedOrder] =
    useState<OrderResponse | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get<{
        data: OrderResponse[];
      }>("/orders");

      setOrders(response.data.data);
    } catch (error) {
      console.error("주문 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 검색 + 상태 필터
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        filterStatus === "ALL" || order.status === filterStatus;

      const keyword = search.toLowerCase();

      const matchesSearch =
        !keyword ||
        order.employeeName.toLowerCase().includes(keyword) ||
        String(order.id).includes(keyword) ||
        order.items?.some((item) =>
          item.menuName.toLowerCase().includes(keyword)
        );

      return matchesStatus && matchesSearch;
    });
  }, [orders, filterStatus, search]);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}원`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "RECEIVED":
        return "접수";
      case "MAKING":
        return "제조중";
      case "COMPLETED":
        return "완료";
      case "CANCELLED":
        return "취소";
    }
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case "RECEIVED":
        return "bg-blue-50 text-blue-600";

      case "MAKING":
        return "bg-orange-50 text-orange-600";

      case "COMPLETED":
        return "bg-green-50 text-green-600";

      case "CANCELLED":
        return "bg-red-50 text-red-500";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "RECEIVED":
        return <Clock3 size={14} />;

      case "MAKING":
        return <LoaderCircle size={14} />;

      case "COMPLETED":
        return <CheckCircle2 size={14} />;

      case "CANCELLED":
        return <XCircle size={14} />;
    }
  };

  // 주문 상태 변경
  const changeStatus = async (
    orderId: number,
    status: OrderStatus
  ) => {
    try {
      await api.patch(`/orders/${orderId}/status`, {
        status,
      });

      await fetchOrders();

      if (selectedOrder?.id === orderId) {
        const updatedOrder = orders.find(
          (order) => order.id === orderId
        );

        if (updatedOrder) {
          setSelectedOrder({
            ...updatedOrder,
            status,
          });
        }
      }
    } catch (error) {
      console.error("주문 상태 변경 실패:", error);
    }
  };

  // 주문 취소
  const cancelOrder = async (orderId: number) => {
    if (!confirm("이 주문을 취소하시겠습니까?")) {
      return;
    }

    try {
      await api.patch(`/orders/${orderId}/cancel`);

      await fetchOrders();

      setSelectedOrder(null);
    } catch (error) {
      console.error("주문 취소 실패:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="max-w-[1500px] mx-auto px-8 py-8">

        {/* 제목 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            주문관리
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            매장의 주문을 확인하고 상태를 관리할 수 있습니다.
          </p>
        </div>

        {/* 상단 필터 */}
        <div className="bg-white border border-[#E5E8EB] rounded-2xl p-5 mb-6">

          <div className="flex items-center justify-between gap-4">

            {/* 상태 */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                ["ALL", "전체"],
                ["RECEIVED", "접수"],
                ["MAKING", "제조중"],
                ["COMPLETED", "완료"],
                ["CANCELLED", "취소"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setFilterStatus(value as FilterStatus)
                  }
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                    filterStatus === value
                      ? "bg-[#5C3A21] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 검색 / 새로고침 */}
            <div className="flex items-center gap-2 shrink-0">

              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="주문번호, 직원, 메뉴 검색"
                  className="w-64 pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#5C3A21]"
                />
              </div>

              <button
                type="button"
                onClick={fetchOrders}
                disabled={loading}
                className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 주문 목록 + 상세 */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

          {/* 주문 목록 */}
          <div className="bg-white border border-[#E5E8EB] rounded-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900">
                  주문 목록
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  총 {filteredOrders.length}건
                </p>
              </div>
            </div>

            {loading ? (
              <div className="h-80 flex items-center justify-center text-gray-400">
                주문을 불러오는 중...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="h-80 flex flex-col items-center justify-center text-gray-400">
                <ShoppingBag size={40} className="mb-3" />

                <p className="text-sm">
                  주문 내역이 없습니다.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">

                {filteredOrders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full px-6 py-5 text-left hover:bg-gray-50 transition ${
                      selectedOrder?.id === order.id
                        ? "bg-[#FAF7F4]"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-5">

                      <div className="min-w-0">

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900">
                            주문 #{order.id}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-2 truncate">
                          {order.items?.length
                            ? order.items
                                .map(
                                  (item) =>
                                    `${item.menuName} × ${item.quantity}`
                                )
                                .join(" · ")
                            : "상품 정보 없음"}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {order.employeeName} ·{" "}
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900">
                          {formatPrice(order.totalPrice)}
                        </p>
                      </div>

                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 주문 상세 */}
          <div className="bg-white border border-[#E5E8EB] rounded-2xl overflow-hidden h-fit">

            {!selectedOrder ? (
              <div className="h-96 flex flex-col items-center justify-center text-gray-400 px-6 text-center">
                <ShoppingBag size={42} className="mb-4" />

                <p className="text-sm">
                  주문을 선택해주세요.
                </p>

                <p className="text-xs mt-1 text-gray-400">
                  주문을 클릭하면 상세 정보를 확인할 수 있습니다.
                </p>
              </div>
            ) : (
              <>
                {/* 상세 헤더 */}
                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">
                        주문번호
                      </p>

                      <h2 className="text-xl font-bold text-gray-900 mt-1">
                        #{selectedOrder.id}
                      </h2>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                </div>

                {/* 주문 상품 */}
                <div className="px-6 py-5">

                  <h3 className="text-sm font-bold text-gray-900 mb-4">
                    주문 상품
                  </h3>

                  <div className="space-y-4">
                    {selectedOrder.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {item.menuName}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {item.price.toLocaleString()}원 ×{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm font-bold text-gray-900">
                          {(
                            item.price * item.quantity
                          ).toLocaleString()}
                          원
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 금액 */}
                <div className="px-6 py-5 border-t border-gray-100">

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      총 결제금액
                    </span>

                    <span className="text-xl font-black text-[#5C3A21]">
                      {formatPrice(selectedOrder.totalPrice)}
                    </span>
                  </div>

                </div>

                {/* 주문 정보 */}
                <div className="px-6 py-5 border-t border-gray-100 space-y-3">

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      주문 직원
                    </span>

                    <span className="font-semibold text-gray-800">
                      {selectedOrder.employeeName}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      주문 시간
                    </span>

                    <span className="font-semibold text-gray-800">
                      {formatDate(selectedOrder.createdAt)}
                    </span>
                  </div>

                </div>

                {/* 상태 변경 */}
                <div className="px-6 py-5 border-t border-gray-100">

                  <p className="text-sm font-bold text-gray-900 mb-3">
                    주문 상태 변경
                  </p>

                  <div className="grid grid-cols-2 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        changeStatus(
                          selectedOrder.id,
                          "MAKING"
                        )
                      }
                      disabled={
                        selectedOrder.status === "CANCELLED" ||
                        selectedOrder.status === "COMPLETED"
                      }
                      className="py-2.5 rounded-lg bg-orange-50 text-orange-600 text-sm font-semibold hover:bg-orange-100 disabled:opacity-40"
                    >
                      제조중
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        changeStatus(
                          selectedOrder.id,
                          "COMPLETED"
                        )
                      }
                      disabled={
                        selectedOrder.status === "CANCELLED"
                      }
                      className="py-2.5 rounded-lg bg-green-50 text-green-600 text-sm font-semibold hover:bg-green-100 disabled:opacity-40"
                    >
                      완료
                    </button>

                  </div>

                  {selectedOrder.status !== "CANCELLED" &&
                    selectedOrder.status !== "COMPLETED" && (
                      <button
                        type="button"
                        onClick={() =>
                          cancelOrder(selectedOrder.id)
                        }
                        className="w-full mt-2 py-2.5 rounded-lg bg-red-50 text-red-500 text-sm font-semibold hover:bg-red-100"
                      >
                        주문 취소
                      </button>
                    )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}