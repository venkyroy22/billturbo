"use client";

import { useState } from "react";
import { Menu, X, ReceiptText } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden fixed top-0 left-0 w-full z-[100] px-4 h-16 flex items-center justify-between glass border-b dark:border-white/5">
      <div className="flex items-center gap-2 text-primary">
        <ReceiptText size={24} />
        <span className="font-bold font-display">BillTurbo</span>
      </div>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-accent rounded-xl transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-background z-[101] shadow-2xl"
            >
              <div className="h-full flex flex-col" onClick={() => setIsOpen(false)}>
                <Sidebar />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
