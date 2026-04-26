import React from 'react';

export default function About() {
  return (
    <div style={{ color: 'white', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
        TECHNICAL <span style={{ color: '#cc1a00' }}>SKILLS</span>
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '20px', lineHeight: '1.6' }}>
        Core Development<br/>
        Frontend Development: Mahir dalam membangun antarmuka web interaktif menggunakan React.js dan Tailwind CSS.
        Backend Systems: Berpengalaman mengelola logika server dan API menggunakan framework Laravel.
        Database Management: Mampu melakukan perancangan dan optimasi query data menggunakan MySQL.
        3D Web Graphics: Memiliki kemampuan dasar dalam mengimplementasikan grafis 3D interaktif di browser menggunakan Three.js dan GSAP untuk animasi..
      </p>
    </div>
  );
}