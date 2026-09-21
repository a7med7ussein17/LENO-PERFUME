'use client'
import React, { useState } from 'react'
import { ShoppingBag, Search, ChevronRight, Menu, X, Check, Star, ShieldCheck, Truck, Sparkles, MessageCircle } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState('cart') 
  const [isSubmitted, setIsSubmitted] = useState(false)

  // بيانات العطور المباشرة مع إضافة الأحجام والأسعار
  const products = [
    {
      id: 1,
      name: "Creed Aventus (كريد أفسنتوس)",
      category: "LENO",
      badge: "توصيل مجاني 🚚",
      image: "https://iili.io/n3JiY4S.jpg",
      sizes: [
        { size: "100 ml", price: 12000, originalPrice: 15000 },
        { size: "50 ml", price: 7000, originalPrice: 9000 }
      ],
      description: "عطر فاخر يمزج بين الفواكه والأخشاب مع لمسات من الأناناس والبرغموت والمسك النقي."
    },
    {
      id: 2,
      name: "Sauvage Dior (سوفاج ديور)",
      category: "LENO",
      badge: "الأكثر مبيعاً 🔥",
      image: "https://iili.io/n3JiY4S.jpg",
      sizes: [
        { size: "100 ml", price: 12000, originalPrice: 15000 },
        { size: "50 ml", price: 7000, originalPrice: 9000 }
      ],
      description: "نفحات منعشة من البرغموت مع لمسات من الفلفل الأسود والأخشاب دافئة وقوية."
    },
    {
      id: 3,
      name: "Baccarat Rouge 540 (باكارات روج)",
      category: "Original",
      badge: "مميز ✨",
      image: "https://iili.io/n3JiY4S.jpg",
      sizes: [
        { size: "100 ml", price: 15000, originalPrice: 18000 },
        { size: "50 ml", price: 9000, originalPrice: 11000 }
      ],
      description: "عطر ساحر يجمع بين العنبر الخشب والأزهار الراقية مع نفحات الياسمين والزعفران."
    }
  ]

  const [selectedSizes, setSelectedSizes] = useState(() => {
    const initial = {}
    products.forEach(p => {
      initial[p.id] = p.sizes[0]
    })
    return initial
  })

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'بغداد',
    address: '',
    notes: ''
  })

  const handleSizeChange = (productId, sizeObj) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: sizeObj
    }))
  }

  const addToCart = (product) => {
    const currentSize = selectedSizes[product.id] || product.sizes[0]
    const itemKey = `${product.id}-${currentSize.size}`
    
    setCart(prevCart => {
      const existing = prevCart.find(item => item.cartItemId === itemKey)
      if (existing) {
        return prevCart.map(item =>
          item.cartItemId === itemKey ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, selectedSize: currentSize, quantity: 1, cartItemId: itemKey }]
    })
    setIsCartOpen(true)
  }

  const updateQuantity = (cartItemId, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta
          return newQty > 0 ? { ...item, quantity: newQty } : null
        }
        return item
      }).filter(Boolean)
    })
  }

  const totalAmount = cart.reduce((sum, item) => sum + (item.selectedSize.price * item.quantity), 0)

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.address) {
      alert('يرجى إكمال جميع الحقول المطلوبة')
      return
    }

    let itemsList = cart.map(item => `• ${item.name} (${item.selectedSize.size}) x${item.quantity} = ${(item.selectedSize.price * item.quantity).toLocaleString()} د.ع`).join('\n')
    
    let message = `🛍️ *طلب جديد من متجر لينو*\n\n`
    message += `👤 *الاسم:* ${formData.name}\n`
    message += `📞 *الهاتف:* ${formData.phone}\n`
    message += `📍 *المحافظة:* ${formData.city}\n`
    message += `🏠 *العنوان:* ${formData.address}\n`
    if (formData.notes) message += `📝 *ملاحظات:* ${formData.notes}\n`
    message += `\n📦 *المنتجات:*\n${itemsList}\n\n`
    message += `💰 *الإجمالي:* ${totalAmount.toLocaleString()} د.ع`

    const whatsappUrl = `https://wa.me/9647700000000?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    setIsSubmitted(true)
    setCart([])
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans dir-rtl" dir="rtl">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex-1 flex justify-center md:justify-start items-center">
              <span className="text-2xl font-black tracking-wider text-black font-serif">لينو</span>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-gray-100 text-gray-700 transition">
                <ShoppingBag size={22} />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <header className="bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            عطرك.. بصمتك التي لا تُنسى.
          </h1>
          <p className="text-gray-300 text-sm sm:text-lg mb-6">
            تشكيلة فاخرة من أجود العطور العالمية المجهزة بعناية فائقة لتناسب ذوقك الرفيع.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Categories */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {['ALL', 'LENO', 'Original'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat === 'ALL' ? 'الكل' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="ابحث عن عطر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black transition"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const activeSize = selectedSizes[product.id] || product.sizes[0]

            return (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between overflow-hidden">
                <div className="p-4">
                  <div className="relative aspect-square rounded-xl bg-gray-50 overflow-hidden mb-4">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    {product.badge && (
                      <span className="absolute top-3 right-3 bg-black/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>

                  {/* Size Selector */}
                  <div className="mb-4">
                    <label className="text-xs text-gray-400 block mb-1">اختر الحجم:</label>
                    <div className="flex gap-2">
                      {product.sizes.map((sObj) => (
                        <button
                          key={sObj.size}
                          onClick={() => handleSizeChange(product.id, sObj)}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                            activeSize.size === sObj.size
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {sObj.size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-black text-gray-900">
                      {activeSize.price.toLocaleString()} د.ع
                    </span>
                    {activeSize.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        {activeSize.originalPrice.toLocaleString()} د.ع
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={16} />
                    إضافة للسلة
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-xl flex flex-col justify-between">
              
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">سلة التسوق ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <ShoppingBag size={48} className="mx-auto mb-3 opacity-30" />
                    السلة فارغة حالياً
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.cartItemId} className="flex gap-4 border-b pb-4 items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                        <span className="text-xs text-gray-400 block">{item.selectedSize.size}</span>
                        <span className="text-xs font-bold text-gray-700 block mt-1">
                          {item.selectedSize.price.toLocaleString()} د.ع
                        </span>
                      </div>
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.cartItemId, -1)} className="px-2 py-1 bg-gray-50 text-gray-600">-</button>
                        <span className="px-3 text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, 1)} className="px-2 py-1 bg-gray-50 text-gray-600">+</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer / Checkout */}
              {cart.length > 0 && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">المجموع الكلي:</span>
                    <span className="text-xl font-black text-gray-900">{totalAmount.toLocaleString()} د.ع</span>
                  </div>
                  
                  <form onSubmit={handleSubmitOrder} className="space-y-3">
                    <input
                      type="text"
                      name="name"
                      placeholder="الاسم الكامل"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="رقم الهاتف"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="العنوان التفصيلي"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    />
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                    >
                      <MessageCircle size={18} />
                      إرسال الطلب عبر الواتساب
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
