"use client";

import { 
  Search, 
  MessageSquare, 
  User as UserIcon, 
  Send, 
  Loader2, 
  Inbox,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Ticket {
  _id: string;
  user: { name: string; email: string };
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function AdminQueriesPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetch("/api/admin/queries") // Will build this API
      .then(res => res.json())
      .then(data => setTickets(data.tickets || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = tickets.filter(t => 
    t.subject.toLowerCase().includes(search.toLowerCase()) || 
    t.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-8">
      {/* Ticket List */}
      <div className="w-1/3 flex flex-col space-y-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-primary">
            <MessageSquare size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Communication Hub</span>
          </div>
          <h1 className="text-4xl font-outfit font-black text-white tracking-tight">Support <span className="text-primary italic">Desk</span></h1>
        </div>

        <div className="glass-card p-4 rounded-3xl border border-white/5 relative group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Filter by subject or user..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-all text-xs font-medium"
          />
        </div>

        <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center h-40 space-y-4">
                <Loader2 className="animate-spin text-primary" size={24} />
                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Polling Nodes...</p>
             </div>
          ) : filtered.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-40 text-muted-foreground space-y-2 opacity-50">
                <Inbox size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest">No Active Queries</p>
             </div>
          ) : filtered.map((ticket) => (
            <motion.div 
              key={ticket._id}
              onClick={() => setSelectedTicket(ticket)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "glass-card p-6 rounded-[2rem] border border-white/5 cursor-pointer transition-all hover:bg-white/5 group relative overflow-hidden",
                selectedTicket?._id === ticket._id ? "bg-white/10 border-primary/30 glow-blue" : ""
              )}
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-2 flex-grow min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        ticket.priority === "high" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : 
                        ticket.priority === "medium" ? "bg-orange-500" : "bg-blue-500"
                    )} />
                    <h5 className="text-white font-black text-sm tracking-tight truncate">{ticket.subject}</h5>
                  </div>
                  <p className="text-muted-foreground text-[10px] font-medium line-clamp-1">{ticket.user?.name || "Guest"}</p>
                </div>
                <span className="text-[9px] text-muted-foreground font-black whitespace-nowrap bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 ml-4">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ticket Workspace */}
      <div className="flex-1 glass-card rounded-[3rem] border border-white/5 flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          {selectedTicket ? (
            <motion.div 
                key={selectedTicket._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full"
            >
                {/* Chat Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center space-x-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner italic font-black text-xl">
                            {selectedTicket.user?.name?.[0] || "?"}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight">{selectedTicket.user?.name || "Anonymous Requester"}</h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{selectedTicket.user?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                            selectedTicket.status === "open" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-white/5 text-muted-foreground border-white/10"
                        )}>
                            Status: {selectedTicket.status}
                        </div>
                    </div>
                </div>

                {/* Message Log */}
                <div className="flex-grow p-10 overflow-y-auto space-y-10 custom-scrollbar">
                    <div className="flex items-start space-x-5">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shadow-inner mt-1">
                            <UserIcon size={18} />
                        </div>
                        <div className="space-y-2 max-w-2xl">
                            <div className="bg-white/5 p-6 rounded-3xl rounded-tl-none border border-white/5">
                                <p className="text-sm text-white/90 leading-relaxed font-medium">{selectedTicket.message}</p>
                            </div>
                            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest block pl-2">Client Request • {new Date(selectedTicket.createdAt).toLocaleTimeString()}</span>
                        </div>
                    </div>

                    {/* Simulation of Admin Replies */}
                    <div className="flex items-start justify-end space-x-5">
                        <div className="space-y-2 max-w-2xl text-right">
                            <div className="bg-primary p-6 rounded-3xl rounded-tr-none shadow-xl shadow-primary/20">
                                <p className="text-sm text-white leading-relaxed font-black">Agent initialized. We are currently investigating the protocol anomaly. Your node will be updated shortly.</p>
                            </div>
                            <span className="text-[9px] text-primary font-black uppercase tracking-widest block pr-2">System Admin • Just Now</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-blue mt-1">
                            <ShieldCheck size={18} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Response Controller */}
                <div className="p-8 bg-[#050505]/50 border-t border-white/5">
                    <div className="relative group">
                        <textarea 
                            placeholder="Draft your executive response..."
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-8 pr-20 py-6 text-white text-sm font-medium focus:outline-none focus:border-primary transition-all resize-none min-h-[100px]"
                        />
                        <button className="absolute right-4 bottom-4 p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all glow-blue group-focus-within:rotate-12">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </motion.div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center space-y-6 opacity-30 select-none">
                <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center text-white border border-white/5">
                    <Inbox size={48} />
                </div>
                <div className="text-center space-y-2 px-10">
                    <p className="text-xl font-black text-white tracking-tight uppercase">Desk Standby</p>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Select a communication node from the matrix to initialize response sequence.</p>
                </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

