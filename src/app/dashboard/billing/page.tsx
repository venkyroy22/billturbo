"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  ShoppingCart, 
  IndianRupee,
  Loader2,
  CheckCircle2,
  ReceiptText,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
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
  subtotal: number;
  gstAmount: number;
}

export default function BillingPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, subtotal: product.price, gstAmount: (product.price * product.gstPercent) / 100 }];
    });
    toast.success(`${product.name} added to cart`, { duration: 1000 });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.error("Removed from cart");
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let gstTotal = 0;
    
    cart.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      const itemGst = (itemSubtotal * item.gstPercent) / 100;
      subtotal += itemSubtotal;
      gstTotal += itemGst;
    });

    return { subtotal, gstTotal, total: subtotal + gstTotal };
  };

  const { subtotal, gstTotal, total } = calculateTotals();

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const billData = {
        totalAmount: total,
        subtotal,
        gstTotal,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          gstPercent: item.gstPercent,
          subtotal: item.price * item.quantity
        }))
      };

      const res = await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billData),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Bill generated successfully!");
        router.push(`/invoice/${data.id}`);
      } else {
        toast.error("Failed to generate bill");
      }
    } catch (error) {
      toast.error("An error occurred during checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)]">
      {/* Product Selection */}
      <div className="lg:col-span-7 flex flex-col space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-6">
          <h1 className="text-3xl font-black font-display flex items-center gap-4 uppercase tracking-[0.2em]">
             <Zap className="text-white fill-white" /> QUICK BILLING
          </h1>
        </div>

        <div className="relative group overflow-hidden">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={20} />
          <Input 
            placeholder="SEARCH INVENTORY..." 
            className="pl-16 h-16 bg-[#121212] border-none ring-1 ring-white/10 rounded-none uppercase tracking-[0.2em] font-bold text-sm focus:ring-white placeholder:text-white/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {loading ? (
             <div className="flex justify-center p-12">
               <Loader2 className="animate-spin text-white" size={40} />
             </div>
          ) : filteredProducts.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-16 border border-dashed border-white/10 bg-[#121212]">
                <CheckCircle2 size={48} className="mb-4 text-white/30" />
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/50">NO PRODUCTS FOUND</p>
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="cursor-pointer bg-[#151515] hover:bg-white hover:text-black transition-colors border border-white/5 flex flex-col justify-between p-6 group h-full"
                  onClick={() => addToCart(product)}
                >
                  <div className="space-y-2 mb-8">
                    <div className="text-[10px] text-white/50 group-hover:text-black/50 font-bold uppercase tracking-[0.2em]">{product.gstPercent}% GST</div>
                    <div className="text-sm font-bold uppercase tracking-widest line-clamp-1">{product.name}</div>
                  </div>
                  <div>
                    <div className="font-black text-2xl tracking-tighter">{formatCurrency(product.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="lg:col-span-5 h-[calc(100vh-140px)] sticky top-24">
        <div className="h-full flex flex-col border border-white/5 bg-[#151515] overflow-hidden">
          <div className="bg-[#121212] border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ShoppingCart className="text-white" />
                <h3 className="text-lg font-bold uppercase tracking-[0.2em]">INVOICE SUMMARY</h3>
              </div>
              <span className="bg-white text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                {cart.length} ITEMS
              </span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <input 
                     type="text" 
                     placeholder="CUSTOMER NAME" 
                     className="w-full bg-transparent border-0 border-b border-white/10 pb-4 text-xs font-bold focus:ring-0 focus:border-white transition-colors placeholder:text-white/30 uppercase tracking-[0.2em]" 
                     value={customerInfo.name}
                     onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  />
                  <input 
                     type="text" 
                     placeholder="MOBILE NO." 
                     className="w-full bg-transparent border-0 border-b border-white/10 pb-4 text-xs font-bold focus:ring-0 focus:border-white transition-colors placeholder:text-white/30 uppercase tracking-[0.2em]" 
                     value={customerInfo.phone}
                     onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  />
               </div>
            </div>

            <div className="space-y-2 pt-4">
              <AnimatePresence mode="popLayout">
                {cart.length === 0 ? (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="text-center py-16 text-[10px] uppercase font-bold tracking-[0.2em] text-white/30"
                   >
                     SELECT ITEMS TO BEGIN
                   </motion.div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between p-4 bg-[#121212] border border-transparent hover:border-white/10 transition-colors"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="font-bold text-xs uppercase tracking-[0.2em] truncate mb-1">{item.name}</p>
                        <p className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase">{formatCurrency(item.price)} EA</p>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center border border-white/10">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-3 hover:bg-white hover:text-black transition-colors"><Minus size={12} /></button>
                          <span className="w-10 text-center text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-3 hover:bg-white hover:text-black transition-colors"><Plus size={12} /></button>
                        </div>
                        <div className="w-24 text-right">
                          <p className="font-black text-sm tracking-tight">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-3 text-white/50 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex-col bg-[#121212] p-8 border-t border-white/5 space-y-8">
            <div className="w-full space-y-4 font-bold text-xs uppercase tracking-[0.2em]">
              <div className="flex justify-between text-white/50">
                <span>SUBTOTAL</span>
                <span className="text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>GST TOTAL</span>
                <span className="text-white">{formatCurrency(gstTotal)}</span>
              </div>
              <div className="flex justify-between items-end pt-6 border-t border-white/10">
                <span className="text-white/50 leading-none">TOTAL PAYABLE</span>
                <span className="text-3xl font-black text-white tracking-tighter leading-none">{formatCurrency(total)}</span>
              </div>
            </div>
            
            <button 
              className="w-full h-16 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={handleCheckout} 
              disabled={isSubmitting || cart.length === 0}
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-4" size={20} /> : <ReceiptText className="mr-4" size={20} />}
              GENERATE & PAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
