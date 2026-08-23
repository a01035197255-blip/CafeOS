"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMyInfo } from "@/services/user";
import type { UserResponse } from "@/types/user";
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

import { logout } from "@/services/user";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

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

      // 백엔드 로그아웃
      // → Redis Refresh Token 삭제
      await logout();

      // 브라우저 Access Token 삭제
      localStorage.removeItem("accessToken");

      // 혹시 저장되어 있다면 Refresh Token도 삭제
      localStorage.removeItem("refreshToken");

      // 로그인 페이지 이동
      router.push("/login");
    } catch (error) {
      console.error(
        "로그아웃 요청 실패:",
        error
      );

      /*
       * 서버 로그아웃 요청이 실패하더라도
       * 브라우저에 남아있는 토큰은 삭제
       */
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

    const [user, setUser] =
      useState<UserResponse | null>(null);

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

  /**
   * 내 정보
   */
  const handleMyInfo = () => {
    setUserMenuOpen(false);
    router.push("/mypage");
  };

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
              Notification
          ========================= */}

          <button
            type="button"
            className="relative cursor-pointer rounded-full p-2.5 transition hover:bg-gray-100"
          >
            <Bell
              size={21}
              className="text-gray-600"
            />

            <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>

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
              {/* Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5C3A21] font-bold text-white">
                ☕
              </div>

              {/* User Info */}
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

              {/* Arrow */}
              <ChevronDown
                size={15}
                className={`text-gray-400 transition-transform ${
                  userMenuOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* =========================
                Dropdown
            ========================= */}

            {userMenuOpen && (
              <div className="absolute right-0 top-[58px] z-50 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

                {/* Account Info */}
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

                {/* 내 정보 */}
                <button
                  type="button"
                  onClick={handleMyInfo}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-[#FAF8F5] hover:text-[#5C3A21]"
                >
                  <User size={17} />

                  <span>
                    내 정보
                  </span>
                </button>

                {/* 로그아웃 */}
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