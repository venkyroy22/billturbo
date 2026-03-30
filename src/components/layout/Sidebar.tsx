"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ReceiptIndianRupee,
  Package,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Moon } from "lucide-react";

const menuItems = [
  { name: "Dashboard",  icon: LayoutDashboard,     href: "/dashboard" },
  { name: "New Bill",   icon: ReceiptIndianRupee,   href: "/dashboard/billing" },
  { name: "Products",   icon: Package,              href: "/dashboard/products" },
  { name: "History",    icon: History,              href: "/dashboard/history" },
  { name: "Settings",   icon: Settings,             href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] w-full bg-[#0c0c0c] border border-white/[0.06] overflow-hidden relative selection:bg-white selection:text-black">

      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Logo */}
      <div className="p-8 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Image src="/logo.png" alt="BillTurbo" fill className="object-contain" priority />
          </div>
          <div className="flex flex-col leading-none text-[10px] uppercase tracking-[0.2em] font-extrabold text-white/60 gap-0.5">
            <span className="text-white text-xs group-hover:text-white/80 transition-colors">ILL</span>
            <span className="tracking-[0.4em] group-hover:text-white/50 transition-colors">TURBO</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        <p className="px-4 pb-3 pt-2 text-[9px] font-black uppercase tracking-[0.5em] text-white/15">Menu</p>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 group relative overflow-hidden",
                isActive
                  ? "bg-white text-black"
                  : "text-white/40 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              {/* Active left accent */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-black/20" />
              )}
              {!isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/0 group-hover:bg-white/20 transition-colors duration-300" />
              )}

              <item.icon
                size={15}
                className={cn(
                  "shrink-0 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-black" : "text-white/30 group-hover:text-white"
                )}
              />
              <span>{item.name}</span>

              {/* Hover shimmer */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.02] to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 space-y-2">
        {/* Theme indicator */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border border-white/5">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/25">System</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" />
            <Moon size={12} className="text-white/25" />
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3.5 px-4 py-3.5 w-full text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all duration-300 group"
        >
          <LogOut size={15} className="transition-transform duration-300 group-hover:-translate-x-0.5 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
