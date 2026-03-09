"use client";

import {
  IndianRupee,
  ShoppingBag,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Loader2,
  TrendingUp,
  PackageCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

interface DashboardStats {
  stats: {
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    openTickets: number;
    totalRevenue: number;
  };
  monthlyRevenue: {
    _id: { month: number; year: number };
    revenue: number;
  }[];
  recentOrders: {
    _id: string;
    user: { name: string; email: string };
    totalAmount: number;
    orderStatus: string;
    createdAt: string;
  }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Loading Hub Data...</p>
        </div>
      </div>
    );
  }

  const summaryStats = [
    { label: "Total Revenue", value: `₹${(data?.stats.totalRevenue || 0).toLocaleString()}`, trend: "+12.5%", isUp: true, icon: IndianRupee, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Volume", value: data?.stats.totalOrders || 0, trend: "+8.2%", isUp: true, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Support", value: data?.stats.openTickets || 0, trend: "Pending", isUp: false, icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Network", value: data?.stats.totalUsers || 0, trend: "+25%", isUp: true, icon: Users, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-primary">
            <TrendingUp size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Performance Alpha</span>
          </div>
          <h1 className="text-5xl font-outfit font-black text-white tracking-tight">System <span className="text-primary italic">Intelligence</span></h1>
          <p className="text-muted-foreground font-medium">Monitoring real-time business velocity and marketplace trends.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5">Generate Report</button>
          <button className="bg-primary text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] glow-blue border border-white/10">Synchronize Nodes</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 cursor-help"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner", stat.bg, stat.color)}>
                <stat.icon size={28} />
              </div>
              <div className={cn(
                "flex items-center space-x-1 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-tighter",
                stat.isUp ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
              )}>
                <span>{stat.trend}</span>
                {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              </div>
            </div>
            <div className="mt-8 relative z-10">
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h4 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section Simulation */}
        <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] space-y-10 relative overflow-hidden">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <IndianRupee size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Revenue Stream</h3>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Growth Velocity Analysis</p>
                    </div>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                    {['6M', '1Y', 'ALL'].map(t => (
                        <button key={t} className={cn("px-4 py-2 text-[10px] font-black rounded-lg transition-all", t === '6M' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white")}>{t}</button>
                    ))}
                </div>
              </div>
          
          <div className="relative h-72 w-full flex items-end justify-between px-6 pb-2 border-b border-white/5">
            {data?.monthlyRevenue.map((m, i) => {
                const maxRevenue = Math.max(...data.monthlyRevenue.map(r => r.revenue), 1);
                const h = (m.revenue / maxRevenue) * 100;
                return (
                    <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(h, 5)}%` }}
                          transition={{ delay: 0.5 + i * 0.05, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          className={cn(
                            "w-12 rounded-t-2xl transition-all hover:scale-x-110 cursor-pointer relative",
                            h > 80 ? "bg-primary glow-blue shadow-[0_0_30px_rgba(0,112,243,0.3)]" : "bg-white/10 hover:bg-white/20"
                          )}
                        >
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-[#050505] px-3 py-1.5 rounded-xl text-[10px] font-black shadow-2xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 pointer-events-none whitespace-nowrap z-20">
                            ₹{m.revenue.toLocaleString()}
                          </div>
                        </motion.div>
                        <span className="mt-6 text-[10px] text-muted-foreground font-black uppercase tracking-widest transition-colors group-hover:text-white">
                            {new Date(0, m._id.month - 1).toLocaleString('default', { month: 'short' })}
                        </span>
                    </div>
                );
            })}
          </div>
        </div>

        {/* Global Activity Feed */}
        <div className="glass-card p-10 rounded-[3rem] space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white tracking-tight">Active Node</h3>
            <Link href="/orders" className="flex items-center space-x-2 text-[10px] text-primary font-black uppercase tracking-[0.2em] group">
                <span>Full Logs</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          <div className="space-y-8">
            {data?.recentOrders.map((order, i) => (
              <div key={order._id} className="flex gap-5 group cursor-pointer relative">
                {i < (data?.recentOrders.length || 0) - 1 && <div className="absolute top-12 left-6 w-[1px] h-10 bg-white/5" />}
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white shrink-0 group-hover:border-primary/50 transition-colors duration-500">
                    <PackageCheck size={20} className="group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <div className="flex-grow min-w-0 space-y-2 pb-6 border-b border-white/5 last:border-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-white font-black text-sm tracking-tight truncate group-hover:text-primary transition-colors">{order.user?.name || "Anonymous Node"}</h5>
                    <span className="text-[10px] text-muted-foreground font-black whitespace-nowrap bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 group-hover:text-white transition-colors">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">₹{order.totalAmount.toLocaleString()} • Settlement</p>
                    <span className={cn(
                        "text-[9px] font-black uppercase px-2 py-0.5 rounded-md",
                        order.orderStatus === "delivered" ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                    )}>{order.orderStatus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
