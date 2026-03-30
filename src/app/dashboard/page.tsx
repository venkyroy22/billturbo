import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  TrendingUp,
  Receipt,
  ShoppingCart,
  ArrowRight,
  ReceiptText,
  Package,
  ArrowUpRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getStats(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [totalBills, todayBills, totalRevenue, recentBills, chartDataRaw] =
    await Promise.all([
      prisma.bill.count({ where: { shopId: userId } }),
      prisma.bill.count({ where: { shopId: userId, createdAt: { gte: today } } }),
      prisma.bill.aggregate({ where: { shopId: userId }, _sum: { totalAmount: true } }),
      prisma.bill.findMany({
        where: { shopId: userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, billNumber: true, totalAmount: true, customerName: true, customerPhone: true, createdAt: true },
      }),
      prisma.bill.groupBy({
        by: ["createdAt"],
        where: { shopId: userId, createdAt: { gte: sevenDaysAgo } },
        _sum: { totalAmount: true },
      }),
    ]);

  const dailyRevMap: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyRevMap[d.toLocaleDateString()] = 0;
  }
  chartDataRaw.forEach((item: any) => {
    const dateStr = new Date(item.createdAt).toLocaleDateString();
    if (dailyRevMap[dateStr] !== undefined) dailyRevMap[dateStr] += item._sum.totalAmount || 0;
  });

  const chartData = Object.entries(dailyRevMap)
    .map(([date, amount]) => ({ date, amount }))
    .reverse();

  return {
    totalBills,
    todayBills,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    recentBills,
    chartData,
  };
}

function RevenueSparkline({ data }: { data: { date: string; amount: number }[] }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.amount), 1);
  const points = data
    .map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.amount / max) * 80}`)
    .join(" ");

  return (
    <div className="w-full h-16 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M 0 100 L ${points} L 100 100 Z`} fill="url(#sparkGrad)" />
        <polyline
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="opacity-50"
        />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1)) * 100}
            cy={100 - (d.amount / max) * 80}
            r="2.5"
            fill="white"
            className="opacity-0 hover:opacity-100 transition-opacity"
          />
        ))}
      </svg>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  let stats = {
    totalBills: 0, todayBills: 0, totalRevenue: 0,
    recentBills: [] as any[], chartData: [] as any[],
  };

  try {
    if (session?.user?.id) stats = await getStats(session.user.id);
  } catch (e) {
    console.error("Failed to fetch stats:", e);
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      sub: stats.totalRevenue > 0 ? "All time" : "Make your first sale",
      chart: <RevenueSparkline data={stats.chartData} />,
      accent: "group-hover:text-emerald-300",
    },
    {
      title: "Bills Generated",
      value: String(stats.totalBills),
      icon: Receipt,
      sub: `${stats.todayBills} today`,
      chart: null,
      accent: "group-hover:text-sky-300",
    },
    {
      title: "Today's Sales",
      value: String(stats.todayBills),
      icon: ShoppingCart,
      sub: "Daily activity",
      chart: null,
      accent: "group-hover:text-violet-300",
    },
  ];

  return (
    <div className="space-y-10 animate-float-up">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/[0.06]">
        <div>
          <span className="section-label mb-4 block">Overview</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            Dashboard
          </h1>
          <p className="text-white/30 text-[11px] font-bold tracking-[0.3em] uppercase mt-5 flex items-center gap-3">
            <span className="w-6 h-px bg-white/15" />
            Welcome back, {session?.user?.name || "Shop Owner"}
          </p>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] px-5 py-3.5 bg-white/[0.03] border border-white/[0.06] text-white/40 hover:border-white/15 transition-colors duration-300">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          System Online
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, idx) => (
          <div
            key={stat.title}
            className="group brutalist-card flex flex-col gap-4 animate-float-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="p-3.5 bg-white/[0.04] border border-white/[0.06] group-hover:bg-white group-hover:text-black transition-all duration-500 shrink-0">
                <stat.icon size={18} />
              </div>
              <ArrowUpRight size={14} className="text-white/10 group-hover:text-white/30 transition-colors" />
            </div>

            <div className="mt-2">
              <p className="section-label mb-2">{stat.title}</p>
              <div className={`text-4xl font-black tracking-tighter transition-all duration-500 ${stat.accent}`}>
                {stat.value}
              </div>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] mt-2">{stat.sub}</p>
            </div>

            {stat.chart && (
              <div className="mt-2 pt-4 border-t border-white/[0.06] opacity-40 group-hover:opacity-80 transition-opacity duration-700">
                {stat.chart}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Quick Actions + Recent Bills ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Quick Actions */}
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <span className="section-label">Quick Actions</span>
            <div className="flex-1 h-px bg-white/[0.04]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { href: "/dashboard/billing", icon: ReceiptText, label: "Create Bill", desc: "New invoice" },
              { href: "/dashboard/products", icon: Package, label: "Products", desc: "Manage catalog" },
            ].map(({ href, icon: Icon, label, desc }) => (
              <a
                key={href}
                href={href}
                className="group flex flex-col justify-between p-8 bg-white/[0.02] hover:bg-white hover:text-black border border-white/[0.06] hover:border-transparent transition-all duration-500 h-48 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 transition-all duration-700 pointer-events-none" />
                <Icon className="group-hover:scale-110 transition-transform duration-500 text-white/50 group-hover:text-black" size={32} />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] mb-1">{label}</p>
                  <p className="text-[10px] text-white/30 group-hover:text-black/50 font-bold uppercase tracking-[0.2em] transition-colors">{desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Bills */}
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <span className="section-label whitespace-nowrap">Recent Bills</span>
              <div className="flex-1 h-px bg-white/[0.04]" />
            </div>
            <a
              href="/dashboard/history"
              className="flex items-center gap-1.5 text-[10px] font-black text-white/25 hover:text-white uppercase tracking-[0.3em] transition-colors"
            >
              All <ArrowRight size={10} />
            </a>
          </div>

          <div className="space-y-2">
            {stats.recentBills.length === 0 ? (
              <div className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/10 text-center py-16 border border-white/[0.04] bg-white/[0.01]">
                No bills yet
              </div>
            ) : (
              stats.recentBills.map((bill) => (
                <a
                  key={bill.id}
                  href={`/invoice/${bill.id}`}
                  className="group flex items-center justify-between px-5 py-4 bg-white/[0.02] hover:bg-white hover:text-black border border-white/[0.05] hover:border-transparent transition-all duration-400"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-[10px] font-black text-white/20 group-hover:text-black/40 transition-colors uppercase tracking-wider tabular-nums">
                      #{bill.billNumber}
                    </span>
                    <div>
                      <p className="font-black text-xs tracking-[0.1em] uppercase">{bill.customerName || "Walk-in"}</p>
                      <p className="text-[10px] text-white/25 group-hover:text-black/40 font-bold uppercase tracking-[0.2em] mt-0.5 transition-colors">
                        {formatDate(bill.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {bill.isPaid ? (
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 group-hover:text-emerald-600 border border-emerald-500/25 px-2 py-1">Paid</span>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400/60 group-hover:text-amber-600/60 border border-amber-500/20 px-2 py-1">Pending</span>
                    )}
                    <p className="text-base font-black tracking-tighter">{formatCurrency(bill.totalAmount)}</p>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 translate-x-[-6px] group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
