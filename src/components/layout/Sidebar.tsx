"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ReceiptIndianRupee, 
  Package, 
  History, 
  Settings, 
  LogOut,
  ReceiptText
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Moon, Sun } from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "New Bill", icon: ReceiptIndianRupee, href: "/dashboard/billing" },
  { name: "Products", icon: Package, href: "/dashboard/products" },
  { name: "History", icon: History, href: "/dashboard/history" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] w-full bg-[#151515] border border-white/5 shadow-[20px_20px_60px_#101010,-20px_-20px_60px_#202020] overflow-hidden relative selection:bg-white selection:text-black">
      <div className="p-8 relative z-10">
        <div className="flex flex-col leading-tight mb-16 text-xs uppercase tracking-[0.2em] font-bold text-white/70">
          <span className="text-white">BILL</span>
          <span>TURBO</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 group relative border",
                  isActive 
                    ? "bg-white text-black border-transparent" 
                    : "text-white/50 border-transparent hover:bg-[#121212] hover:text-white hover:border-white/10"
                )}
              >
                <item.icon size={16} className={cn("transition-transform group-hover:scale-110 relative z-10", isActive ? "text-black" : "text-white/50")} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4 border-t border-white/5">
        <div className="flex items-center justify-between px-4 py-4 bg-[#121212] border border-white/5">
           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Theme</span>
           {/* Replaced complex popover with a simple static dark icon to fit monochromatic */}
           <Moon size={14} className="text-white/50" />
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-4 px-4 py-4 w-full text-xs font-bold uppercase tracking-[0.2em] text-white/50 border border-transparent hover:bg-destructive/10 hover:text-white hover:border-destructive/30 transition-all group"
        >
          <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
          SIGN OUT
        </button>
      </div>
    </div>
  );
}
