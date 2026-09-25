'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const whatsappNumber = "9647751772000";

  const SUPABASE_URL = "https://bqodbfoopkzbnysztdnp.supabase.co";
  const SUPABASE_KEY = "sb_publishable_GJJ7tpPrgW6Qg-YwTrayzQ_dYC2JJgm";

  const provincesDelivery = [
    { name: "دهوك", price: 3000 },
    { name: "زاخو", price: 4000 },
    { name: "أربيل", price: 4000 },
    { name: "السليمانية", price: 4000 },
    { name: "حلبجة", price: 4000 },
    { name: "بغداد", price: 5000 },
    { name: "البصرة", price: 5000 },
    { name: "نينوى (الموصل)", price: 5000 },
    { name: "النجف الأشرف", price: 5000 },
    { name: "كربلاء المقدسة", price: 5000 },
    { name: "بابل (الحلة)", price: 5000 },
    { name: "ذي قار (الناصرية)", price: 5000 },
    { name: "الأنبار (الرمادي)", price: 5000 },
    { name: "ديالى (بعقوبة)", price: 5000 },
    { name: "كركوك", price: 5000 },
    { name: "القادسية (الديوانية)", price: 5000 },
    { name: "واسط (الكوت)", price: 5000 },
    { name: "ميسان (العمارة)", price: 5000 },
    { name: "المثنى (السماوة)", price: 5000 },
    { name: "صلاح الدين (تكريت)", price: 5000 }
  ];

  const [products, setProducts] = useState([]);
  const [mainTab, setMainTab] = useState("perfumes"); 

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
          }
        });
        if (!res.ok) throw new Error("فشل الاتصال");
        const data = await res.json();
        if (data && data.length > 0) {
          const formattedProducts = data.map(item => {
            let imageList = [];
            if (Array.isArray(item.image) && item.image.length > 0) {
              imageList = item.image.filter(img => typeof img === 'string' && img.trim() !== '');
            } else if (typeof item.image === 'string' && item.image.trim() !== '') {
              try {
                const parsed = JSON.parse(item.image);
                if (Array.isArray(parsed)) imageList = parsed;
                else imageList = [item.image];
              } catch {
                imageList = [item.image];
              }
            }

            if (imageList.length === 0) {
              imageList = ["https://iili.io/n3JiY4S.jpg"];
            }

            const itemOriginalPrice = item.original_price ? Number(item.original_price) : null;
            const itemDiscountedPrice = item.discounted_price ? Number(item.discounted_price) : null;

            const mainProductFreeDelivery = Boolean(item.free_delivery);

            let rawSizes = [];
            if (Array.isArray(item.sizes) && item.sizes.length > 0) {
              rawSizes = item.sizes.map(s => {
                let sizePrice = Number(s.price) || 0;
                let sizeOrigPrice = s.original_price ? Number(s.original_price) : null;

                if (!sizeOrigPrice && itemOriginalPrice) {
                  if (itemDiscountedPrice && sizePrice === itemDiscountedPrice) {
                    sizeOrigPrice = itemOriginalPrice;
                  } else if (sizePrice === itemOriginalPrice && itemDiscountedPrice) {
                    sizePrice = itemDiscountedPrice;
                    sizeOrigPrice = itemOriginalPrice;
                  }
                }

                let sizeStock = null;
                if (s.stock !== undefined && s.stock !== null) sizeStock = Number(s.stock);
                else if (s.quantity !== undefined && s.quantity !== null) sizeStock = Number(s.quantity);

                let isAvailable = true;
                if (sizeStock !== null) {
                  isAvailable = sizeStock > 0;
                } else if (s.available !== undefined) {
                  isAvailable = Boolean(s.available);
                }

                const isSizeFree = s.free_delivery !== undefined ? Boolean(s.free_delivery) : mainProductFreeDelivery;

                return {
                  label: s.label || s.size_label || "الحجم القياسي",
                  price: sizePrice,
                  originalPrice: sizeOrigPrice,
                  available: isAvailable,
                  freeDelivery: isSizeFree
                };
              });
            } else {
              const currentPrice = itemDiscountedPrice || Number(item.price) || 0;
              const mainStock = item.stock_quantity !== undefined ? Number(item.stock_quantity) : (item.stock !== undefined ? Number(item.stock) : null);
              const mainAvailable = mainStock !== null ? mainStock > 0 : (item.available !== undefined ? Boolean(item.available) : true);

              rawSizes = [
                { 
                  label: item.size_label || "200 مل", 
                  price: currentPrice, 
                  originalPrice: itemOriginalPrice,
                  available: mainAvailable,
                  freeDelivery: mainProductFreeDelivery
                }
              ];
            }

            const catLower = (item.category || "").toLowerCase();
            const nameLower = (item.name || "").toLowerCase();

            const isGlassItem = catLower.includes("زجاج") || catLower.includes("زجاجة") || catLower.includes("عبوات") || catLower.includes("glass");
            const isSprayItem = !isGlassItem && (
              catLower.includes("مطر") || catLower.includes("معطر") || catLower.includes("spray") || catLower.includes("mist") ||
              nameLower.includes("مطر") || nameLower.includes("معطر") || nameLower.includes("spray")
            );

            let displayBadge = item.badge || null;
            if (displayBadge && typeof displayBadge === 'string') {
              if (displayBadge.toLowerCase().includes('discount')) {
                displayBadge = displayBadge.replace(/discount/gi, 'خصم');
              }
            }

            return {
              id: item.id,
              name: item.name || "منتج بدون اسم",
              category: item.category || "LENO",
              isGlass: isGlassItem,
              isSpray: isSprayItem,
              badge: displayBadge,
              images: imageList,
              image: imageList[0],
              sizes: rawSizes
            };
          });
          setProducts(formattedProducts);
        }

      } catch (err) {
        console.warn("خطأ في جلب البيانات:", err);
      }
    }
    fetchProducts();
  }, []);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [filterCategory, setFilterCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [zoomedImage, setZoomedImage] = useState(null);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState(provincesDelivery[0].name);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  
  const [formError, setFormError] = useState("");

  const currentProvinceObj = provincesDelivery.find(p => p.name === selectedProvince) || provincesDelivery[0];

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const hasFreeDeliveryItem = cart.some(item => item.freeDelivery);
  const deliveryFee = hasFreeDeliveryItem ? 0 : currentProvinceObj.price;
  const cartFinalTotal = cartSubTotalPrice + deliveryFee;

  const currentMainProducts = products.filter(p => {
    if (mainTab === "glass") return p.isGlass;
    if (mainTab === "spray") return p.isSpray;
    return !p.isGlass && !p.isSpray; 
  });

  const categoriesList = ["الكل", ...Array.from(new Set(currentMainProducts.map(p => p.category).filter(Boolean)))];

  const openProduct = (product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    const firstAvailableIndex = product.sizes.findIndex(s => s.available);
    setSelectedSizeIndex(firstAvailableIndex !== -1 ? firstAvailableIndex : 0);
    setQuantity(1);
  };

  const addToCart = () => {
    if (!selectedProduct) return;
    const currentSize = selectedProduct.sizes[selectedSizeIndex];
    if (!currentSize || !currentSize.available) return;

    const cartItemId = `${selectedProduct.id}-${currentSize.label}`;
    
    const newItem = {
      cartItemId: cartItemId,
      name: selectedProduct.name,
      image: selectedProduct.images[selectedImageIndex] || selectedProduct.image,
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

  // تغيير الكمية داخل السلة
  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.cartItemId !== cartItemId);
      if (newCart.length === 0) {
        setIsCartOpen(false);
      }
      return newCart;
    });
  };

  const handleScroll = (e) => {
    const scrollLeft = Math.abs(e.target.scrollLeft);
    const width = e.target.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== selectedImageIndex) {
      setSelectedImageIndex(newIndex);
    }
  };

  const sendCartWhatsAppOrder = () => {
    if (cart.length === 0) return;

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setFormError("⚠️ يرجى كتابة كافة البيانات المطلوبة (الاسم، الهاتف، العنوان) لإكمال الطلب.");
      return;
    }

    setFormError("");

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
    text += `📌 *معلومات الزبون والطلب:*\n`;
    text += `- الاسم: ${customerName}\n`;
    text += `- الهاتف: ${customerPhone}\n`;
    text += `- المحافظة: ${selectedProvince}\n`;
    text += `- العنوان التفصيلي: ${customerAddress}\n`;

    text += `\nــــــــــــــــــــــــــــ\n`;
    text += `مجموع المنتجات: ${cartSubTotalPrice.toLocaleString()} IQD\n`;
    if (hasFreeDeliveryItem) {
      text += `التوصيل: مجاني 🚚✨\n`;
    } else {
      text += `أجور التوصيل (${selectedProvince}): ${deliveryFee.toLocaleString()} IQD\n`;
    }
    text += `*المجموع الكلي الصافي: ${cartFinalTotal.toLocaleString()} IQD*`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredProducts = currentMainProducts.filter(p => {
    const matchesCategory = filterCategory === "الكل" || p.category === filterCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#fcfcfc', color: '#18181b', fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl', minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* الهيدر */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #f4f4f5' }}>
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
          <div onClick={() => { if(cart.length > 0) setIsCartOpen(true); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}>
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

      {/* البحث */}
      {isSearchOpen && (
        <div style={{ padding: '10px 16px', backgroundColor: '#ffffff', borderBottom: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="text"
            placeholder="ابحث هنا..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #d4d4d8', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f9f9f9', boxSizing: 'border-box' }}
            autoFocus
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ border: 'none', background: 'none', color: '#a1a1aa', fontSize: '0.9rem', cursor: 'pointer' }}>مسح</button>
          )}
        </div>
      )}

      {/* المبدل الرئيسي */}
      <div style={{ padding: '16px 16px 0 16px' }}>
        <div style={{ display: 'flex', backgroundColor: '#e4e4e7', padding: '4px', borderRadius: '14px', gap: '2px' }}>
          <button
            onClick={() => { setMainTab('perfumes'); setFilterCategory('الكل'); }}
            style={{
              flex: 1,
              padding: '10px 4px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: mainTab === 'perfumes' ? '#2d3732' : 'transparent',
              color: mainTab === 'perfumes' ? '#fff' : '#52525b',
              fontWeight: '800',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            العطور 🌿
          </button>
          <button
            onClick={() => { setMainTab('spray'); setFilterCategory('الكل'); }}
            style={{
              flex: 1,
              padding: '10px 4px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: mainTab === 'spray' ? '#2d3732' : 'transparent',
              color: mainTab === 'spray' ? '#fff' : '#52525b',
              fontWeight: '800',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            معطرات الجسم 🌸
          </button>
          <button
            onClick={() => { setMainTab('glass'); setFilterCategory('الكل'); }}
            style={{
              flex: 1,
              padding: '10px 4px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: mainTab === 'glass' ? '#2d3732' : 'transparent',
              color: mainTab === 'glass' ? '#fff' : '#52525b',
              fontWeight: '800',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            الزجاج والعبوات 🍾
          </button>
        </div>
      </div>

      {/* البانر */}
      <div style={{ backgroundColor: '#2d3732', color: '#fff', textAlign: 'center', padding: '26px 20px', margin: '16px 16px 12px 16px', borderRadius: '16px' }}>
        <h1 style={{ fontSize: '1.45rem', margin: '0 0 6px 0', fontWeight: '800' }}>
          {mainTab === 'perfumes' && 'عطرك.. بصمتك التي لا تُنسى.'}
          {mainTab === 'spray' && 'انتعاش يدوم طوال اليوم ✨'}
          {mainTab === 'glass' && 'تشكيلة الزجاج والعبوات الفاخرة'}
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#e4e4e7', margin: 0 }}>
          {mainTab === 'perfumes' && 'اكتشف تشكيلة لينو العطرية الفاخرة الآن ➔'}
          {mainTab === 'spray' && 'تصفح أرقى المطر والمعطرات اليومية للجسم ➔'}
          {mainTab === 'glass' && 'اختر أرق أشكال الزجاجات والعلب بجميع الأحجام ➔'}
        </p>
      </div>

      {/* الفلترة الفرعية */}
      {categoriesList.length > 2 && (
        <div style={{ padding: '0 16px', marginTop: '15px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
            {categoriesList.map((cat) => (
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
      )}

      {/* المنتجات */}
      <main style={{ padding: '10px 16px 0 16px' }}>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#71717a' }}>
            {products.length === 0 ? "جاري تحميل البيانات..." : `لا توجد منتجات متوفرة في هذا القسم حالياً.`}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {filteredProducts.map((p) => {
              const firstSize = p.sizes && p.sizes[0] ? p.sizes[0] : null;
              const allSizesOutOfStock = p.sizes.every(s => !s.available);

              return (
                <div key={p.id} onClick={() => openProduct(p)} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f4f4f5', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  
                  {allSizesOutOfStock ? (
                    <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#b91c1c', color: '#fff', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', zIndex: 2 }}>
                      نفذت الكمية
                    </span>
                  ) : (
                    p.badge && (
                      <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#2d3732', color: '#fff', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', zIndex: 2 }}>
                        {p.badge}
                      </span>
                    )
                  )}

                  <div style={{ width: '100%', height: '170px', backgroundColor: '#f9f9f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: '700', color: '#18181b', lineHeight: '1.3' }}>{p.name}</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#2d3732' }}>
                        IQD {firstSize ? firstSize.price.toLocaleString() : 0}
                      </span>
                      {firstSize && firstSize.originalPrice && firstSize.originalPrice > firstSize.price && (
                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa', textDecoration: 'line-through' }}>
                          IQD {firstSize.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* تفاصيل المنتج */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxHeight: '90vh', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px', overflowY: 'auto', direction: 'rtl', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '0.85rem', color: '#71717a' }}>تفاصيل المنتج</span>
              <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>
            
            {/* معرض الصور */}
            <div style={{ position: 'relative', width: '100%', marginBottom: '15px' }}>
              <div 
                onScroll={handleScroll}
                style={{ 
                  display: 'flex', 
                  overflowX: 'auto', 
                  scrollSnapType: 'x mandatory', 
                  scrollBehavior: 'smooth',
                  borderRadius: '16px',
                  backgroundColor: '#f9f9f9',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {selectedProduct.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setZoomedImage(img)}
                    style={{ 
                      flex: '0 0 100%', 
                      scrollSnapAlign: 'start', 
                      height: '240px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={img} alt={selectedProduct.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>

              {selectedProduct.images.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
                  {selectedProduct.images.map((_, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        width: selectedImageIndex === idx ? '18px' : '6px', 
                        height: '6px', 
                        borderRadius: '10px', 
                        backgroundColor: selectedImageIndex === idx ? '#2d3732' : '#d4d4d8', 
                        transition: 'all 0.3s ease' 
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>

            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: '800' }}>{selectedProduct.name}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#2d3732' }}>
                IQD {(selectedProduct.sizes[selectedSizeIndex].price * quantity).toLocaleString()}
              </span>
              {selectedProduct.sizes[selectedSizeIndex].originalPrice && selectedProduct.sizes[selectedSizeIndex].originalPrice > selectedProduct.sizes[selectedSizeIndex].price && (
                <span style={{ fontSize: '0.9rem', color: '#a1a1aa', textDecoration: 'line-through' }}>
                  IQD {(selectedProduct.sizes[selectedSizeIndex].originalPrice * quantity).toLocaleString()}
                </span>
              )}
            </div>

            {selectedProduct.sizes[selectedSizeIndex].available && selectedProduct.sizes[selectedSizeIndex].freeDelivery && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0fdf4', color: '#166534', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '14px', width: 'fit-content', border: '1px solid #bbf7d0' }}>
                <span>🚚</span>
                <span>توصيل مجاني لهذا الخيار</span>
              </div>
            )}

            {/* الحجم */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', color: '#3f3f46' }}>اختر الحجم أو العرض</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {selectedProduct.sizes.map((size, index) => {
                  const isSelected = selectedSizeIndex === index;
                  const isAvailable = size.available;

                  return (
                    <button 
                      key={index} 
                      onClick={() => setSelectedSizeIndex(index)} 
                      style={{ 
                        minWidth: '100px', 
                        padding: '8px 12px', 
                        borderRadius: '10px', 
                        border: isSelected ? '2px solid #2d3732' : '1px solid #e4e4e7', 
                        backgroundColor: isSelected ? '#2d3732' : '#fff', 
                        color: isSelected ? '#fff' : (isAvailable ? '#18181b' : '#a1a1aa'), 
                        fontWeight: 'bold', 
                        cursor: 'pointer', 
                        textAlign: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.85rem' }}>{size.label}</div>
                      {isAvailable ? (
                        <div style={{ fontSize: '0.7rem', marginTop: '2px', opacity: 0.8 }}>
                          IQD {size.price.toLocaleString()}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.65rem', marginTop: '2px', color: isSelected ? '#fca5a5' : '#dc2626', fontWeight: 'bold' }}>نفذت الكمية</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedProduct.sizes[selectedSizeIndex].available && (
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#3f3f46' }}>العدد</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '36px', height: '36px', border: 'none', backgroundColor: '#f4f4f5', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                  <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold', fontSize: '1rem' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ width: '36px', height: '36px', border: 'none', backgroundColor: '#f4f4f5', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                </div>
              </div>
            )}

            {selectedProduct.sizes[selectedSizeIndex].available ? (
              <button onClick={addToCart} style={{ width: '100%', backgroundColor: '#2d3732', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer' }}>
                إضافة إلى السلة 🛒
              </button>
            ) : (
              <button disabled style={{ width: '100%', backgroundColor: '#9ca3af', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'not-allowed' }}>
                نفذت الكمية لهذا الحجم
              </button>
            )}

          </div>
        </div>
      )}

      {/* زوم الصورة */}
      {zoomedImage && (
        <div onClick={() => setZoomedImage(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <button onClick={() => setZoomedImage(null)} style={{ position: 'absolute', top: '20px', right: '20px', color: '#fff', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer' }}>✕</button>
          <img src={zoomedImage} alt="زوم" style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} />
        </div>
      )}

      {/* السلة المعدلة بالكامل بحجم متناسق */}
      {isCartOpen && cart.length > 0 && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', zIndex: 200 }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '480px', maxHeight: '85vh', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', direction: 'rtl', boxSizing: 'border-box' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f4f4f5', paddingBottom: '10px', flexShrink: 0 }}>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#18181b' }}>سلة المشتريات ({cartItemsCount})</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#71717a' }}>✕</button>
            </div>
            
            <div style={{ overflowY: 'auto', flexGrow: 1, padding: '10px 0' }}>
              {cart.map(item => (
                <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f4f4f5', paddingBottom: '12px', marginBottom: '12px' }}>
                  
                  {/* الجهة اليمين: زر الحذف والعداد متناسق جداً */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <button onClick={() => removeFromCart(item.cartItemId)} style={{ background: 'none', border: 'none', color: '#b91c1c', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}>
                      حذف
                    </button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 'bold' }}>العدد:</span>
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #e4e4e7', borderRadius: '6px', backgroundColor: '#f9f9f9', height: '26px', overflow: 'hidden' }}>
                        <button onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)} style={{ width: '24px', height: '100%', border: 'none', backgroundColor: 'transparent', fontSize: '0.9rem', fontWeight: 'bold', color: '#18181b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                        <span style={{ padding: '0 6px', fontSize: '0.8rem', fontWeight: 'bold', color: '#18181b', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)} style={{ width: '24px', height: '100%', border: 'none', backgroundColor: 'transparent', fontSize: '0.9rem', fontWeight: 'bold', color: '#18181b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                    </div>
                  </div>

                  {/* الجهة اليسار: التفاصيل والصورة */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#18181b', fontWeight: '700', textAlign: 'right' }}>{item.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '2px' }}>{item.sizeLabel}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#2d3732', marginTop: '2px' }}>
                        IQD {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                    <img src={item.image} alt={item.name} style={{ width: '45px', height: '55px', borderRadius: '6px', objectFit: 'contain', backgroundColor: '#f9f9f9', flexShrink: 0 }} />
                  </div>

                </div>
              ))}

              {/* قسم معلومات التوصيل */}
              <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '8px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.9rem' }}>📍</span>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#1e293b', fontWeight: '800' }}>معلومات التوصيل والطلب:</h4>
                </div>

                {formError && (
                  <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '8px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '10px' }}>
                    {formError}
                  </div>
                )}
                
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px', color: '#475569' }}>
                    المحافظة <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select 
                    value={selectedProvince} 
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '9px 12px', 
                      borderRadius: '8px', 
                      border: '1px solid #cbd5e1', 
                      fontSize: '0.85rem', 
                      outline: 'none', 
                      backgroundColor: '#fff', 
                      fontWeight: '700',
                      color: '#0f172a',
                      boxSizing: 'border-box'
                    }}
                  >
                    {provincesDelivery.map(p => (
                      <option key={p.name} value={p.name}>
                        {p.name} — ({p.price.toLocaleString()} د.ع)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', width: '100%', boxSizing: 'border-box' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px', color: '#475569' }}>
                      الاسم الكامل <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="أدخل اسمك" 
                      value={customerName} 
                      onChange={(e) => { setCustomerName(e.target.value); setFormError(""); }}
                      style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px', color: '#475569' }}>
                      رقم الهاتف <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input 
                      type="tel" 
                      placeholder="077XXXXXXXX" 
                      value={customerPhone} 
                      onChange={(e) => { setCustomerPhone(e.target.value); setFormError(""); }}
                      style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none', backgroundColor: '#fff', textAlign: 'right', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px', color: '#475569' }}>
                    العنوان التفصيلي <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="المنطقة / المحلة / أقرب نقطة دالة" 
                    value={customerAddress} 
                    onChange={(e) => { setCustomerAddress(e.target.value); setFormError(""); }}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: 'auto', flexShrink: 0, backgroundColor: '#fff' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '8px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>مجموع المواد:</span>
                  <span>IQD {cartSubTotalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>أجور التوصيل ({selectedProvince}):</span>
                  <span>{hasFreeDeliveryItem ? "مجاني 🚚✨" : `IQD ${deliveryFee.toLocaleString()}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '0.95rem', color: '#0f172a', borderTop: '1px solid #f8fafc', paddingTop: '4px' }}>
                  <span>المجموع الكلي الصافي:</span>
                  <span style={{ color: '#2d3732' }}>IQD {cartFinalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button onClick={sendCartWhatsAppOrder} style={{ width: '100%', backgroundColor: '#2d3732', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span>إرسال الطلب عبر الواتساب</span>
                <span style={{ fontSize: '1rem' }}>💬</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* القائمة الجانبية */}
      {isMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ width: '75%', maxWidth: '300px', backgroundColor: '#fff', height: '100%', padding: '24px 20px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f4f4f5', paddingBottom: '15px' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#2d3732' }}>لـينـو 🌿</div>
              <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem', fontWeight: '600', color: '#27272a' }}>
              <div onClick={() => { setMainTab("perfumes"); setFilterCategory("الكل"); setIsMenuOpen(false); }} style={{ cursor: 'pointer', fontWeight: mainTab === 'perfumes' ? 'bold' : 'normal' }}>
                قسم العطور 🌿
              </div>

              <div onClick={() => { setMainTab("spray"); setFilterCategory("الكل"); setIsMenuOpen(false); }} style={{ cursor: 'pointer', fontWeight: mainTab === 'spray' ? 'bold' : 'normal' }}>
                معطرات الجسم (Spray) 🌸
              </div>

              <div onClick={() => { setMainTab("glass"); setFilterCategory("الكل"); setIsMenuOpen(false); }} style={{ cursor: 'pointer', fontWeight: mainTab === 'glass' ? 'bold' : 'normal' }}>
                قسم الزجاج والعبوات 🍾
              </div>
              
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', marginTop: '15px', borderTop: '1px solid #f4f4f5', paddingTop: '15px' }}>تواصل معنا (واتساب) 💬</a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
