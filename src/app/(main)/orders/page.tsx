"use client";

import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard,
  ExternalLink,
  MoreVertical,
  Loader2,
  ArrowUpDown,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Order {
  _id: string;
  user: { name: string; email: string };
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  orderStatus: string;
  externalPlatform: string;
  externalOrderId?: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/orders") // Will build this API
      .then(res => res.json())
      .then(data => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = orders.filter(o => 
    o._id.toLowerCase().includes(search.toLowerCase()) || 
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.externalOrderId?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle2 size={14} className="text-green-500" />;
      case "shipped": return <Truck size={14} className="text-blue-500" />;
      case "processing": return <Clock size={14} className="text-orange-500" />;
      case "cancelled": return <XCircle size={14} className="text-destructive" />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-primary">
            <ShoppingBag size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Transaction Layer</span>
          </div>
          <h1 className="text-5xl font-outfit font-black text-white tracking-tight">Order <span className="text-primary italic">Orchestration</span></h1>
          <p className="text-muted-foreground font-medium">Global commerce flow and cross-platform fulfillment tracking.</p>
        </div>
        <div className="flex items-center space-x-3">
            <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 transition-all">Bulk Process</button>
            <button className="bg-primary text-white px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] glow-blue border border-white/10 shrink-0">Export Ledger</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-card p-6 rounded-[2.5rem] border border-white/5 flex flex-wrap items-center justify-between gap-6">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search Order ID, Customer, or Platform ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary transition-all text-sm font-medium"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 px-6 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.1em] transition-all border border-white/5">
            <History size={16} />
            <span>Past Archives</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card rounded-[3rem] border border-white/5 overflow-hidden">
        {isLoading ? (
             <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Filtering Transaction Nodes...</p>
             </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <div className="flex items-center space-x-2">
                        <span>Transaction Hash</span>
                        <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Origin Node</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Currency Flow</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Network Status</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-6">
                      <div className="space-y-1">
                          <span className="text-white font-mono text-[11px] uppercase tracking-tighter block group-hover:text-primary transition-colors">#{order._id.slice(-8)}</span>
                          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.1em]">{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="space-y-1">
                          <span className="text-white font-black text-sm block tracking-tight uppercase">{order.user?.name || "Anonymous"}</span>
                          <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest">{order.externalPlatform}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 font-medium">
                      <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-white transition-colors">
                              <CreditCard size={14} />
                          </div>
                          <div>
                              <span className="text-white font-black text-sm">₹{order.totalAmount.toLocaleString()}</span>
                              <span className={cn(
                                "block text-[9px] font-black uppercase tracking-widest",
                                order.paymentStatus === "paid" ? "text-green-500" : "text-orange-500"
                              )}>{order.paymentStatus}</span>
                          </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-2">
                         <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                            {getStatusIcon(order.orderStatus)}
                         </div>
                         <span className={cn(
                           "text-[9px] font-black uppercase tracking-widest",
                           order.orderStatus === "delivered" ? "text-green-500" : 
                           order.orderStatus === "cancelled" ? "text-destructive" : "text-primary"
                         )}>
                           {order.orderStatus}
                         </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all">
                          <Truck size={16} />
                        </button>
                        <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all">
                          <MoreVertical size={16} />
                        </button>
                        <Link href={`/orders/${order._id}`} className="p-3 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl text-primary transition-all">
                          <ExternalLink size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Status Bar */}
        <div className="p-10 border-t border-white/5 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic">Omnichannel Fulfillment Synchronized • Node Cluster 05 Online</p>
          <div className="flex items-center space-x-3">
            <button className="p-3 border border-white/10 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all">
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center space-x-2">
                {[1, 2, 3].map((p) => (
                <button key={p} className={cn(
                    "w-10 h-10 rounded-xl font-black text-[10px] transition-all border",
                    p === 1 ? "bg-primary text-white shadow-lg shadow-primary/20 border-primary" : "text-muted-foreground border-white/5 hover:text-white hover:bg-white/5"
                )}>
                    {p}
                </button>
                ))}
            </div>
            <button className="p-3 border border-white/10 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
