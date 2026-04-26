/**
 * carAnimations.js
 * Pure GSAP timeline factories. Each function receives a live
 * THREE.Object3D ref and returns a configured (but not yet played) timeline.
 * Call tl.play() from the component after binding onComplete.
 */
import gsap from 'gsap';

// ─────────────────────────────────────────────────────────────────
// IDLE — micro engine vibration + camera sway
// Returns a looping timeline stored on the mesh for cleanup.
// ─────────────────────────────────────────────────────────────────
export function buildIdleTimeline(meshRef) {
  const tl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });

  tl.to(meshRef.position, {
    y: 0.022,
    duration: 0.09,
    ease: 'none',
  })
    .to(meshRef.position, { y: 0, duration: 0.09, ease: 'none' })
    // Slight chassis rock on Z (body roll feel)
    .to(
      meshRef.rotation,
      { z: 0.006, duration: 0.14, ease: 'sine.inOut', yoyo: true, repeat: 1 },
      0
    );

  return tl;
}

// ─────────────────────────────────────────────────────────────────
// FORWARD — drive ahead (Home → About)
//
// Phase 1  (0.00s): Front dips under acceleration load
// Phase 2  (0.15s): Surge — car races forward, camera chases
// Phase 3  (1.80s): FOV breathes out (speed sensation)
// Phase 4  (2.40s): Settling decel, camera catches up
// ─────────────────────────────────────────────────────────────────
export function buildForwardTimeline(meshRef, cameraRef, onComplete) {
  // Snapshot current transforms so we can reset after nav
  const startPos = { ...meshRef.position };
  const startRot = { ...meshRef.rotation };

  const tl = gsap.timeline({ paused: true, onComplete });

  // Phase 1 – weight transfer: nose dips
  tl.to(meshRef.rotation, {
    x: -0.045,
    duration: 0.28,
    ease: 'power3.in',
  });

  // Phase 2 – launch surge
  tl.to(
    meshRef.position,
    {
      z: -40,
      duration: 2.1,
      ease: 'power3.inOut',
    },
    0.15
  );

  // Camera chases — intentional lag for parallax feel
  tl.to(
    cameraRef.position,
    {
      z: cameraRef.position.z - 32,
      y: cameraRef.position.y - 0.4,
      duration: 2.5,
      ease: 'power2.inOut',
    },
    0.2
  );

  // FOV breathe (speed sensation) — must call updateProjectionMatrix
  tl.to(
    cameraRef,
    {
      fov: 58,
      duration: 0.9,
      ease: 'power1.in',
      onUpdate() {
        cameraRef.updateProjectionMatrix();
      },
    },
    0.25
  );

  // Phase 4 – settle
  tl.to(
    cameraRef,
    {
      fov: 45,
      duration: 0.6,
      ease: 'power1.out',
      onUpdate() {
        cameraRef.updateProjectionMatrix();
      },
    },
    '-=0.5'
  );

  return tl;
}

// ─────────────────────────────────────────────────────────────────
// DRIFT — cinematic side-transition (→ Features, Contact, etc.)
//
// Physics breakdown:
//   1. Counter-steer snap    — brief opposite rotation (realism)
//   2. Throttle kick         — rear steps out (yaw increases fast)
//   3. Full slide angle      — ~55° yaw + body roll on Z
//   4. Lateral translation   — car slides across X axis
//   5. Re-centre             — elastic settle back to neutral yaw
//   6. Camera lag sweep      — camera follows with ~15% delay
//
// @param {'left'|'right'} direction
// ─────────────────────────────────────────────────────────────────
export function buildDriftTimeline(meshRef, cameraRef, direction = 'right', onComplete) {
  const sign = direction === 'right' ? 1 : -1;

  const tl = gsap.timeline({ paused: true, onComplete });

  // ① Counter-steer snap (opposite lock, ~0.25s)
  tl.to(meshRef.rotation, {
    y: sign * -0.28,
    duration: 0.22,
    ease: 'power4.in',
  });

  // ② Throttle kick — rear breaks traction (yaw snaps aggressively)
  tl.to(meshRef.rotation, {
    y: sign * 0.95,
    z: sign * 0.07,    // body roll: outside wheels compress
    x: -0.03,          // mild nose lift from rear grip loss
    duration: 0.38,
    ease: 'power3.out',
  });

  // ③ Sustained slide angle — hold the drift
  tl.to(meshRef.rotation, {
    y: sign * 1.1,     // ~63° — full drift angle
    z: sign * 0.11,    // roll increases slightly at peak slide
    duration: 0.45,
    ease: 'power1.inOut',
  });

  // ④ Lateral translation — car physically crosses screen
  tl.to(
    meshRef.position,
    {
      x: sign * 9,
      z: -1.5,          // slight forward creep during slide
      duration: 0.95,
      ease: 'power2.inOut',
    },
    '-=0.7'             // overlap with rotation for simultaneity
  );

  // ⑤ Re-centre — car straightens into new direction
  tl.to(meshRef.rotation, {
    y: 0,
    z: 0,
    x: 0,
    duration: 0.55,
    ease: 'elastic.out(0.75, 0.5)',  // elastic = chassis spring bounce
  });

  // ⑥ Camera lag sweep — follows the car with a soft delay
  tl.to(
    cameraRef.position,
    {
      x: sign * 4.5,
      duration: 1.15,
      ease: 'power2.out',
    },
    0.3                 // starts slightly after car begins moving
  );

  // Minor FOV breathe during drift
  tl.to(
    cameraRef,
    {
      fov: 52,
      duration: 0.5,
      ease: 'power1.in',
      onUpdate() { cameraRef.updateProjectionMatrix(); },
    },
    0.4
  );
  tl.to(
    cameraRef,
    {
      fov: 45,
      duration: 0.4,
      ease: 'power1.out',
      onUpdate() { cameraRef.updateProjectionMatrix(); },
    },
    '-=0.2'
  );

  return tl;
}