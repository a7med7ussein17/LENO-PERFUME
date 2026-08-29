'use client';

export default function Home() {
  // اكتب رقم هاتفك مع رمز الدولة بدون + (مثال للعراق: 9647700000000)
  const whatsappNumber = "9647700000000";

  const products = [
    {
      id: 1,
      name: "عطر ليونو الملكي (LENO Royal)",
      price: "25,000 د.ع",
      type: "تركيب خاص",
      gender: "رجالي",
      rating: "5.0",
      desc: "تركيبة عطرية فخمة تمزج بين العود الملكي والعنبر، بثبات وفوحان يدوم لأكثر من 24 ساعة."
    },
    {
      id: 2,
      name: "ليونو بلاك عود (LENO Black Oud)",
      price: "30,000 د.ع",
      type: "تركيب خاص",
      gender: "للجنسين",
      rating: "4.9",
      desc: "نفحات غامضة وساحرة من الخشب النادر والبخور الفاخر، مناسب للمناسبات الرسمية."
    },
    {
      id: 3,
      name: "تقسيم ديور سوفاج إلكسير",
      price: "35,000 د.ع",
      type: "تقسيم نيش",
      gender: "رجالي",
      rating: "5.0",
      desc: "عينة 10 مل مأخوذة مباشرة من العلبة الأصلية لعشاق الفخامة والتميز."
    },
    {
      id: 4,
      name: "تقسيم باقارات روج 540",
      price: "40,000 د.ع",
      type: "تقسيم نيش",
      gender: "للجنسين",
      rating: "4.9",
      desc: "عينة 10 مل من العطر الفرنسي الأيقوني الشهير برائحة الياسمين والعنبر التوابلي."
    }
  ];

  const sendOrder = (productName) => {
    const message = encodeURIComponent(`مرحباً LENO PERFUME، أرغب بطلب: ${productName}`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090d16',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      direction: 'rtl',
      paddingBottom: '60px'
    }}>
      {/* الهيدر الفخم */}
      <header style={{
        textAlign: 'center',
        padding: '50px 20px 40px',
        background: 'radial-gradient(circle at top, #1e293b 0%, #090d16 100%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          fontSize: '0.8rem',
          letterSpacing: '3px',
          color: '#d4af37',
          fontWeight: 'bold',
          marginBottom: '8px',
          textTransform: 'uppercase'
        }}>
          ✨ Exclusive Perfume Collection ✨
        </div>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #fff 30%, #d4af37 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 10px 0',
          letterSpacing: '2px'
        }}>
          LENO PERFUME
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
          عالم التركيب الفاخر وتقسيم البراندات العالمية الأوريجينال
        </p>
      </header>

      {/* شبكة المنتجات */}
      <main style={{ maxWidth: '1100px', margin: '40px auto 0', padding: '0 20px' }}>
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          borderRight: '4px solid #d4af37',
          paddingRight: '12px'
        }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '700', color: '#fff' }}>
            تشكيلة العطور المختارة
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>طلب مباشر وسريع</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {products.map((p) => (
            <div key={p.id} style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
            }}>
              <div>
                {/* أوسمة العطر (تركيب/تقسيم + جنس العطر) */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    color: '#d4af37',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontWeight: 'bold'
                  }}>
                    {p.type}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    backgroundColor: '#1e293b',
                    color: '#cbd5e1',
                    border: '1px solid #334155',
                    padding: '4px 10px',
                    borderRadius: '20px'
                  }}>
                    {p.gender}
                  </span>
                </div>

                {/* مكان العطر */}
                <div style={{
                  height: '130px',
                  backgroundColor: '#0b0f19',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  marginBottom: '18px',
                  border: '1px dashed rgba(212, 175, 55, 0.2)',
                  fontSize: '3rem'
                }}>
                  🧪
                </div>

                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#fff', fontWeight: '700' }}>{p.name}</h3>

                <div style={{ color: '#f59e0b', fontSize: '0.85rem', marginBottom: '12px' }}>
                  ⭐ {p.rating} <span style={{ color: '#64748b' }}>(تقييم الزبائن)</span>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '20px' }}>
                  {p.desc}
                </p>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '16px'
                }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>السعر:</span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#d4af37' }}>{p.price}</span>
                </div>

                <button
                  onClick={() => sendOrder(p.name)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)'
                  }}
                >
                  اطلب عبر الواتساب 💬
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* الفوتر */}
      <footer style={{ textAlign: 'center', marginTop: '60px', color: '#475569', fontSize: '0.85rem' }}>
        © LENO PERFUME - جميع الحقوق محفوظة
      </footer>
    </div>
  );
}
