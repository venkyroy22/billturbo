"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ── Top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-[100] h-16 flex items-center justify-between px-5 border-b border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 shrink-0">
            <Image src="/logo.png" alt="BillTurbo" fill className="object-contain" />
          </div>
          <span className="flex items-center text-xs font-black uppercase tracking-widest">
            <span className="text-white">ILL</span>
            <span className="text-white/25 ml-1">TURBO</span>
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-9 h-9 flex items-center justify-center border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-all duration-200"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={16} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu size={16} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[98] lg:hidden"
            />
            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 left-0 h-full w-72 bg-[#0c0c0c] z-[99] shadow-2xl lg:hidden border-r border-white/[0.06]"
            >
              <div className="h-full pt-16" onClick={() => setIsOpen(false)}>
                <Sidebar />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
