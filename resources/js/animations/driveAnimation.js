import gsap from 'gsap';

export function playDrive(car, camera, onComplete) {
    gsap.killTweensOf([car.position, car.rotation, camera.position]);

    const tl = gsap.timeline({ onComplete });

    // Phase 1: Wheels spin-up, slight squat
    tl.to(car.rotation, { x: -0.04, duration: 0.3, ease: 'power2.in' }, 0)

    // Phase 2: Surge forward — car leads, camera chases
    .to(car.position, {
        z: -35,
        duration: 2.2,
        ease: 'power3.inOut',
    }, 0.1)
    .to(camera.position, {
        z: -28,
        y: 2.0,
        duration: 2.5,
        ease: 'power2.inOut',
    }, 0.1)

    // Phase 3: Perspective pull — feel the acceleration
    .to(camera, {
        fov: 55,
        duration: 0.8,
        ease: 'power1.in',
        onUpdate: function() { camera.updateProjectionMatrix(); }
    }, 0.2)

    // Phase 4: Deceleration — settle into the About scene
    .to(car.position, {
        z: -40,
        duration: 0.6,
        ease: 'power3.out',
    })
    .to(camera, {
        fov: 45,
        duration: 0.5,
        ease: 'power1.out',
        onUpdate: function() { camera.updateProjectionMatrix(); }
    }, '-=0.5');

    return tl;
}