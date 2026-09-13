'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const whatsappNumber = "9647751772000";

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Creed Aventus (كريد أفينتوس)",
      category: "LENO",
      badge: "توصيل مجاني لـ 30ml", 
      image: "https://iili.io/n3JiY4S.jpg",
      sizes: [
        { label: "10 مل", price: 5000, originalPrice: null, freeDelivery: false },
        { label: "30 مل", price: 12000, originalPrice: 15000, freeDelivery: true }
      ]
    },
    {
      id: 2,
      name: "Imagination - Louis Vuitton (إيماجينشين)",
      category: "LENO",
      badge: "توصيل مجاني لـ 30ml", 
      image: "https://iili.io/n3JOfqb.jpg",
      sizes: [
        { label: "10 مل", price: 10000, originalPrice: null, freeDelivery: false },
        { label: "30 مل", price: 23000, originalPrice: 25000, freeDelivery: true }
      ]
    },
    {
      id: 3,
      name: "مجموعة التوباكو من إبراق",
      category: "Original",
      badge: "Original 100% ✨", 
      image: "https://iili.io/nqnsfvp.jpg",
      sizes: [
        { label: "قطعة واحدة (20 مل)", price: 15000, originalPrice: null, freeDelivery: false },
        { label: "المجموعة كاملة", price: 85000, originalPrice: null, freeDelivery: true }
      ]
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [filterCategory, setFilterCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // بيانات لوحة التحكم
  const ADMIN_PIN = "1234";
  const [name, setName] = useState('');
  const [category, setCategory] = useState('LENO');
  const [badge, setBadge] = useState('');
  const [image, setImage] = useState('');
  const [size1Label, setSize1Label] = useState('10 مل');
  const [size1Price, setSize1Price] = useState('');
  const [size2Label, setSize2Label] = useState('30 مل');
  const [size2Price, setSize2Price] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {}
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

  const handleOpenAdminFromMenu = () => {
    setIsMenuOpen(false);
    const inputPin = prompt("أدخل الرمز السري لوحة التحكم:");
    if (inputPin === ADMIN_PIN) {
      setIsAdminOpen(true);
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !image || !size1Price) {
      alert('يرجى ملء المعلومات الأساسية!');
      return;
    }

    setLoading(true);
    const sizes = [{ label: size1Label, price: Number(size1Price), freeDelivery: false }];
    if (size2Price) sizes.push({ label: size2Label, price: Number(size2Price), freeDelivery: true });

    const newProduct = { name, category, badge: badge || null, image, sizes };

    try {
      const { data, error } = await supabase.from('products').insert([newProduct]).select();
      if (!error && data) {
        setProducts([data[0], ...products]);
      } else {
        setProducts([{ ...newProduct, id: Date.now() }, ...products]);
      }
    } catch (err) {
      setProducts([{ ...newProduct, id: Date.now() }, ...products]);
    }

    alert("تمت الإضافة بنجاح! 🎉");
    setName(''); setBadge(''); setImage(''); setSize1Price(''); setSize2Price('');
    setIsAdminOpen(false);
    setLoading(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = filterCategory === "الكل" || p.category === filterCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#fcfcfc', color: '#18181b', fontFamily: 'system-ui, sans-serif', direction: 'rtl', minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* Navbar */}
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

      {/* القائمة الجانبية */}
      {isMenuOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex' }}>
          <div style={{ width: '280px', backgroundColor: '#fff', height: '100%', padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '-2px 0 12px rgba(0,0,0,0.1)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: '900' }}>القائمة</span>
                <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem', fontWeight: '600' }}>
                <div onClick={() => { setFilterCategory("الكل"); setIsMenuOpen(false); }} style={{ cursor: 'pointer', padding: '8px 0' }}>الصفحة الرئيسية</div>
                <div onClick={() => { setFilterCategory("LENO"); setIsMenuOpen(false); }} style={{ cursor: 'pointer', padding: '8px 0' }}>تشكيلة LENO</div>
                <div onClick={() => { setFilterCategory("Original"); setIsMenuOpen(false); }} style={{ cursor: 'pointer', padding: '8px 0' }}>تشكيلة Original</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f4f4f5', paddingTop: '15px' }}>
              <div onClick={handleOpenAdminFromMenu} style={{ cursor: 'pointer', color: '#71717a', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🔒</span>
                <span>لوحة التحكم (المشرف)</span>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }} onClick={() => setIsMenuOpen(false)}></div>
        </div>
      )}

      {/* نافذة لوحة التحكم (إضافة عطر) */}
      {isAdminOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <form onSubmit={handleAddProduct} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', maxWidth: '450px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>إضافة عطر جديد</h3>
              <button type="button" onClick={() => setIsAdminOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            
            <input type="text" placeholder="اسم العطر" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #d4d4d8' }} required />
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d4d4d8' }}>
                <option value="LENO">LENO</option>
                <option value="Original">Original</option>
              </select>
              <input type="text" placeholder="الشارة (Badge)" value={badge} onChange={(e) => setBadge(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d4d4d8' }} />
            </div>

            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: '100%', marginBottom: '10px' }} required />

            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input type="text" placeholder="الحجم 1" value={size1Label} onChange={(e) => setSize1Label(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #d4d4d8' }} />
              <input type="number" placeholder="السعر 1" value={size1Price} onChange={(e) => setSize1Price(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #d4d4d8' }} required />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
              <input type="text" placeholder="الحجم 2 (اختياري)" value={size2Label} onChange={(e) => setSize2Label(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #d4d4d8' }} />
              <input type="number" placeholder="السعر 2" value={size2Price} onChange={(e) => setSize2Price(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #d4d4d8' }} />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#2d3732', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>
              {loading ? 'جاري الإضافة...' : 'حفظ ونشر العطر'}
            </button>
          </form>
        </div>
      )}

      {/* Banner */}
      <div style={{ backgroundColor: '#2d3732', color: '#fff', textAlign: 'center', padding: '40px 20px', margin: '16px', borderRadius: '16px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', fontWeight: '800' }}>عطرك.. بصمتك التي لا تُنسى.</h1>
        <p style={{ fontSize: '0.9rem', color: '#e4e4e7', margin: 0 }}>اكتشف تشكيلة لينو الفاخرة الآن ➔</p>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 16px', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '1.3rem', margin: '0 0 15px 0', fontWeight: '800' }}>التسوق حسب المجموعة</h2>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {["الكل", "LENO", "Original"].map((cat) => (
            <button key={cat} onClick={() => setFilterCategory(cat)} style={{ padding: '8px 18px', borderRadius: '20px', border: filterCategory === cat ? 'none' : '1px solid #e4e4e7', backgroundColor: filterCategory === cat ? '#2d3732' : '#fff', color: filterCategory === cat ? '#fff' : '#52525b', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <main style={{ padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {filteredProducts.map((p) => (
            <div key={p.id} onClick={() => openProduct(p)} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f4f4f5', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {p.badge && <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#2d3732', color: '#fff', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', zIndex: 2 }}>{p.badge}</span>}
              <div style={{ width: '100%', height: '180px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: '700' }}>{p.name}</h3>
                <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#2d3732' }}>
                  {p.sizes?.[0]?.price?.toLocaleString()} IQD
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal - نافذة تفاصيل العطر والشراء */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '500px', borderRadius: '24px 24px 0 0', padding: '24px', maxHeight: '85vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '16px', left: '16px', border: 'none', background: '#f4f4f5', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ height: '180px', objectFit: 'contain' }} />
            </div>

            <h2 style={{ fontSize: '1.2rem', margin: '0 0 8px 0', fontWeight: '800' }}>{selectedProduct.name}</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>اختر الحجم:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedProduct.sizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSizeIndex(idx)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: selectedSizeIndex === idx ? '2px solid #2d3732' : '1px solid #e4e4e7',
                      backgroundColor: selectedSizeIndex === idx ? '#f4f4f5' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{size.label}</div>
                    <div style={{ fontSize: '0.85rem', color: '#2d3732', marginTop: '2px' }}>{size.price.toLocaleString()} IQD</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '4px' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '36px', height: '36px', border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>-</button>
                <span style={{ padding: '0 12px', fontWeight: 'bold' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={{ width: '36px', height: '36px', border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>+</button>
              </div>

              <button onClick={addToCart} style={{ flex: 1, backgroundColor: '#2d3732', color: '#fff', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                إضافة للسلة 🛍️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer - نافذة السلة الجانبية */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '400px', height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800' }}>سلة التسوق</h2>
                <button onClick={() => setIsCartOpen(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
              </div>

              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#71717a', marginTop: '40px' }}>السلة فارغة حالياً.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '60vh', overflowY: 'auto' }}>
                  {cart.map((item) => (
                    <div key={item.cartItemId} style={{ display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid #f4f4f5', paddingBottom: '12px' }}>
                      <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{item.sizeLabel} × {item.quantity}</div>
                        <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#2d3732' }}>{(item.price * item.quantity).toLocaleString()} IQD</div>
                      </div>
                      <button onClick={() => removeFromCart(item.cartItemId)} style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #e4e4e7', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: '800', fontSize: '1.1rem' }}>
                  <span>المجموع:</span>
                  <span>{cartTotalPrice.toLocaleString()} IQD</span>
                </div>
                <button onClick={sendCartWhatsAppOrder} style={{ width: '100%', backgroundColor: '#166534', color: '#fff', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                  إرسال الطلب عبر واتساب 💬
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
