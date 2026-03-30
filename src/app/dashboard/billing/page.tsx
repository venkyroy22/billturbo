"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Trash2,
  Search,
  ShoppingCart,
  Loader2,
  ReceiptText,
  Zap,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  gstPercent: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function BillingPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "" });

  useEffect(() => { fetchProducts(); }, []);

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

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added`, { duration: 900 });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
          .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const totals = cart.reduce(
    (acc, item) => {
      const sub = item.price * item.quantity;
      const gst = (sub * item.gstPercent) / 100;
      return { subtotal: acc.subtotal + sub, gstTotal: acc.gstTotal + gst };
    },
    { subtotal: 0, gstTotal: 0 }
  );
  const total = totals.subtotal + totals.gstTotal;

  const handleCheckout = async () => {
    if (cart.length === 0) { toast.error("Cart is empty"); return; }
    setIsSubmitting(true);
    try {
      const billData = {
        totalAmount: total,
        subtotal: totals.subtotal,
        gstTotal: totals.gstTotal,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        items: cart.map((i) => ({
          productId: i.id, name: i.name, price: i.price,
          quantity: i.quantity, gstPercent: i.gstPercent, subtotal: i.price * i.quantity,
        })),
      };
      const res = await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billData),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success("Bill generated!");
        router.push(`/invoice/${data.id}`);
      } else {
        toast.error("Failed to generate bill");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-8rem)] animate-float-up">

      {/* ── Product Panel ── */}
      <div className="lg:col-span-7 flex flex-col space-y-6">

        {/* Header */}
        <div className="pb-8 border-b border-white/[0.06]">
          <span className="section-label mb-3 block">Inventory</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none flex items-center gap-5">
            <Zap size={40} className="text-white/80 fill-white/80" /> Quick Billing
          </h1>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/60 transition-colors" size={18} />
          <input
            placeholder="Search products…"
            className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-white/20 pl-14 pr-4 h-14 text-xs font-bold uppercase tracking-[0.3em] placeholder:text-white/15 placeholder:normal-case placeholder:tracking-normal transition-all duration-300 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto scrollbar-thin pr-1">
          {loading ? (
            <div className="flex justify-center p-24">
              <Loader2 className="animate-spin text-white/20" size={48} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-24 border border-dashed border-white/[0.06]">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <AnimatePresence>
                {filtered.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="cursor-pointer group bg-white/[0.02] border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.05] p-6 flex flex-col justify-between h-36 relative overflow-hidden transition-all duration-300"
                    onClick={() => addToCart(product)}
                  >
                    {/* Cart badge */}
                    {cart.find((i) => i.id === product.id) && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-white text-black text-[9px] font-black flex items-center justify-center">
                        {cart.find((i) => i.id === product.id)!.quantity}
                      </div>
                    )}
                    <div>
                      <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.3em] mb-1.5">{product.gstPercent}% GST</p>
                      <p className="text-xs font-black uppercase tracking-tight line-clamp-2 leading-snug">{product.name}</p>
                    </div>
                    <p className="text-xl font-black tracking-tighter group-hover:scale-105 transition-transform origin-left duration-300">
                      {formatCurrency(product.price)}
                    </p>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-300 pointer-events-none" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ── Cart / Checkout Panel ── */}
      <div className="lg:col-span-5 lg:sticky lg:top-0 lg:h-[calc(100vh-8rem)]">
        <div className="h-full flex flex-col bg-[#0c0c0c] border border-white/[0.06] overflow-hidden">

          {/* Cart header */}
          <div className="px-7 py-5 border-b border-white/[0.06] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <ShoppingCart size={18} className="text-white/40" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Invoice Summary</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-white text-black px-4 py-1.5">
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-7 space-y-8">

            {/* Customer info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <p className="section-label">Customer</p>
                <div className="flex-1 h-px bg-white/[0.04]" />
              </div>
              <input
                type="text"
                placeholder="Customer name (optional)"
                className="w-full bg-transparent border-b border-white/[0.06] focus:border-white/40 pb-3 text-xs font-bold uppercase tracking-[0.2em] placeholder:text-white/10 placeholder:normal-case placeholder:tracking-normal outline-none transition-colors"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone number (optional)"
                className="w-full bg-transparent border-b border-white/[0.06] focus:border-white/40 pb-3 text-xs font-bold uppercase tracking-[0.2em] placeholder:text-white/10 placeholder:normal-case placeholder:tracking-normal outline-none transition-colors"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              />
            </div>

            {/* Cart items */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <p className="section-label">Items</p>
                <div className="flex-1 h-px bg-white/[0.04]" />
              </div>

              <AnimatePresence mode="popLayout">
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 text-[10px] uppercase font-black tracking-[0.4em] text-white/[0.08] border border-dashed border-white/[0.05]"
                  >
                    Select items to start
                  </motion.div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="group flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] hover:border-white/15 transition-all duration-300"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.1em] truncate">{item.name}</p>
                        <p className="text-[10px] text-white/25 font-bold mt-0.5">{formatCurrency(item.price)} each</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-white/[0.08]">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-200 text-white/40"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-9 text-center text-xs font-black tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-200 text-white/40"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <span className="text-sm font-black tracking-tighter w-20 text-right tabular-nums">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 flex items-center justify-center text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Totals + Checkout */}
          <div className="shrink-0 border-t border-white/[0.06] bg-[#0a0a0a] p-7 space-y-5">
            <div className="space-y-2.5 text-[11px] font-bold uppercase tracking-[0.3em]">
              <div className="flex justify-between text-white/30">
                <span>Subtotal</span>
                <span className="text-white font-black tabular-nums">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/30">
                <span>GST</span>
                <span className="text-white font-black tabular-nums">{formatCurrency(totals.gstTotal)}</span>
              </div>
              <div className="h-px bg-white/[0.06] my-3" />
              <div className="flex justify-between items-end">
                <span className="text-white/20 text-[10px]">Total</span>
                <span className="text-3xl font-black tracking-tighter text-white tabular-nums">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting || cart.length === 0}
              className="w-full h-14 bg-white text-black text-xs font-black uppercase tracking-[0.4em] hover:bg-white/90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.08)] hover:shadow-[0_0_60px_rgba(255,255,255,0.16)]"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <ReceiptText size={18} />
                  Generate Invoice
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
