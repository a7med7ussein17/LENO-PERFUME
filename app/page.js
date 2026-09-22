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

  const parsePriceVal = (val) => {
    if (val === null || val === undefined || val === '') return null;
    let num = parseFloat(val);
    if (isNaN(num)) return null;
    if (num > 0 && num < 100) {
      num = num * 1000;
    }
    return Math.round(num);
  };

  const initialProducts = [
    {
      id: 1,
      name: "Creed Aventus (كريد أفينتوس)",
      category: "LENO",
      badge: "خصم خاص", 
      image: "https://iili.io/n3JiY4S.jpg",
      stock: 10,
      sizes: [
        { label: "10 مل", price: 5000, originalPrice: null },
        { label: "35 مل", price: 13000, originalPrice: 17500 }
      ]
    }
  ];

  const [products, setProducts] = useState(initialProducts);

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
            let imageUrl = "https://iili.io/n3JiY4S.jpg";
            if (Array.isArray(item.image) && item.image.length > 0) {
              imageUrl = item.image[0];
            } else if (typeof item.image === 'string' && item.image.trim() !== '') {
              imageUrl = item.image;
            }

            const itemStock = item.stock_quantity !== undefined && item.stock_quantity !== null ? parseInt(item.stock_quantity) : 10;
            
            // قراءة السعر الأصلي الرئيسي المكتوب في قاعدة البيانات
            const mainOriginalPrice = parsePriceVal(item.original_price);

            let rawSizes = [];
            if (Array.isArray(item.sizes) && item.sizes.length > 0) {
              rawSizes = item.sizes.map(s => {
                let sizePrice = parsePriceVal(s.price) || 0;
                let sizeOrigPrice = parsePriceVal(s.original_price);

                // إذا لم يوجد سعر أصلي داخل الحجم، نستخدم السعر الأصلي الرئيسي للحجم الكبير (أكبر من 5000)
                if (!sizeOrigPrice && mainOriginalPrice && sizePrice > 5000) {
                  sizeOrigPrice = mainOriginalPrice;
                }

                return {
                  label: s.label || "الحجم القياسي",
                  price: sizePrice,
                  originalPrice: (sizeOrigPrice && sizeOrigPrice > sizePrice) ? sizeOrigPrice : null
                };
              });
            } else {
              const currentPrice = parsePriceVal(item.discounted_price) || parsePriceVal(item.price) || 0;
              rawSizes = [
                { 
                  label: item.size_label || "35 مل", 
                  price: currentPrice, 
                  originalPrice: (mainOriginalPrice && mainOriginalPrice > currentPrice) ? mainOriginalPrice : null
                }
              ];
            }

            const validPrices = rawSizes.map(s => s.price).filter(p => p > 0);
            const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : 0;

            const parsedSizes = rawSizes.map(s => ({
              ...s,
              freeDelivery: s.price > 0 && s.price === maxPrice
            }));

            return {
              id: item.id,
              name: item.name || "عطر بدون اسم",
              category: item.category || "LENO",
              badge: item.badge || null,
              image: imageUrl,
              stock: itemStock,
              sizes: parsedSizes
            };
          });
          setProducts(formattedProducts);
        }

      } catch (err) {
        console.warn("استخدام البيانات الاحتياطية:", err);
      }
    }
    fetchProducts();
  }, []);

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

  const [selectedProvince, setSelectedProvince] = useState(provincesDelivery[0].name);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const currentProvinceObj = provincesDelivery.find(p => p.name === selectedProvince) || provincesDelivery[0];

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const hasFreeDeliveryItem = cart.some(item => item.freeDelivery);
  const deliveryFee = hasFreeDeliveryItem ? 0 : currentProvinceObj.price;
  const cartFinalTotal = cartSubTotalPrice + deliveryFee;

  const openProduct = (product) => {
    setSelectedProduct(product);
    // تحديد الحجم الكبير تلقائياً عند فتح نافذة العطر
    const maxIndex = product.sizes.reduce((maxI, el, i, arr) => el.price > arr[maxI].price ? i : maxI, 0);
    setSelectedSizeIndex(maxIndex);
    setQuantity(1);
  };

  const addToCart = () => {
    if (!selectedProduct || selectedProduct.stock <= 0) return;
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
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.cartItemId !== cartItemId);
      if (newCart.length === 0) {
        setIsCartOpen(false);
      }
      return newCart;
    });
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
    text += `📌 *معلومات الزبون والطلب:*\n`;
    if (customerName) text += `- الاسم: ${customerName}\n`;
    if (customerPhone) text += `- الهاتف: ${customerPhone}\n`;
    text += `- المحافظة: ${selectedProvince}\n`;
    if (customerAddress) text += `- العنوان التفصيلي: ${customerAddress}\n`;

    text += `\nــــــــــــــــــــــــــــ\n`;
    text += `مجموع المنتجات: ${cartSubTotalPrice.toLocaleString()} IQD\n`;
    if (hasFreeDeliveryItem) {
      text += `التوصيل: مجاني 🚚✨\n`;
    } else {
      text += `أجور التوصيل (${selectedProvince}): ${deliveryFee.toLocaleString()} IQD\n`;
    }
    text += `*المجموع الصافي المباشر: ${cartFinalTotal.toLocaleString()} IQD*`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredProducts = products.filter(p => {
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
            placeholder="ابحث عن اسم العطر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #d4d4d8', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f9f9f9' }}
            autoFocus
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ border: 'none', background: 'none', color: '#a1a1aa', fontSize: '0.9rem', cursor: 'pointer' }}>مسح</button>
          )}
        </div>
      )}

      {/* البانر */}
      <div style={{ backgroundColor: '#2d3732', color: '#fff', textAlign: 'center', padding: '40px 20px', margin: '12px 16px', borderRadius: '16px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', fontWeight: '800' }}>عطرك.. بصمتك التي لا تُنسى.</h1>
        <p style={{ fontSize: '0.9rem', color: '#e4e4e7', margin: 0 }}>اكتشف تشكيلة لينو الفاخرة الآن ➔</p>
      </div>

      {/* الفلترة */}
      <div style={{ padding: '0 16px', marginTop: '20px', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '1.2rem', margin: '0 0 12px 0', fontWeight: '800' }}>التسوق حسب المجموعة</h2>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
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
            {filteredProducts.map((p) => {
              // اختيار الحجم الذي يحتوي على الخصم أو الحجم الأكبر لعرضه في الواجهة الرئيسية
              const discountedSize = p.sizes.find(s => s.originalPrice) || p.sizes[p.sizes.length - 1];
              const isOutOfStock = p.stock <= 0;

              return (
                <div key={p.id} onClick={() => openProduct(p)} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f4f4f5', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column', opacity: isOutOfStock ? 0.75 : 1 }}>
                  
                  {p.badge && !isOutOfStock && (
                    <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#2d3732', color: '#fff', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', zIndex: 2 }}>
                      {p.badge}
                    </span>
                  )}

                  {isOutOfStock && (
                    <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#b91c1c', color: '#fff', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', zIndex: 2 }}>
                      نفدت الكمية ❌
                    </span>
                  )}

                  <div style={{ width: '100%', height: '170px', backgroundColor: '#f9f9f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: isOutOfStock ? 'grayscale(40%)' : 'none' }} />
                  </div>
                  <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: '700', color: '#18181b', lineHeight: '1.3' }}>{p.name}</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#2d3732' }}>
                        IQD {discountedSize ? discountedSize.price.toLocaleString() : 0}
                      </span>
                      {discountedSize && discountedSize.originalPrice && (
                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa', textDecoration: 'line-through' }}>
                          IQD {discountedSize.originalPrice.toLocaleString()}
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

      {/* تفاصيل العطر */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxHeight: '90vh', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px', overflowY: 'auto', direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '0.85rem', color: '#71717a' }}>تفاصيل العطر</span>
              <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div 
              onClick={() => setZoomedImage(selectedProduct.image)}
              style={{ width: '100%', height: '220px', borderRadius: '16px', backgroundColor: '#f9f9f9', overflow: 'hidden', marginBottom: '15px', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              <span style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem' }}>🔍 اضغط لتكبير الصورة</span>
            </div>

            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '800' }}>{selectedProduct.name}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#2d3732' }}>
                IQD {(selectedProduct.sizes[selectedSizeIndex].price * quantity).toLocaleString()}
              </span>
              {selectedProduct.sizes[selectedSizeIndex].originalPrice && (
                <span style={{ fontSize: '0.9rem', color: '#a1a1aa', textDecoration: 'line-through' }}>
                  IQD {(selectedProduct.sizes[selectedSizeIndex].originalPrice * quantity).toLocaleString()}
                </span>
              )}
            </div>

            {selectedProduct.stock > 0 && selectedProduct.sizes[selectedSizeIndex].freeDelivery && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0fdf4', color: '#166534', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '14px', width: 'fit-content', border: '1px solid #bbf7d0' }}>
                <span>🚚</span>
                <span>توصيل مجاني لهذا الخيار</span>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', color: '#3f3f46' }}>اختر الحجم أو العرض</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedProduct.sizes.map((size, index) => (
                  <button key={index} onClick={() => setSelectedSizeIndex(index)} style={{ flex: 1, minWidth: '90px', padding: '10px 6px', borderRadius: '8px', border: selectedSizeIndex === index ? '2px solid #2d3732' : '1px solid #e4e4e7', backgroundColor: selectedSizeIndex === index ? '#2d3732' : '#fff', color: selectedSizeIndex === index ? '#fff' : '#18181b', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.85rem' }}>{size.label}</div>
                    <div style={{ fontSize: '0.7rem', marginTop: '2px', opacity: 0.8 }}>
                      IQD {size.price.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedProduct.stock > 0 && (
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#3f3f46' }}>العدد المطلوب</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '36px', height: '36px', border: 'none', backgroundColor: '#f4f4f5', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                  <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold', fontSize: '1rem' }}>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))} style={{ width: '36px', height: '36px', border: 'none', backgroundColor: '#f4f4f5', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                </div>
              </div>
            )}

            {selectedProduct.stock > 0 ? (
              <button onClick={addToCart} style={{ width: '100%', backgroundColor: '#2d3732', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer' }}>
                إضافة إلى السلة 🛒
              </button>
            ) : (
              <button disabled style={{ width: '100%', backgroundColor: '#9ca3af', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'not-allowed' }}>
                غير متوفر حالياً (نفدت الكمية) ❌
              </button>
            )}

          </div>
        </div>
      )}

      {/* زوم الصورة */}
      {zoomedImage && (
        <div onClick={() => setZoomedImage(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <button onClick={() => setZoomedImage(null)} style={{ position: 'absolute', top: '20px', right: '20px', color: '#fff', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer' }}>✕</button>
          <img src={zoomedImage} alt="عطر زوم" style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} />
        </div>
      )}

      {/* السلة */}
      {isCartOpen && cart.length > 0 && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', zIndex: 200 }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '480px', maxHeight: '82vh', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', direction: 'rtl', boxSizing: 'border-box' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f4f4f5', paddingBottom: '10px', flexShrink: 0 }}>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#18181b' }}>سلة المشتريات ({cartItemsCount})</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#71717a' }}>✕</button>
            </div>
            
            <div style={{ overflowY: 'auto', flexGrow: 1, padding: '10px 0' }}>
              {cart.map(item => (
                <div key={item.cartItemId} style={{ display: 'flex', gap: '12px', marginBottom: '12px', borderBottom: '1px solid #f4f4f5', paddingBottom: '12px', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'contain', backgroundColor: '#f9f9f9' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#18181b', fontWeight: '700' }}>{item.name}</h4>
                      <button onClick={() => removeFromCart(item.cartItemId)} style={{ background: 'none', border: 'none', color: '#b91c1c', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#52525b', marginTop: '2px' }}>
                      {item.sizeLabel} {item.freeDelivery && <span style={{ color: '#166534', fontWeight: 'bold' }}>(توصيل مجاني)</span>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2d3732' }}>IQD {(item.price * item.quantity).toLocaleString()}</span>
                      <span style={{ fontSize: '0.75rem', color: '#71717a' }}>العدد: {item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem' }}>📍</span>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#1e293b', fontWeight: '800' }}>معلومات التوصيل والطلب:</h4>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px', color: '#475569' }}>اختر المحافظة / المنطقة:</label>
                  <select 
                    value={selectedProvince} 
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '8px', 
                      border: '1px solid #cbd5e1', 
                      fontSize: '0.85rem', 
                      outline: 'none', 
                      backgroundColor: '#fff', 
                      fontWeight: '700',
                      color: '#0f172a'
                    }}
                  >
                    {provincesDelivery.map(p => (
                      <option key={p.name} value={p.name}>
                        {p.name} — ({p.price.toLocaleString()} د.ع)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="الاسم الكامل" 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none', backgroundColor: '#fff' }}
                  />
                  <input 
                    type="tel" 
                    placeholder="رقم الهاتف" 
                    value={customerPhone} 
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none', backgroundColor: '#fff', textAlign: 'right' }}
                  />
                </div>

                <input 
                  type="text" 
                  placeholder="العنوان التفصيلي (المنطقة / أقرب نقطة دالة)" 
                  value={customerAddress} 
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: 'auto', flexShrink: 0, backgroundColor: '#fff' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '8px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>مجموع العطور:</span>
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
                <span>إرسال الطلب الصافي عبر الواتساب</span>
                <span style={{ fontSize: '1rem' }}>💬</span>
              </button>
            </div>
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
