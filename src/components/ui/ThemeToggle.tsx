"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/50 hover:bg-accent transition-colors group"
    >
      <div className="relative w-6 h-6">
        <motion.div
          animate={{
            scale: theme === "light" ? 1 : 0,
            rotate: theme === "light" ? 0 : 90,
            opacity: theme === "light" ? 1 : 0,
          }}
          className="absolute inset-0 text-amber-500"
        >
          <Sun size={24} />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{
            scale: theme === "dark" ? 1 : 0,
            rotate: theme === "dark" ? 0 : -90,
            opacity: theme === "dark" ? 1 : 0,
          }}
          className="absolute inset-0 text-blue-400"
        >
          <Moon size={24} />
        </motion.div>
      </div>
    </button>
  );
}
