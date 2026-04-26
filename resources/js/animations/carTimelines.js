import gsap from 'gsap';

// 1. ANIMASI IDLE (Getaran Mesin Saat Diam)
export const buildIdleTimeline = (carGroup) => {
  return gsap.timeline({ repeat: -1, yoyo: true })
    .to(carGroup.position, {
      y: 0.03, // Getaran halus ke atas/bawah
      duration: 0.8,
      ease: "sine.inOut"
    });
};

// 2. ANIMASI FORWARD (Dipakai About & AI Tasks)
export const buildForwardTimeline = (carGroup, camera, onComplete) => {
  // onComplete WAJIB dipanggil agar MustangMesh bisa reset posisi mobil
  const tl = gsap.timeline({ onComplete: onComplete });
  
  // Tahap A: Ancang-ancang mundur sedikit (suspensi turun)
  tl.to(carGroup.position, {
    z: 0.8,
    y: -0.05,
    duration: 0.3,
    ease: "power2.out"
  })
  // Tahap B: Melesat maju (Jangan kejauhan, cukup z: -6 agar tidak tembus map)
  .to(carGroup.position, {
    z: -6, 
    y: 0.1, // Hidung mobil sedikit ngangkat
    duration: 0.5,
    ease: "power2.in"
  });

  return tl;
};

// 3. ANIMASI DRIFT (Dipakai Projects, Skills, Contact)
export const buildDriftTimeline = (carGroup, camera, direction, onComplete) => {
  const tl = gsap.timeline({ onComplete: onComplete });
  
  // Tentukan arah berdasarkan input (Maksimal x: 3 atau -3 agar tidak hilang)
  const dirX = direction === 'right' ? 3 : -3;
  const rotY = direction === 'right' ? -Math.PI / 5 : Math.PI / 5;

  tl.to(carGroup.position, {
    x: dirX,
    z: -2, // Agak maju sedikit saat drift
    duration: 0.6,
    ease: "power2.inOut"
  }, 0)
  .to(carGroup.rotation, {
    y: rotY,
    duration: 0.5,
    ease: "power2.out"
  }, 0);

  return tl;
};