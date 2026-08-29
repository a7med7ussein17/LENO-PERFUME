'use client';
import { useState } from 'react';

export default function Home() {
  const whatsappNumber = "9647700000000"; // اكتب رقم هاتفك مع رمز الدولة بدون +

  // قائمة المنتجات مع الخيارات (الحجوم والأسعار)
  const products = [
    {
      id: 1,
      name: "عطر التبغ الفرنسي",
      category: "تقسيم",
      badge: "الأكثر مبيعاً",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80",
      rating: "4.9",
      reviews: "18",
      sizes: [
        { label: "5 مل", price: 10000 },
        { label: "10 مل", price: 18000 },
        { label: "50 مل", price: 45000 }
      ]
    },
    {
      id: 2,
      name: "عطر نيرو (Nero)",
      category: "تركيب",
      badge: "أوكازيون",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&q=80",
      rating: "5.0",
      reviews: "24",
      sizes: [
        { label: "5 مل", price: 8000 },
        { label: "10 مل", price: 15000 },
        { label: "50 مل", price: 35000 }
      ]
    },
    {
      id: 3,
      name: "كينج توباكو",
      category: "تركيب",
      badge: "جديد",
      image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500&q=80",
      rating: "4.8",
      reviews: "9",
      sizes: [
        { label: "5 مل", price: 6000 },
        { label: "10 مل", price: 12000 },
        { label: "50 مل", price: 30000 }
      ]
    },
    {
      id: 4,
      name: "إيمرالد سول دايموند",
      category: "تقسيم",
      badge: "",
      image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&q=80",
      rating: "5.0",
      reviews: "15",
      sizes: [
        { label: "10 مل", price: 20000 },
        { label: "50 مل", price: 50000 }
      ]
    }
  ];

  // حالات النافذة التفاعلية (Modal)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [filterCategory, setFilterCategory] = useState("الكل");

  // فتح نافذة تفاصيل العطر
  const openProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSizeIndex(0);
    setQuantity(1);
  };

  // إرسال الطلب للواتساب
  const sendWhatsAppOrder = () => {
    if (!selectedProduct) return;
    const currentSize = selectedProduct.sizes[selectedSizeIndex];
    const totalPrice = (currentSize.price * quantity).toLocaleString();

    const text = `مرحباً LENO PERFUME 🌿
أرغب بطلب:
- العطر: ${selectedProduct.name}
- المقاس: ${currentSize.label}
- العدد: ${quantity}
- السعر الإجمالي: ${totalPrice} IQD`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // تصفية المنتجات
  const filteredProducts = filterCategory === "الكل" 
    ? products 
    : products.filter(p => p.category === filterCategory);

  return (
    <div style={{ backgroundColor: '#fcfcfc', color: '#18181b', fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl', minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* شريط الملاحة العلوية مثل ياقوت */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#fff', borderBottom: '1px solid #f4f4f5', sticky: 'top', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: '1.2rem', cursor: 'pointer' }}>☰</div>
        <div style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '2px', color: '#27272a' }}>ليـونـو</div>
        <div style={{ display: 'flex', gap: '15px', fontSize: '1.2rem' }}>
          <span>🔍</span>
          <span>🛍️</span>
        </div>
      </nav>

      {/* البانر الرئيسي */}
      <div style={{ backgroundColor: '#2d3732', color: '#fff', textAlign: 'center', padding: '40px 20px', margin: '10px 16px', borderRadius: '16px', backgroundSize: 'cover' }}>
        <h1 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', fontWeight: '800' }}>خصم اليوم. ندم الغد.</h1>
        <p style={{ fontSize: '0.9rem', color: '#e4e4e7', margin: 0 }}>تسوق تشكيلة ليونو الفاخرة الآن ➔</p>
      </div>

      {/* شريط الفلترة */}
      <div style={{ padding: '0 16px', marginTop: '25px', marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
          <h2 style={{ fontSize: '1.3rem', margin: 0, fontWeight: '800' }}>التسوق حسب المجموعة</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {["الكل", "تركيب", "تقسيم"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                border: filterCategory === cat ? 'none' : '1px solid #e4e4e7',
                backgroundColor: filterCategory === cat ? '#2d3732' : '#fff',
                color: filterCategory === cat ? '#fff' : '#52525b',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* شبكة العرض بخانتين (2 Columns Grid) مثل موقع ياقوت */}
      <main style={{ padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => openProduct(p)}
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #f4f4f5',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* شارة أوكازيون / جديد */}
              {p.badge && (
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: '#b91c1c',
                  color: '#fff',
                  fontSize: '0.7rem',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  zIndex: 2
                }}>
                  {p.badge}
                </span>
              )}

              {/* صورة العطر */}
              <div style={{ width: '100%', height: '170px', backgroundColor: '#f9f9f9', overflow: 'hidden' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* تفاصيل العطر تحت الصورة */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '700', color: '#18181b' }}>{p.name}</h3>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#2d3732' }}>
                  {p.sizes[0].price.toLocaleString()} IQD
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* النافذة التفاعلية للطلب وتحديد الحجم (Modal) */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#fff',
            width: '100%',
            maxHeight: '90vh',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '20px',
            overflowY: 'auto',
            direction: 'rtl',
            animation: 'slideUp 0.3s ease-out'
          }}>
            {/* زر إغلاق النافذة */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '0.85rem', color: '#71717a' }}>تفاصيل العطر</span>
              <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>

            {/* صورة العطر الكبيرة بالداخل */}
            <div style={{ width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden', marginBottom: '15px' }}>
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h2 style={{ margin: '0 0 6px 0', fontSize: '1.4rem', fontWeight: '800' }}>{selectedProduct.name}</h2>
            
            {/* التقييم */}
            <div style={{ fontSize: '0.85rem', color: '#71717a', marginBottom: '15px' }}>
              ⭐⭐⭐⭐⭐ {selectedProduct.rating} <span style={{ textDecoration: 'underline' }}>({selectedProduct.reviews} مراجعة)</span>
            </div>

            {/* السعر الديناميكي المتغير */}
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#2d3732', marginBottom: '20px' }}>
              {(selectedProduct.sizes[selectedSizeIndex].price * quantity).toLocaleString()} IQD
            </div>

            {/* اختيار المقاس / الحجم */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: '#3f3f46' }}>مقاس العلبة</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedProduct.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSizeIndex(index)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: selectedSizeIndex === index ? '2px solid #2d3732' : '1px solid #e4e4e7',
                      backgroundColor: selectedSizeIndex === index ? '#2d3732' : '#fff',
                      color: selectedSizeIndex === index ? '#fff' : '#18181b',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* عداد الـ (+ / -) للكمية */}
            <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#3f3f46' }}>العدد</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '40px', height: '40px', border: 'none', backgroundColor: '#f4f4f5', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ width: '45px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '40px', height: '40px', border: 'none', backgroundColor: '#f4f4f5', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* زر أضف للسلة والطلب عبر الواتساب */}
            <button
              onClick={sendWhatsAppOrder}
              style={{
                width: '100%',
                backgroundColor: '#2d3732',
                color: '#fff',
                border: 'none',
                padding: '16px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(45, 55, 50, 0.3)'
              }}
            >
              شراء الآن (عبر الواتساب) 💬
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
