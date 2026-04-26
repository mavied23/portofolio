/**
 * PersistentLayout.jsx
 *
 * THE architectural keystone. The render order is:
 *
 *   <div root>                   ← position: relative, full screen
 *     <MustangScene />            ← position: absolute, z-0  (never unmounts)
 *     <Navbar />                  ← position: absolute, z-50 (always visible)
 *     <div page-content>          ← position: absolute, z-10 (route content)
 *       <Outlet />                ← swapped on each navigation
 *     </div>
 *   </div>
 *
 * MustangScene is rendered BEFORE the Outlet — it lives at the bottom of the
 * z-stack and is never touched by React Router's remounting logic.
 */
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import MustangScene from './MustangScene';
import Navbar from './Navbar';
import PageTransitionWrapper from './PageTransitionWrapper';

export default function PersistentLayout() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">

      {/*
        Layer 0 — Three.js canvas
        Never unmounts. GSAP drives the car here.
      */}
      <MustangScene />

      {/*
        Layer 1 — Navigation (always on top of canvas)
      */}
      <Navbar />

      {/*
        Layer 2 — Page content overlay
        Pages are semi-transparent panels floating over the 3D scene.
        PageTransitionWrapper handles fade-in/out between routes.
      */}
      <div className="absolute inset-0 z-10 flex items-center justify-center
                      pointer-events-none">
        <Suspense fallback={null}>
          <PageTransitionWrapper>
            <Outlet />
          </PageTransitionWrapper>
        </Suspense>
      </div>

    </div>
  );
}