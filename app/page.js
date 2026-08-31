'use client';
import { useState } from 'react';

export default function Home() {
  const whatsappNumber = "9647751772000"; // رقمك جاهز هنا

  // قائمة المنتجات
  const products = [
    {
      id: 1,
      name: "عطر التبغ الفرنسي",
      category: "تقسيم",
      badge: "", 
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80",
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
      badge: "Sale",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&q=80",
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
      badge: "New",
      image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500&q=80",
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
      sizes: [
        { label: "10 مل", price: 20000 },
        { label: "50 مل", price: 50000 }
      ]
    }
  ];

  // حالات (States) النظام
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [filterCategory, setFilterCategory] = useState("الكل");
  
  // حالات السلة (Cart)
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // حساب مجموع القطع في السلة
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  // حساب السعر الكلي للسلة
  const cartTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // فتح نافذة تفاصيل العطر
  const openProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSizeIndex(0);
    setQuantity(1);
  };

  // وظيفة إضافة العطر للسلة
  const addToCart = () => {
    if (!selectedProduct) return;
    const currentSize = selectedProduct.sizes[selectedSizeIndex];
    
    // تكوين منتج فريد (عن طريق دمج الآي دي مع الحجم)
    const cartItemId = `${selectedProduct.id}-${currentSize.label}`;
    
    const newItem = {
      cartItemId: cartItemId,
      name: selectedProduct.name,
      image: selectedProduct.image,
      sizeLabel: currentSize.label,
      price: currentSize.price,
      quantity: quantity
    };

    setCart(prevCart => {
      // إذا العطر موجود بنفس الحجم، نزيد الكمية فقط
      const existingItem = prevCart.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return prevCart.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      // إذا ما موجود، نضيفه كمنتج جديد للسلة
      return [...prevCart, newItem];
    });

    // إغلاق نافذة العطر بعد الإضافة
    setSelectedProduct(null);
    // نفتح السلة للمستخدم حتى يشوف شضاف
    setIsCartOpen(true);
  };

  // حذف عطر من السلة
  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  // إرسال طلب السلة بالكامل للواتساب
  const sendCartWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let text = `مرحباً LENO PERFUME 🌿\nأرغب بطلب المنتجات التالية:\n\n`;
    
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      text += `${index + 1}. ${item.name}\n`;
      text += `- المقاس: ${item.sizeLabel}\n`;
      text += `- العدد: ${item.quantity}\n`;
      text += `- السعر: ${itemTotal.toLocaleString()} IQD\n\n`;
    });

    text += `ــــــــــــــــــــــــــــ\n`;
    text += `المجموع الكلي: ${cartTotalPrice.toLocaleString()} IQD`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredProducts = filterCategory === "الكل" 
    ? products 
    : products.filter(p => p.category === filterCategory);

  return (
    <div style={{ backgroundColor: '#fcfcfc', color: '#18181b', fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl', minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* شريط الملاحة */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: '1px solid #f4f4f5' }}>
        
        <div style={{ cursor: 'pointer', color: '#3f3f46', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>

        <div style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '1px', color: '#18181b' }}>
          ليـونـو
        </div>

        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', color: '#3f3f46' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          {/* زر فتح السلة (العربة) */}
          <div onClick={() => setIsCartOpen(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartItemsCount > 0 && (
              <span style={{ position: 'absolute', top: '-5px', right: '-8px', backgroundColor: '#b91c1c', color: '#fff', fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartItemsCount}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* البانر */}
      <div style={{ backgroundColor: '#2d3732', color: '#fff', textAlign: 'center', padding: '40px 20px', margin: '10px 16px', borderRadius: '16px', backgroundSize: 'cover' }}>
        <h1 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', fontWeight: '800' }}>عطرك.. بصمتك التي لا تُنسى.</h1>
        <p style={{ fontSize: '0.9rem', color: '#e4e4e7', margin: 0 }}>اكتشف تشكيلة ليونو الفاخرة الآن ➔</p>
      </div>

      {/* الفلترة */}
      <div style={{ padding: '0 16px', marginTop: '25px', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '1.3rem', margin: '0 0 15px 0', fontWeight: '800' }}>التسوق حسب المجموعة</h2>
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

      {/* المنتجات */}
      <main style={{ padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {filteredProducts.map((p) => (
            <div key={p.id} onClick={() => openProduct(p)} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f4f4f5', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {p.badge && (
                <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#b91c1c', color: '#fff', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold', zIndex: 2 }}>
                  {p.badge}
                </span>
              )}
              <div style={{ width: '100%', height: '170px', backgroundColor: '#f9f9f9', overflow: 'hidden' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
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

      {/* نافذة تفاصيل العطر للإضافة للسلة */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxHeight: '90vh', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px', overflowY: 'auto', direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '0.85rem', color: '#71717a' }}>تفاصيل العطر</span>
              <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden', marginBottom: '15px' }}>
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h2 style={{ margin: '0 0 15px 0', fontSize: '1.4rem', fontWeight: '800' }}>{selectedProduct.name}</h2>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#2d3732', marginBottom: '20px' }}>
              {(selectedProduct.sizes[selectedSizeIndex].price * quantity).toLocaleString()} IQD
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: '#3f3f46' }}>مقاس العلبة</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedProduct.sizes.map((size, index) => (
                  <button key={index} onClick={() => setSelectedSizeIndex(index)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: selectedSizeIndex === index ? '2px solid #2d3732' : '1px solid #e4e4e7', backgroundColor: selectedSizeIndex === index ? '#2d3732' : '#fff', color: selectedSizeIndex === index ? '#fff' : '#18181b', fontWeight: 'bold', cursor: 'pointer' }}>
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#3f3f46' }}>العدد</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '40px', height: '40px', border: 'none', backgroundColor: '#f4f4f5', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                <span style={{ width: '45px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={{ width: '40px', height: '40px', border: 'none', backgroundColor: '#f4f4f5', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
              </div>
            </div>
            <button onClick={addToCart} style={{ width: '100%', backgroundColor: '#2d3732', color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
              إضافة إلى السلة 🛒
            </button>
          </div>
        </div>
      )}

      {/* السلة الجانبية (Cart Sidebar) */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', justifyContent: 'flex-start', direction: 'rtl' }}>
          <div style={{ width: '85%', maxWidth: '350px', backgroundColor: '#fff', height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e4e4e7', paddingBottom: '15px', marginBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>سلة المشتريات ({cartItemsCount})</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#71717a' }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#71717a', marginTop: '50px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛒</div>
                  <p>السلة فارغة حالياً</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.cartItemId} style={{ display: 'flex', gap: '12px', marginBottom: '15px', borderBottom: '1px solid #f4f4f5', paddingBottom: '15px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '65px', height: '65px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#18181b' }}>{item.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#52525b' }}>{item.sizeLabel}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2d3732' }}>{(item.price * item.quantity).toLocaleString()} IQD</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.8rem', color: '#71717a' }}>الكمية: {item.quantity}</span>
                          <button onClick={() => removeFromCart(item.cartItemId)} style={{ background: 'none', border: 'none', color: '#b91c1c', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}>حذف</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #e4e4e7', paddingTop: '15px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: '900', fontSize: '1.1rem', color: '#18181b' }}>
                  <span>المجموع الكلي:</span>
                  <span>{cartTotalPrice.toLocaleString()} IQD</span>
                </div>
                <button onClick={sendCartWhatsAppOrder} style={{ width: '100%', backgroundColor: '#2d3732', color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  إتمام الطلب (واتساب) 💬
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}

    </div>
  );
}
