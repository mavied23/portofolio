import gsap from 'gsap';

export function playIdle(car, camera) {
    // Kill any running timelines
    gsap.killTweensOf([car.position, car.rotation, camera.position]);

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    // Micro-vibration simulating engine rumble
    tl.to(car.position, {
        y: 0.018,
        duration: 0.08,
        ease: 'none',
    }).to(car.position, {
        y: 0,
        duration: 0.08,
        ease: 'none',
    });

    // Subtle body roll (chassis flex)
    gsap.to(car.rotation, {
        z: 0.004,
        duration: 0.12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    });

    // Camera breathing — cinematic sway
    gsap.to(camera.position, {
        y: 2.55,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    });

    return tl;
}