'use client';
import { useState } from 'react';

// مكون نموذج إضافة عطر جديد (مدمج)
function AddProductForm({ onAddProduct }) {
  const [isOpen, setIsOpen] = useState(false);
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

  // رفع الصورة من الجهاز وتحويلها فوراً
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image || !size1Price) {
      alert('الرجاء كتابة اسم العطر، اختيار صورة، وإضافة سعر واحد على الأقل!');
      return;
    }

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
      id: Date.now(),
      name,
      category,
      badge: badge || null,
      image,
      sizes
    };

    onAddProduct(newProduct);

    // تفريغ الحقول
    setName('');
    setBadge('');
    setImage('');
    setSize1Price('');
    setSize2Price('');
    setSize2OriginalPrice('');
    setIsOpen(false);
  };

  return (
    <div style={{ padding: '0 16px', marginBottom: '20px', direction: 'rtl' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
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
        <span>{isOpen ? 'إغلاق نموذج الإضافة ✕' : '➕ إضافة عطر جديد فوراً'}</span>
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
            style={{ width: '100%', backgroundColor: '#166534', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            حفظ وإضافة للمتجر 🚀
          </button>
        </form>
      )}
    </div>
  );
}

export default function Home() {
  const whatsappNumber = "9647751772000";

  // قائمة المنتجات جعلناها حالة (State) لتقبل الإضافة الفورية
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

  const [zoomedImage, setZoomedImage] = useState(null);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleAddNewProduct = (newPerfume) => {
    setProducts([newPerfume, ...products]);
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
      cartItemId: cartItemId,
      name: selectedProduct.name,
      image: selectedProduct.image,
      sizeLabel: currentSize.label,
      price: currentSize.price,
      freeDelivery: currentSize.freeDelivery,
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

      {/* زر ونموذج إضافة العطر الجديد */}
      <AddProductForm onAddProduct={handleAddNewProduct} />

      {/* الفلترة */}
      <div style={{ padding: '0 16px', marginTop: '10px', marginBottom: '15px' }}>
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
        {filteredProducts.length === 0 ? (
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
                      {p.sizes[0].price.toLocaleString()} IQD
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
                {(selectedProduct.sizes[selectedSizeIndex].price * quantity).toLocaleString()} IQD
              </span>
              {selectedProduct.sizes[selectedSizeIndex].originalPrice && (
                <span style={{ fontSize: '1.1rem', color: '#a1a1aa', textDecoration: 'line-through' }}>
                  {(selectedProduct.sizes[selectedSizeIndex].originalPrice * quantity).toLocaleString()} IQD
                </span>
              )}
            </div>

            {selectedProduct.sizes[selectedSizeIndex].freeDelivery && (
              <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '15px', border: '1px solid #bbf7d0' }}>
                🚚 يشمل توصيل مجاني لهذا الخيار!
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: '#3f3f46' }}>اختر الحجم أو العرض</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedProduct.sizes.map((size, index) => (
                  <button key={index} onClick={() => setSelectedSizeIndex(index)} style={{ flex: 1, padding: '12px 8px', borderRadius: '8px', border: selectedSizeIndex === index ? '2px solid #2d3732' : '1px solid #e4e4e7', backgroundColor: selectedSizeIndex === index ? '#2d3732' : '#fff', color: selectedSizeIndex === index ? '#fff' : '#18181b', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}>
                    <div>{size.label}</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '2px', opacity: 0.8 }}>{size.price.toLocaleString()} IQD</div>
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

      {/* نافذة تكبير الصورة (Full Screen Lightbox) */}
      {zoomedImage && (
        <div onClick={() => setZoomedImage(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <button onClick={() => setZoomedImage(null)} style={{ position: 'absolute', top: '20px', right: '20px', color: '#fff', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer' }}>✕</button>
          <img src={zoomedImage} alt="عطر زوم" style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} />
        </div>
      )}

      {/* نافذة السلة */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxHeight: '85vh', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e4e4e7', paddingBottom: '15px', marginBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>سلة المشتريات ({cartItemsCount})</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#71717a' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', flexGrow: 1, paddingBottom: '10px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#71717a', margin: '40px 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛒</div>
                  <p>السلة فارغة حالياً</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.cartItemId} style={{ display: 'flex', gap: '12px', marginBottom: '15px', borderBottom: '1px solid #f4f4f5', paddingBottom: '15px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '65px', height: '65px', borderRadius: '8px', objectFit: 'contain', backgroundColor: '#f9f9f9' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#18181b' }}>{item.name}</h4>
                      <div style={{ fontSize: '0.8rem', color: '#52525b' }}>
                        {item.sizeLabel} {item.freeDelivery && <span style={{ color: '#166534', fontWeight: 'bold' }}>(توصيل مجاني)</span>}
                      </div>
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
              <div style={{ borderTop: '1px solid #e4e4e7', paddingTop: '15px', marginTop: '10px' }}>
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

      {/* القائمة الجانبية */}
      {isMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ width: '75%', maxWidth: '300px', backgroundColor: '#fff', height: '100%', padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #f4f4f5', paddingBottom: '15px' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#2d3732' }}>لـينـو 🌿</div>
              <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '1rem', fontWeight: '600', color: '#27272a' }}>
              <div onClick={() => setIsMenuOpen(false)} style={{ cursor: 'pointer' }}>الرئيسية 🏠</div>
              <div onClick={() => { setFilterCategory("LENO"); setIsMenuOpen(false); }} style={{ cursor: 'pointer' }}>عطور LENO 🧪</div>
              <div onClick={() => { setFilterCategory("Original"); setIsMenuOpen(false); }} style={{ cursor: 'pointer' }}>عطور Original ✨</div>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>تواصل معنا (واتساب) 💬</a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
