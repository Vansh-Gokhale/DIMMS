"use client";

import { motion } from "framer-motion";

export const HeroSection = () => {
    return (
        <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center z-10 pointer-events-none pt-20">
            <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
                <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
                    DIMMS
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
                <p className="text-xl md:text-2xl text-white/60 font-light tracking-wide max-w-2xl px-4">
                    Digital Internship & Mentorship Management System
                </p>
            </motion.div>

            {/* Decorative Glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] -z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
            />
        </section>
    );
};
