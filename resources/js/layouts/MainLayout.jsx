import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import MustangMesh from '../components/MustangMesh';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const groupRef  = useRef(null);
  const navigate  = useNavigate();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    // ── 1. SCENE ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a22); 
    scene.fog = new THREE.FogExp2(0x1a1a22, 0.012);

    // ── 2. CAMERA ──
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 500);
    camera.position.set(0, 3.2, 10);
    camera.lookAt(0, 0.8, 0);
    cameraRef.current = camera;

    // ── 3. RENDERER ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    // Masukkan canvas ke dalam div ref, bukan document.body langsung
    containerRef.current.appendChild(renderer.domElement);

    // ── 4. LIGHTING ──
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const sun = new THREE.DirectionalLight(0xffffff, 4.0);
    sun.position.set(5, 15, 7.5);
    scene.add(sun);

    const lightLeft = new THREE.PointLight(0x00ffff, 20, 50);
    lightLeft.position.set(-10, 5, 5);
    scene.add(lightLeft);

    const lightRight = new THREE.PointLight(0xff00ff, 20, 50);
    lightRight.position.set(10, 5, 5);
    scene.add(lightRight);

    // ── 5. ROAD ──
    const grid = new THREE.GridHelper(400, 80, 0xff0055, 0x333344);
    scene.add(grid);

    // ── 6. CAR GROUP ──
    const carGroup = new THREE.Group();
    scene.add(carGroup);
    groupRef.current = carGroup;

    setIsReady(true);

    // ── 7. LOOP ──
    let frameId;
    const animate = () => {
      grid.position.z += 0.85;
      if (grid.position.z > 10) grid.position.z = 0;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a22', overflow: 'hidden' }}>
      {/* Container untuk Canvas Three.js */}
      <div ref={containerRef} style={{ position: 'fixed', inset: 0, zIndex: 0 }} />

      {/* Render Mobil */}
      {isReady && (
        <MustangMesh 
          groupRef={groupRef} 
          cameraRef={cameraRef} 
          navigate={navigate} 
        />
      )}

      {/* UI Overlay */}
      <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none', height: '100%' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <Navbar />
        </div>
        <main style={{ 
          height: 'calc(100vh - 80px)', 
          display: 'flex', 
          alignItems: 'flex-end', 
          padding: '0 50px 80px' 
        }}>
          <div style={{ pointerEvents: 'auto', width: '100%', maxWidth: '600px' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}