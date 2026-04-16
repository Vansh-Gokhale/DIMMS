"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React from "react";
import { useRouter } from "next/navigation";

export const LoginCard = () => {
    const router = useRouter();

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = clientX - left - width / 2;
        const yPct = clientY - top - height / 2;
        x.set(xPct);
        y.set(yPct);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

    return (
        <div className="flex items-center justify-center p-4 -mt-20 z-20 perspective-[1200px]">
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                initial={{ opacity: 0, y: 100, rotateX: 30 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="relative w-full max-w-md group"
            >
                {/* Anti-Gravity Floating Animation Wrapper */}
                <motion.div
                    animate={{
                        y: [-10, 10, -10],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }}
                    className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl overflow-hidden text-center"
                >
                    {/* Internal Glow */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    <h2 className="text-3xl font-semibold text-white mb-4 tracking-tight">Begin Your Journey</h2>
                    <p className="text-white/50 mb-8 text-sm leading-relaxed">
                        Access the next generation of academic management. Streamlined, efficient, and limitless.
                    </p>

                    <div className="relative z-10">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/login')}
                            className="w-full h-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg shadow-lg shadow-indigo-500/25 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative flex items-center justify-center gap-2">
                                Get Started
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </span>
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};
