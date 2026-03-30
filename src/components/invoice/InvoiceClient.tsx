"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  CheckCircle2,
  ReceiptText,
  Download,
  Share2,
  QrCode,
  Copy,
  Check,
  Printer,
  Smartphone,
  IndianRupee,
  RefreshCw,
  Clock,
  AlertCircle,
  Store,
  ArrowLeft,
} from "lucide-react";
import QRCode from "qrcode";
import Image from "next/image";
import { translations, Locale } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface InvoiceClientProps {
  bill: any;
  isMerchant: boolean;
}

/* ─── UPI helpers ─── */
function buildUpiLink(upiId: string, shopName: string, amount: number, billNumber: number) {
  const pa = encodeURIComponent(upiId);
  const pn = encodeURIComponent(shopName || "Merchant");
  const am = amount.toFixed(2);
  const tn = encodeURIComponent(`Bill #${billNumber} - ${shopName}`);
  return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`;
}

/* ─── Merchant View: shows the invoice-URL QR for customer to scan ─── */
function MerchantView({ bill, billUrl, upiQrUrl, isPaid, paidAt, onRefresh, refreshing }: {
  bill: any;
  billUrl: string;
  upiQrUrl: string;
  isPaid: boolean;
  paidAt: string | null;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const [invoiceQrUrl, setInvoiceQrUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>("en");
  const t = translations[currentLocale];

  useEffect(() => {
    if (!billUrl) return;
    QRCode.toDataURL(billUrl, {
      scale: 14,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#000000", light: "#FFFFFF" },
    }).then(setInvoiceQrUrl);
  }, [billUrl]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(billUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black">

      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-white/30 hover:text-white transition-colors">
            <ArrowLeft size={15} /> <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25">
            Bill #{bill.billNumber}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {(["en", "hi", "te"] as Locale[]).map((loc) => (
            <button key={loc} onClick={() => setCurrentLocale(loc)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-200 ${currentLocale === loc ? "bg-white text-black" : "text-white/30 hover:text-white"}`}
            >{loc.toUpperCase()}</button>
          ))}
          <button onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all duration-200"
          ><Printer size={12} /> Print</button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-24 space-y-6">

        {/* ── Payment Status Banner ── */}
        <AnimatePresence mode="wait">
          {isPaid ? (
            <motion.div key="paid"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between px-6 py-4 bg-emerald-500/10 border border-emerald-500/25"
            >
              <div className="flex items-center gap-4">
                <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.1em] text-emerald-400">Payment Received</p>
                  {paidAt && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/60 mt-0.5">
                      {new Date(paidAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-2xl font-black tracking-tighter text-emerald-400">
                {formatCurrency(bill.totalAmount)}
              </span>
            </motion.div>
          ) : (
            <motion.div key="pending"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between px-6 py-4 bg-amber-500/8 border border-amber-500/20"
            >
              <div className="flex items-center gap-4">
                <Clock size={20} className="text-amber-400/70 shrink-0" />
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.1em] text-amber-400/80">Awaiting Payment</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/40 mt-0.5">
                    Show the QR below to your customer
                  </p>
                </div>
              </div>
              <button
                onClick={onRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 border border-white/[0.08] text-white/30 hover:text-white hover:border-white/25 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-200 disabled:opacity-40"
              >
                <RefreshCw size={11} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Checking…" : "Check Status"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── QR Panel: the invoice URL for customer to scan ── */}
        {!isPaid && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="border border-white/[0.08] bg-[#0d0d0d] overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <QrCode size={18} className="text-white/40" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em]">Show to Customer</h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">
                Invoice #{bill.billNumber}
              </span>
            </div>

            <div className="p-8 flex flex-col sm:flex-row items-center gap-10">
              {/* QR code box */}
              <div className="shrink-0 flex flex-col items-center gap-5">
                {invoiceQrUrl ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/8 blur-2xl scale-75 pointer-events-none" />
                    <div className="relative bg-white p-4 shadow-[0_0_60px_rgba(255,255,255,0.12)]">
                      <Image
                        src={invoiceQrUrl}
                        alt="Invoice QR — scan to view & pay"
                        width={200}
                        height={200}
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-[200px] h-[200px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center animate-pulse">
                    <QrCode size={40} className="text-white/10" />
                  </div>
                )}
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25 text-center">
                  Customer scans this → views invoice → pays
                </p>
              </div>

              {/* Instructions */}
              <div className="flex flex-col gap-5 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/20">How it works</p>
                {[
                  { n: "1", text: "Customer scans this QR with their phone camera" },
                  { n: "2", text: `Customer sees the invoice for ${formatCurrency(bill.totalAmount)}` },
                  { n: "3", text: "Customer taps Pay Now → picks their UPI app" },
                  { n: "4", text: "Payment lands in your UPI account instantly" },
                ].map((step) => (
                  <div key={step.n} className="flex items-start gap-4">
                    <div className="w-7 h-7 bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[10px] font-black text-white/30 shrink-0">
                      {step.n}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/40 leading-relaxed pt-1">{step.text}</p>
                  </div>
                ))}

                {/* Share link */}
                <div className="mt-4 flex gap-2">
                  <div className="flex-1 px-4 py-3 border border-white/[0.06] bg-white/[0.02] text-[10px] font-bold text-white/25 truncate">
                    {billUrl}
                  </div>
                  <button onClick={copyLink}
                    className="flex items-center gap-2 px-4 py-3 border border-white/[0.08] text-white/40 hover:text-white hover:border-white/25 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-200 whitespace-nowrap"
                  >
                    {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    {copied ? "Copied" : "Copy Link"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Invoice document ── */}
        <InvoiceDocument bill={bill} t={translations[currentLocale]} upiQrUrl={upiQrUrl} isMerchant />
      </div>
    </div>
  );
}

/* ─── Customer View: clean invoice + Pay button ─── */
function CustomerView({ bill, isPaid, onConfirmPaid, confirmingPaid }: {
  bill: any;
  isPaid: boolean;
  onConfirmPaid: () => void;
  confirmingPaid: boolean;
}) {
  const [currentLocale, setCurrentLocale] = useState<Locale>("en");
  const [payStep, setPayStep] = useState<"idle" | "choosing">("idle");
  const [copied, setCopied] = useState(false);
  const t = translations[currentLocale];

  const upiId = bill.owner.upiId || "";
  const shopName = bill.owner.shopName || "Merchant";
  const amount = bill.totalAmount;
  const hasUpi = Boolean(upiId);

  const upiLink = buildUpiLink(upiId, shopName, amount, bill.billNumber);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // App-specific deep links — pre-fill amount + merchant
  const PAY_APPS = [
    {
      id: "gpay", name: "Google Pay",
      link: `tez://upi/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(shopName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Bill #" + bill.billNumber)}`,
      bg: "bg-white", text: "text-gray-900",
      icon: (
        <svg viewBox="0 0 40 40" className="w-7 h-7">
          <circle cx="20" cy="20" r="20" fill="white"/>
          <path d="M28.8 20.5c0-.6-.1-1.2-.2-1.8H20v3.4h4.9c-.2 1.1-.9 2-1.8 2.6v2.2h2.9c1.7-1.6 2.8-3.8 2.8-6.4z" fill="#4285F4"/>
          <path d="M20 29c2.4 0 4.4-.8 5.9-2.1l-2.9-2.2c-.8.5-1.8.9-3 .9-2.3 0-4.2-1.5-4.9-3.6h-3v2.3C13.6 27.1 16.6 29 20 29z" fill="#34A853"/>
          <path d="M15.1 21.9c-.2-.5-.3-1.1-.3-1.7s.1-1.2.3-1.7v-2.3h-3a8.9 8.9 0 000 8l3-2.3z" fill="#FBBC05"/>
          <path d="M20 14.9c1.3 0 2.5.5 3.4 1.3l2.5-2.5C24.4 12.2 22.4 11.4 20 11.4c-3.4 0-6.4 1.9-7.9 4.8l3 2.3c.7-2.1 2.6-3.6 4.9-3.6z" fill="#EA4335"/>
        </svg>
      ),
    },
    {
      id: "phonepe", name: "PhonePe",
      link: `phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(shopName)}&am=${amount.toFixed(2)}&cu=INR`,
      bg: "bg-[#5f259f]", text: "text-white",
      icon: (
        <svg viewBox="0 0 40 40" className="w-7 h-7" fill="white">
          <circle cx="20" cy="20" r="20" fill="#5f259f"/>
          <path d="M20 10a10 10 0 100 20 10 10 0 000-20zm0 2.5a7.5 7.5 0 010 15v-5h-2.5v-2.5H20v-2.5a2.5 2.5 0 012.5-2.5h2.5v2.5H22.5A2.5 2.5 0 0120 20v-7.5z"/>
        </svg>
      ),
    },
    {
      id: "paytm", name: "Paytm",
      link: `paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(shopName)}&am=${amount.toFixed(2)}&cu=INR`,
      bg: "bg-[#002970]", text: "text-white",
      icon: (
        <svg viewBox="0 0 40 40" className="w-7 h-7" fill="white">
          <circle cx="20" cy="20" r="20" fill="#002970"/>
          <rect x="12" y="14" width="4" height="12" rx="1" fill="white"/>
          <rect x="18" y="14" width="4" height="12" rx="1" fill="white"/>
          <rect x="24" y="14" width="4" height="12" rx="1" fill="white"/>
        </svg>
      ),
    },
    {
      id: "bhim", name: "BHIM UPI",
      link: upiLink,
      bg: "bg-[#1a6c35]", text: "text-white",
      icon: (
        <svg viewBox="0 0 40 40" className="w-7 h-7" fill="white">
          <circle cx="20" cy="20" r="20" fill="#1a6c35"/>
          <path d="M14 20l6 6 6-6M14 14l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black">

      {/* Compact top bar */}
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6 h-13 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-7 h-7 shrink-0">
            <Image src="/logo.png" alt="BillTurbo" fill className="object-contain" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{shopName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(["en", "hi", "te"] as Locale[]).map((loc) => (
            <button key={loc} onClick={() => setCurrentLocale(loc)}
              className={`px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-200 ${currentLocale === loc ? "bg-white text-black" : "text-white/25 hover:text-white"}`}
            >{loc.toUpperCase()}</button>
          ))}
          <button onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/[0.07] text-white/25 hover:text-white text-[9px] font-black uppercase tracking-[0.2em] transition-colors"
          >
            {copied ? <Check size={10} className="text-emerald-400" /> : <Share2 size={10} />}
            {copied ? "Copied" : "Share"}
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8 pb-32 space-y-5">

        {/* Already paid banner */}
        <AnimatePresence>
          {isPaid && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-10 text-center space-y-4 border border-emerald-500/25 bg-emerald-500/8"
            >
              <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-emerald-400">Payment Done!</h2>
                <p className="text-[11px] text-emerald-400/60 font-bold uppercase tracking-[0.2em] mt-2">
                  Your payment of {formatCurrency(amount)} has been recorded
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invoice document */}
        <InvoiceDocument bill={bill} t={translations[currentLocale]} isMerchant={false} />

        {/* ── PAY NOW section ── */}
        {!isPaid && hasUpi && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border border-white/[0.08] bg-[#0d0d0d] overflow-hidden"
          >
            {/* Amount + CTA */}
            {payStep === "idle" && (
              <div className="p-8 flex flex-col items-center gap-6">
                <div className="text-center">
                  <p className="section-label mb-2">Amount Due</p>
                  <div className="text-5xl font-black tracking-tighter">{formatCurrency(amount)}</div>
                  <p className="text-[10px] text-white/25 font-bold uppercase tracking-[0.3em] mt-2">
                    To {shopName}
                  </p>
                </div>

                {/* Big Pay button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPayStep("choosing")}
                  className="w-full h-16 bg-white text-black text-sm font-black uppercase tracking-[0.4em] hover:bg-white/90 active:bg-white/80 transition-all duration-200 flex items-center justify-center gap-3 shadow-[0_0_50px_rgba(255,255,255,0.12)] hover:shadow-[0_0_70px_rgba(255,255,255,0.20)]"
                >
                  <IndianRupee size={18} />
                  Pay {formatCurrency(amount)}
                </motion.button>

                <p className="text-[9px] text-center text-white/20 font-bold uppercase tracking-[0.2em]">
                  {t.note}
                </p>
              </div>
            )}

            {/* App chooser */}
            <AnimatePresence>
              {payStep === "choosing" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="px-7 py-5 border-b border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em]">Choose Payment App</p>
                      <p className="text-[10px] text-white/25 font-bold uppercase tracking-[0.2em] mt-0.5">
                        Tap to open and pay {formatCurrency(amount)}
                      </p>
                    </div>
                    <button
                      onClick={() => setPayStep("idle")}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-white/25 hover:text-white transition-colors px-3 py-2 border border-white/[0.06] hover:border-white/20"
                    >
                      Back
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    {PAY_APPS.map((app, idx) => (
                      <motion.a
                        key={app.id}
                        href={app.link}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.07 } }}
                        onClick={() => {
                          // After payment initiation, show confirmation prompt
                          setTimeout(() => {
                            setPayStep("idle");
                          }, 1500);
                        }}
                        className="flex items-center justify-between px-5 py-4 border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 active:scale-[0.99] transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-full ${app.bg} flex items-center justify-center shrink-0 shadow-md`}>
                            {app.icon}
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.1em]">{app.name}</p>
                            <p className="text-[10px] text-white/30 font-bold mt-0.5">
                              Pay {formatCurrency(amount)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/25 group-hover:text-white/60 transition-colors">
                          Open →
                        </div>
                      </motion.a>
                    ))}

                    {/* Generic UPI (opens system chooser) */}
                    <a
                      href={upiLink}
                      className="flex items-center justify-center gap-3 py-4 border border-dashed border-white/[0.07] text-white/25 hover:text-white/50 hover:border-white/20 transition-all duration-200 text-[11px] font-black uppercase tracking-[0.25em] mt-1"
                    >
                      <Smartphone size={13} /> Other UPI App
                    </a>
                  </div>

                  {/* After paying → confirm */}
                  <div className="px-5 pb-5">
                    <div className="border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">
                        Completed the payment?
                      </p>
                      <button
                        onClick={onConfirmPaid}
                        disabled={confirmingPaid}
                        className="w-full py-4 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-200 disabled:opacity-40 flex items-center justify-center gap-2"
                      >
                        {confirmingPaid ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                        Yes, I've Paid
                      </button>
                      <p className="text-[9px] text-center text-white/15 font-bold uppercase tracking-[0.2em]">
                        This notifies the merchant instantly
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No UPI configured */}
        {!hasUpi && !isPaid && (
          <div className="border border-amber-500/20 bg-amber-500/5 px-6 py-5 flex items-center gap-4">
            <AlertCircle size={18} className="text-amber-400/70 shrink-0" />
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-400/70">
              Payment not available — merchant hasn't set up UPI.
            </p>
          </div>
        )}

        {/* Print button */}
        <button onClick={() => window.print()}
          className="w-full flex items-center justify-center gap-3 py-4 border border-white/[0.07] text-white/30 hover:text-white hover:border-white/20 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-200"
        >
          <Printer size={13} /> Save / Print Invoice
        </button>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── Shared: Invoice document (printed & displayed) ─── */
function InvoiceDocument({ bill, t, upiQrUrl, isMerchant }: {
  bill: any; t: any; upiQrUrl?: string; isMerchant: boolean;
}) {
  return (
    <div className="border border-white/[0.08] bg-[#0c0c0c] overflow-hidden" id="invoice-print-area">

      {/* Header */}
      <div className="px-7 py-6 border-b border-white/[0.06] flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-8 h-8 shrink-0">
              <Image src="/logo.png" alt="BillTurbo" fill className="object-contain" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">BillTurbo</span>
          </div>
          <h2 className="text-lg font-black uppercase tracking-tight">{bill.owner.shopName || "Shop"}</h2>
          {bill.owner.gstNumber && (
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 mt-1.5">
              GSTIN: {bill.owner.gstNumber}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/[0.08] bg-white/[0.02] mb-2">
            <ReceiptText size={12} className="text-white/30" />
            <span className="text-sm font-black uppercase tracking-[0.2em]">#{bill.billNumber}</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 mt-2">
            {formatDate(bill.createdAt)}
          </p>
        </div>
      </div>

      {/* Customer */}
      {(bill.customerName || bill.customerPhone) && (
        <div className="px-7 py-4 border-b border-white/[0.05] bg-white/[0.01]">
          <p className="section-label mb-2.5">Customer</p>
          {bill.customerName && <p className="text-sm font-black uppercase tracking-[0.1em]">{bill.customerName}</p>}
          {bill.customerPhone && <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mt-1">{bill.customerPhone}</p>}
        </div>
      )}

      {/* Items table */}
      <div className="px-7 py-5">
        <div className="border border-white/[0.06]">
          <div className="grid grid-cols-12 px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
            <span className="col-span-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/25">Item</span>
            <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/25 text-center">Qty</span>
            <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/25 text-right">Rate</span>
            <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/25 text-right">Total</span>
          </div>
          {bill.items.map((item: any, idx: number) => (
            <div key={item.id}
              className={`grid grid-cols-12 px-4 py-3.5 items-center ${idx !== bill.items.length - 1 ? "border-b border-white/[0.04]" : ""}`}
            >
              <div className="col-span-6">
                <p className="text-xs font-black uppercase tracking-[0.1em]">{item.name}</p>
                {item.gstPercent > 0 && (
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em] mt-0.5">GST {item.gstPercent}%</p>
                )}
              </div>
              <p className="col-span-2 text-xs font-black text-center tabular-nums">{item.quantity}</p>
              <p className="col-span-2 text-xs font-black text-right tabular-nums">{formatCurrency(item.price)}</p>
              <p className="col-span-2 text-xs font-black text-right tabular-nums">{formatCurrency(item.subtotal)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="px-7 pb-6">
        <div className="border border-white/[0.06] bg-white/[0.02] px-6 py-5 space-y-3">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
            <span>{t.subtotal}</span>
            <span className="text-white tabular-nums">{formatCurrency(bill.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
            <span>{t.gstTotal}</span>
            <span className="text-white tabular-nums">{formatCurrency(bill.gstTotal)}</span>
          </div>
          <div className="h-px bg-white/[0.07]" />
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-white/50">{t.totalAmount}</span>
            <span className="text-3xl font-black tracking-tighter tabular-nums">{formatCurrency(bill.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* QR for print (merchant copy) */}
      {isMerchant && upiQrUrl && (
        <div className="px-7 pb-6 flex items-center justify-between gap-6 border-t border-white/[0.05] pt-6">
          <div className="bg-white p-2.5 shrink-0">
            <Image src={upiQrUrl} alt="UPI QR" width={80} height={80} style={{ imageRendering: "pixelated" }} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Pay via UPI</p>
            <p className="text-[11px] font-bold text-white/20">{bill.owner.upiId}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black tracking-tighter">{formatCurrency(bill.totalAmount)}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-7 py-4 border-t border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/12">{t.generatedWith} BillTurbo</p>
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/12">billturbo.in</p>
      </div>
    </div>
  );
}

/* ─── Main export ─── */
export default function InvoiceClient({ bill, isMerchant }: InvoiceClientProps) {
  const [isPaid, setIsPaid] = useState<boolean>(bill.isPaid ?? false);
  const [paidAt, setPaidAt] = useState<string | null>(bill.paidAt ?? null);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmingPaid, setConfirmingPaid] = useState(false);
  const [upiQrUrl, setUpiQrUrl] = useState("");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const upiId = bill.owner.upiId || "";
  const shopName = bill.owner.shopName || "Merchant";
  const amount = bill.totalAmount;
  const upiLink = buildUpiLink(upiId, shopName, amount, bill.billNumber);

  // Generate UPI QR (for merchant print copy)
  useEffect(() => {
    if (!upiId) return;
    QRCode.toDataURL(upiLink, {
      scale: 10, margin: 2, errorCorrectionLevel: "H",
      color: { dark: "#000000", light: "#FFFFFF" },
    }).then(setUpiQrUrl);
  }, [upiLink, upiId]);

  // Poll payment status (merchant side, every 5 s while unpaid)
  const checkStatus = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch(`/api/bills/${bill.id}/status`);
      if (res.ok) {
        const data = await res.json();
        if (data.isPaid) {
          setIsPaid(true);
          setPaidAt(data.paidAt);
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      }
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, [bill.id]);

  // Auto-poll every 5 s on merchant side, stop when paid
  useEffect(() => {
    if (!isMerchant || isPaid) return;
    pollingRef.current = setInterval(() => checkStatus(true), 5000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [isMerchant, isPaid, checkStatus]);

  // Customer confirms payment
  const handleConfirmPaid = async () => {
    setConfirmingPaid(true);
    try {
      const res = await fetch(`/api/bills/${bill.id}/status`, { method: "PATCH" });
      if (res.ok) {
        setIsPaid(true);
        const data = await res.json();
        setPaidAt(data.paidAt);
      }
    } finally {
      setConfirmingPaid(false);
    }
  };

  const billUrl = typeof window !== "undefined"
    ? window.location.href
    : `https://billturbo.in/invoice/${bill.id}`;

  if (isMerchant) {
    return (
      <MerchantView
        bill={bill}
        billUrl={billUrl}
        upiQrUrl={upiQrUrl}
        isPaid={isPaid}
        paidAt={paidAt}
        onRefresh={() => checkStatus(false)}
        refreshing={refreshing}
      />
    );
  }

  return (
    <CustomerView
      bill={bill}
      isPaid={isPaid}
      onConfirmPaid={handleConfirmPaid}
      confirmingPaid={confirmingPaid}
    />
  );
}
