import { create } from 'zustand';

// Global car state store (Zustand — lightweight, no context hell)
export const useCarStore = create((set) => ({
    carState: 'idle',       // 'idle' | 'drive' | 'drift-left' | 'drift-right'
    targetPage: '/',
    setCarState: (state, page) => set({ carState: state, targetPage: page }),
}));

export const useCarState = () => useCarStore();