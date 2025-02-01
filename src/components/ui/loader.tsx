"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import Image from "next/image";

function AnimatedLogo({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const logoElement = document.querySelector("#animated-logo");
    if (!logoElement) return;

    const tl = gsap.timeline({
      onComplete, // Callback to notify the parent when the animation finishes
    });

    tl.to(logoElement, {
      y: -200, // Jump to the center
      duration: 0.7,
      rotate: 720,
      ease: "power2.out",
    })
      .to(logoElement, {
        y: 0, // Land at the center
        duration: 0.3,
        ease: "bounce.out",
      })
      .to(logoElement, {
        rotation: 360, // Rotate one full circle
        duration: 0.5,
        ease: "linear",
      })
      .to(logoElement, {
        y: 300, // Fall out of view
        duration: 0.7,
        rotation: 720, // Rotate twice while falling
        ease: "power2.in",
      });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <Image
        id="animated-logo"
        src="/icon.png" // Ensure this path points to your image
        alt="Incridea Logo"
        width={108}
        height={108}
        style={{ transform: "translateY(100%)" }} // Start off-screen
      />
    </div>
  );
}

export default function Loader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (pathname === "/preference") {
      setIsAnimating(false); // Skip animation for specific routes
    } else {
      setIsAnimating(true); // Trigger animation on other routes
    }
  }, [pathname]);

  return (
    <>
      {isAnimating ? (
        <AnimatedLogo onComplete={() => setIsAnimating(false)} />
      ) : (
        children
      )}
    </>
  );
}
