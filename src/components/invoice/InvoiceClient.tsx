"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  CheckCircle2, 
  Smartphone, 
  ReceiptText, 
  ExternalLink, 
  ChevronRight,
  Languages,
  Loader2
} from "lucide-react";
import QRCode from "qrcode";
import Image from "next/image";
import { translations, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

interface InvoiceClientProps {
  bill: any;
}

export default function InvoiceClient({ bill }: InvoiceClientProps) {
  const [currentLocale, setCurrentLocale] = useState<Locale>("en");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const t = translations[currentLocale];

  const upiLink = `upi://pay?pa=${bill.owner.upiId}&pn=${encodeURIComponent(
    bill.owner.shopName || "BillTurbo Merchant"
  )}&am=${bill.totalAmount.toFixed(2)}&cu=INR`;

  useEffect(() => {
    QRCode.toDataURL(upiLink, {
      scale: 10,
      margin: 2,
    }).then(setQrCodeUrl);
  }, [upiLink]);

  const payLinks = [
    { name: "Google Pay", color: "from-blue-500 to-red-500", url: upiLink },
    { name: "PhonePe", color: "from-purple-600 to-indigo-600", url: upiLink },
    { name: "Paytm", color: "from-blue-400 to-cyan-400", url: upiLink },
  ];

  if (!qrCodeUrl) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 animate-in fade-in duration-500 pb-24 selection:bg-white selection:text-black">
      {/* Language Selector */}
      <div className="flex justify-center gap-4 mb-16 no-print">
        {(["en", "hi", "te"] as Locale[]).map((loc) => (
          <button
            key={loc}
            className={`border px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
              currentLocale === loc
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/50 border-white/10 hover:border-white/30"
            }`}
            onClick={() => setCurrentLocale(loc)}
          >
            {loc}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto space-y-16">
        {/* Success Header */}
        <div className="text-center space-y-4 py-8 border-b border-white/10 no-print">
           <div className="inline-flex items-center justify-center p-4 border border-white/20 bg-white/5 mb-4">
             <CheckCircle2 size={32} className="text-white" />
           </div>
           <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">{t.billGenerated}</h1>
           <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em]">{t.scanToPay}</p>
        </div>

        {/* Payment QR Section */}
        <div className="border border-white/5 bg-[#171717]">
          <div className="p-12 flex flex-col items-center border-b border-dashed border-white/10">
            <div className="bg-white p-4 shadow-[10px_10px_0px_#2a2a2a] border border-black mb-12">
              <Image 
                src={qrCodeUrl} 
                alt="UPI Payment QR" 
                width={240} 
                height={240} 
                className="mix-blend-multiply"
              />
            </div>
            <div className="text-center w-full">
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.3em] mb-4 border-b border-white/5 pb-4 inline-block">{t.totalToPay}</p>
              <h2 className="text-6xl font-black text-white tracking-tighter">
                {formatCurrency(bill.totalAmount)}
              </h2>
            </div>
          </div>
          <div className="p-8 no-print bg-[#121212]">
             <div className="grid grid-cols-1 gap-4">
               <p className="text-[10px] text-center font-bold text-white/30 uppercase tracking-[0.2em] mb-4">OR PAY VIA APP</p>
               {payLinks.map((app) => (
                 <a 
                   key={app.name} 
                   href={app.url}
                   className="flex items-center justify-between p-6 bg-[#1a1a1a] border border-white/5 hover:bg-white hover:text-black hover:border-white transition-colors group"
                 >
                   <div className="flex items-center gap-4">
                     <Smartphone size={20} className="text-white/50 group-hover:text-black transition-colors" />
                     <span className="text-xs font-bold uppercase tracking-widest">{app.name}</span>
                   </div>
                   <ChevronRight size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                 </a>
               ))}
               <p className="text-[10px] text-center text-white/30 uppercase tracking-[0.2em] mt-8 p-4 border border-dashed border-white/10">
                 {t.note}
               </p>
             </div>
          </div>
        </div>

        {/* Invoice Details Section */}
        <div className="border border-white/5 bg-[#151515]">
           <div className="p-8 pb-6 border-b border-white/10 bg-[#121212]">
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-wider">{bill.owner.shopName || "SHOP OWNER"}</h3>
                    <p className="text-xs font-bold text-white/50 mt-2 flex items-center gap-2 uppercase tracking-[0.2em]">
                      <ReceiptText size={14} /> BILL #{bill.billNumber}
                    </p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em] border border-white/20 p-2 inline-block bg-white/5">{formatDate(bill.createdAt)}</p>
                    {bill.owner.gstNumber && (
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mt-3 block">GST: {bill.owner.gstNumber}</p>
                    )}
                 </div>
              </div>
           </div>
           
           <div className="p-8">
              <div className="space-y-4">
                 <div className="space-y-0 border border-white/10">
                   {bill.items.map((item: any, idx: number) => (
                      <div key={item.id} className={`flex justify-between items-center p-4 ${idx !== 0 ? 'border-t border-white/5' : ''}`}>
                         <div className="flex-1">
                            <p className="font-bold text-xs uppercase tracking-widest">{item.name}</p>
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mt-1">{item.quantity} X {formatCurrency(item.price)}</p>
                         </div>
                         <div className="text-right font-black text-sm tracking-tight">
                            {formatCurrency(item.subtotal)}
                         </div>
                      </div>
                   ))}
                 </div>
                 
                 <div className="bg-[#121212] p-6 border border-white/10 space-y-4 mt-8">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                       <span>{t.subtotal}</span>
                       <span className="text-white">{formatCurrency(bill.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                       <span>{t.gstTotal}</span>
                       <span className="text-white">{formatCurrency(bill.gstTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-6 mt-4 border-t border-dashed border-white/20">
                       <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">{t.totalAmount}</span>
                       <span className="text-3xl font-black text-white tracking-tighter">{formatCurrency(bill.totalAmount)}</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-[#121212] p-6 flex flex-col items-center justify-center border-t border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2">POWERED BY</span>
              <p className="font-black text-white flex items-center gap-2 uppercase tracking-[0.2em]">
                 <ReceiptText size={16} /> BILLTURBO
              </p>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center pb-12 pt-8 no-print border-t border-white/5">
           <button 
             onClick={() => window.print()} 
             className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors border border-transparent hover:border-white/20 px-6 py-4 bg-[#121212]"
           >
             <ExternalLink size={14} /> DOWNLOAD / PRINT INVOICE
           </button>
        </div>
      </div>
    </div>
  );
}
