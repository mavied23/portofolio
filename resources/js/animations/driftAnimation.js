import gsap from 'gsap';

/**
 * @param {THREE.Object3D} car
 * @param {THREE.Camera} camera
 * @param {'left' | 'right'} direction
 * @param {Function} onComplete
 */
export function playDrift(car, camera, direction = 'right', onComplete) {
    gsap.killTweensOf([car.position, car.rotation, camera.position]);

    const sign = direction === 'right' ? 1 : -1;
    const tl = gsap.timeline({ onComplete });

    // Phase 1: Initiation — counter-steer snap
    tl.to(car.rotation, {
        y: sign * -0.35,        // Brief opposite lock
        duration: 0.25,
        ease: 'power3.in',
    })

    // Phase 2: Full drift rotation
    .to(car.rotation, {
        y: sign * 1.2,          // Slide angle ~70°
        z: sign * 0.08,         // Body roll
        duration: 0.7,
        ease: 'power2.out',
    })

    // Phase 3: Lateral slide — smoke, screech
    .to(car.position, {
        x: sign * 6,
        z: -3,
        duration: 0.9,
        ease: 'power1.inOut',
    }, '-=0.5')

    // Camera swings with the drift
    .to(camera.position, {
        x: sign * 2.5,
        duration: 0.8,
        ease: 'power2.out',
    }, '-=0.8')

    // Phase 4: Straighten up — car realigns to new direction
    .to(car.rotation, {
        y: sign * 0,
        z: 0,
        duration: 0.5,
        ease: 'elastic.out(0.8, 0.5)',
    })
    .to(camera.position, {
        x: sign * 6,
        duration: 0.4,
        ease: 'power2.inOut',
    });

    return tl;
}