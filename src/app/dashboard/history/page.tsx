"use client";

import { useState, useEffect } from "react";
import { 
  History, 
  Search, 
  Calendar, 
  ChevronRight, 
  IndianRupee, 
  Loader2,
  ReceiptText,
  Clock,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Bill {
  id: string;
  billNumber: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  items: BillItem[];
}

export default function HistoryPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBill, setSelectedBill] = useState<string | null>(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await fetch("/api/bills");
      if (res.ok) {
        const data = await res.json();
        setBills(data);
      }
    } catch (error) {
      toast.error("Failed to load bill history");
    } finally {
      setLoading(false);
    }
  };

  const filteredBills = bills.filter((b) =>
    (b.customerName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (b.customerPhone || "").includes(searchTerm) ||
    b.billNumber.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/30 mb-2 block">.03</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight uppercase flex items-center gap-4">
             <History className="text-white" size={48} /> HISTORY
          </h1>
          <p className="text-white/50 text-sm tracking-wider uppercase mt-4">Review and track all your generated invoices</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative group flex-1 max-w-md overflow-hidden">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={20} />
          <Input
            placeholder="SEARCH BY BILL NO., NAME OR PHONE..."
            className="pl-16 h-16 bg-[#121212] border-none ring-1 ring-white/10 rounded-none uppercase tracking-[0.2em] font-bold text-sm focus:ring-white placeholder:text-white/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
           <button className="h-16 px-8 flex items-center justify-center border border-white/10 bg-[#121212] text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-colors">
              <Calendar size={16} className="mr-3" /> ALL TIME
           </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-white" size={60} />
          </div>
        ) : filteredBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-24 border border-dashed border-white/10 bg-[#121212]">
            <ReceiptText size={64} className="mb-8 text-white/30" />
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/50">NO BILLS FOUND</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredBills.map((bill) => (
              <motion.div
                key={bill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <div 
                  className={`border border-white/5 transition-all overflow-hidden bg-[#151515] ${selectedBill === bill.id ? 'border-l-4 border-l-white ring-1 ring-white/10' : 'hover:border-white/20'}`}
                >
                  <div 
                    className="p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-white/5 transition-colors"
                    onClick={() => setSelectedBill(selectedBill === bill.id ? null : bill.id)}
                  >
                    <div className="flex items-center gap-8">
                      <div className="bg-[#121212] p-4 text-white font-bold text-center w-20 flex flex-col justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                        <span className="text-[10px] uppercase opacity-50 tracking-[0.2em] mb-1">BILL</span>
                        <span className="text-xl tracking-tighter">#{bill.billNumber}</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-xl uppercase tracking-widest">{bill.customerName || "WALK-IN"}</h4>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/50 font-bold uppercase tracking-[0.2em]">
                          <span className="flex items-center gap-2"><Clock size={12} className="opacity-50" /> {formatDate(bill.createdAt)}</span>
                          {bill.customerPhone && <span className="flex items-center gap-2"><Calendar size={12} className="opacity-50" /> {bill.customerPhone}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-12 w-full md:w-auto border-t border-white/10 md:border-none pt-6 md:pt-0">
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-white/50 tracking-[0.2em] mb-1">TOTAL</p>
                        <p className="text-3xl font-black text-white tracking-tighter">{formatCurrency(bill.totalAmount)}</p>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/10 group-hover:bg-white text-white group-hover:text-black transition-colors flex items-center justify-center">
                        <ChevronDown className={`transition-transform duration-300 ${selectedBill === bill.id ? 'rotate-180' : ''}`} size={16} />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedBill === bill.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-dashed border-white/10"
                      >
                        <div className="p-8 bg-[#121212] space-y-8">
                          <div>
                            <p className="text-[10px] font-bold uppercase text-white/30 tracking-[0.2em] mb-6 block">ITEM DETAILS</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {bill.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-4 bg-[#151515] border border-white/5 hover:border-white/20 transition-colors">
                                  <div>
                                    <p className="font-bold text-sm uppercase tracking-widest mb-1">{item.name}</p>
                                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em]">{item.quantity} X {formatCurrency(item.price)}</p>
                                  </div>
                                  <div className="font-black text-white tracking-tighter text-lg">{formatCurrency(item.subtotal)}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-dashed border-white/10">
                             <div className="flex gap-4 w-full md:w-auto">
                               <Link 
                                 href={`/invoice/${bill.id}`} 
                                 className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/90 transition-colors"
                               >
                                 <ExternalLink size={14} /> VIEW INVOICE +
                               </Link>
                             </div>
                             <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">ID: {bill.id}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )
        }
      </div>
    </div>
  );
}
