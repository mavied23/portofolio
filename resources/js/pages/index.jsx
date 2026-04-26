/**
 * pages/index.jsx  v3
 * Gunakan inline styles sepenuhnya — tidak bergantung Tailwind.
 * Ini memastikan konten selalu terlihat even jika CSS gagal load.
 */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

function useFadeUp(ref, delay = 0.15) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.55, delay, ease: 'power2.out' }
    );
    return () => gsap.killTweensOf(el);
  }, []);
}

// Shared styles
const S = {
  tag: {
    fontFamily: 'monospace', fontSize: '9px',
    letterSpacing: '0.4em', textTransform: 'uppercase',
    color: 'rgba(204,26,0,0.6)', marginBottom: '12px', display: 'block',
  },
  title: {
    fontSize: '2.2rem', fontWeight: 100, lineHeight: 1.1,
    letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.9)',
    marginBottom: '16px', margin: '0 0 16px',
  },
  divider: {
    width: '32px', height: '1px',
    background: 'rgba(204,26,0,0.4)', margin: '20px 0',
  },
  body: {
    fontSize: '13px', color: 'rgba(255,255,255,0.4)',
    lineHeight: 1.7, fontWeight: 300, maxWidth: '380px', margin: 0,
  },
  accent: { color: 'rgba(204,26,0,0.8)', fontStyle: 'normal' },
};

export function HomePage() {
  const ref = useRef(null);
  useFadeUp(ref, 0.2);
  return (
    <div ref={ref} style={{ opacity: 0 }}>
      <span style={S.tag}>Portfolio — 2025</span>
      <h1 style={S.title}>
        Built for<br />
        those who<br />
        <em style={S.accent}>push limits.</em>
      </h1>
      <div style={S.divider} />
      <p style={S.body}>
        Navigate to feel the machine respond.
        Every link is a manoeuvre.
      </p>
    </div>
  );
}

export function AboutPage() {
  const ref = useRef(null);
  useFadeUp(ref, 0.25);
  const techs = ['Laravel 13', 'Three.js', 'GSAP 3', 'React'];
  return (
    <div ref={ref} style={{ opacity: 0 }}>
      <span style={S.tag}>01 — About</span>
      <h1 style={S.title}>Full-Stack<br />Creative Dev.</h1>
      <div style={S.divider} />
      <p style={S.body}>
        I build interfaces that move. Specialising in high-performance
        web experiences, 3D animation, and the Laravel infrastructure
        that ships them.
      </p>
      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxWidth: '240px' }}>
        {techs.map(t => (
          <div key={t} style={{
            fontFamily: 'monospace', fontSize: '9px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: '8px 12px',
          }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

export function ProjectsPage() {
  const ref = useRef(null);
  useFadeUp(ref, 0.25);
  const projects = [
    { id: '01', name: 'Velocity UI',  desc: 'Motion design system' },
    { id: '02', name: 'Apex CMS',     desc: 'Headless Laravel CMS' },
    { id: '03', name: 'Grid Zero',    desc: 'WebGL data visualiser' },
  ];
  return (
    <div ref={ref} style={{ opacity: 0 }}>
      <span style={S.tag}>02 — Projects</span>
      <h1 style={S.title}>Selected<br />Work.</h1>
      <div style={S.divider} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {projects.map(p => (
          <div key={p.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px', marginBottom: '16px',
          }}>
            <div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', fontWeight: 300, margin: '0 0 4px' }}>{p.name}</p>
              <p style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', margin: 0 }}>{p.desc}</p>
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.15)' }}>{p.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkillsPage() {
  const ref = useRef(null);
  useFadeUp(ref, 0.25);
  const stacks = [
    { label: 'Backend',   items: ['Laravel', 'PHP 8.3', 'PostgreSQL'] },
    { label: 'Frontend',  items: ['React', 'Vite', 'Tailwind CSS'] },
    { label: 'Animation', items: ['Three.js', 'GSAP', 'WebGL'] },
  ];
  return (
    <div ref={ref} style={{ opacity: 0 }}>
      <span style={S.tag}>03 — Skills</span>
      <h1 style={S.title}>The Stack.</h1>
      <div style={S.divider} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {stacks.map(s => (
          <div key={s.label}>
            <p style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(204,26,0,0.5)', marginBottom: '8px', margin: '0 0 8px' }}>{s.label}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {s.items.map(item => (
                <span key={item} style={{
                  fontFamily: 'monospace', fontSize: '10px',
                  color: 'rgba(255,255,255,0.35)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  padding: '4px 10px',
                }}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContactPage() {
  const ref = useRef(null);
  useFadeUp(ref, 0.25);
  return (
    <div ref={ref} style={{ opacity: 0 }}>
      <span style={S.tag}>04 — Contact</span>
      <h1 style={S.title}>
        Let's build<br />something<br />
        <em style={S.accent}>fast.</em>
      </h1>
      <div style={S.divider} />
      <p style={S.body}>Available for freelance work. I respond within 24 hours.</p>
      <div style={{ marginTop: '24px' }}>
        <a href="mailto:hello@yourdomain.com" style={{
          fontFamily: 'monospace', fontSize: '11px',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
          textDecoration: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          paddingBottom: '2px',
        }}>
          hello@yourdomain.com
        </a>
      </div>
    </div>
  );
}