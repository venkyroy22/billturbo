"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-white/90 rounded-none uppercase tracking-widest font-bold",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 rounded-none uppercase tracking-widest font-bold",
        outline:
          "border border-white/20 bg-transparent hover:bg-white hover:text-black rounded-none uppercase tracking-widest font-bold",
        secondary:
          "bg-[#1A1A1A] text-white hover:bg-white/10 rounded-none uppercase tracking-widest font-bold",
        ghost: "hover:bg-white/10 hover:text-white rounded-none uppercase tracking-widest font-bold",
        link: "text-white underline-offset-4 hover:underline rounded-none",
        premium: "bg-white text-black font-black uppercase tracking-[0.2em] shadow-[8px_8px_0px_#2a2a2a] hover:shadow-[4px_4px_0px_#2a2a2a] hover:translate-x-[4px] hover:translate-y-[4px] transition-all border border-black rounded-none",
      },
      size: {
        default: "h-11 px-8 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={cn("inline-flex w-auto", className?.includes("w-full") ? "w-full" : "")}
      >
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {props.children}
        </Comp>
      </motion.div>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
