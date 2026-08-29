'use client';

export default function Home() {
  // اكتب رقم هاتفك مع رمز الدولة بدون + (مثال للعراق: 9647700000000)
  const whatsappNumber = "9647700000000";

  const products = [
    { id: 1, name: "عطر ليونو الملكي", price: "25,000 د.ع", type: "تركيب خاص", desc: "ثبات عالي وتأثير فوّاح يدوم طويلاً." },
    { id: 2, name: "تقسيم براند عالمي", price: "35,000 د.ع", type: "عطور نيش", desc: "عينة 10مل من العطر الأصلي مباشرة." }
  ];

  const sendOrder = (productName) => {
    const message = encodeURIComponent(`مرحباً LENO PERFUME، أرغب بطلب: ${productName}`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', fontFamily: 'sans-serif', direction: 'rtl', padding: '20px' }}>
      <header style={{ textAlign: 'center', padding: '30px 0', borderBottom: '1px solid #334155' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#f59e0b', margin: 0, letterSpacing: '2px' }}>LENO PERFUME</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>متخصصون في تركيب العطور وتقسيم البراندات العالمية</p>
      </header>

      <main style={{ maxWidth: '900px', margin: '30px auto' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: '#f8fafc' }}>المنتجات المتاحة</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {products.map((p) => (
            <div key={p.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.8rem', backgroundColor: '#334155', color: '#f59e0b', padding: '4px 8px', borderRadius: '4px' }}>{p.type}</span>
                <h3 style={{ margin: '15px 0 5px 0', fontSize: '1.3rem' }}>{p.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px' }}>{p.desc}</p>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '15px' }}>{p.price}</div>
                <button
                  onClick={() => sendOrder(p.name)}
                  style={{ width: '100%', backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  اطلب عبر الواتساب 💬
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
