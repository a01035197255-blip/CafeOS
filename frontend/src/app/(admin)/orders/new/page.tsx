"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Check,
} from "lucide-react";

import { createOrder } from "@/services/order";
import { getMenuList } from "@/services/menu";

import type {
  CreateOrderItemRequest,
  CreateOrderRequest,
} from "@/types/order";

import type { MenuResponse } from "@/types/menu";

interface OrderCartItem {
  menuId: number;
  menuName: string;
  price: number;
  quantity: number;
}

export default function CreateOrderPage() {
  const router = useRouter();

  const [menus, setMenus] = useState<MenuResponse[]>([]);
  const [cart, setCart] = useState<OrderCartItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  // 메뉴 조회
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);

        const data = await getMenuList();

        setMenus(data);
      } catch (error) {
        console.error("메뉴 목록 조회 실패:", error);
        alert("메뉴를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // 검색
  const filteredMenus = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return menus;
    }

    return menus.filter((menu) =>
      menu.name.toLowerCase().includes(keyword)
    );
  }, [menus, search]);

  // 메뉴 추가
  const addMenu = (menu: MenuResponse) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.menuId === menu.id
      );

      if (existing) {
        return prev.map((item) =>
          item.menuId === menu.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          menuId: menu.id,
          menuName: menu.name,
          price: menu.price,
          quantity: 1,
        },
      ];
    });
  };

  // 수량 증가
  const increaseQuantity = (menuId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.menuId === menuId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // 수량 감소
  const decreaseQuantity = (menuId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.menuId === menuId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 삭제
  const removeItem = (menuId: number) => {
    setCart((prev) =>
      prev.filter(
        (item) => item.menuId !== menuId
      )
    );
  };

  // 총 수량
  const totalQuantity = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [cart]);

  // 총 금액
  const totalPrice = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  // 주문 생성
  const handleSubmit = async () => {
    if (cart.length === 0) {
      alert("주문할 메뉴를 선택해주세요.");
      return;
    }

    try {
      setSaving(true);

      const items: CreateOrderItemRequest[] =
        cart.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
        }));

      const request: CreateOrderRequest = {
        items,
      };

      await createOrder(request);

      alert("주문이 생성되었습니다.");

      router.push("/orders");
    } catch (error) {
      console.error("주문 생성 실패:", error);
      alert("주문 생성에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="mx-auto max-w-[1400px] px-8 py-8">

        {/* 상단 */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/orders")}
            className="mb-5 flex cursor-pointer items-center gap-2 text-sm text-gray-500 transition hover:text-[#5C3A21]"
          >
            <ArrowLeft size={17} />
            주문 관리
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              주문 생성
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              메뉴를 선택하여 새로운 주문을 생성합니다.
            </p>
          </div>
        </div>

        {/* 본문 */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px]">

          {/* 메뉴 영역 */}
          <section className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">

            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-gray-900">
                    메뉴 선택
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    주문할 메뉴를 선택해주세요.
                  </p>
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="메뉴 검색"
                  className="w-56 rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#5C3A21]"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex h-96 items-center justify-center text-sm text-gray-400">
                메뉴를 불러오는 중...
              </div>
            ) : filteredMenus.length === 0 ? (
              <div className="flex h-96 flex-col items-center justify-center text-gray-400">
                <ShoppingBag
                  size={40}
                  className="mb-3"
                />

                <p className="text-sm">
                  등록된 메뉴가 없습니다.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3 lg:grid-cols-4">

                {filteredMenus.map((menu) => {
                  const cartItem = cart.find(
                    (item) =>
                      item.menuId === menu.id
                  );

                  return (
                    <button
                      key={menu.id}
                      type="button"
                      onClick={() =>
                        addMenu(menu)
                      }
                      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#CDB9A7] hover:shadow-md"
                    >
                      {/* 이미지 */}
                      <div className="mb-4 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-[#F7F3EF]">
                        {menu.imageUrl ? (
                          <img
                            src={menu.imageUrl}
                            alt={menu.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ShoppingBag
                            size={30}
                            className="text-[#B8A99D]"
                          />
                        )}
                      </div>

                      <p className="truncate text-sm font-bold text-gray-900">
                        {menu.name}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#5C3A21]">
                        {menu.price.toLocaleString()}
                        원
                      </p>

                      {cartItem && (
                        <div className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-[#F5EEE8] py-1.5 text-xs font-bold text-[#5C3A21]">
                          <Check size={13} />
                          {cartItem.quantity}개 선택
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* 주문서 */}
          <aside className="h-fit overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">

            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">
                    주문 내역
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    총 {totalQuantity}개
                  </p>
                </div>

                <ShoppingBag
                  size={20}
                  className="text-[#5C3A21]"
                />
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="flex h-72 flex-col items-center justify-center px-6 text-center text-gray-400">
                <ShoppingBag
                  size={42}
                  className="mb-4"
                />

                <p className="text-sm font-medium">
                  선택한 메뉴가 없습니다.
                </p>

                <p className="mt-1 text-xs">
                  왼쪽에서 메뉴를 선택해주세요.
                </p>
              </div>
            ) : (
              <>
                <div className="max-h-[500px] divide-y divide-gray-100 overflow-y-auto">

                  {cart.map((item) => (
                    <div
                      key={item.menuId}
                      className="px-6 py-5"
                    >
                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-900">
                            {item.menuName}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {item.price.toLocaleString()}
                            원
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              item.menuId
                            )
                          }
                          className="cursor-pointer text-gray-400 transition hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">

                        <div className="flex items-center rounded-lg border border-gray-200">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item.menuId
                              )
                            }
                            className="cursor-pointer px-3 py-2 text-gray-500 transition hover:bg-gray-50"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="min-w-10 text-center text-sm font-bold text-gray-900">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item.menuId
                              )
                            }
                            className="cursor-pointer px-3 py-2 text-gray-500 transition hover:bg-gray-50"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <p className="text-sm font-bold text-gray-900">
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString()}
                          원
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 금액 */}
                <div className="border-t border-gray-100 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      총 결제금액
                    </span>

                    <span className="text-2xl font-black text-[#5C3A21]">
                      {totalPrice.toLocaleString()}
                      원
                    </span>
                  </div>
                </div>

                {/* 버튼 */}
                <div className="border-t border-gray-100 bg-[#FCFCFC] p-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="w-full cursor-pointer rounded-xl bg-[#5C3A21] py-3.5 text-sm font-bold text-white transition hover:bg-[#4A2E1A] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "주문 생성 중..."
                      : "주문 생성"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/orders")
                    }
                    disabled={saving}
                    className="mt-2 w-full cursor-pointer rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    취소
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}