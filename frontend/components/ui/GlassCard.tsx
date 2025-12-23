"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={hoverEffect ? { y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" } : {}}
            className={cn(
                "glass-panel rounded-2xl p-6 transition-all duration-300",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
