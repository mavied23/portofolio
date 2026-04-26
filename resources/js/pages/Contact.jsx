import React from 'react';

export default function Contact() {
  return (
    <div style={{ color: 'white', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
        CONTACT <br/><span style={{ color: '#cc1a00' }}>Reza Mavied Kuswara</span>
      </h1>
      <p>Hubungi saya untuk kolaborasi atau diskusi teknologi:</p>
      <a href="mailto:rezamavid3@gmail.com" style={{ color: '#cc1a00', textDecoration: 'none', border: '1px solid #cc1a00', padding: '10px 20px', display: 'inline-block', marginTop: '10px' }}>
        SEND_MESSAGE
      </a>
    </div>
  );
}