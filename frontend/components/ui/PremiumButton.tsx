"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface PremiumButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline";
    className?: string;
    icon?: React.ReactNode;
}

export function PremiumButton({ children, variant = "primary", className, icon, ...props }: PremiumButtonProps) {
    const variants = {
        primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20",
        secondary: "bg-white text-slate-900 hover:bg-slate-50 shadow-md border border-slate-100",
        outline: "bg-transparent border border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors",
                variants[variant],
                className
            )}
            {...props}
        >
            {icon && <span className="w-5 h-5">{icon}</span>}
            {children}
        </motion.button>
    );
}
