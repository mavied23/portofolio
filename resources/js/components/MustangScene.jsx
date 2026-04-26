/**
 * MustangScene.jsx
 *
 * THE persistent canvas. Placed outside <Outlet /> so it NEVER unmounts
 * during route transitions. Three.js setup lives here.
 *
 * Architecture note:
 *   We do NOT use React Three Fiber here to avoid an extra dependency.
 *   Pure Three.js gives us direct access to every object ref GSAP needs.
 *   If you prefer R3F, the pattern is identical — just wrap in <Canvas>
 *   and expose cameraRef via useThree().
 */
import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import MustangMesh from './MustangMesh';

// We create ONE renderer and inject it into the DOM imperatively.
// React only manages the <div> mount point.
export default function MustangScene() {
  const mountRef   = useRef(null);
  const sceneRef   = useRef(null);
  const cameraRef  = useRef(null);
  const rendererRef = useRef(null);
  const rafRef     = useRef(null);
  const meshGroupRef = useRef(null); // THREE.Group updated by MustangMesh
  const navigate   = useNavigate();

  // ── Called by MustangMesh when an animation completes ─────────
  const handleAnimationComplete = useCallback((route) => {
    navigate(route);
  }, [navigate]);

  // ── Bootstrap Three.js once ────────────────────────────────────
  useEffect(() => {
    const el = mountRef.current;
    const W  = el.clientWidth;
    const H  = el.clientHeight;

    // ── Scene ──────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080808);
    scene.fog = new THREE.FogExp2(0x080808, 0.022);
    sceneRef.current = scene;

    // ── Camera ─────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 300);
    camera.position.set(0, 2.8, 9);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // ── Renderer ───────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace  = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Lights ─────────────────────────────────────────────────
    // Ambient — soft fill
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Key light — warm, overhead driver's side
    const key = new THREE.DirectionalLight(0xfff0d0, 4.0);
    key.position.set(4, 10, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far  = 60;
    key.shadow.camera.left = key.shadow.camera.bottom = -12;
    key.shadow.camera.right = key.shadow.camera.top   =  12;
    scene.add(key);

    // Rim light — cool blue from rear
    const rim = new THREE.DirectionalLight(0x2255cc, 1.8);
    rim.position.set(-6, 4, -8);
    scene.add(rim);

    // Ground bounce — warm fill from below
    const bounce = new THREE.PointLight(0xff6600, 0.4, 12);
    bounce.position.set(0, -0.5, 0);
    scene.add(bounce);

    // ── Ground plane ───────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120, 60, 60),
      new THREE.MeshStandardMaterial({
        color: 0x0d0d0d,
        roughness: 0.85,
        metalness: 0.05,
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid lines on ground (subtle, cinematic)
    const grid = new THREE.GridHelper(80, 40, 0x222222, 0x181818);
    grid.position.y = 0.001;
    scene.add(grid);

    // ── Placeholder mesh group (managed by MustangMesh) ────────
    // We inject it into the scene here and pass the ref down
    const group = new THREE.Group();
    scene.add(group);
    meshGroupRef.current = group;

    // ── Render loop ────────────────────────────────────────────
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize handler ─────────────────────────────────────────
    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      {/* WebGL mount point — fills the screen */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/*
        MustangMesh is a "logic component" — no DOM output.
        It receives the camera ref so GSAP timelines can animate it.
        It injects its THREE.Group into meshGroupRef via useImperativeHandle
        (see MustangMesh for details).
      */}
      <MustangMesh
        cameraRef={cameraRef}
        sceneRef={sceneRef}
        groupRef={meshGroupRef}
        onAnimationComplete={handleAnimationComplete}
      />
    </>
  );
}