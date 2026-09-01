"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getMyInfo, logout } from "@/services/user";
import type { UserResponse } from "@/types/user";

import { getSalesAnalysis } from "@/services/sales";
import type { SalesAnalysisResponse } from "@/types/sales";

import { getInventoryList } from "@/services/inventory";
import type { InventoryResponse } from "@/types/inventory";

import {
  Coffee,
  Bell,
  ChevronDown,
  Store,
  ShoppingCart,
  UtensilsCrossed,
  Package,
  Users,
  Clock3,
  Megaphone,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  const [user, setUser] =
    useState<UserResponse | null>(null);
    const [inventories, setInventories] = useState<InventoryResponse[]>([]);

  const [salesAnalysis, setSalesAnalysis] =
    useState<SalesAnalysisResponse | null>(null);

  const menus = [
    {
      name: "매장관리",
      href: "/dashboard",
      icon: Store,
    },
    {
      name: "주문관리",
      href: "/orders",
      icon: ShoppingCart,
    },
    {
      name: "메뉴관리",
      href: "/menus",
      icon: UtensilsCrossed,
    },
    {
      name: "재고관리",
      href: "/inventory",
      icon: Package,
    },
    {
      name: "직원관리",
      href: "/employees",
      icon: Users,
    },
    {
      name: "근태관리",
      href: "/attendance",
      icon: Clock3,
    },
    {
      name: "공지사항",
      href: "/notices",
      icon: Megaphone,
    },
    {
      name: "매출분석",
      href: "/sales",
      icon: BarChart3,
    },
  ];

  /**
   * 사용자 정보 조회
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMyInfo();
        setUser(data);
      } catch (error) {
        console.error(
          "사용자 정보 조회 실패:",
          error
        );
      }
    };

    fetchUser();
  }, []);

  const handleNotificationClick = async () => {
    try {
      const [salesData, inventoryData] = await Promise.all([
        getSalesAnalysis(),
        getInventoryList(),
      ]);

      setSalesAnalysis(salesData);
      setInventories(inventoryData);
    } catch (error) {
      console.error("알림 데이터 갱신 실패:", error);
    }

    setNotificationOpen((prev) => !prev);
  };

    const lowStockItems = inventories.filter(
      (inventory) =>
        inventory.quantity <= inventory.minimumStock
    );

  /**
   * AI 알림 개수
   *
   * 현재는 실제 데이터 기준으로 판단
   * - 오늘 매출 데이터가 존재하면 1
   * - 인기 메뉴 데이터가 존재하면 1
   * - 일별 매출 데이터가 존재하면 1
   *
   * 나중에 AI가 중요도까지 판단하도록 확장 가능
   */
  const notificationCount = [
    salesAnalysis?.todaySales !== undefined,
    lowStockItems.length > 0,
    salesAnalysis?.popularMenus &&
      salesAnalysis.popularMenus.length > 0,
  ].filter(Boolean).length;

  /**
   * 로그아웃
   */
  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    const confirmed = window.confirm(
      "로그아웃하시겠습니까?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoggingOut(true);

      await logout();

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      router.push("/login");
    } catch (error) {
      console.error(
        "로그아웃 요청 실패:",
        error
      );

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  /**
   * 내 정보
   */
  const handleMyInfo = () => {
    setUserMenuOpen(false);
    router.push("/mypage");
  };

  /**
   * 숫자 포맷
   */
  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) {
      return "-";
    }

    return `${price.toLocaleString()}원`;
  };

  /**
   * 대표 인기 메뉴
   */
  const popularMenu =
    salesAnalysis?.popularMenus?.[0];

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8EBEF] bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-8">

        {/* =========================
            Logo
        ========================= */}

        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5C3A21] text-white shadow">
            <Coffee size={22} />
          </div>

          <span className="text-2xl font-extrabold tracking-tight text-gray-900">
            CafeOS
          </span>
        </Link>

        {/* =========================
            Menu
        ========================= */}

        <nav className="hidden items-center gap-8 lg:flex">

          {menus.map((menu) => {
            const Icon = menu.icon;

            const active =
              pathname === menu.href ||
              pathname.startsWith(
                menu.href + "/"
              );

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`group relative flex items-center gap-2 pb-1 transition-all ${
                  active
                    ? "font-bold text-[#5C3A21]"
                    : "text-gray-600 hover:text-[#5C3A21]"
                }`}
              >
                <Icon
                  size={17}
                  className={
                    active
                      ? "text-[#5C3A21]"
                      : "text-gray-400 group-hover:text-[#5C3A21]"
                  }
                />

                <span className="text-[15px]">
                  {menu.name}
                </span>

                {active && (
                  <span className="absolute -bottom-[22px] left-0 h-[3px] w-full rounded-full bg-[#5C3A21]" />
                )}
              </Link>
            );
          })}

        </nav>

        {/* =========================
            Right
        ========================= */}

        <div className="flex items-center gap-5">

          {/* =========================
              AI Notification
          ========================= */}

          <div className="relative">

            <button
              type="button"
              onClick=
                {handleNotificationClick}

              className="relative cursor-pointer rounded-full p-2.5 transition hover:bg-gray-100"
              title="AI 운영 인사이트"
            >
              <Bell
                size={21}
                className="text-gray-600"
              />


              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5C3A21] px-1 text-[9px] font-bold text-white">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* =========================
                AI Insight Popup
            ========================= */}

            {notificationOpen && (
              <div className="absolute right-0 top-14 z-50 w-[360px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

                {/* Header */}
                <div className="border-b border-gray-100 px-5 py-4">
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        🤖 AI 운영 인사이트
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        오늘 매장 운영에서 확인할 사항
                      </p>
                    </div>

                    <span className="rounded-full bg-[#FAF8F5] px-2.5 py-1 text-[10px] font-bold text-[#5C3A21]">
                      AI
                    </span>

                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4 px-5 py-4">

                  {/* 오늘 매출 */}
                  <div className="flex gap-3">
                    <div className="mt-0.5 text-base">🟠</div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900">
                        오늘 매출
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        오늘 완료된 주문 기준 매출은{" "}
                        <span className="font-bold text-gray-800">
                          {formatPrice(salesAnalysis?.todaySales)}
                        </span>
                        입니다.
                      </p>
                    </div>
                  </div>

                  {/* 재고 부족 */}
                  <div className="flex gap-3">
                    <div className="mt-0.5 text-base">🔴</div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900">
                        재고 부족
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {lowStockItems.length > 0 ? (
                          <>
                            <span className="font-bold text-gray-800">
                              {lowStockItems
                                .slice(0, 3)
                                .map((item) => item.ingredientName)
                                .join(" · ")}
                            </span>
                            {lowStockItems.length > 3 && " 등"}{" "}
                            {lowStockItems.length}개 품목이
                            최소 재고 기준 이하입니다.
                          </>
                        ) : (
                          "현재 부족한 재고가 없습니다."
                        )}
                      </p>
                    </div>
                  </div>


                  {/* 인기 메뉴 */}
                  <div className="flex gap-3">
                    <div className="mt-0.5 text-base">
                      🟢
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900">
                        인기 메뉴
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {salesAnalysis?.totalOrders === 0 ? (
                          "이번 달 판매된 메뉴가 없습니다."
                        ) : popularMenu ? (
                          <>
                            이번 달 가장 많이 판매된 메뉴는{" "}
                            <span className="font-bold text-gray-800">
                              {popularMenu.menuName}
                            </span>
                            입니다.
                            {" "}

                          </>
                        ) : (
                          "인기 메뉴 데이터를 확인할 수 없습니다."
                        )}
                      </p>
                    </div>
                  </div>
                 </div>

                {/* Footer */}
                <div className="border-t border-gray-100 bg-[#FAF8F5] p-4">

                  <button
                    type="button"
                    onClick={() => {
                      setNotificationOpen(false);
                      router.push("/ai-analysis");
                    }}
                    className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#5C3A21] py-3 text-sm font-bold text-white transition hover:bg-[#472b18]"
                  >
                    AI 상세 분석 보기
                    <span className="ml-2">
                      →
                    </span>
                  </button>

                </div>

              </div>
            )}

          </div>

          {/* =========================
              User
          ========================= */}

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setUserMenuOpen(
                  (prev) => !prev
                )
              }
              className="flex cursor-pointer items-center gap-3 border-l border-gray-200 pl-5 transition hover:opacity-90"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5C3A21] font-bold text-white">
                ☕
              </div>

              <div className="text-left">

                <p className="text-xs font-bold text-gray-900">
                  {user?.role ?? "USER"}
                </p>

                <p className="text-[11px] text-gray-500">
                  {user?.role === "OWNER"
                    ? "사장님"
                    : user?.role === "MANAGER"
                      ? "매니저"
                      : user?.role === "STAFF"
                        ? "직원"
                        : "사용자"}
                </p>

              </div>

              <ChevronDown
                size={15}
                className={`text-gray-400 transition-transform ${
                  userMenuOpen
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>

            {/* Dropdown */}

            {userMenuOpen && (
              <div className="absolute right-0 top-[58px] z-50 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

                <div className="border-b border-gray-100 px-4 py-4">

                  <p className="text-[11px] font-medium text-gray-400">
                    로그인 계정
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {user?.role ?? "USER"}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {user?.role === "OWNER"
                      ? "사장님"
                      : user?.role === "MANAGER"
                        ? "매니저"
                        : user?.role === "STAFF"
                          ? "직원"
                          : "사용자"}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={handleMyInfo}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-[#FAF8F5] hover:text-[#5C3A21]"
                >
                  <User size={17} />
                  <span>내 정보</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogOut size={17} />

                  <span>
                    {loggingOut
                      ? "로그아웃 중..."
                      : "로그아웃"}
                  </span>
                </button>

              </div>
            )}

          </div>

        </div>

      </div>
    </header>
  );
}