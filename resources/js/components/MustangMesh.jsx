/**
 * components/MustangMesh.jsx — CINEMATIC EDITION
 * - Real Headlights (SpotLights) with helper cones
 * - Road Glare (Kilauan Lampu Jalan di Aspal)
 * - Full 300+ Lines Geometry preserved
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import useCarStore, { ANIMATIONS } from '../store/useCarStore';
import { 
  buildIdleTimeline, 
  buildForwardTimeline, 
  buildDriftTimeline 
} from '../animations/carTimelines';

const MAT = {
  body: () => new THREE.MeshStandardMaterial({
    color: 0xcc1a00, roughness: 1, metalness: 1,
    emissive: 0x330000, emissiveIntensity: 0.3
  }),
  cabin: () => new THREE.MeshStandardMaterial({
    color: 0x1a2233, roughness: 0.1, metalness: 0.2,
    transparent: true, opacity: 0.8
  }),
  rubber: () => new THREE.MeshStandardMaterial({
    color: 0x0a0a0a, roughness: 2, metalness: 0.05
  }),
  chrome: () => new THREE.MeshStandardMaterial({
    color: 0xefefef, roughness: 0.2, metalness: 1.0
  }),
  neonWhite: () => new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 8 // Boosted intensity
  }),
  neonRed: () => new THREE.MeshStandardMaterial({
    color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 10
  })
};

export default function MustangMesh({ groupRef, cameraRef, navigate }) {
  const carRef = useRef(null);
  const wheelsRef = useRef([]);
  const activeTlRef = useRef(null);
  const idleTlRef = useRef(null);
  const wheelSpeedRef = useRef(0.15);

  useEffect(() => {
    if (!groupRef || !groupRef.current) return;

    const carRoot = new THREE.Group();
    const bodyGroup = new THREE.Group();
    carRoot.add(bodyGroup);

    // ── 2. DETAILED BODY GEOMETRY ──────────────────────────────────
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 4.8), MAT.body());
    chassis.position.y = 0.6;
    chassis.castShadow = true;
    bodyGroup.add(chassis);

    const hood = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.2, 1.6), MAT.body());
    hood.position.set(0, 0.9, 1.55);
    bodyGroup.add(hood);

    const trunk = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.15, 1.2), MAT.body());
    trunk.position.set(0, 0.85, -1.8);
    bodyGroup.add(trunk);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.65, 2.2), MAT.cabin());
    cabin.position.set(0, 1.15, -0.3);
    bodyGroup.add(cabin);

    // Spoiler
    const spoilerWing = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.05, 0.5), MAT.body());
    spoilerWing.position.set(0, 1.15, -2.3);
    bodyGroup.add(spoilerWing);
    
    const spoilerLegL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), MAT.chrome());
    spoilerLegL.position.set(-0.9, 0.95, -2.3);
    bodyGroup.add(spoilerLegL);
    const spoilerLegR = spoilerLegL.clone();
    spoilerLegR.position.set(0.9, 0.95, -2.3);
    bodyGroup.add(spoilerLegR);

    // ── 3. REAL LIGHTING SYSTEM (HEADLIGHTS) ───────────────────────
    const createHeadlight = (xPos) => {
      const lightGroup = new THREE.Group();
      
      // Lens (Visual)
      const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.18), MAT.neonWhite());
      lens.position.set(xPos, 0.7, 2.41);
      bodyGroup.add(lens);

      // Real Light Source (Pancaran Lampu)
      const spotLight = new THREE.SpotLight(0xffffff, 25);
      spotLight.position.set(xPos, 0.7, 2.5);
      spotLight.target.position.set(xPos, 0, 10); // Arah lampu ke depan
      spotLight.angle = Math.PI / 6;
      spotLight.penumbra = 0.5;
      spotLight.distance = 15;
      
      bodyGroup.add(spotLight);
      bodyGroup.add(spotLight.target);
    };

    createHeadlight(-0.75);
    createHeadlight(0.75);

    // ── 4. ROAD GLARE & TAILLIGHTS ─────────────────────────────────
    // Taillights
    for(let i = -1; i <= 1; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.05), MAT.neonRed());
      bar.position.set(-0.7 + (i * 0.15), 0.7, -2.41);
      bodyGroup.add(bar);
      const barR = bar.clone();
      barR.position.set(0.7 + (i * 0.15), 0.7, -2.41);
      bodyGroup.add(barR);
    }

    // Kilauan Jalan (Road Glare) di bawah mobil
    const glareGeo = new THREE.PlaneGeometry(3, 6);
    const glareMat = new THREE.MeshBasicMaterial({
      color: 0xcc1a00,
      transparent: true,
      opacity: 0.15,
      map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/gradient.png') // Efek gradasi
    });
    const roadGlare = new THREE.Mesh(glareGeo, glareMat);
    roadGlare.rotation.x = -Math.PI / 2;
    roadGlare.position.y = 0.01; // Tipis di atas aspal
    bodyGroup.add(roadGlare);

    // ── 5. WHEELS & SYSTEM ─────────────────────────────────────────
    const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.45, 32);
    const rimGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.48, 6);
    const wheelPos = [{ x: -1.25, z: 1.6 }, { x: 1.25, z: 1.6 }, { x: -1.25, z: -1.6 }, { x: 1.25, z: -1.6 }];

    wheelPos.forEach(pos => {
      const wGroup = new THREE.Group();
      const tire = new THREE.Mesh(wheelGeo, MAT.rubber());
      tire.rotation.z = Math.PI / 2;
      const rim = new THREE.Mesh(rimGeo, MAT.chrome());
      rim.rotation.z = Math.PI / 2;
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.98, 0.47), MAT.neonWhite());
      tire.add(stripe);
      wGroup.add(tire); wGroup.add(rim);
      wGroup.position.set(pos.x, 0.48, pos.z);
      bodyGroup.add(wGroup);
      wheelsRef.current.push(tire);
    });

    carRef.current = bodyGroup;
    groupRef.current.add(carRoot);
    useCarStore.getState().setReady(true);

    let animId;
    const animate = () => {
      wheelsRef.current.forEach(w => { w.rotation.x += wheelSpeedRef.current; });
      animId = requestAnimationFrame(animate);
    };
    animate();

    idleTlRef.current = buildIdleTimeline(bodyGroup);
    idleTlRef.current.play();

    return () => {
      cancelAnimationFrame(animId);
      if (groupRef.current) groupRef.current.remove(carRoot);
    };
  }, [groupRef]);

  // ── 6. ANIMATION LOGIC (WITH RESET PROTECTION) ─────────────────
  useEffect(() => {
    const unsub = useCarStore.subscribe(
      (state) => state.currentAnimation,
      (animation) => {
        if (!carRef.current || !cameraRef.current) return;
        const body = carRef.current;
        const camera = cameraRef.current;

        if (activeTlRef.current) activeTlRef.current.kill();
        if (idleTlRef.current) idleTlRef.current.pause();

        const { pendingRoute, clearNavigation, setAnimation } = useCarStore.getState();

        const onComplete = () => {
          if (pendingRoute && navigate) navigate(pendingRoute);
          clearNavigation();
          setAnimation(ANIMATIONS.IDLE);
          wheelSpeedRef.current = 0.15;
          
          // Reset posisi & rotasi secara paksa ke titik tengah
          gsap.to(body.position, { x: 0, y: 0, z: 0, duration: 0.8, ease: "power2.out" });
          gsap.to(body.rotation, { x: 0, y: 0, z: 0, duration: 0.8, ease: "power2.out" });

          if (idleTlRef.current) idleTlRef.current.play();
        };

        gsap.killTweensOf(body.position);
        gsap.killTweensOf(body.rotation);

        switch (animation) {
          case ANIMATIONS.FORWARD:
            wheelSpeedRef.current = 0.8;
            activeTlRef.current = buildForwardTimeline(body, camera, onComplete);
            break;
          case ANIMATIONS.DRIFT_RIGHT:
          case ANIMATIONS.DRIFT_LEFT:
            wheelSpeedRef.current = 1.3;
            const side = animation === ANIMATIONS.DRIFT_RIGHT ? 'right' : 'left';
            activeTlRef.current = buildDriftTimeline(body, camera, side, onComplete);
            break;
          default:
            onComplete();
            break;
        }
        if (activeTlRef.current) activeTlRef.current.play();
      }
    );
    return () => unsub();
  }, [navigate, cameraRef]);

  return null;
}