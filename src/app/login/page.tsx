"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (res?.error) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.success("Welcome back!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">

      {/* ── Left Panel (decorative) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-[#060606] border-r border-white/5 p-16 relative overflow-hidden">
        {/* Background grid */}
        <div className="bg-grid absolute inset-0" />
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10 group">
          <div className="relative w-10 h-10 shrink-0">
            <Image src="/logo.png" alt="BillTurbo" fill className="object-contain" priority />
          </div>
          <div className="flex flex-col leading-none text-[10px] gap-0.5">
            <span className="text-white font-extrabold tracking-[0.2em]">ILL</span>
            <span className="text-white/40 tracking-[0.4em] font-bold">TURBO</span>
          </div>
        </Link>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <span className="section-label block">Platform</span>
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-[0.9] text-white/90">
            Zero Fees.<br />
            <span className="text-white/20">Instant UPI.</span>
          </h2>
          <p className="text-xs text-white/30 uppercase tracking-widest leading-loose max-w-xs font-medium">
            The fastest billing tool for modern Indian shops. Zero commissions, instant settlements.
          </p>

          {/* Stat pills */}
          <div className="flex flex-col gap-4 pt-4">
            {["0% Transaction Fees", "UPI Direct Settlement", "GST-Ready Invoices"].map((f, i) => (
              <div key={f} className="flex items-center gap-4 animate-float-up" style={{ animationDelay: `${i * 0.1 + 0.3}s` }}>
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 border-t border-white/5 pt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/15">
            © 2026 BillTurbo Systems
          </p>
        </div>
      </div>

      {/* ── Right Panel (form) ── */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative">
        {/* Mobile logo */}
        <div className="absolute top-8 left-8 flex lg:hidden items-center gap-3">
          <div className="relative w-8 h-8 shrink-0">
            <Image src="/logo.png" alt="BillTurbo" fill className="object-contain" priority />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50">BillTurbo</span>
        </div>

        <div className="w-full max-w-md animate-float-up">

          {/* Header */}
          <div className="mb-12">
            <span className="section-label mb-4 block">Account</span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
              Welcome<br />Back.
            </h1>
            <p className="text-xs text-white/30 font-bold uppercase tracking-[0.2em]">
              Sign in to your dashboard
            </p>
          </div>

          {/* Form card */}
          <div className="border border-white/8 bg-white/[0.02] p-8 md:p-10 space-y-8 hover:border-white/15 transition-colors duration-500">

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Email */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="name@example.com"
                    required
                    autoComplete="email"
                    className="w-full bg-transparent border-b border-white/10 focus:border-white/50 py-4 text-sm font-bold uppercase tracking-widest placeholder:text-white/10 placeholder:normal-case placeholder:tracking-normal transition-colors duration-300 outline-none caret-white"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full bg-transparent border-b border-white/10 focus:border-white/50 py-4 text-sm font-bold tracking-widest placeholder:text-white/10 transition-colors duration-300 outline-none caret-white pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full h-14 bg-white text-black text-xs font-black uppercase tracking-[0.4em] hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[9px] uppercase tracking-[0.4em] text-white/15 font-bold">or</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Sign up link */}
            <p className="text-[10px] text-center text-white/30 font-bold uppercase tracking-[0.2em]">
              No account?{" "}
              <Link
                href="/signup"
                className="text-white hover:text-white/70 border-b border-white/30 hover:border-white/10 transition-all duration-300"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
