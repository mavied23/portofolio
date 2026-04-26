import React from 'react';

export default function About() {
  return (
    <div style={{ color: 'white', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
        ABOUT <span style={{ color: '#cc1a00' }}>ME</span>
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '20px', lineHeight: '1.6' }}>
        The Tech-Driven Hustler <br/>
        Saya adalah mahasiswa Teknik Informatika tingkat akhir yang mendedikasikan 
        waktu di persimpangan antara teknologi, logistik, dan kewirausahaan. Dengan 
        pengalaman nyata sebagai owner dari SantapSambal, saya memahami bahwa teknologi 
        bukan hanya soal baris kode, tapi solusi untuk skalabilitas bisnis.
      </p>
    </div>
  );
}