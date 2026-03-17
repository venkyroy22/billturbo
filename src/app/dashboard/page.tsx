import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  TrendingUp, 
  Receipt, 
  ShoppingCart, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  ReceiptText,
  Package,
  ArrowRight
} from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getStats(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // For chart data - last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [totalBills, todayBills, totalRevenue, recentBills, chartDataRaw] = await Promise.all([
    prisma.bill.count({ where: { shopId: userId } }),
    prisma.bill.count({ 
      where: { 
        shopId: userId, 
        createdAt: { gte: today }
      } 
    }),
    prisma.bill.aggregate({
      where: { shopId: userId },
      _sum: { totalAmount: true }
    }),
    prisma.bill.findMany({
      where: { shopId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        billNumber: true,
        totalAmount: true,
        customerName: true,
        customerPhone: true,
        createdAt: true
      }
    }),
    prisma.bill.groupBy({
      by: ['createdAt'],
      where: {
        shopId: userId,
        createdAt: { gte: sevenDaysAgo }
      },
      _sum: {
        totalAmount: true
      }
    })
  ]);

  // Process chart data to be by day
  const dailyRevMap: Record<string, number> = {};
  for(let i=0; i<7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyRevMap[d.toLocaleDateString()] = 0;
  }
  
  chartDataRaw.forEach((item: any) => {
    const dateStr = new Date(item.createdAt).toLocaleDateString();
    if(dailyRevMap[dateStr] !== undefined) {
      dailyRevMap[dateStr] += item._sum.totalAmount || 0;
    }
  });

  const chartData = Object.entries(dailyRevMap)
    .map(([date, amount]) => ({ date, amount }))
    .reverse();

  return {
    totalBills,
    todayBills,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    recentBills,
    chartData
  };
}

function RevenueChart({ data }: { data: { date: string, amount: number }[] }) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map(d => d.amount), 1);
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.amount / max) * 80}`).join(" ");

  return (
    <div className="w-full h-32 relative group">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 100 L ${points} L 100 100 Z`}
          fill="url(#gradient)"
          className="transition-all duration-700"
        />
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="text-primary transition-all duration-700"
        />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1)) * 100}
            cy={100 - (d.amount / max) * 80}
            r="2"
            className="fill-white stroke-primary stroke-2 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        ))}
      </svg>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  // In a real scenario, prisma might fail if DB is not connected. 
  // We'll use try-catch or mock for now to ensure UI looks good.
  let stats = { totalBills: 0, todayBills: 0, totalRevenue: 0, recentBills: [] as any[], chartData: [] as any[] };
  
  try {
    if (session?.user?.id) {
      stats = await getStats(session.user.id);
    }
  } catch (e) {
    console.error("Failed to fetch stats:", e);
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: "text-white",
      bg: "bg-white/10",
      trend: stats.totalRevenue > 0 ? "Real data" : "Start now",
      chart: <RevenueChart data={stats.chartData} />
    },
    {
      title: "Bills Generated",
      value: stats.totalBills,
      icon: Receipt,
      color: "text-white",
      bg: "bg-white/10",
      trend: `${stats.todayBills} today`,
    },
    {
      title: "Today's Sales",
      value: stats.todayBills,
      icon: ShoppingCart,
      color: "text-white",
      bg: "bg-white/10",
      trend: "Daily pulse",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/30 mb-2 block">.00</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight uppercase">Dashboard</h1>
          <p className="text-white/50 text-sm tracking-wider uppercase mt-4">Welcome back, {session?.user?.name || "Shop Owner"}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-4 py-3 bg-[#121212] border border-white/10 text-white">
           <div className="w-2 h-2 bg-white animate-pulse" /> SYSTEM ONLINE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((stat, idx) => (
          <div key={stat.title} className="bg-[#121212] border border-white/5 p-8 hover:border-white/20 transition-colors flex flex-col justify-between group">
             <div className="flex justify-between items-start mb-12">
                <div className="p-4 bg-white/5 border border-white/10 transition-transform group-hover:scale-105">
                   <stat.icon className="text-white" size={24} />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                   0{idx + 1} // {stat.trend}
                </div>
             </div>
             <div className="space-y-4">
                <p className="text-xs font-bold text-white/50 uppercase tracking-[0.2em]">{stat.title}</p>
                <div className="text-4xl font-black tracking-tighter">{stat.value}</div>
             </div>
             {stat.chart && <div className="mt-8 pt-8 border-t border-white/5">{stat.chart}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#151515] border border-white/5 p-8 flex flex-col">
          <h3 className="text-xl font-bold uppercase tracking-[0.2em] mb-8 pb-4 border-b border-white/10">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-6 flex-1">
            <a href="/dashboard/billing" className="flex flex-col items-center justify-center p-8 bg-[#121212] hover:bg-white hover:text-black transition-colors border border-white/5 group h-full">
              <ReceiptText className="mb-4 group-hover:scale-110 transition-transform" size={32} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Create Bill</span>
            </a>
            <a href="/dashboard/products" className="flex flex-col items-center justify-center p-8 bg-[#121212] hover:bg-white hover:text-black transition-colors border border-white/5 group h-full">
              <Package className="mb-4 group-hover:scale-110 transition-transform" size={32} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Manage Items</span>
            </a>
          </div>
        </div>

        <div className="bg-[#151515] border border-white/5 p-8 flex flex-col">
          <div className="flex flex-row items-center justify-between mb-8 pb-4 border-b border-white/10">
            <h3 className="text-xl font-bold uppercase tracking-[0.2em]">Recent Activity</h3>
            <a href="/dashboard/history" className="text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-[0.2em] transition-colors">View All +</a>
          </div>
          <div>
             {stats.recentBills.length === 0 ? (
               <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 text-center py-16 border border-dashed border-white/5">
                  NO RECENT ACTIVITY
               </div>
             ) : (
               <div className="space-y-2">
                 {stats.recentBills.map((bill) => (
                   <a 
                     key={bill.id} 
                     href={`/invoice/${bill.id}`}
                     className="flex items-center justify-between p-4 bg-[#121212] hover:bg-white hover:text-black transition-colors border border-white/5 group"
                   >
                     <div className="flex items-center gap-6">
                        <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50">
                           #{bill.billNumber}
                        </div>
                        <div>
                           <p className="font-bold text-sm tracking-widest uppercase">{bill.customerName || "WALK-IN"}</p>
                           <p className="text-[10px] opacity-50 font-bold uppercase tracking-[0.2em]">{formatDate(bill.createdAt)}</p>
                        </div>
                     </div>
                     <div className="text-right flex items-center gap-4">
                        <p className="font-black tracking-tight">{formatCurrency(bill.totalAmount)}</p>
                        <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                   </a>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
