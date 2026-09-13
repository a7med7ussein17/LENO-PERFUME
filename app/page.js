'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 👈 تأكد من وضع بيانات Supabase الخاصة بك هنا
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// مكون نموذج إضافة عطر جديد (مدمج ومحمّي)
function AddProductForm({ onProductAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const ADMIN_PIN = "1772"; // 👈 غير هذا الرمز السري لخيارك الخاص

  const [name, setName] = useState('');
  const [category, setCategory] = useState('LENO');
  const [badge, setBadge] = useState('');
  const [image, setImage] = useState('');
  
  const [size1Label, setSize1Label] = useState('10 مل');
  const [size1Price, setSize1Price] = useState('');
  const [size1Free, setSize1Free] = useState(false);

  const [size2Label, setSize2Label] = useState('30 مل');
  const [size2Price, setSize2Price] = useState('');
  const [size2OriginalPrice, setSize2OriginalPrice] = useState('');
  const [size2Free, setSize2Free] = useState(true);

  const handleOpenForm = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    const inputPin = prompt("أدخل الرمز السري لوحة التحكم:");
    if (inputPin === ADMIN_PIN) {
      setIsOpen(true);
    } else if (inputPin !== null) {
      alert("الرمز السري غير صحيح!");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !image || !size1Price) {
      alert('الرجاء كتابة اسم العطر، اختيار صورة، وإضافة سعر واحد على الأقل!');
      return;
    }

    setLoading(true);

    const sizes = [
      {
        label: size1Label,
        price: Number(size1Price),
        originalPrice: null,
        freeDelivery: size1Free
      }
    ];

    if (size2Price) {
      sizes.push({
        label: size2Label,
        price: Number(size2Price),
        originalPrice: size2OriginalPrice ? Number(size2OriginalPrice) : null,
        freeDelivery: size2Free
      });
    }

    const newProduct = {
      name,
      category,
      badge: badge || null,
      image,
      sizes
    };

    // إرسال البيانات إلى Supabase
    const { data, error } = await supabase.from('products').insert([newProduct]).select();

    if (error) {
      alert("حدث خطأ أثناء الإضافة: " + error.message);
    } else {
      alert("تمت إضافة العطر إلى Supabase بنجاح! 🎉");
      if (onProductAdded && data) onProductAdded(data[0]);
      setName('');
      setBadge('');
      setImage('');
      setSize1Price('');
      setSize2Price('');
      setSize2OriginalPrice('');
      setIsOpen(false);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '0 16px', marginBottom: '20px', direction: 'rtl' }}>
      <button 
        onClick={handleOpenForm}
        style={{
          width: '100%',
          backgroundColor: '#2d3732',
          color: '#fff',
          padding: '14px',
          borderRadius: '12px',
          border: 'none',
          fontWeight: 'bold',
          fontSize: '0.95rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          gap: '8px'
        }}
      >
        <span>{isOpen ? 'إغلاق لوحة الإضافة ✕' : '🔒 إضافة عطر جديد (للمشرف)'}</span>
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e4e4e7', marginTop: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#18181b' }}>بيانات العطر الجديد</h3>
          
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>اسم العطر</label>
            <input 
              type="text" 
              placeholder="مثال: Sauvage - Dior" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d4d4d8', outline: 'none' }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>التصنيف</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d4d4d8', backgroundColor: '#fff' }}>
                <option value="LENO">LENO</option>
                <option value="Original">Original</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>الشارة (Badge)</label>
              <input 
                type="text" 
                placeholder="مثال: الأكثر مبيعاً" 
                value={badge} 
                onChange={(e) => setBadge(e.target.value)} 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d4d4d8', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>صورة العطر (اختر من الجهاز)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d4d4d8', backgroundColor: '#f9f9f9' }}
              required
            />
            {image && (
              <div style={{ marginTop: '8px', textAlign: 'center' }}>
                <img src={image} alt="معاينة" style={{ height: '80px', borderRadius: '8px', objectFit: 'contain' }} />
              </div>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f4f4f5', margin: '15px 0' }} />

          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2d3732' }}>الحجم الأول:</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
              <input type="text" placeholder="الحجم (10 مل)" value={size1Label} onChange={(e) => setSize1Label(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #d4d4d8' }} />
              <input type="number" placeholder="السعر (IQD)" value={size1Price} onChange={(e) => setSize1Price(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #d4d4d8' }} required />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2d3732' }}>الحجم الثاني (اختياري):</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
              <input type="text" placeholder="الحجم (30 مل)" value={size2Label} onChange={(e) => setSize2Label(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #d4d4d8' }} />
              <input type="number" placeholder="السعر" value={size2Price} onChange={(e) => setSize2Price(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #d4d4d8' }} />
              <input type="number" placeholder="قبل الخصم" value={size2OriginalPrice} onChange={(e) => setSize2OriginalPrice(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #d4d4d8' }} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', backgroundColor: '#166534', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'جاري الحفظ في الداتابيز...' : 'حفظ وإضافة للمتجر 🚀'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function Home() {
  const whatsappNumber = "9647751772000";

  const [products, setProducts] = useState([]);
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

  // جلب العطور تلقائياً من Supabase عند فتح الموقع
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        setProducts(data);
      }
    }
    fetchProducts();
  }, []);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleAddNewProduct = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSizeIndex(0);
    setQuantity(1);
  };

  const addToCart = () => {
    if (!selectedProduct) return;
    const currentSize = selectedProduct.sizes[selectedSizeIndex];
    const cartItemId = `${selectedProduct.id}-${currentSize.label}`;
    
    const newItem = {
      cartItemId,
      name: selectedProduct.name,
      image: selectedProduct.image,
      sizeLabel: currentSize.label,
      price: currentSize.price,
      freeDelivery: currentSize.freeDelivery,
      quantity
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
      text += `${index + 1}. ${item.name}\n- المقاس: ${item.sizeLabel}${deliveryNote}\n- العدد: ${item.quantity}\n- السعر: ${itemTotal.toLocaleString()} IQD\n\n`;
    });
    text += `ــــــــــــــــــــــــــــ\nالمجموع الكلي: ${cartTotalPrice.toLocaleString()} IQD`;

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
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #f4f4f5' }}>
        <div onClick={() => setIsMenuOpen(true)} style={{ cursor: 'pointer', color: '#3f3f46' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '1px' }}>لـينـو</div>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
          <div onClick={() => setIsSearchOpen(!isSearchOpen)} style={{ cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <div onClick={() => setIsCartOpen(true)} style={{ cursor: 'pointer', position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            {cartItemsCount > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-8px', backgroundColor: '#b91c1c', color: '#fff', fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartItemsCount}</span>}
          </div>
        </div>
      </nav>

      {/* حقل البحث */}
      {isSearchOpen && (
        <div style={{ padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #e4e4e7' }}>
          <input type="text" placeholder="ابحث عن اسم العطر..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d4d4d8', fontSize: '0.95rem', outline: 'none' }} />
        </div>
      )}

      {/* البانر */}
      <div style={{ backgroundColor: '#2d3732', color: '#fff', textAlign: 'center', padding: '40px 20px', margin: '10px 16px', borderRadius: '16px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', fontWeight: '800' }}>عطرك.. بصمتك التي لا تُنسى.</h1>
        <p style={{ fontSize: '0.9rem', color: '#e4e4e7', margin: 0 }}>اكتشف تشكيلة لينو الفاخرة الآن ➔</p>
      </div>

      {/* لوحة الإضافة للمشرف (محمية بـ PIN) */}
      <AddProductForm onProductAdded={handleAddNewProduct} />

      {/* الفلترة */}
      <div style={{ padding: '0 16px', marginTop: '10px', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '1.3rem', margin: '0 0 15px 0', fontWeight: '800' }}>التسوق حسب المجموعة</h2>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {["الكل", "LENO", "Original"].map((cat) => (
            <button key={cat} onClick={() => setFilterCategory(cat)} style={{ padding: '8px 18px', borderRadius: '20px', border: filterCategory === cat ? 'none' : '1px solid #e4e4e7', backgroundColor: filterCategory === cat ? '#2d3732' : '#fff', color: filterCategory === cat ? '#fff' : '#52525b', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* عرض المنتجات */}
      <main style={{ padding: '0 16px' }}>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#71717a' }}>لا توجد عطور تطابق بحثك.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {filteredProducts.map((p) => (
              <div key={p.id} onClick={() => openProduct(p)} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f4f4f5', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {p.badge && <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#2d3732', color: '#fff', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', zIndex: 2 }}>{p.badge}</span>}
                <div style={{ width: '100%', height: '180px', backgroundColor: '#f9f9f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: '700', color: '#18181b' }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#2d3732' }}>
                      {p.sizes?.[0]?.price?.toLocaleString()} IQD
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* نافذة التفاصيل، Lightbox، والسلة كما هي... */}
    </div>
  );
}
