"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Loader2, Store } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Account created! Please sign in.");
        router.push("/login");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to create account.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background my-8">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 border border-white/20 bg-white/5 mb-2">
            <Store size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tight uppercase">BILLTURBO</h1>
          <p className="text-white/50 font-bold uppercase tracking-[0.2em] text-[10px]">The digital pulse of your shop</p>
        </div>

        <div className="bg-[#121212] border border-white/10 p-8 space-y-8 shadow-[20px_20px_0px_#101010]">
          <div className="text-center border-b border-white/10 pb-6">
            <h2 className="text-2xl font-black uppercase tracking-widest">CREATE ACCOUNT</h2>
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">START GENERATING DIGITAL BILLS IN MINUTES</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">YOUR NAME</label>
                <Input
                  type="text"
                  placeholder="E.G. JOHN DOE"
                  required
                  className="bg-transparent border-0 border-b border-white/10 rounded-none text-white focus:ring-0 focus:border-white pl-0 uppercase font-bold tracking-widest text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">SHOP NAME</label>
                <Input
                  type="text"
                  placeholder="JOHN'S STORE"
                  required
                  className="bg-transparent border-0 border-b border-white/10 rounded-none text-white focus:ring-0 focus:border-white pl-0 uppercase font-bold tracking-widest text-sm"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">EMAIL ADDRESS</label>
                <Input
                  type="email"
                  placeholder="NAME@EXAMPLE.COM"
                  required
                  className="bg-transparent border-0 border-b border-white/10 rounded-none text-white focus:ring-0 focus:border-white pl-0 uppercase font-bold tracking-widest text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">PASSWORD</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="bg-transparent border-0 border-b border-white/10 rounded-none text-white focus:ring-0 focus:border-white pl-0 uppercase font-bold tracking-widest text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-6 pt-4">
              <Button type="submit" variant="premium" className="w-full h-14" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : "SIGN UP"}
              </Button>
              <p className="text-[10px] text-center text-white/50 font-bold uppercase tracking-[0.2em]">
                ALREADY HAVE AN ACCOUNT?{" "}
                <Link href="/login" className="text-white hover:text-white/80 border-b border-white hover:border-white/80 transition-colors uppercase">
                  SIGN IN
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
