import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarState } from '../hooks/useCarState';
import { playIdle } from '../animations/idleAnimation';
import { playDrive } from '../animations/driveAnimation';
import { playDrift } from '../animations/driftAnimation';

const NAV_ITEMS = [
    { label: 'Home',     path: '/',         state: 'idle' },
    { label: 'About',    path: '/about',    state: 'drive' },
    { label: 'Projects', path: '/projects', state: 'drift-right' },
    { label: 'Contact',  path: '/contact',  state: 'drift-left' },
];

export default function NavigationOverlay() {
    const navigate = useNavigate();
    const { carState, setCarState } = useCarState();
    const sceneRef = useRef(null);

    useEffect(() => {
        // Grab scene refs from global (set by MustangScene after mount)
        const handler = (e) => { sceneRef.current = e.detail; };
        window.addEventListener('car:ready', handler);
        return () => window.removeEventListener('car:ready', handler);
    }, []);

    const handleNav = (item) => {
        if (carState === item.state) return; // already here
        const { car, camera } = sceneRef.current || {};
        if (!car || !camera) return;

        setCarState(item.state, item.path);

        const go = () => navigate(item.path);

        if (item.state === 'idle') {
            playIdle(car, camera);
            navigate(item.path);
        } else if (item.state === 'drive') {
            playDrive(car, camera, go);
        } else if (item.state === 'drift-right') {
            playDrift(car, camera, 'right', go);
        } else if (item.state === 'drift-left') {
            playDrift(car, camera, 'left', go);
        }
    };

    return (
        <nav className="absolute top-0 left-0 right-0 z-50 flex items-center
                        justify-between px-10 py-6 mix-blend-normal">

            {/* Logo / wordmark */}
            <span className="text-white font-light tracking-[0.3em] text-sm uppercase
                             opacity-80 select-none">
                Mustang
            </span>

            {/* Nav links */}
            <ul className="flex gap-10">
                {NAV_ITEMS.map((item) => (
                    <li key={item.path}>
                        <button
                            onClick={() => handleNav(item)}
                            className={`
                                text-sm tracking-widest uppercase transition-all duration-300
                                ${carState === item.state
                                    ? 'text-white opacity-100'
                                    : 'text-white/50 hover:text-white/90'}
                            `}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}