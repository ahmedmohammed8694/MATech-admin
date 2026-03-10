"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Package, 
  Save, 
  Loader2, 
  Plus, 
  X, 
  Layout, 
  Settings, 
  Image as LucideImage,
  Globe,
  Zap,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [uploadMode, setUploadMode] = useState<"url" | "upload">("url");
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    salePrice: "",
    category: "",
    stock: "0",
    brand: "",
    features: [""] as string[],
    specifications: [{ key: "", value: "" }],
    images: [""] as string[],
    isFeatured: false,
    isActive: true,
    whatsappQuickOrder: true
  });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  // Slug availability check
  useEffect(() => {
    if (!formData.slug) {
      setSlugStatus("idle");
      return;
    }

    const timer = setTimeout(async () => {
      setSlugStatus("checking");
      try {
        const res = await fetch("/api/admin/products/check-slug", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: formData.slug })
        });
        const data = await res.json();
        setSlugStatus(data.available ? "available" : "taken");
      } catch {
        setSlugStatus("idle");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.slug]);

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    setFormData(prev => ({ ...prev, name, slug }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images.filter(img => img !== ""), data.url]
        }));
      }
    } catch {
      alert("Matrix upload failure");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => setFormData(prev => ({ ...prev, features: [...prev.features, ""] }));
  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleSpecChange = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const addSpec = () => setFormData(prev => ({ ...prev, specifications: [...prev.specifications, { key: "", value: "" }] }));
  const removeSpec = (index: number) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImage = () => setFormData(prev => ({ ...prev, images: [...prev.images, ""] }));
  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slugStatus === "taken") {
      alert("Product ID already exists in the matrix. Please modify the slug.");
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stock: Number(formData.stock),
        features: formData.features.filter(f => f.trim() !== ""),
        specifications: formData.specifications.reduce((acc, curr) => {
          if (curr.key && curr.value) acc[curr.key] = curr.value;
          return acc;
        }, {} as Record<string, string>),
        images: formData.images.filter(i => i.trim() !== "")
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to deploy product");
      }

      router.push("/inventory");
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Error deploying product. Check SKU/Slug uniqueness.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Link href="/inventory" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors group mb-4">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Matrix</span>
          </Link>
          <div className="flex items-center space-x-2 text-primary">
            <Package size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">New Entity Initialization</span>
          </div>
          <h1 className="text-5xl font-outfit font-black text-white tracking-tight">Deploy <span className="text-primary italic">Product</span></h1>
          <p className="text-muted-foreground font-medium">Provision new hardware or software entities into the global catalog.</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || slugStatus === "taken"}
          className="bg-primary text-white px-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center space-x-3 glow-blue hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition-all border border-white/10 shrink-0"
        >
          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          <span>{isSubmitting ? "Provisioning..." : "Finalize Deployment"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Essential Data */}
        <div className="lg:col-span-2 space-y-10">
          <section className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-8">
            <div className="flex items-center space-x-3 border-b border-white/5 pb-6">
              <Layout className="text-primary" size={20} />
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Core identity Protocol</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Product Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Quantum Pro X1"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-medium"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Slug (Node Matrix ID)</label>
                    <div className="flex items-center space-x-2">
                        {slugStatus === "checking" && <Loader2 size={12} className="animate-spin text-primary" />}
                        {slugStatus === "available" && <CheckCircle2 size={12} className="text-green-500" />}
                        {slugStatus === "taken" && <AlertCircle size={12} className="text-destructive" />}
                        <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest",
                            slugStatus === "available" ? "text-green-500" : 
                            slugStatus === "taken" ? "text-destructive" : "text-muted-foreground"
                        )}>
                            {slugStatus === "idle" && "Verification Pending"}
                            {slugStatus === "checking" && "Scanning Network..."}
                            {slugStatus === "available" && "ID Verified"}
                            {slugStatus === "taken" && "Collision Detected"}
                        </span>
                    </div>
                </div>
                <input 
                  required
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className={cn(
                      "w-full bg-white/5 border rounded-2xl px-6 py-4 text-white focus:outline-none transition-all font-mono text-xs",
                      slugStatus === "available" ? "border-green-500/30" : 
                      slugStatus === "taken" ? "border-destructive/30" : "border-white/10 focus:border-primary"
                  )}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Description / Specifications Narrative</label>
              <textarea 
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed features, capabilities and system requirements..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-medium resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Base Valuation (Price)</label>
                <input 
                  required
                  type="number" 
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="₹"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-black"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Sale Price (Optional)</label>
                <input 
                  type="number" 
                  value={formData.salePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value }))}
                  placeholder="₹"
                  className="w-full bg-white/5 border border-blue-500/20 rounded-2xl px-6 py-4 text-blue-400 focus:outline-none focus:border-primary transition-all font-black"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Initial Stock Units</label>
                <input 
                  required
                  type="number" 
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-black"
                />
              </div>
            </div>
          </section>

          {/* Features & Specs */}
          <section className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-10">
            <div className="flex items-center space-x-3 border-b border-white/5 pb-6">
                <Zap className="text-primary" size={20} />
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Capabilities & Protocols</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Key Technical Highlights</h3>
                <button type="button" onClick={addFeature} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all">
                  <Plus size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {formData.features.map((feat, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <input 
                      type="text" 
                      value={feat}
                      onChange={(e) => handleFeatureChange(i, e.target.value)}
                      placeholder={`Feature ${i + 1}...`}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-primary transition-all text-sm"
                    />
                    <button type="button" onClick={() => removeFeature(i)} className="p-3 text-muted-foreground hover:text-destructive transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Extended Specifications Matrix</h3>
                <button type="button" onClick={addSpec} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all">
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                {formData.specifications.map((spec, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <input 
                      type="text" 
                      value={spec.key}
                      onChange={(e) => handleSpecChange(i, "key", e.target.value)}
                      placeholder="Property (e.g. RAM)"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-primary transition-all text-sm"
                    />
                     <input 
                      type="text" 
                      value={spec.value}
                      onChange={(e) => handleSpecChange(i, "value", e.target.value)}
                      placeholder="Value (e.g. 16GB)"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-primary transition-all text-sm"
                    />
                    <button type="button" onClick={() => removeSpec(i)} className="p-3 text-muted-foreground hover:text-destructive transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Meta & Media */}
        <div className="space-y-10">
          <section className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-8">
            <div className="flex items-center space-x-3 border-b border-white/5 pb-4">
                <Settings className="text-primary" size={18} />
                <h2 className="text-sm font-black text-white uppercase tracking-tighter">Segment & Node Settings</h2>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Classification Segment</label>
              <select 
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-black uppercase text-[10px] tracking-widest cursor-pointer"
              >
                <option value="">Select Protocol Segment</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Brand Entity</label>
              <input 
                type="text" 
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="e.g. MA Tech Solutions"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <span className="text-xs font-black text-white uppercase tracking-tighter">Active Status</span>
                    <p className="text-[10px] text-muted-foreground font-medium italic">Visible in marketplace</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    formData.isActive ? "bg-primary glow-blue" : "bg-white/10"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-lg",
                    formData.isActive ? "right-1" : "left-1"
                  )} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <span className="text-xs font-black text-white uppercase tracking-tighter">Featured Priority</span>
                    <p className="text-[10px] text-muted-foreground font-medium italic">Frontpage exposure</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    formData.isFeatured ? "bg-yellow-500 glow-yellow" : "bg-white/10"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-lg",
                    formData.isFeatured ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
            </div>
          </section>

          <section className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center space-x-3">
                    <LucideImage className="text-primary" size={18} />
                    <h2 className="text-sm font-black text-white uppercase tracking-tighter">Media Assets</h2>
                </div>
                <div className="flex items-center bg-white/5 rounded-lg p-1">
                    <button 
                        type="button"
                        onClick={() => setUploadMode("url")}
                        className={cn("p-1.5 rounded-md transition-all", uploadMode === "url" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white")}
                    >
                        <LinkIcon size={14} />
                    </button>
                    <button 
                        type="button"
                        onClick={() => setUploadMode("upload")}
                        className={cn("p-1.5 rounded-md transition-all", uploadMode === "upload" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white")}
                    >
                        <UploadCloud size={14} />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
              {uploadMode === "upload" && (
                  <div className="relative group">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-white/10 rounded-[1.5rem] p-8 flex flex-col items-center justify-center space-y-3 group-hover:border-primary/50 transition-all bg-white/[0.02]">
                        {isUploading ? (
                            <Loader2 size={24} className="animate-spin text-primary" />
                        ) : (
                            <UploadCloud size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-white transition-colors text-center leading-relaxed">
                            {isUploading ? "Uploading to Matrix..." : "Drop file or Click to Upload"}
                        </p>
                    </div>
                  </div>
              )}

              {formData.images.map((img, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <input 
                      type="text" 
                      value={img}
                      onChange={(e) => handleImageChange(i, e.target.value)}
                      placeholder="https://image-url or local path"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all text-[10px] font-mono"
                    />
                    <button type="button" onClick={() => removeImage(i)} className="text-muted-foreground hover:text-destructive">
                      <X size={16} />
                    </button>
                  </div>
                  {img && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
              
              {uploadMode === "url" && (
                <button type="button" onClick={addImage} className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center space-x-2">
                    <Plus size={14} />
                    <span>Append Image URL</span>
                </button>
              )}
            </div>
          </section>

          <section className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-4 bg-primary/5">
             <div className="flex items-center space-x-3">
                <Globe className="text-primary" size={18} />
                <h2 className="text-sm font-black text-white uppercase tracking-tighter italic font-outfit">External Channels</h2>
             </div>
             <p className="text-[10px] text-muted-foreground leading-relaxed">External platforms synchronization (Amazon/Flipkart) will be available in V1.2 update.</p>
          </section>
        </div>
      </form>
    </div>
  );
}
