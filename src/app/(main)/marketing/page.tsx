"use client";

import { 
  Zap, 
  Plus, 
  Image as ImageIcon, 
  Send, 
  Target, 
  Globe, 
  Smartphone,
  Layout,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function MarketingPage() {

  const campaigns = [
    { name: "Premium Tech Week", reach: "1.2k", status: "Running", conversion: "12%" },
    { name: "Winter Clearance", reach: "4.5k", status: "Finished", conversion: "8%" },
    { name: "New Arrival Drop", reach: "800", status: "Draft", conversion: "0%" },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-primary">
            <Zap size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Marketing Engine</span>
          </div>
          <h1 className="text-5xl font-outfit font-black text-white tracking-tight">Broadcast <span className="text-primary italic">Central</span></h1>
          <p className="text-muted-foreground font-medium">Orchestrate executive offers and corporate updates across the network.</p>
        </div>
        <button className="bg-primary text-white px-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center space-x-3 glow-blue border border-white/10 shrink-0 hover:scale-[1.02] transition-all">
          <Plus size={20} />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Creation Workspace */}
        <div className="lg:col-span-2 space-y-10">
            <div className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-white tracking-tight">Forge New Post</h3>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        <button className="px-4 py-2 text-[10px] font-black bg-primary text-white rounded-lg shadow-lg shadow-primary/20 transition-all uppercase tracking-widest">Promotion</button>
                        <button className="px-4 py-2 text-[10px] font-black text-muted-foreground hover:text-white transition-all uppercase tracking-widest">Announcement</button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] ml-4">Campaign Headline</label>
                        <input 
                            type="text" 
                            placeholder="Type high-impact title..."
                            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-white font-black tracking-tight focus:outline-none focus:border-primary transition-all text-lg"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] ml-4">Broadcast Content</label>
                        <textarea 
                            placeholder="Compose detailed marketing copy..."
                            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-white font-medium focus:outline-none focus:border-primary transition-all text-sm min-h-[150px] resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3 group cursor-pointer border-2 border-dashed border-white/10 rounded-[1.5rem] p-10 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
                            <ImageIcon size={32} />
                            <p className="text-[10px] font-black uppercase tracking-widest">Primary Visual</p>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] ml-2">Target URL</label>
                                <input 
                                    type="text" 
                                    placeholder="/shop"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-medium text-xs font-mono"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] ml-2">Discount Prefix</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 20% OFF"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-medium text-xs font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                            <Globe size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Web Hub</span>
                        </div>
                        <div className="flex items-center space-x-2 text-primary">
                            <Smartphone size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">App Push</span>
                        </div>
                    </div>
                    <button className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center space-x-3 glow-blue">
                        <Send size={18} />
                        <span>Deploy Alpha</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Intelligence Panel */}
        <div className="space-y-10">
            <div className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-10 border-l-4 border-l-primary/30">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                        <Target size={24} />
                    </div>
                    <h4 className="text-xl font-black text-white tracking-tight italic uppercase">Active Metrics</h4>
                </div>
                <div className="space-y-6">
                    {campaigns.map((c, i) => (
                        <div key={i} className="space-y-3 group">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black text-white group-hover:text-primary transition-colors">{c.name}</span>
                                <span className={cn(
                                    "text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border",
                                    c.status === "Running" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-white/5 text-muted-foreground border-white/10"
                                )}>{c.status}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Reach</p>
                                    <p className="text-white font-black text-sm">{c.reach}</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Rate</p>
                                    <p className="text-primary font-black text-sm">{c.conversion}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Layout Preview Simulation */}
            <div className="glass-card p-10 rounded-[3rem] border border-white/5 bg-gradient-to-br from-white/[0.02] to-primary/5 group cursor-wait relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between transition-opacity group-hover:opacity-0">
                    <div className="flex items-center space-x-2">
                        <Layout size={16} className="text-primary/50" />
                        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Live Preview Node</span>
                    </div>
                </div>
                <div className="pt-8 space-y-4">
                    <div className="w-full aspect-video rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 italic group-hover:text-primary/50 transition-colors">
                        <Layout size={40} />
                    </div>
                    <div className="space-y-2">
                        <div className="w-2/3 h-4 bg-white/5 rounded-full" />
                        <div className="w-full h-2 bg-white/5 rounded-full" />
                        <div className="w-full h-2 bg-white/5 rounded-full opacity-50" />
                    </div>
                    <div className="pt-4 flex items-center justify-between">
                        <div className="w-20 h-8 bg-primary/20 rounded-xl" />
                        <ExternalLink size={16} className="text-white/20" />
                    </div>
                </div>
                <div className="absolute inset-0 bg-[#050505]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <div className="text-center space-y-2">
                        <p className="text-xs font-black text-white italic tracking-widest uppercase">Initializing Canvas...</p>
                        <p className="text-[9px] text-primary font-black uppercase tracking-tight">Real-time simulation online</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
