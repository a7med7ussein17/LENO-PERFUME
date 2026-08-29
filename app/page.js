'use client';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', fontFamily: 'sans-serif', direction: 'rtl', padding: '20px' }}>
      <header style={{ textAlign: 'center', padding: '40px 0', borderBottom: '1px solid #334155' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#f59e0b', margin: 0 }}>LENO PERFUME</h1>
        <p style={{ color: '#94a3b8', marginTop: '10px' }}>متجر إلكتروني متكامل متخصص في تركيب العطور وتقسيم البراندات العالمية</p>
      </header>

      <main style={{ maxWidth: '800px', margin: '40px auto', display: 'grid', gap: '20px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', textAlign: 'center' }}>
          <h2 style={{ color: '#f8fafc' }}>عروض العطور المميزة</h2>
          <p style={{ color: '#cbd5e1' }}>تصفح تشكيلتنا الخاصة من تركيبات العطور الفاخرة.</p>
          <button style={{ backgroundColor: '#f59e0b', color: '#000', fontWeight: 'bold', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '15px' }}>
            تصفح المنتجات
          </button>
        </div>
      </main>
    </div>
  );
}
