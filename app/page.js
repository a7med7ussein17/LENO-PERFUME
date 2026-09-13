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
  const [filterCategory, setFilterCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // حالات لوحة إضافة العطر للمشرف
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
      alert('يرجى ملاءة المعلومات الأساسية!');
      return;
    }

    setLoading(true);
    const sizes = [{ label: size1Label, price: Number(size1Price) }];
    if (size2Price) sizes.push({ label: size2Label, price: Number(size2Price) });

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
    <div style={{ backgroundColor: '#fcfcfc', color: '#18181b', fontFamily: 'system-ui, sans-serif', direction: 'rtl', minHeight: '100vh' }}>
      
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

      {/* القائمة الجانبية (Sidebar) */}
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

            {/* خيار الإدارة داخل القائمة الجانبية */}
            <div style={{ borderTop: '1px solid #f4f4f5', paddingTop: '15px' }}>
              <div 
                onClick={handleOpenAdminFromMenu} 
                style={{ cursor: 'pointer', color: '#71717a', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
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
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {["الكل", "LENO", "Original"].map((cat) => (
            <button key={cat} onClick={() => setFilterCategory(cat)} style={{ padding: '8px 18px', borderRadius: '20px', border: filterCategory === cat ? 'none' : '1px solid #e4e4e7', backgroundColor: filterCategory === cat ? '#2d3732' : '#fff', color: filterCategory === cat ? '#fff' : '#52525b', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <main style={{ padding: '0 16px', paddingBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {filteredProducts.map((p) => (
            <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f4f4f5', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {p.badge && <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#2d3732', color: '#fff', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>{p.badge}</span>}
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

    </div>
  );
}
