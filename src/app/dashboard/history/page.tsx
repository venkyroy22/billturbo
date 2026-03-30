"use client";

import { useState, useEffect } from "react";
import {
  History,
  Search,
  Calendar,
  Loader2,
  ReceiptText,
  Clock,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Circle,
} from "lucide-react";
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
  isPaid: boolean;
  paidAt?: string | null;
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

  useEffect(() => { fetchBills(); }, []);

  const fetchBills = async () => {
    try {
      const res = await fetch("/api/bills");
      if (res.ok) setBills(await res.json());
    } catch {
      toast.error("Failed to load bill history");
    } finally {
      setLoading(false);
    }
  };

  const filtered = bills.filter(
    (b) =>
      (b.customerName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (b.customerPhone || "").includes(searchTerm) ||
      b.billNumber.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-float-up pb-16">

      {/* ── Header ── */}
      <div className="pb-10 border-b border-white/[0.06]">
        <span className="section-label mb-3 block">Records</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none flex items-center gap-6">
          <History size={48} className="text-white/60" /> History
        </h1>
        <p className="text-white/25 text-[11px] font-bold tracking-[0.3em] uppercase mt-5">
          All generated invoices and transactions
        </p>
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative group flex-1 max-w-lg">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/60 transition-colors" size={17} />
          <input
            placeholder="Search bill #, name, phone…"
            className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-white/20 pl-14 pr-4 h-13 py-4 text-xs font-bold uppercase tracking-[0.25em] placeholder:text-white/15 placeholder:normal-case placeholder:tracking-normal transition-all duration-300 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="h-13 py-4 px-7 flex items-center justify-center border border-white/[0.06] bg-white/[0.02] hover:bg-white hover:text-black text-xs font-bold uppercase tracking-[0.25em] text-white/50 transition-all duration-300 gap-3">
          <Calendar size={15} /> All Time
        </button>
      </div>

      {/* ── Bill List ── */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-white/30" size={48} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-24 border border-dashed border-white/[0.06] bg-white/[0.01]">
            <ReceiptText size={48} className="mb-6 text-white/15" />
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">No bills found</p>
          </div>
        ) : (
          filtered.map((bill, idx) => (
            <motion.div
              key={bill.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <div
                className={`border transition-all duration-300 overflow-hidden bg-[#0d0d0d] ${
                  selectedBill === bill.id
                    ? "border-white/25"
                    : "border-white/[0.06] hover:border-white/15"
                }`}
              >
                {/* Row */}
                <div
                  className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors"
                  onClick={() => setSelectedBill(selectedBill === bill.id ? null : bill.id)}
                >
                  <div className="flex items-center gap-6">
                    {/* Bill # box */}
                    <div className="bg-white/[0.04] border border-white/[0.06] px-3 py-3 text-center min-w-[60px] shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                      <p className="text-[8px] uppercase font-bold text-white/30 tracking-[0.3em] mb-1">Bill</p>
                      <p className="text-base font-black tracking-tighter">#{bill.billNumber}</p>
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-[0.1em]">{bill.customerName || "Walk-in"}</h4>
                      <div className="flex flex-wrap items-center gap-4 mt-1.5 text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1.5">
                          <Clock size={10} />
                          {formatDate(bill.createdAt)}
                        </span>
                        {bill.customerPhone && (
                          <span>{bill.customerPhone}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 ml-auto">
                    {/* Payment status badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 border text-[9px] font-black uppercase tracking-[0.25em] ${
                      bill.isPaid
                        ? "border-emerald-500/25 bg-emerald-500/8 text-emerald-400"
                        : "border-amber-500/20 bg-amber-500/5 text-amber-400/70"
                    }`}>
                      {bill.isPaid
                        ? <><CheckCircle2 size={10} /> Paid</>
                        : <><Circle size={10} /> Pending</>
                      }
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/25 font-bold uppercase tracking-[0.2em] mb-1">Total</p>
                      <p className={`text-2xl font-black tracking-tighter tabular-nums ${bill.isPaid ? "text-emerald-400" : ""}`}>
                        {formatCurrency(bill.totalAmount)}
                      </p>
                    </div>
                    <div className={`w-8 h-8 border border-white/[0.08] flex items-center justify-center transition-transform duration-300 ${selectedBill === bill.id ? "rotate-180" : ""}`}>
                      <ChevronDown size={14} className="text-white/40" />
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {selectedBill === bill.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-dashed border-white/[0.06]"
                    >
                      <div className="p-6 bg-black/20 space-y-6">
                        <p className="section-label mb-4">Item Details</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {bill.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/[0.05] hover:border-white/15 transition-colors"
                            >
                              <div>
                                <p className="font-black text-xs uppercase tracking-[0.1em] mb-1">{item.name}</p>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
                                  {item.quantity} × {formatCurrency(item.price)}
                                </p>
                              </div>
                              <p className="font-black text-sm tracking-tighter tabular-nums">{formatCurrency(item.subtotal)}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-5 pt-5 border-t border-dashed border-white/[0.06]">
                          <Link
                            href={`/invoice/${bill.id}`}
                            className="flex items-center gap-3 px-7 py-3.5 bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white/90 transition-colors"
                          >
                            <ExternalLink size={13} /> View Invoice
                          </Link>
                          <p className="text-[10px] font-mono text-white/15 tracking-wider">{bill.id}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
