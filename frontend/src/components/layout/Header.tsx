"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();

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
      href: "/staff",
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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E8EBEF] shadow-sm">
      <div className="max-w-[1600px] mx-auto h-20 px-8 flex items-center justify-between">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-xl bg-[#5C3A21] flex items-center justify-center text-white shadow">
            <Coffee size={22} />
          </div>

          <span className="text-2xl font-extrabold tracking-tight text-gray-900">
            CafeOS
          </span>
        </Link>

        {/* Menu */}
        <nav className="hidden lg:flex items-center gap-8">

          {menus.map((menu) => {
            const Icon = menu.icon;

            const active =
              pathname === menu.href ||
              pathname.startsWith(menu.href + "/");

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`group relative flex items-center gap-2 pb-1 transition-all
                ${
                  active
                    ? "text-[#5C3A21] font-bold"
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

                <span className="text-[15px]">{menu.name}</span>

                {active && (
                  <span className="absolute -bottom-[22px] left-0 w-full h-[3px] rounded-full bg-[#5C3A21]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-5">

          {/* Notification */}
          <button className="relative p-2.5 rounded-full hover:bg-gray-100 transition cursor-pointer">
            <Bell size={21} className="text-gray-600" />

            <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          {/* User */}
          <button className="flex items-center gap-3 pl-5 border-l border-gray-200 hover:opacity-90 transition cursor-pointer">

            <div className="w-10 h-10 rounded-full bg-[#5C3A21] flex items-center justify-center text-white font-bold">
              ☕
            </div>

            <div className="text-left">
              <p className="text-xs font-bold text-gray-900">
                OWNER
              </p>

              <p className="text-[11px] text-gray-500">
                사장님
              </p>
            </div>

            <ChevronDown
              size={15}
              className="text-gray-400"
            />
          </button>

        </div>

      </div>
    </header>
  );
}