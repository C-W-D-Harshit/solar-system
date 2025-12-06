import { useState, useEffect } from "react";

/** Breakpoint for mobile devices in pixels */
const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to detect if the current viewport is mobile-sized
 * Also detects touch capability for better mobile experience
 * @returns Object containing isMobile and isTouchDevice booleans
 */
export function useIsMobile(): { isMobile: boolean; isTouchDevice: boolean } {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  });

  useEffect(() => {
    /**
     * Handle window resize events to update mobile state
     */
    const handleResize = (): void => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    /**
     * Detect touch capability on mount and after any changes
     */
    const detectTouch = (): void => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };

    // Set up resize listener with throttling via ResizeObserver
    window.addEventListener("resize", handleResize);
    detectTouch();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isMobile, isTouchDevice };
}

