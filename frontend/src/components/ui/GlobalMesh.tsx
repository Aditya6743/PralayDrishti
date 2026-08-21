"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

export function GlobalMesh() {
  const [isClient, setIsClient] = useState(false);
  
  // High-performance motion values
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Smooth springs for the glow to softly trail the cursor
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Construct the CSS mask dynamically
  const backgroundTemplate = useMotionTemplate`radial-gradient(circle 400px at ${springX}px ${springY}px, rgba(239, 68, 68, 0.15) 0%, rgba(56, 189, 248, 0.05) 40%, transparent 100%)`;
  const maskImage = useMotionTemplate`radial-gradient(circle 350px at ${springX}px ${springY}px, black 0%, transparent 100%)`;

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-background">
      {/* 1. Base dim dot matrix */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* 2. Premium glowing dot matrix that follows the cursor */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"
        style={{
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
        }}
      />
      
      {/* 3. Soft ambient color glow that follows the cursor */}
      <motion.div
        className="absolute inset-0 mix-blend-screen opacity-15"
        style={{
          background: backgroundTemplate
        }}
      />
    </div>
  );
}
