/**
 * PageTransitionWrapper.jsx
 *
 * Fades page content in after route change.
 * Syncs with the car animation: content waits until navigation completes.
 */
import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export default function PageTransitionWrapper({ children }) {
  const ref      = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fade in from slightly below (parallax entrance)
    gsap.fromTo(
      el,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: 0.15 }
    );

    return () => gsap.killTweensOf(el);
  }, [location.pathname]);

  return (
    <div
      ref={ref}
      className="pointer-events-auto w-full h-full flex items-center justify-center"
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  );
}