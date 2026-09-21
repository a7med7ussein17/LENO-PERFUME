'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 1. إعداد الاتصال بـ Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const whatsappNumber = "9647751772000";

  // حالة المنتجات القادمة من الداتابيز
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [filterCategory, setFilterCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [zoomedImage, setZoomedImage] = useState(null);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 2. جلب المنتجات تلقائياً من Supabase عند فتح الصفحة
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('خطأ في جلب المنتجات:', error);
      } else if (data) {
        // تحويل بيانات Supabase لتوافق تصميمك
        const formattedProducts = data.map((item) => {
          // التعامل مع الصور (سواء كانت مصفوفة أو نص)
          let imageUrl = "https://via.placeholder.com/150";
          if (Array.isArray(item.images) && item.images.length > 0) {
            imageUrl = item.images[0];
          } else if (typeof item.images === 'string') {
            try {
              const parsed = JSON.parse(item.images);
              imageUrl = Array.isArray(parsed) ? parsed[0] : item.images;
            } catch {
              imageUrl = item.images;
            }
          }

          // التعامل مع الأحجام
          let parsedSizes = [];
          if (item.sizes) {
            parsedSizes = typeof item.sizes === 'string' ? JSON.parse(item.sizes) : item.sizes;
          } else {
            // سعر افتراضي في حال عدم وجود أحجام
            parsedSizes = [{ label: `${item.volume_ml || ''} مل`, price: item.price || item.original_price || 0 }];
          }

          return {
            id: item.id,
            name: item.name,
            category: item.category_id ? "Original" : "LENO", // أو تخصيص التصنيف حسب الحاجة
            badge: item.badge || null,
            image: imageUrl,
            sizes: parsedSizes
          };
        });

        setProducts(formattedProducts);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSizeIndex(0);
    setQuantity(1);
  };

  const addToCart = () => {
    if (!selectedProduct) return;
    const currentSize = selectedProduct.sizes[selectedSizeIndex] || { label: '', price: 0 };
    const cartItemId = `${selectedProduct.id}-${currentSize.label}`;
    
    const newItem = {
      cartItemId: cartItemId,
      name: selectedProduct.name,
      image: selectedProduct.image,
      sizeLabel: currentSize.label,
      price: currentSize.price,
      freeDelivery: currentSize.freeDelivery || false,
      quantity: quantity
    };

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return prevCart.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prevCart, newItem];
    });

    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const sendCartWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let text = `مرحباً LENO PERFUME 🌿\nأرغب بطلب المنتجات التالية:\n\n`;
    
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      const deliveryNote = item.freeDelivery ? " (توصيل مجاني 🚚)" : "";
      text += `${index + 1}. ${item.name}\n`;
      text += `- المقاس: ${item.sizeLabel}${deliveryNote}\n`;
      text += `- العدد: ${item.quantity}\n`;
      text += `- السعر: ${itemTotal.toLocaleString()} IQD\n\n`;
    });

    text += `ــــــــــــــــــــــــــــ\n`;
    text += `المجموع الكلي: ${cartTotalPrice.toLocaleString()} IQD`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = filterCategory === "الكل" || p.category === filterCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#fcfcfc', color: '#18181b', fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl', minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* شريط الملاحة */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: '1px solid #f4f4f5' }}>
        <div onClick={() => setIsMenuOpen(true)} style={{ cursor: 'pointer', color: '#3f3f46', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>

        <div style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '1px', color: '#18181b' }}>
          لـينـو
        </div>

        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', color: '#3f3f46' }}>
          <div onClick={() => setIsSearchOpen(!isSearchOpen)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
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

      {/* حقل البحث */}
      {isSearchOpen && (
        <div style={{ padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #e4e4e7' }}>
          <input
            type="text"
            placeholder="ابحث عن اسم العطر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d4d4d8', fontSize: '0.95rem', outline: 'none' }}
          />
        </div>
      )}

      {/* البانر */}
      <div style={{ backgroundColor: '#2d3732', color: '#fff', textAlign: 'center', padding: '40px 20px', margin: '10px 16px', borderRadius: '16px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', fontWeight: '800' }}>عطرك.. بصمتك التي لا تُنسى.</h1>
        <p style={{ fontSize: '0.9rem', color: '#e4e4e7', margin: 0 }}>اكتشف تشكيلة لينو الفاخرة الآن ➔</p>
      </div>

      {/* الفلترة */}
      <div style={{ padding: '0 16px', marginTop: '25px', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '1.3rem', margin: '0 0 15px 0', fontWeight: '800' }}>التسوق حسب المجموعة</h2>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {["الكل", "LENO", "Original"].map((cat) => (
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

      {/* عرض المنتجات */}
      <main style={{ padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#71717a' }}>
            جاري تحميل العطور... 🌿
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#71717a' }}>
            لا توجد عطور تطابق بحثك.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {filteredProducts.map((p) => (
              <div key={p.id} onClick={() => openProduct(p)} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f4f4f5', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {p.badge && (
                  <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#2d3732', color: '#fff', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', zIndex: 2 }}>
                    {p.badge}
                  </span>
                )}
                <div style={{ width: '100%', height: '180px', backgroundColor: '#f9f9f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: '700', color: '#18181b' }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#2d3732' }}>
                      {p.sizes && p.sizes[0] ? p.sizes[0].price.toLocaleString() : 0} IQD
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* نافذة تفاصيل العطر */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxHeight: '90vh', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px', overflowY: 'auto', direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '0.85rem', color: '#71717a' }}>تفاصيل العطر</span>
              <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div 
              onClick={() => setZoomedImage(selectedProduct.image)}
              style={{ width: '100%', height: '260px', borderRadius: '16px', backgroundColor: '#f9f9f9', overflow: 'hidden', marginBottom: '15px', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              <span style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem' }}>🔍 اضغط لتكبير الصورة</span>
            </div>

            <h2 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', fontWeight: '800' }}>{selectedProduct.name}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#2d3732' }}>
                {((selectedProduct.sizes[selectedSizeIndex]?.price || 0) * quantity).toLocaleString()} IQD
              </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: '#3f3f46' }}>اختر الحجم أو العرض</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedProduct.sizes.map((size, index) => (
                  <button key={index} onClick={() => setSelectedSizeIndex(index)} style={{ flex: 1, padding: '12px 8px', borderRadius: '8px', border: selectedSizeIndex === index ? '2px solid #2d3732' : '1px solid #e4e4e7', backgroundColor: selectedSizeIndex === index ? '#2d3732' : '#fff', color: selectedSizeIndex === index ? '#fff' : '#18181b', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}>
                    <div>{size.label}</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '2px', opacity: 0.8 }}>{size.price?.toLocaleString()} IQD</div>
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

      {/* باقي الأقسام والسلة والقائمة الجانبية... */}
      {/* (نفس تصميمك الأصلي بالكامل) */}
    </div>
  );
}
