"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Loader2, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    name: "",
    price: 0,
    gstPercent: 0,
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const method = currentProduct.id ? "PUT" : "POST";
    const endpoint = "/api/products";

    try {
      const res = await fetch(endpoint, {
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
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/30 mb-2 block">.01</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight uppercase">Products</h1>
          <p className="text-white/50 text-sm tracking-wider uppercase mt-4">Manage your shop inventory</p>
        </div>
        <button 
          className="bg-white text-black text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 hover:bg-white/90 transition-colors flex items-center"
          onClick={() => {
            setCurrentProduct({ name: "", price: 0, gstPercent: 0 });
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} className="mr-3" /> ADD PRODUCT
        </button>
      </div>

      <div className="relative group max-w-md overflow-hidden">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={20} />
        <Input
          placeholder="SEARCH PRODUCTS..."
          className="pl-16 h-16 bg-[#121212] border-none ring-1 ring-white/10 rounded-none uppercase tracking-[0.2em] font-bold text-sm focus:ring-white placeholder:text-white/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex justify-center py-16">
            <Loader2 className="animate-spin text-white" size={40} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-16 border border-dashed border-white/10 bg-[#121212]">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/50">NO PRODUCTS FOUND</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className="bg-[#151515] hover:bg-white hover:text-black transition-colors border border-white/5 flex flex-col justify-between p-8 group relative"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button 
                    onClick={() => handleEdit(product)}
                    className="p-3 bg-[#121212] text-white hover:bg-black transition-colors border border-white/10"
                  >
                    <Pencil size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <div className="space-y-4 mb-16">
                  <div className="text-[10px] text-white/50 group-hover:text-black/50 font-bold uppercase tracking-[0.2em]">GST: {product.gstPercent}%</div>
                  <h3 className="text-xl font-bold uppercase tracking-widest line-clamp-1">{product.name}</h3>
                </div>
                
                <div>
                  <div className="font-black text-4xl tracking-tighter flex items-center">
                    <IndianRupee size={28} className="mr-2 opacity-50" />
                    {product.price}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#151515] border border-white/10 shadow-[20px_20px_60px_#101010,-20px_-20px_60px_#202020]"
          >
            <div className="p-8 border-b border-white/10">
               <h2 className="text-xl font-black uppercase tracking-[0.2em]">{currentProduct.id ? "EDIT PRODUCT" : "NEW PRODUCT"}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">PRODUCT NAME</label>
                <input
                  type="text"
                  placeholder="E.G. BIRYANI"
                  required
                  className="w-full bg-transparent border-0 border-b border-white/10 pb-4 text-sm font-bold focus:ring-0 focus:border-white transition-colors placeholder:text-white/30 uppercase tracking-[0.2em]"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">PRICE (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                    className="w-full bg-transparent border-0 border-b border-white/10 pb-4 text-sm font-bold focus:ring-0 focus:border-white transition-colors placeholder:text-white/30 uppercase tracking-[0.2em]"
                    value={isNaN(currentProduct.price as number) ? "" : currentProduct.price}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                      setCurrentProduct({ ...currentProduct, price: val });
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">GST %</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full bg-transparent border-0 border-b border-white/10 pb-4 text-sm font-bold focus:ring-0 focus:border-white transition-colors placeholder:text-white/30 uppercase tracking-[0.2em]"
                    value={isNaN(currentProduct.gstPercent as number) ? "" : currentProduct.gstPercent}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                      setCurrentProduct({ ...currentProduct, gstPercent: val });
                    }}
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-8 border-t border-white/10">
                <button 
                  type="button" 
                  className="flex-1 border border-white/10 text-white text-xs font-bold uppercase tracking-[0.2em] py-4 hover:bg-white/5 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] py-4 hover:bg-white/90 transition-colors flex items-center justify-center disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="animate-spin mr-2" size={16} /> : (currentProduct.id ? "UPDATE" : "SAVE")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
