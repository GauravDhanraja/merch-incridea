"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function TransitionWrapper({
                                            children,
                                          }: Readonly<{ children: React.ReactNode }>) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname(); // Detects route changes

  useEffect(() => {
    const fadeIn = () => {
      // Transition to black
      return gsap.to(overlayRef.current, {
        backgroundColor: "black",
        duration: 1,
        ease: "power2.out",
      });
    };

    const fadeOut = () => {
      // Transition to transparent
      return gsap.to(overlayRef.current, {
        backgroundColor: "transparent",
        duration: 1,
        ease: "power2.out",
      });
    };

    const handleRouteChange = async () => {
      await fadeIn(); // Fade to black
      fadeOut(); // Fade back to transparent
    };

    handleRouteChange(); // Run on initial load and subsequent route changes
  }, [pathname]); // Trigger whenever the pathname changes

  return (
      <>
        {/* Full-screen overlay for transitions */}
        <div
            ref={overlayRef}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              pointerEvents: "none",
              zIndex: 9999,
            }}
        ></div>
        {/* Actual content */}
        {children}
      </>
  );
}
