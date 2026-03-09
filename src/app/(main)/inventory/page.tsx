"use client";

import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Package,
  ArrowUpDown,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  category: { name: string };
  images: string[];
  isActive: boolean;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/products")
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-primary">
            <Package size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Stock Intelligence</span>
          </div>
          <h1 className="text-5xl font-outfit font-black text-white tracking-tight">Catalog <span className="text-primary italic">Matrix</span></h1>
          <p className="text-muted-foreground font-medium">Global inventory distribution and lifecycle management.</p>
        </div>
        <Link href="/inventory/new" className="bg-primary text-white px-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center space-x-3 glow-blue hover:scale-[1.02] transition-all border border-white/10 shrink-0">
          <Plus size={20} />
          <span>Deploy Product</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="glass-card p-6 rounded-[2.5rem] border border-white/5 flex flex-wrap items-center justify-between gap-6">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by SKU, Name or Category..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary transition-all text-sm font-medium"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 px-6 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.1em] transition-all border border-white/5">
            <Filter size={16} />
            <span>Refine Search</span>
          </button>
          <div className="h-10 w-[1px] bg-white/10" />
          <select className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-[0.1em] text-white focus:outline-none focus:border-primary transition-all cursor-pointer">
            <option>All Segments</option>
            <option>Enterprise</option>
            <option>Consumer</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-card rounded-[3rem] border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Filtering Matrix...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <div className="flex items-center space-x-2">
                        <span>Product Entity</span>
                        <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Category</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Valuation</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Node Stock</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((item) => (
                  <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-5">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 relative overflow-hidden shrink-0 border border-white/5 group-hover:border-primary/30 transition-colors">
                          <Image 
                            src={item.images[0] || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200"} 
                            alt={item.name} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                        </div>
                        <div>
                            <span className="text-white font-black text-sm tracking-tight block group-hover:text-primary transition-colors">{item.name}</span>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{item.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-[10px] text-white font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">{item.category?.name || "Uncategorized"}</span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-white font-black text-sm">₹{item.price.toLocaleString()}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-3">
                         {item.stock > 10 ? (
                           <div className="w-2 h-2 rounded-full bg-green-500 glow-green" />
                         ) : (
                           <div className={cn("w-2 h-2 rounded-full animate-ping", item.stock > 0 ? "bg-orange-500" : "bg-destructive")} />
                         )}
                         <span className={cn(
                           "text-[10px] font-black uppercase tracking-widest",
                           item.stock > 10 ? "text-green-500" : 
                           item.stock > 0 ? "text-orange-500" : "text-destructive"
                         )}>
                           {item.stock} Units
                         </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all">
                          <Edit size={16} />
                        </button>
                        <button className="p-3 bg-white/5 hover:bg-destructive/10 border border-white/10 rounded-xl text-muted-foreground hover:text-white transition-all">
                          <Trash2 size={16} />
                        </button>
                        <Link href={`/product/${item.slug}`} className="p-3 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl text-primary transition-all">
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
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Global Catalog Synchronization • Node 001 Active</p>
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
