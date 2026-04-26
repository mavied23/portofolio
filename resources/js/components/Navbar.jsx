/**
 * components/Navbar.jsx — v4.0 (Final Navigation Fix)
 * Menangani navigasi terstruktur agar pergerakan mobil Mustang presisi.
 */
import React from 'react';
import { useLocation } from 'react-router-dom';
import useCarStore, { ANIMATIONS } from '../store/useCarStore';

const ROUTES = [
  { path: '/',         label: 'Home',     animation: ANIMATIONS.IDLE,         hint: null },
  { path: '/about',    label: 'About',    animation: ANIMATIONS.FORWARD,      hint: '↑'  },
  { path: '/projects', label: 'Projects', animation: ANIMATIONS.DRIFT_RIGHT,  hint: '→'  },
  { path: '/skills',   label: 'Skills',   animation: ANIMATIONS.DRIFT_LEFT,   hint: '←'  },
  { path: '/ai-tasks', label: 'AI TASKS', animation: ANIMATIONS.FORWARD,      hint: 'Δ'  },
  { path: '/contact',  label: 'Contact',  animation: ANIMATIONS.DRIFT_RIGHT,  hint: '→'  },
];

export default function Navbar() {
  const location          = useLocation();
  const isNavigating      = useCarStore((s) => s.isNavigating);
  const isReady           = useCarStore((s) => s.isReady);
  const currentAnimation  = useCarStore((s) => s.currentAnimation);
  const triggerTransition = useCarStore((s) => s.triggerTransition);

  /**
   * Fungsi Navigasi Utama
   * Memastikan mobil melakukan manuver yang benar sebelum pindah halaman.
   */
  const handleNavigation = (path, animation) => {
    // Jangan lakukan apa-apa jika sudah di halaman tersebut atau sedang loading
    if (location.pathname === path) return;
    if (!isReady || isNavigating) return;

    // Trigger animasi mobil ke Zustand Store
    triggerTransition(animation, path);

    // JURUS PENGAMAN: Paksa reset jika navigasi macet lebih dari 2.5 detik
    setTimeout(() => {
      if (useCarStore.getState().isNavigating) {
        console.warn("Sistem Navigasi tersendat, memaksa sinkronisasi...");
        useCarStore.getState().clearNavigation();
      }
    }, 2500); 
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '28px 40px',
      position: 'relative',
      zIndex: 50,
    }}>
      
      {/* WORDMARK (Logo Mustang) 
        Sekarang bisa diklik untuk kembali ke Home dengan animasi IDLE.
      */}
      <div 
        onClick={() => handleNavigation('/', ANIMATIONS.IDLE)}
        style={{ 
          userSelect: 'none', 
          cursor: isNavigating ? 'not-allowed' : 'pointer',
          transition: 'opacity 0.3s'
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <span style={{
          fontFamily: 'monospace',
          fontSize: '20px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.8)',
        }}>
          Reza Mavied Portofolio 
        </span>
        <div style={{ 
          height: '1px', 
          background: location.pathname === '/' ? '#cc1a00' : 'rgba(204,26,0,0.4)', 
          marginTop: '4px',
          transition: 'width 0.3s' 
        }} />
      </div>

      {/* Nav links (Menu Kanan) */}
      <ul style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '36px', 
        listStyle: 'none', 
        margin: 0, 
        padding: 0 
      }}>
        {ROUTES.map((route) => {
          const isActive = location.pathname === route.path;
          const isLocked = isNavigating && !isActive;

          return (
            <li key={route.path} style={{ position: 'relative' }}>
              <button
                onClick={() => handleNavigation(route.path, route.animation)}
                disabled={isLocked}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: isLocked ? 'not-allowed' : isActive ? 'default' : 'pointer',
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: isActive
                    ? 'rgba(255,255,255,1)'
                    : isLocked
                    ? 'rgba(255,255,255,0.15)'
                    : 'rgba(255,255,255,0.4)',
                  padding: '4px 0',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  outline: 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive && !isLocked) e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                }}
                onMouseLeave={e => {
                  if (!isActive && !isLocked) e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                }}
              >
                {route.hint && (
                  <span style={{ 
                    fontSize: '12px', 
                    color: isActive ? '#cc1a00' : 'rgba(204,26,0,0.7)',
                    transition: 'color 0.3s' 
                  }}>
                    {route.hint}
                  </span>
                )}
                {route.label}
              </button>

              {/* Garis Bawah Aktif (Indikator Posisi Mobil) */}
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                left: 0,
                height: '1px',
                width: isActive ? '100%' : '0%',
                background: '#cc1a00',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            </li>
          );
        })}
      </ul>

      {/* Debug Badge (Hanya muncul saat Development) */}
      {import.meta.env.DEV && (
        <div style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'rgba(0,0,0,0.85)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '9px',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.5)',
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: isNavigating ? '#cc1a00' : isReady ? '#22c55e' : '#eab308',
            display: 'inline-block',
            boxShadow: isNavigating ? '0 0 8px #cc1a00' : 'none'
          }} />
          <span style={{ color: '#fff' }}>{currentAnimation}</span>
          {!isReady && ' · LOADING_ASSETS'}
          {isNavigating && ' · MANOEUVRING'}
        </div>
      )}
    </nav>
  );
}