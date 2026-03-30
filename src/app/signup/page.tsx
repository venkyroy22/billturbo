"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Loader2, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        toast.success("Account created! Please sign in.");
        router.push("/login");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to create account.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    "100% free — no hidden fees",
    "Instant UPI settlements",
    "GST-ready invoices in seconds",
  ];

  const fields = [
    { key: "name", label: "Your Name", type: "text", placeholder: "Full name", autoComplete: "name" },
    { key: "shopName", label: "Shop Name", type: "text", placeholder: "Business name", autoComplete: "organization" },
    { key: "email", label: "Email Address", type: "email", placeholder: "name@example.com", autoComplete: "email" },
    { key: "password", label: "Password", type: "password", placeholder: "••••••••", autoComplete: "new-password" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "••••••••", autoComplete: "new-password" },
  ];

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-[#060606] border-r border-white/5 p-16 relative overflow-hidden">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="relative w-10 h-10 shrink-0">
            <Image src="/logo.png" alt="BillTurbo" fill className="object-contain" priority />
          </div>
          <div className="flex flex-col leading-none text-[10px] gap-0.5">
            <span className="text-white font-extrabold tracking-[0.2em]">ILL</span>
            <span className="text-white/40 tracking-[0.4em] font-bold">TURBO</span>
          </div>
        </Link>

        <div className="relative z-10 space-y-10">
          <span className="section-label block">Join Now</span>
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-[0.9] text-white/90">
            Your Shop,<br />
            <span className="text-white/20">Your Money.</span>
          </h2>
          <p className="text-xs text-white/30 uppercase tracking-widest leading-loose max-w-xs font-medium">
            Set up your digital storefront in minutes. Start accepting UPI payments today.
          </p>
          <div className="flex flex-col gap-5">
            {perks.map((p, i) => (
              <div key={p} className="flex items-center gap-4 animate-float-up" style={{ animationDelay: `${i * 0.1 + 0.2}s` }}>
                <div className="w-6 h-6 border border-white/20 bg-white/5 flex items-center justify-center shrink-0">
                  <Check size={10} className="text-white/60" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-t border-white/5 pt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/15">© 2026 BillTurbo Systems</p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-start justify-center p-8 lg:p-16 relative overflow-y-auto">
        {/* Mobile logo */}
        <div className="absolute top-8 left-8 flex lg:hidden items-center gap-3">
          <div className="relative w-8 h-8 shrink-0">
            <Image src="/logo.png" alt="BillTurbo" fill className="object-contain" priority />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50">BillTurbo</span>
        </div>

        <div className="w-full max-w-md py-20 lg:py-0 lg:mt-[10vh] animate-float-up">

          <div className="mb-12">
            <span className="section-label mb-4 block">New Account</span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
              Create<br />Account.
            </h1>
            <p className="text-xs text-white/30 font-bold uppercase tracking-[0.2em]">
              Start billing in under 2 minutes
            </p>
          </div>

          <div className="border border-white/8 bg-white/[0.02] p-8 md:p-10 space-y-8 hover:border-white/15 transition-colors duration-500">
            <form onSubmit={handleSubmit} className="space-y-7">
              {fields.map((field) => (
                <div key={field.key} className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type={
                        field.type === "password"
                          ? field.key === "password"
                            ? showPassword ? "text" : "password"
                            : showConfirmPassword ? "text" : "password"
                          : field.type
                      }
                      placeholder={field.placeholder}
                      required
                      autoComplete={field.autoComplete}
                      minLength={field.type === "password" ? 6 : undefined}
                      className="w-full bg-transparent border-b border-white/10 focus:border-white/50 py-4 text-sm font-bold uppercase tracking-widest placeholder:text-white/10 placeholder:normal-case placeholder:tracking-normal transition-colors duration-300 outline-none caret-white pr-10"
                      value={(formData as any)[field.key]}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    />
                    {field.type === "password" && (
                      <button
                        type="button"
                        onClick={() =>
                          field.key === "password"
                            ? setShowPassword(!showPassword)
                            : setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                      >
                        {(field.key === "password" ? showPassword : showConfirmPassword)
                          ? <EyeOff size={16} />
                          : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

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
                      Create Account
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[9px] uppercase tracking-[0.4em] text-white/15 font-bold">or</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <p className="text-[10px] text-center text-white/30 font-bold uppercase tracking-[0.2em]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-white hover:text-white/70 border-b border-white/30 hover:border-white/10 transition-all duration-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
