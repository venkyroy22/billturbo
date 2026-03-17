"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Loader2, ReceiptText } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 border border-white/20 bg-white/5 mb-2">
            <ReceiptText size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tight uppercase">BILLTURBO</h1>
          <p className="text-white/50 font-bold uppercase tracking-[0.2em] text-[10px]">Digital billing for modern Indian shops</p>
        </div>

        <div className="bg-[#121212] border border-white/10 p-8 space-y-8 shadow-[20px_20px_0px_#101010]">
          <div className="text-center border-b border-white/10 pb-6">
            <h2 className="text-2xl font-black uppercase tracking-widest">WELCOME BACK</h2>
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Enter your credentials to access your dashboard</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
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
                  className="bg-transparent border-0 border-b border-white/10 rounded-none text-white focus:ring-0 focus:border-white pl-0 text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-6 pt-4">
              <Button type="submit" variant="premium" className="w-full h-14" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : "SIGN IN"}
              </Button>
              <p className="text-[10px] text-center text-white/50 font-bold uppercase tracking-[0.2em]">
                DON'T HAVE AN ACCOUNT?{" "}
                <Link href="/signup" className="text-white hover:text-white/80 border-b border-white hover:border-white/80 transition-colors uppercase">
                  SIGN UP
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
