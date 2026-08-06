import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Boxes,
  ShoppingCart,
  Users,
  Bell,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: <BarChart3 size={28} />,
    title: "매출 분석",
    desc: "실시간 매출 현황과 판매 데이터를 확인하세요.",
  },
  {
    icon: <Boxes size={28} />,
    title: "재고 관리",
    desc: "재고와 최소 재고를 손쉽게 관리합니다.",
  },
  {
    icon: <ShoppingCart size={28} />,
    title: "주문(POS)",
    desc: "빠르고 편리한 주문 및 결제 시스템.",
  },
  {
    icon: <Users size={28} />,
    title: "직원 관리",
    desc: "직원 정보와 근태를 관리합니다.",
  },
  {
    icon: <Bell size={28} />,
    title: "공지 관리",
    desc: "공지사항을 등록하고 공유하세요.",
  },
  {
    icon: <Brain size={28} />,
    title: "AI 분석",
    desc: "판매 추이와 재고를 예측합니다.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf8f6]">

      {/* Header */}

      <header className="border-b border-[#ece7e3] bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

          <h1 className="text-3xl font-bold text-[#8B5E3C]">
            ☕ CafeOS
          </h1>

          <nav className="hidden items-center gap-10 text-sm text-gray-600 md:flex">
            <a href="#">기능 소개</a>
            <a href="#">가격</a>
            <a href="#">고객지원</a>
            <a href="#">문의</a>
          </nav>

          <Link
            href="/login"
            className="rounded-lg bg-[#8B5E3C] px-5 py-2 font-semibold text-white transition hover:bg-[#6d472e]"
          >
            로그인
          </Link>

        </div>
      </header>

      {/* Hero */}

      <section className="mx-auto flex max-w-7xl items-center justify-between gap-20 px-8 py-20">

        {/* Left */}

        <div className="max-w-xl">

          <h2 className="text-6xl font-extrabold leading-tight text-gray-900">
            카페 운영,
            <br />
            더 쉽고 스마트하게
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            매출, 재고, 직원, 주문, 공지까지
            <br />
            모든 것을 하나의 시스템에서 관리하세요.
          </p>

          <div className="mt-10 flex gap-4">

            <Link
              href="/login"
              className="rounded-xl bg-[#8B5E3C] px-8 py-4 font-semibold text-white transition hover:bg-[#71482e]"
            >
              시작하기
            </Link>

            <button className="rounded-xl border border-gray-300 bg-white px-8 py-4 font-semibold hover:bg-gray-50">
              기능 둘러보기
            </button>

          </div>

        </div>

        {/* Right */}

        <div className="relative h-[500px] w-[520px] overflow-hidden rounded-[36px] bg-white shadow-2xl">

          <Image
            src="/images/hero.jpg"
            alt="Cafe"
            fill
            priority
            className="object-cover"
          />

        </div>

      </section>

      {/* Feature */}

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-8 pb-24 md:grid-cols-2 lg:grid-cols-3">

        {features.map((item) => (

          <div
            key={item.title}
            className="rounded-3xl border border-[#efefef] bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5EEE8] text-[#8B5E3C]">
              {item.icon}
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              {item.title}
            </h3>

            <p className="mt-3 leading-7 text-gray-500">
              {item.desc}
            </p>

          </div>

        ))}

      </section>

    </main>
  );
}