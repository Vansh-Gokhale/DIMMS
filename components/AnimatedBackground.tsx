"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedBackground = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-[#050505]">
            {/* Deep decorative gradients */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
            >
                {/* Top Left Orb */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }}
                    className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-purple-900/30 rounded-full blur-[120px]"
                />

                {/* Bottom Right Orb */}
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 2,
                    }}
                    className="absolute -bottom-[10%] -right-[10%] w-[45vw] h-[45vw] bg-indigo-900/20 rounded-full blur-[140px]"
                />

                {/* Center Accent Orb */}
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 1,
                    }}
                    className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[100px]"
                />
            </motion.div>

            {/* Grid Mesh Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Subtle Noise Texture */}
            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none">
                <svg className="w-full h-full">
                    <filter id="noiseFilter">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.6"
                            stitchTiles="stitch"
                        />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>
        </div>
    );
};
