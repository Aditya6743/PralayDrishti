"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const MagneticCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring physics (Increased sensitivity)
  const springConfig = { damping: 15, stiffness: 500, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if it's a touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTouchDevice(true);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 10);
      cursorY.set(e.clientY - 10);
      
      // Ambient radial light following cursor
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Magnetic attraction targets
    const handleTargetEnter = () => setIsHovering(true);
    const handleTargetLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", moveCursor);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    // Attach to interactive elements
    const setupTargets = () => {
      const targets = document.querySelectorAll("a, button, [role='button'], .magnetic-target");
      targets.forEach((target) => {
        target.addEventListener("mouseenter", handleTargetEnter);
        target.addEventListener("mouseleave", handleTargetLeave);
      });
    };

    setupTargets();

    // Re-run setup on DOM changes using MutationObserver
    const observer = new MutationObserver(setupTargets);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, [cursorX, cursorY]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Background ambient light following cursor */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.03), transparent 40%)`,
          opacity: isVisible ? 1 : 0
        }}
      />
      
      {/* Precision Glowing Dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 40 : 20,
            height: isHovering ? 40 : 20,
            backgroundColor: isHovering ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.9)",
            boxShadow: isHovering ? "0 0 20px rgba(255,255,255,0.2)" : "0 0 10px rgba(255,255,255,0.5)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-full backdrop-blur-sm"
        />
      </motion.div>
    </>
  );
};
