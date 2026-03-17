"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  Loader2, 
  Store, 
  Wallet, 
  ShieldCheck, 
  CreditCard,
  Building,
  User,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
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
        toast.success("Settings updated successfully!");
        update({ 
          user: { 
            name: formData.name, 
            shopName: formData.shopName, 
            upiId: formData.upiId 
          } 
        });
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: "Business Identity",
      description: "How your shop appears to customers",
      icon: Store,
      fields: [
        { label: "Shop Name", name: "shopName", type: "text", placeholder: "e.g. Tasty Bytes Restaurant", icon: Store },
        { label: "Owner Name", name: "name", type: "text", placeholder: "Your Full Name", icon: User },
      ]
    },
    {
      title: "Payment Details",
      description: "Required for receiving instant UPI payments",
      icon: Wallet,
      fields: [
        { label: "UPI VPA / ID", name: "upiId", type: "text", placeholder: "e.g. shopname@upi or 9876543210@paytm", icon: CreditCard },
        { label: "GST Number (Optional)", name: "gstNumber", type: "text", placeholder: "15-digit GSTIN", icon: Building },
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Settings</h1>
          <p className="text-muted-foreground">Configure your profile and payment details</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 rounded-full text-sm font-bold shadow-sm">
           <ShieldCheck size={16} /> Data Secured
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-12">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-none shadow-xl overflow-hidden glass rounded-3xl">
              <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl text-primary shadow-lg border border-primary/10">
                    <section.icon size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                       <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1">{field.label}</label>
                       <div className="relative group">
                          <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                          <Input
                            placeholder={field.placeholder}
                            className="h-12 pl-12 rounded-xl focus:border-primary/50"
                            value={(formData as any)[field.name]}
                            required={field.name !== "gstNumber"}
                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          />
                       </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end pt-4"
        >
          <Button type="submit" variant="premium" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : <><Save className="mr-2" size={24} /> Save Configuration</>}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
