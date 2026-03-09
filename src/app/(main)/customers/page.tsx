"use client";

import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  User as UserIcon, 
  Mail, 
  Smartphone, 
  MapPin, 
  ShoppingBag,
  ChevronRight,
  UserPlus,
  ArrowUpRight,
  Loader2,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Customer {
  _id: string;
  name?: string;
  email: string;
  role: string;
  phoneNumber?: string;
  createdAt: string;
  address?: {
    city: string;
    state: string;
  };
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/customers") // Placeholder - will build this API shortly
      .then(res => res.json())
      .then(data => setCustomers(data.users || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = customers.filter(c => 
    c.email.toLowerCase().includes(search.toLowerCase()) || 
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-primary">
            <Users size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Network Intelligence</span>
          </div>
          <h1 className="text-5xl font-outfit font-black text-white tracking-tight">Customer <span className="text-primary italic">OS</span></h1>
          <p className="text-muted-foreground font-medium">Unified CRM and identity management for the MA Tech ecosystem.</p>
        </div>
        <button className="bg-primary text-white px-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center space-x-3 glow-blue border border-white/10 shrink-0 hover:scale-[1.02] transition-all">
          <UserPlus size={20} />
          <span>Onboard User</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="glass-card p-6 rounded-[2.5rem] border border-white/5 flex flex-wrap items-center justify-between gap-6">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary transition-all text-sm font-medium"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 px-6 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.1em] transition-all border border-white/5">
            <Filter size={16} />
            <span>Refine Audience</span>
          </button>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Decoding Identity Matrix...</p>
            </div>
        ) : filtered.map((customer) => (
          <motion.div 
            key={customer._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-10 rounded-[3.5rem] border border-white/5 hover:bg-white/[0.04] transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
            
            <button className="absolute top-10 right-10 p-2 text-muted-foreground hover:text-white transition-colors z-10">
              <MoreVertical size={20} />
            </button>
            
            <div className="flex items-start space-x-8 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center text-primary border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <UserIcon size={36} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <h3 className="text-2xl font-black text-white tracking-tight">{customer.name || "Anonymous User"}</h3>
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                    customer.role === "admin" ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-muted-foreground border-white/10"
                  )}>
                    {customer.role}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground font-medium">
                  <div className="flex items-center space-x-1">
                      <Mail size={12} className="text-primary/50" />
                      <span>{customer.email}</span>
                  </div>
                  {customer.phoneNumber && (
                    <>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <div className="flex items-center space-x-1">
                            <Smartphone size={12} className="text-primary/50" />
                            <span>{customer.phoneNumber}</span>
                        </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-8 border-t border-white/5 pt-10">
              <div className="space-y-2 group/stat">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] flex items-center space-x-2 group-hover/stat:text-primary transition-colors">
                  <ShoppingBag size={12} />
                  <span>Interaction Summary</span>
                </p>
                <div className="space-y-1">
                    <p className="text-white font-black text-lg tracking-tight">Active Node</p>
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest">Joined {new Date(customer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-2 group/stat">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] flex items-center space-x-2 group-hover/stat:text-primary transition-colors">
                  <MapPin size={12} />
                  <span>Geographic Tag</span>
                </p>
                <div className="space-y-1">
                    <p className="text-white font-black text-sm tracking-tight truncate">{customer.address?.city || "Remote"}, {customer.address?.state || "Unknown"}</p>
                    <div className="flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase text-green-500 tracking-widest">Online Now</span>
                    </div>
                </div>
              </div>
            </div>

            <button className="mt-10 w-full py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-3 transition-all group-hover:bg-primary group-hover:text-white group-hover:glow-blue overflow-hidden relative">
              <span className="relative z-10">Access Full Profile</span>
              <ChevronRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
