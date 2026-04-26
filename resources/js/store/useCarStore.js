/**
 * store/useCarStore.js
 *
 * FIX: Zustand v5 dengan subscribeWithSelector.
 * Di v5, middleware perlu di-wrap dengan cara yang spesifik.
 * Jika pakai Zustand v4, syntax ini juga tetap valid.
 */
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const ANIMATIONS = {
  IDLE:        'idle',
  FORWARD:     'forward',
  DRIFT_RIGHT: 'drift-right',
  DRIFT_LEFT:  'drift-left',
};

const useCarStore = create(
  subscribeWithSelector((set, get) => ({
    // ── State ─────────────────────────────────────────────────
    currentAnimation: ANIMATIONS.IDLE,
    isNavigating:     false,
    pendingRoute:     null,
    isReady:          false,

    // ── Actions ───────────────────────────────────────────────

    /**
     * Dipanggil oleh Navbar saat link diklik.
     * TIDAK boleh memanggil navigate() di sini.
     */
    triggerTransition: (animation, targetRoute) => {
      // Guard: jangan proses jika sedang navigasi
      if (get().isNavigating) return;

      set({
        currentAnimation: animation,
        pendingRoute:     targetRoute ?? null,
        isNavigating:     !!targetRoute,
      });
    },

    /**
     * Dipanggil MustangMesh setelah navigate() selesai di onComplete.
     */
    clearNavigation: () =>
      set({ isNavigating: false, pendingRoute: null }),

    /**
     * Dipanggil MustangMesh saat kembali ke idle.
     */
    setAnimation: (animation) =>
      set({ currentAnimation: animation }),

    /**
     * Dipanggil MustangMesh setelah mesh/geometry siap.
     */
    setReady: (ready) =>
      set({ isReady: ready }),

    reset: () =>
      set({
        currentAnimation: ANIMATIONS.IDLE,
        isNavigating:     false,
        pendingRoute:     null,
      }),
  }))
);

export default useCarStore;