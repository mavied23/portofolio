import React from 'react';

export default function About() {
  return (
    <div style={{ color: 'white', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
        MY <span style={{ color: '#cc1a00' }}>PROJECTS</span>
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '20px', lineHeight: '1.6' }}>
        SantapSambal E-Commerce Platform <br/>
        Deskripsi: Membangun ekosistem digital untuk brand kuliner lokal "SantapSambal", mencakup website pemesanan dan manajemen stok.

Tech Stack: React.js untuk antarmuka pengguna dan Laravel untuk manajemen data pesanan.

Value: Transformasi bisnis kuliner tradisional ke arah digital untuk menjangkau pasar yang lebih luas.
      </p>
    </div>
  );
}