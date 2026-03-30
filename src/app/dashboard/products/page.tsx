"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Loader2, IndianRupee, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  gstPercent: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: "", price: 0, gstPercent: 0,
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) setProducts(await res.json());
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const method = currentProduct.id ? "PUT" : "POST";
    try {
      const res = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProduct),
      });
      if (res.ok) {
        toast.success(currentProduct.id ? "Product updated" : "Product added");
        setIsModalOpen(false);
        setCurrentProduct({ name: "", price: 0, gstPercent: 0 });
        fetchProducts();
      } else {
        toast.error("Failed to save product");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Deleted"); fetchProducts(); }
      else toast.error("Failed to delete");
    } catch {
      toast.error("An error occurred");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdd = () => {
    setCurrentProduct({ name: "", price: 0, gstPercent: 0 });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-float-up pb-12">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/[0.06]">
        <div>
          <span className="section-label mb-3 block">Inventory</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">Products</h1>
          <p className="text-white/25 text-[11px] font-bold tracking-[0.3em] uppercase mt-5">Manage your shop catalog</p>
        </div>
        <button
          onClick={openAdd}
          className="group flex items-center gap-3 px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:bg-white/90 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:shadow-[0_0_50px_rgba(255,255,255,0.15)] self-start md:self-auto"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          Add Product
        </button>
      </div>

      {/* ── Search ── */}
      <div className="relative group max-w-md">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/60 transition-colors" size={17} />
        <input
          placeholder="Search catalog…"
          className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-white/20 pl-14 pr-4 h-13 py-4 text-xs font-bold uppercase tracking-[0.25em] placeholder:text-white/15 placeholder:normal-case placeholder:tracking-normal transition-all duration-300 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {loading ? (
          <div className="col-span-full flex justify-center py-24">
            <Loader2 className="animate-spin text-white/20" size={48} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-24 border border-dashed border-white/[0.05]">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">No products found</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: idx * 0.04 } }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white/[0.02] border border-white/[0.06] hover:border-white/18 hover:bg-white/[0.04] p-6 flex flex-col justify-between h-44 relative overflow-hidden transition-all duration-300"
              >
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-[-4px] group-hover:translate-y-0 transition-all duration-300">
                  <button
                    onClick={() => { setCurrentProduct(product); setIsModalOpen(true); }}
                    className="w-8 h-8 bg-white/10 hover:bg-white hover:text-black text-white/60 flex items-center justify-center border border-white/10 transition-all duration-200"
                  >
                    <Pencil size={11} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="w-8 h-8 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center border border-red-500/20 transition-all duration-200"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>

                <div>
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.35em] mb-2">{product.gstPercent}% GST</p>
                  <h3 className="text-sm font-black uppercase tracking-tight line-clamp-2 leading-snug pr-16">{product.name}</h3>
                </div>

                <div className="pt-4 border-t border-white/[0.05]">
                  <div className="flex items-center gap-1 text-white font-black text-2xl tracking-tighter group-hover:scale-105 transition-transform origin-left duration-300">
                    <IndianRupee size={18} className="text-white/40" />
                    {product.price.toLocaleString("en-IN")}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              className="w-full max-w-lg bg-[#0c0c0c] border border-white/10 overflow-hidden shadow-2xl"
            >
              {/* Modal header */}
              <div className="px-8 py-7 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <p className="section-label mb-2">Product</p>
                  <h2 className="text-3xl font-black uppercase tracking-tighter">
                    {currentProduct.id ? "Edit Product" : "New Product"}
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 flex items-center justify-center border border-white/[0.08] text-white/30 hover:text-white hover:border-white/30 transition-all duration-200"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-7">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Product Name</label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    required
                    className="w-full bg-transparent border-b border-white/10 focus:border-white/50 py-3.5 text-sm font-bold uppercase tracking-widest placeholder:text-white/10 placeholder:normal-case placeholder:tracking-normal outline-none transition-colors caret-white"
                    value={currentProduct.name}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Price (₹)", key: "price", placeholder: "0.00", step: "0.01" },
                    { label: "GST %", key: "gstPercent", placeholder: "0", step: "1" },
                  ].map((f) => (
                    <div key={f.key} className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">{f.label}</label>
                      <input
                        type="number"
                        step={f.step}
                        placeholder={f.placeholder}
                        required
                        className="w-full bg-transparent border-b border-white/10 focus:border-white/50 py-3.5 text-sm font-bold uppercase tracking-widest placeholder:text-white/10 outline-none transition-colors caret-white"
                        value={isNaN((currentProduct as any)[f.key]) ? "" : (currentProduct as any)[f.key]}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                          setCurrentProduct({ ...currentProduct, [f.key]: val });
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-13 py-4 border border-white/[0.08] text-white/40 hover:text-white hover:border-white/25 text-xs font-black uppercase tracking-[0.3em] transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-13 py-4 bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:bg-white/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      currentProduct.id ? "Update" : "Save Product"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
