"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Zap, Shield, Receipt, QrCode, IndianRupee, TrendingUp } from "lucide-react";

const TICKER_ITEMS = [
  "ZERO TRANSACTION FEES",
  "INSTANT UPI PAYMENTS",
  "GST-READY INVOICES",
  "QR CODE GENERATION",
  "REAL-TIME ANALYTICS",
  "MADE FOR INDIA",
];

function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

export default function LandingPage() {
  const [visible, setVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const fees = useCountUp(0, 800, visible);
  const pct = useCountUp(100, 1600, visible);
  const speed = useCountUp(5, 1200, visible);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-white selection:text-black overflow-x-hidden">

      {/* ── Background ambient ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/[0.012] rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-white/[0.008] rounded-full blur-3xl" />
        <div className="bg-grid absolute inset-0 opacity-100" />
      </div>

      {/* ── Header ── */}
      <header className="w-full flex justify-between items-center px-8 md:px-16 py-8 relative z-20 animate-fade-in">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 md:w-11 md:h-11 shrink-0">
            <Image src="/logo.png" alt="BillTurbo" fill className="object-contain" priority />
          </div>
          <div className="flex flex-col leading-none text-[10px] md:text-xs gap-0.5">
            <span className="text-white font-extrabold tracking-[0.2em]">ILL</span>
            <span className="text-white/40 tracking-[0.4em] font-bold">TURBO</span>
          </div>
        </Link>

        <nav className="flex items-center gap-8 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">
          <Link href="/login" className="text-white/50 hover:text-white transition-colors duration-300">Login</Link>
          <Link
            href="/signup"
            className="relative px-6 py-3 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/90 transition-all duration-300 group overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 pt-16 pb-32 relative z-10 min-h-[88vh]">

        <div className="animate-float-up delay-100 mb-8">
          <span className="inline-flex items-center gap-3 px-5 py-2.5 border border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-[0.4em] font-bold text-white/50">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Digital Billing Platform
          </span>
        </div>

        <h1 className="animate-float-up delay-200 text-[14vw] md:text-[11rem] font-black tracking-tighter leading-[0.82] mb-8 text-white flex items-center justify-center">
          <div className="relative w-[1.05em] h-[1.05em] shrink-0 -mr-[0.04em] translate-y-[0.04em]">
            <Image src="/logo.png" alt="BillTurbo" fill className="object-contain" priority />
          </div>
          <span className="relative flex items-center">
            <span className="text-white">ILL</span>
            <span className="text-white/15">TURBO</span>
          </span>
        </h1>

        <div className="animate-float-up delay-300 flex flex-col items-center gap-1.5 text-xs md:text-sm uppercase tracking-[0.35em] font-bold text-white/30 mb-16">
          <span>Simplified Indian Billing</span>
          <span className="text-white/15">—</span>
          <span className="text-white/20">Zero Fees. Instant UPI.</span>
        </div>

        <div className="animate-float-up delay-400 flex flex-col sm:flex-row items-center gap-4 mb-24">
          <Link
            href="/signup"
            className="group flex items-center gap-3 px-10 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:bg-white/90 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.12)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
          >
            Start for Free
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-3 px-10 py-5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 text-xs font-black uppercase tracking-[0.3em] transition-all duration-300"
          >
            Sign In
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-4 animate-fade-in delay-700">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-scroll-bar" />
          <span className="text-[9px] uppercase tracking-[0.5em] text-white/20 font-bold">Scroll</span>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="relative border-y border-white/5 py-5 bg-white/[0.015] overflow-hidden z-10">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-white/25 mx-8">
              {item} <span className="text-white/10">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <section ref={statsRef} className="py-32 px-8 md:px-16 bg-[#050505] border-b border-white/5 z-10 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          {[
            { label: "Transaction Fees", value: fees, suffix: "%", prefix: "" },
            { label: "UPI Direct to You", value: pct, suffix: "%", prefix: "" },
            { label: "Seconds to Generate", value: speed, suffix: "s", prefix: "<" },
          ].map((s, i) => (
            <div key={s.label} className="bg-[#050505] p-16 flex flex-col gap-4 group hover:bg-white/[0.02] transition-colors duration-500">
              <span className="section-label">{s.label}</span>
              <div className="text-7xl md:text-8xl font-black tracking-tighter text-white group-hover:scale-105 transition-transform origin-left duration-500">
                {s.prefix}{s.value}{s.suffix}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-40 px-8 md:px-16 bg-background z-10 relative">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <span className="section-label mb-6 block">The Platform</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Built for <br /><span className="text-white/20">Modern India.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {[
              { icon: Receipt, title: "Instant Bills", desc: "Generate professional GST-ready invoices in under 5 seconds." },
              { icon: QrCode, title: "UPI QR Codes", desc: "Every bill gets a payment QR that lands money straight in your account." },
              { icon: IndianRupee, title: "Zero Fees", desc: "We never touch your money. Direct P2P UPI — always 0% commission." },
              { icon: Shield, title: "GST Compliant", desc: "Automatic tax computation. Downloadable invoices accepted everywhere." },
              { icon: TrendingUp, title: "Analytics", desc: "Real-time revenue dashboard. Know your shop's pulse at all times." },
              { icon: Zap, title: "Lightning Fast", desc: "Sub-second page loads. No bloat. Pure performance for busy shops." },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group bg-background hover:bg-white/[0.025] p-12 flex flex-col gap-6 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                <div className="p-4 bg-white/5 border border-white/5 w-fit group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-3">{title}</h3>
                  <p className="text-xs text-white/30 font-medium leading-relaxed tracking-wider">{desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white/50 transition-colors">
                  Learn more <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-40 px-8 md:px-16 bg-[#050505] border-t border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="section-label mb-8 block">Ready?</span>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-12">
            Start Selling <br /><span className="text-white/20">Smarter Today.</span>
          </h2>
          <p className="text-xs text-white/30 max-w-sm mx-auto font-bold uppercase tracking-widest leading-relaxed mb-16">
            No credit card. No setup fee. Just create an account and start generating bills in minutes.
          </p>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-4 px-14 py-6 bg-white text-black text-xs font-black uppercase tracking-[0.4em] hover:bg-white/90 transition-all duration-500 shadow-[0_0_60px_rgba(255,255,255,0.15)] hover:shadow-[0_0_80px_rgba(255,255,255,0.25)]"
          >
            Create Account
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-20 px-8 md:px-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 shrink-0">
            <Image src="/logo.png" alt="BillTurbo" fill className="object-contain opacity-50" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">BillTurbo</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/10 font-bold">
          © 2026 BillTurbo Systems · Made for Bharat
        </span>
        <div className="flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">
          <Link href="/login" className="hover:text-white/50 transition-colors">Login</Link>
          <Link href="/signup" className="hover:text-white/50 transition-colors">Sign Up</Link>
        </div>
      </footer>
    </div>
  );
}
