"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Bell,
  Search,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  MessageSquare,
  Zap,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminMenuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Inventory", icon: Package, href: "/inventory" },
  { label: "Orders", icon: ShoppingCart, href: "/orders" },
  { label: "Customers", icon: Users, href: "/customers" },
  { label: "Queries", icon: MessageSquare, href: "/queries" },
  { label: "Marketing", icon: Zap, href: "/marketing" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show layout on login page
  if (pathname === "/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#050505] flex selection:bg-primary selection:text-white">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-card backdrop-blur-3xl border-r border-white/5 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white glow-blue transition-transform group-hover:rotate-12">
              <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-outfit font-bold text-white tracking-tight leading-none">Admin<span className="text-primary">Hub</span></span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1">Enterprise</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2 py-4">
          {adminMenuItems.map((item) => {
            const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-primary text-white shadow-xl shadow-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={20} className={cn("transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-2">
          <Link
            href="/settings"
            className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all"
          >
            <Settings size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Settings</span>
          </Link>
          <button className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-destructive hover:bg-destructive/10 transition-all">
            <LogOut size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        {/* Admin Header */}
        <header className="h-24 border-b border-white/5 bg-[#050505]/50 backdrop-blur-md sticky top-0 z-40 px-10 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search customers, products, or orders..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-all text-sm"
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Live System</span>
            </div>

            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all relative group">
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full border-2 border-[#050505]" />
            </button>
            
            <div className="h-10 w-[1px] bg-white/10" />

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-none">Ahmed Admin</p>
                <p className="text-[9px] text-primary font-bold uppercase tracking-[0.2em] mt-1">Super User</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 border border-white/10 flex items-center justify-center text-white font-bold text-xl font-outfit shadow-lg shadow-primary/20">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-10 flex-grow">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
