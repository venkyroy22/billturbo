"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "glass dark:bg-zinc-900 dark:text-white border-none",
        duration: 4000,
        style: {
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
        },
      }}
    />
  );
}
