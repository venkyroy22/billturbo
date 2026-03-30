"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Store,
  Wallet,
  CreditCard,
  Building,
  User,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    upiId: "",
    gstNumber: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        shopName: session.user.shopName || "",
        upiId: session.user.upiId || "",
        gstNumber: (session.user as any).gstNumber || "",
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Settings saved!");
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        update({ user: { name: formData.name, shopName: formData.shopName, upiId: formData.upiId } });
      } else {
        toast.error("Failed to update settings");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: "Business Identity",
      description: "How your shop appears to customers on invoices",
      icon: Store,
      fields: [
        { label: "Shop Name", name: "shopName", type: "text", placeholder: "e.g. Tasty Bytes Restaurant", icon: Store },
        { label: "Owner Name", name: "name",     type: "text", placeholder: "Your Full Name",             icon: User  },
      ],
    },
    {
      title: "Payment Details",
      description: "Required for receiving instant UPI payments on invoices",
      icon: Wallet,
      fields: [
        { label: "UPI ID / VPA",        name: "upiId",     type: "text", placeholder: "shopname@upi or 9876543210@paytm",  icon: CreditCard },
        { label: "GST Number (Optional)", name: "gstNumber", type: "text", placeholder: "15-digit GSTIN",                   icon: Building   },
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-3xl animate-float-up pb-12">

      {/* ── Header ── */}
      <div className="pb-10 border-b border-white/[0.06] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="section-label mb-3 block">Configuration</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">Settings</h1>
          <p className="text-white/25 text-[11px] font-bold tracking-[0.3em] uppercase mt-5">
            Shop profile and payment configuration
          </p>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 border border-white/[0.06] bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.25em] text-white/30 self-start md:self-auto">
          <ShieldCheck size={13} className="text-emerald-400/70" />
          Data Secured
        </div>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="space-y-6 pb-12">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="border border-white/[0.06] bg-white/[0.01] overflow-hidden hover:border-white/12 transition-colors duration-500"
          >
            {/* Section header */}
            <div className="px-8 py-6 border-b border-white/[0.05] flex items-center gap-5">
              <div className="p-3 bg-white/[0.04] border border-white/[0.06]">
                <section.icon size={18} className="text-white/60" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">{section.title}</h2>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-1">{section.description}</p>
              </div>
            </div>

            {/* Fields */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {section.fields.map((field) => (
                <div key={field.name} className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                    {field.label}
                  </label>
                  <div className="relative group">
                    <field.icon
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-white/15 group-focus-within:text-white/40 transition-colors"
                      size={15}
                    />
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.name !== "gstNumber"}
                      className="w-full bg-transparent border-b border-white/10 focus:border-white/40 pl-6 pb-3 pt-1 text-sm font-bold uppercase tracking-widest placeholder:text-white/10 placeholder:normal-case placeholder:tracking-normal outline-none transition-colors caret-white"
                      value={(formData as any)[field.name]}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end pt-2"
        >
          <button
            type="submit"
            disabled={loading}
            className="group flex items-center gap-3 px-10 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.4em] hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : saved ? (
              <><CheckCircle2 size={16} className="text-emerald-400" /> Saved!</>
            ) : (
              <><Save size={16} /> Save Settings</>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
