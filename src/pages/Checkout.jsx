import { ShoppingCart, Zap as SolanaIcon, Download, TrendingDown, TrendingUp, Lock, Check, X, CreditCard, ShieldCheck, MapPin, Truck, ChevronRight, Edit2, Loader, RefreshCw, Clock, Shield, Sparkles, AlertTriangle, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'
import { solanaNft, flowgladLock, figmaExport, snowflakeInsight } from '../simulation/sponsorMocks'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Tax Rates Map (Approximations)
const TAX_RATES = {
  'AL': 0.04, 'AK': 0.00, 'AZ': 0.056, 'AR': 0.065, 'CA': 0.0725,
  'CO': 0.029, 'CT': 0.0635, 'DE': 0.00, 'FL': 0.06, 'GA': 0.04,
  'HI': 0.04, 'ID': 0.06, 'IL': 0.0625, 'IN': 0.07, 'IA': 0.06,
  'KS': 0.065, 'KY': 0.06, 'LA': 0.0445, 'ME': 0.055, 'MD': 0.06,
  'MA': 0.0625, 'MI': 0.06, 'MN': 0.06875, 'MS': 0.07, 'MO': 0.04225,
  'MT': 0.00, 'NE': 0.055, 'NV': 0.0685, 'NH': 0.00, 'NJ': 0.06625,
  'NM': 0.05125, 'NY': 0.04, 'NC': 0.0475, 'ND': 0.05, 'OH': 0.0575,
  'OK': 0.045, 'OR': 0.00, 'PA': 0.06, 'RI': 0.07, 'SC': 0.06,
  'SD': 0.045, 'TN': 0.07, 'TX': 0.0625, 'UT': 0.061, 'VT': 0.06,
  'VA': 0.053, 'WA': 0.065, 'WV': 0.06, 'WI': 0.05, 'WY': 0.04,
  'DC': 0.06
}

const US_STATES = Object.keys(TAX_RATES).sort()

export default function Checkout() {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [nftMinted, setNftMinted] = useState(false)
  const [orderId, setOrderId] = useState('') // Static order ID
  const [cartData, setCartData] = useState(null)
  const [currentStep, setCurrentStep] = useState(1) // 1: Shipping, 2: Payment

  // Image Generation State
  const [cosplayImage, setCosplayImage] = useState(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [imageError, setImageError] = useState(null)

  // NFT State
  const [nftStatus, setNftStatus] = useState('idle') // idle, minting

  // Checkout State
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  })

  const [taxAmount, setTaxAmount] = useState(0)
  const [formErrors, setFormErrors] = useState({})

  // Sponsor Integration State
  const [isPriceLocked, setIsPriceLocked] = useState(false)
  const [lockCountdown, setLockCountdown] = useState(24 * 60 * 60) // 24 hours in seconds
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [priceChanges, setPriceChanges] = useState({}) // Track price changes per item

  useEffect(() => {
    console.log('🔵 Checkout page mounted')

    // Check auth
    const isAuthenticated = sessionStorage.getItem('isAuthenticated')
    console.log('Auth status:', isAuthenticated)

    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to auth')
      navigate('/auth')
      return
    }

    document.documentElement.classList.add('dark')

    // Load cart data
    const cart = sessionStorage.getItem('cart')
    console.log('📦 Raw cart from sessionStorage:', cart)

    if (cart) {
      try {
        const parsedCart = JSON.parse(cart)
        console.log('✅ Parsed cart data:', parsedCart)
        console.log('  - Character:', parsedCart.characterName)
        console.log('  - Tier:', parsedCart.tier)
        console.log('  - Items:', parsedCart.items)
        console.log('  - Total:', parsedCart.total)
        setCartData(parsedCart)
      } catch (error) {
        console.error('❌ Failed to parse cart data:', error)
      }
    } else {
      console.warn('⚠️ No cart data found in sessionStorage')
    }
  }, [navigate])

  // Recalculate tax when state changes
  useEffect(() => {
    if (cartData?.total && shippingInfo.state && TAX_RATES[shippingInfo.state] !== undefined) {
      const rate = TAX_RATES[shippingInfo.state]
      setTaxAmount(cartData.total * rate)
    } else {
      setTaxAmount(0)
    }
  }, [shippingInfo.state, cartData])

  // Generate cosplay preview image when cart data is available or changes
  useEffect(() => {
    console.log('🔍 [Checkout] Image loading effect triggered')
    console.log('  - Cart data exists:', !!cartData)
    console.log('  - Has generatedImage:', !!cartData?.generatedImage)

    if (!cartData) {
      console.log('⚠️ [Checkout] No cart data available')
      return
    }

    // Check if we have a pre-generated image from TryOnLab
    if (cartData.generatedImage) {
      console.log('✅ [Checkout] Using pre-generated image from Simulation Lab')
      console.log('  - Image data length:', cartData.generatedImage.length)
      console.log('  - Gender used:', cartData.gender)
      setCosplayImage(cartData.generatedImage)
      setIsGeneratingImage(false)
      return
    }

    // If no pre-generated image, show message (shouldn't happen normally)
    console.log('⚠️ [Checkout] No pre-generated image found - user may have skipped TryOnLab')
    setImageError('No preview image available')
    setIsGeneratingImage(false)
  }, [cartData])

  // Countdown timer for price lock
  useEffect(() => {
    if (isPriceLocked && lockCountdown > 0) {
      const timer = setInterval(() => {
        setLockCountdown(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isPriceLocked, lockCountdown])

  // Generate mock price changes for items
  useEffect(() => {
    if (cartData?.items && Object.keys(priceChanges).length === 0) {
      const changes = {}
      cartData.items.forEach((item, idx) => {
        // Random price change between -35% and +20%
        const changePercent = (Math.random() * 55 - 35).toFixed(1)
        changes[idx] = {
          percent: changePercent,
          trend: Array.from({ length: 10 }, () => Math.random() * 50 + 25) // Sparkline data
        }
      })
      setPriceChanges(changes)
    }
  }, [cartData?.items])

  const handleRefreshPrices = () => {
    setIsRefreshing(true)
    // Regenerate price changes with new random values
    const changes = {}
    cartData?.items?.forEach((item, idx) => {
      const changePercent = (Math.random() * 55 - 35).toFixed(1)
      changes[idx] = {
        percent: changePercent,
        trend: Array.from({ length: 10 }, () => Math.random() * 50 + 25)
      }
    })
    setPriceChanges(changes)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const handleActivatePriceLock = () => {
    setIsPriceLocked(true)
    setLockCountdown(24 * 60 * 60) // Reset to 24:00:00
  }

  const formatCountdown = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const calculatePotentialSavings = () => {
    if (!cartData?.items) return 0
    return cartData.items.reduce((sum, item, idx) => {
      const change = priceChanges[idx]
      if (change && parseFloat(change.percent) < 0) {
        return sum + (item.price * Math.abs(parseFloat(change.percent)) / 100)
      }
      return sum
    }, 0)
  }

  const validateShipping = () => {
    const errors = {}
    if (!shippingInfo.fullName) errors.fullName = "Full Name is required"
    if (!shippingInfo.address) errors.address = "Address is required"
    if (!shippingInfo.city) errors.city = "City is required"
    if (!shippingInfo.state) errors.state = "State is required"
    if (!shippingInfo.zip) errors.zip = "ZIP Code is required"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePayment = () => {
    const errors = {}
    if (!paymentInfo.cardName) errors.cardName = "Name on card is required"
    if (!paymentInfo.cardNumber || paymentInfo.cardNumber.length < 16) errors.cardNumber = "Valid card number required"
    if (!paymentInfo.expiry) errors.expiry = "Expiry required"
    if (!paymentInfo.cvc || paymentInfo.cvc.length < 3) errors.cvc = "Valid CVC required"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateShipping()) setCurrentStep(2)
    } else if (currentStep === 2) {
      // Submit
      if (validatePayment()) handleCheckout()
    }
  }

  const handleCheckout = () => {
    setIsProcessing(true)
    // Generate order ID once when checkout is confirmed
    const newOrderId = Math.random().toString(36).substr(2, 9).toUpperCase()
    setOrderId(newOrderId)
    setTimeout(() => {
      setNftMinted(true)
      setIsProcessing(false)
    }, 2500)
  }

  const handleInputChange = (e, section) => {
    const { name, value } = e.target
    if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [name]: value }))
    } else {
      // Basic formatting for card number
      let formattedValue = value
      if (name === 'cardNumber') {
        formattedValue = value.replace(/\D/g, '').slice(0, 16)
      }
      setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }))
    }
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <header className="w-full px-6 pt-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2 group">
              <SolanaIcon className="w-6 h-6 text-neon-purple group-hover:text-white transition" />
              <span className="font-display font-bold tracking-wider group-hover:text-neon-cyan transition">COSPLAYFORGE</span>
            </div>
            <span className="text-slate-600 text-sm">/</span>
            <span className="text-slate-400 text-sm font-mono">SECURE_CHECKOUT</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              ENCRYPTED_SESSION
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-6xl mx-auto px-4 pb-20">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Checkout Forms */}
          <div className="lg:col-span-2 space-y-6">

            {/* Steps Indicator */}
            {!nftMinted && (
              <div className="flex items-center justify-between mb-8 px-4">
                <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-neon-cyan' : 'text-slate-600'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${currentStep >= 1 ? 'border-neon-cyan bg-neon-cyan/10' : 'border-slate-700'}`}>1</div>
                  <span className="font-mono text-sm hidden md:block">SHIPPING</span>
                </div>
                <div className={`h-px flex-1 mx-4 ${currentStep >= 2 ? 'bg-neon-cyan' : 'bg-slate-800'}`}></div>
                <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-neon-cyan' : 'text-slate-600'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${currentStep >= 2 ? 'border-neon-cyan bg-neon-cyan/10' : 'border-slate-700'}`}>2</div>
                  <span className="font-mono text-sm hidden md:block">PAYMENT</span>
                </div>
                <div className={`h-px flex-1 mx-4 ${nftMinted ? 'bg-neon-cyan' : 'bg-slate-800'}`}></div>
                <div className={`flex items-center gap-2 ${nftMinted ? 'text-neon-cyan' : 'text-slate-600'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${nftMinted ? 'border-neon-cyan bg-neon-cyan/10' : 'border-slate-700'}`}>3</div>
                  <span className="font-mono text-sm hidden md:block">CONFIRMATION</span>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* STEP 1: SHIPPING */}
              {currentStep === 1 && !nftMinted && (
                <motion.div
                  key="step1"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="glass-panel p-8 rounded-xl border border-slate-800 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan"></div>
                  <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-neon-cyan" />
                    SHIPPING_DETAILS
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-400 font-mono mb-1 block">FULL_NAME</label>
                      <input
                        type="text"
                        name="fullName"
                        autoComplete="name"
                        value={shippingInfo.fullName}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        className={`w-full bg-black/40 border ${formErrors.fullName ? 'border-red-500' : 'border-slate-700'} rounded p-3 text-white focus:border-neon-cyan outline-none transition font-mono`}
                        placeholder="John Doe"
                      />
                      {formErrors.fullName && <p className="text-red-500 text-[10px] mt-1 font-mono">{formErrors.fullName}</p>}
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 font-mono mb-1 block">STREET_ADDRESS</label>
                      <input
                        type="text"
                        name="address"
                        autoComplete="shipping address-line1"
                        value={shippingInfo.address}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        className={`w-full bg-black/40 border ${formErrors.address ? 'border-red-500' : 'border-slate-700'} rounded p-3 text-white focus:border-neon-cyan outline-none transition font-mono`}
                        placeholder="123 Cyber Lane"
                      />
                      {formErrors.address && <p className="text-red-500 text-[10px] mt-1 font-mono">{formErrors.address}</p>}

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-400 font-mono mb-1 block">CITY</label>
                        <input
                          type="text"
                          name="city"
                          autoComplete="address-level2"
                          value={shippingInfo.city}
                          onChange={(e) => handleInputChange(e, 'shipping')}
                          className={`w-full bg-black/40 border ${formErrors.city ? 'border-red-500' : 'border-slate-700'} rounded p-3 text-white focus:border-neon-cyan outline-none transition font-mono`}
                          placeholder="Neo Tokyo"
                        />
                        {formErrors.city && <p className="text-red-500 text-[10px] mt-1 font-mono">{formErrors.city}</p>}
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-mono mb-1 block">STATE_/_PROVINCE</label>
                        <select
                          name="state"
                          autoComplete="address-level1"
                          value={shippingInfo.state}
                          onChange={(e) => handleInputChange(e, 'shipping')}
                          className={`w-full bg-black/40 border ${formErrors.state ? 'border-red-500' : 'border-slate-700'} rounded p-3 text-white focus:border-neon-cyan outline-none transition font-mono appearance-none`}
                        >
                          <option value="">Select State</option>
                          {US_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        {formErrors.state && <p className="text-red-500 text-[10px] mt-1 font-mono">{formErrors.state}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-400 font-mono mb-1 block">ZIP_CODE</label>
                        <input
                          type="text"
                          name="zip"
                          autoComplete="postal-code"
                          value={shippingInfo.zip}
                          onChange={(e) => handleInputChange(e, 'shipping')}
                          className={`w-full bg-black/40 border ${formErrors.zip ? 'border-red-500' : 'border-slate-700'} rounded p-3 text-white focus:border-neon-cyan outline-none transition font-mono`}
                          placeholder="90210"
                        />
                        {formErrors.zip && <p className="text-red-500 text-[10px] mt-1 font-mono">{formErrors.zip}</p>}
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-mono mb-1 block">COUNTRY</label>
                        <select
                          name="country"
                          autoComplete="country-name"
                          value={shippingInfo.country}
                          onChange={(e) => handleInputChange(e, 'shipping')}
                          className="w-full bg-black/40 border border-slate-700 rounded p-3 text-white focus:border-neon-cyan outline-none transition font-mono"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Japan">Japan</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-8 rounded shadow-[0_0_25px_rgba(16,185,129,0.5)] transition transform hover:scale-[1.02] flex items-center gap-2 group"
                    >
                      PROCEED_TO_PAYMENT <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PAYMENT */}
              {currentStep === 2 && !nftMinted && (
                <motion.div
                  key="step2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="glass-panel p-8 rounded-xl border border-slate-800 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-neon-purple"></div>

                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold text-white flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-neon-purple" />
                      PAYMENT_METHOD
                    </h2>
                    <button onClick={() => setCurrentStep(1)} className="text-xs text-slate-500 hover:text-white flex items-center gap-1 font-mono">
                      <Edit2 className="w-3 h-3" /> EDIT_SHIPPING
                    </button>
                  </div>

                  <div className="mb-6 p-4 bg-blue-900/10 border border-blue-500/30 rounded flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <div className="text-xs text-blue-200">
                      <span className="font-bold">SECURE_TRANSACTION:</span> All payment data is encrypted via 256-bit SSL protocol.
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-400 font-mono mb-1 block">NAME_ON_CARD</label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={(e) => handleInputChange(e, 'payment')}
                        className={`w-full bg-black/40 border ${formErrors.cardName ? 'border-red-500' : 'border-slate-700'} rounded p-3 text-white focus:border-neon-purple outline-none transition font-mono`}
                        placeholder="JOHN DOE"
                      />
                      {formErrors.cardName && <p className="text-red-500 text-[10px] mt-1 font-mono">{formErrors.cardName}</p>}
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 font-mono mb-1 block">CARD_NUMBER</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => handleInputChange(e, 'payment')}
                          className={`w-full bg-black/40 border ${formErrors.cardNumber ? 'border-red-500' : 'border-slate-700'} rounded p-3 text-white focus:border-neon-purple outline-none transition font-mono pl-12`}
                          placeholder="0000 0000 0000 0000"
                          maxLength={16}
                        />
                        <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                      </div>
                      {formErrors.cardNumber && <p className="text-red-500 text-[10px] mt-1 font-mono">{formErrors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-400 font-mono mb-1 block">EXPIRY_DATE</label>
                        <input
                          type="text"
                          name="expiry"
                          value={paymentInfo.expiry}
                          onChange={(e) => handleInputChange(e, 'payment')}
                          className={`w-full bg-black/40 border ${formErrors.expiry ? 'border-red-500' : 'border-slate-700'} rounded p-3 text-white focus:border-neon-purple outline-none transition font-mono`}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {formErrors.expiry && <p className="text-red-500 text-[10px] mt-1 font-mono">{formErrors.expiry}</p>}
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-mono mb-1 block">CVC_/_CVV</label>
                        <div className="relative">
                          <input
                            type="password"
                            name="cvc"
                            value={paymentInfo.cvc}
                            onChange={(e) => handleInputChange(e, 'payment')}
                            className={`w-full bg-black/40 border ${formErrors.cvc ? 'border-red-500' : 'border-slate-700'} rounded p-3 text-white focus:border-neon-purple outline-none transition font-mono`}
                            placeholder="123"
                            maxLength={4}
                          />
                          <Lock className="absolute right-4 top-3.5 w-4 h-4 text-slate-600" />
                        </div>
                        {formErrors.cvc && <p className="text-red-500 text-[10px] mt-1 font-mono">{formErrors.cvc}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <button onClick={() => setCurrentStep(1)} className="text-slate-400 hover:text-white text-sm font-mono transition">
                      &lt; BACK
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-8 rounded shadow-[0_0_25px_rgba(16,185,129,0.5)] transition transform hover:scale-[1.02] flex items-center gap-2 group relative overflow-hidden"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2 font-mono text-sm">
                          PROCESSING_TX...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 font-mono text-sm tracking-widest">
                          COMPLETE_ORDER <Check className="w-4 h-4 group-hover:scale-125 transition" />
                        </span>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SUCCESS */}
              {nftMinted && (
                <motion.div
                  key="success"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="glass-panel p-8 rounded-xl border border-green-500/30 text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <Check className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white mb-2">ORDER_CONFIRMED</h2>
                  <p className="text-slate-400 font-mono text-sm mb-6">Your cosplay build has been initialized.</p>

                  <div className="bg-black/40 rounded p-4 max-w-md mx-auto mb-8 border border-slate-800 text-left">
                    <div className="flex justify-between text-xs font-mono text-slate-500 mb-2">
                      <span>ORDER_ID:</span>
                      <span className="text-white">#{orderId}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-slate-500 mb-2">
                      <span>SHIPPED_TO:</span>
                      <span className="text-white">{shippingInfo.fullName}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-slate-500">
                      <span>EST_DELIVERY:</span>
                      <span className="text-green-400">5-7 Business Days</span>
                    </div>
                  </div>

                  <button onClick={() => navigate('/')} className="text-neon-cyan hover:underline text-sm font-mono">
                    RETURN_TO_LAB
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Sponsor Integrations - Trading Terminal Style */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">

              {/* SNOWFLAKE MARKET INTELLIGENCE */}
              <div className="glass-panel rounded-xl border border-cyan-500/40 overflow-hidden relative group hover:border-cyan-400/60 transition-all duration-300">
                {/* Animated wave background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-cyan-600 animate-pulse"></div>
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="wave" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                        <path d="M0 10 Q 25 0, 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="1" className="text-cyan-400" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#wave)" />
                  </svg>
                </div>

                <div className="relative z-10 p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span className="text-xs font-bold text-cyan-300 tracking-wider">SNOWFLAKE MARKET INTELLIGENCE</span>
                    </div>
                    <button
                      onClick={handleRefreshPrices}
                      disabled={isRefreshing}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Hot Insight Box */}
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-mono text-orange-400 mb-1 font-bold">🔥 HOT INSIGHT</div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          EVA foam <TrendingDown className="inline w-3 h-3 text-green-400" /> <span className="text-green-400 font-bold">28%</span> after factory expansion
                        </p>
                        <p className="text-[9px] text-orange-300/80 mt-1 font-mono">
                          💡 LOCK NOW before convention season demand surge
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Item Price Trends */}
                  <div className="space-y-2 mb-4">
                    {cartData?.items?.slice(0, 3).map((item, idx) => {
                      const change = priceChanges[idx]
                      if (!change) return null
                      const isDecrease = parseFloat(change.percent) < 0

                      return (
                        <div key={idx} className="bg-black/40 rounded-lg p-2.5 border border-cyan-900/50 hover:border-cyan-700/50 transition-colors">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-slate-200 truncate flex-1 mr-2">{item.name}</span>
                            <div className="flex items-center gap-1">
                              {isDecrease ? (
                                <TrendingDown className="w-3 h-3 text-green-400" />
                              ) : (
                                <TrendingUp className="w-3 h-3 text-red-400" />
                              )}
                              <span className={`text-xs font-mono font-bold ${isDecrease ? 'text-green-400' : 'text-red-400'}`}>
                                {isDecrease ? '' : '+'}{change.percent}%
                              </span>
                            </div>
                          </div>
                          {/* Sparkline Chart */}
                          <svg className="w-full h-6" viewBox="0 0 100 20">
                            <polyline
                              points={change.trend.map((val, i) => `${i * 11},${20 - (val / 100 * 15)}`).join(' ')}
                              fill="none"
                              stroke={isDecrease ? '#4ade80' : '#f87171'}
                              strokeWidth="1.5"
                              className="opacity-70"
                            />
                          </svg>
                          <div className="text-[8px] text-slate-500 mt-1 font-mono">Last 90 days</div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Data Sources & Latency */}
                  <div className="flex items-center justify-between pt-3 border-t border-cyan-900/30">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[8px] bg-cyan-900/40 text-cyan-300 px-1.5 py-0.5 rounded font-mono">Michaels</span>
                      <span className="text-[8px] bg-cyan-900/40 text-cyan-300 px-1.5 py-0.5 rounded font-mono">Etsy</span>
                      <span className="text-[8px] bg-cyan-900/40 text-cyan-300 px-1.5 py-0.5 rounded font-mono">Amazon</span>
                    </div>
                    <span className="text-[9px] text-cyan-400 font-mono font-bold">47ms</span>
                  </div>
                </div>
              </div>

              {/* FLOWGLAD PRICE SHIELD */}
              <div className={`glass-panel rounded-xl border-2 overflow-hidden relative transition-all duration-500 ${isPriceLocked
                ? 'border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse'
                : 'border-indigo-500/40 hover:border-indigo-400/60'
                }`}>
                {/* Glow effect when locked */}
                {isPriceLocked && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10 animate-pulse"></div>
                )}

                <div className="relative z-10 p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className={`w-4 h-4 ${isPriceLocked ? 'text-blue-400' : 'text-indigo-400'}`} />
                      <span className="text-xs font-bold text-indigo-300 tracking-wider">FLOWGLAD PRICE SHIELD</span>
                    </div>
                    {isPriceLocked && (
                      <div className="flex items-center gap-1.5 bg-blue-500/20 px-2 py-1 rounded border border-blue-500/40">
                        <Clock className="w-3 h-3 text-blue-400 animate-pulse" />
                        <span className="text-xs font-mono text-blue-300 font-bold">{formatCountdown(lockCountdown)}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Box */}
                  <div className={`rounded-lg p-4 mb-4 border-2 ${isPriceLocked
                    ? 'bg-gradient-to-br from-blue-900/40 to-blue-800/30 border-blue-500/50'
                    : 'bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border-indigo-500/40'
                    }`}>
                    <div className="text-center">
                      {isPriceLocked && (
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Lock className="w-5 h-5 text-blue-400" />
                          <span className="text-sm font-bold text-blue-300 tracking-wider">PRICES SECURED</span>
                        </div>
                      )}
                      <div className="text-xs text-slate-400 mb-2 font-mono">
                        {isPriceLocked ? 'Total Savings Locked' : 'Potential Savings'}
                      </div>
                      <div className={`text-2xl font-mono font-bold mb-3 ${isPriceLocked ? 'text-green-400' : 'text-indigo-300'}`}>
                        ${calculatePotentialSavings().toFixed(2)}
                      </div>
                      <button
                        onClick={handleActivatePriceLock}
                        disabled={isPriceLocked}
                        className={`w-full font-bold py-2.5 px-4 rounded shadow-lg transition flex items-center justify-center gap-2 ${isPriceLocked
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white cursor-not-allowed opacity-90'
                          : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white transform hover:scale-[1.02]'
                          }`}
                      >
                        {isPriceLocked ? (
                          <>
                            <Lock className="w-4 h-4" />
                            <span className="text-xs tracking-wider">PRICE SHIELD ACTIVE • Secured ${calculatePotentialSavings().toFixed(2)}</span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4" />
                            <span className="text-xs tracking-wider">ACTIVATE PRICE SHIELD • Save ${calculatePotentialSavings().toFixed(2)}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Locked Items Preview */}
                  {isPriceLocked && (
                    <div className="space-y-2 mb-4">
                      {cartData?.items?.slice(0, 3).map((item, idx) => {
                        const change = priceChanges[idx]
                        if (!change || parseFloat(change.percent) >= 0) return null
                        const savings = item.price * Math.abs(parseFloat(change.percent)) / 100
                        const lockedPrice = item.price - savings

                        return (
                          <div key={idx} className="bg-blue-900/20 rounded-lg p-2 border border-blue-800/40">
                            <div className="text-xs text-slate-200 mb-1 truncate">{item.name}</div>
                            <div className="flex items-center gap-2 text-[10px] font-mono">
                              <span className="text-slate-500 line-through">${item.price.toFixed(2)}</span>
                              <span className="text-green-400 font-bold">${lockedPrice.toFixed(2)}</span>
                              <span className="text-green-400">(-${savings.toFixed(2)})</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Protection Stats & Historical Data */}
                  <div className="mb-4 space-y-2">
                    {/* Active Protection Badge */}
                    {isPriceLocked && (
                      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 rounded-lg p-2.5">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-[10px] text-green-400 font-mono font-bold">PROTECTION ACTIVE</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-xs font-mono font-bold text-blue-300">{cartData?.items?.length || 0}</div>
                            <div className="text-[8px] text-slate-500 font-mono">Items</div>
                          </div>
                          <div>
                            <div className="text-xs font-mono font-bold text-green-400">{Math.floor(calculatePotentialSavings() / (cartData?.total || 1) * 100)}%</div>
                            <div className="text-[8px] text-slate-500 font-mono">Saved</div>
                          </div>
                          <div>
                            <div className="text-xs font-mono font-bold text-indigo-300">{lockCountdown}s</div>
                            <div className="text-[8px] text-slate-500 font-mono">Remaining</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Historical Performance */}
                    <div className="bg-black/30 rounded-lg p-2.5 border border-indigo-900/40">
                      <div className="text-[10px] text-indigo-300 font-mono font-bold mb-2">📊 HISTORICAL PERFORMANCE</div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-400 font-mono">Avg. savings/order</span>
                          <span className="text-[9px] text-green-400 font-mono font-bold">$47.83</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-400 font-mono">Peak save rate</span>
                          <span className="text-[9px] text-green-400 font-mono font-bold">31.4%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-400 font-mono">Protected users</span>
                          <span className="text-[9px] text-blue-400 font-mono font-bold">18,247</span>
                        </div>
                      </div>
                    </div>

                    {/* Real-time Market Activity */}
                    {!isPriceLocked && (
                      <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-lg p-2.5 border border-purple-700/40">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Activity className="w-3 h-3 text-purple-400 animate-pulse" />
                          <span className="text-[10px] text-purple-300 font-mono font-bold">LIVE MARKET ACTIVITY</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[9px]">
                            <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-slate-400 font-mono">3 suppliers raised prices in last 5min</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px]">
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-slate-400 font-mono">12 active price locks by other users</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Info */}
                  <div className="space-y-2 pt-3 border-t border-indigo-900/30">
                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                      <span>🛡️ 200+ craft suppliers monitored</span>
                    </div>
                    {!isPriceLocked && (
                      <div className="flex items-start gap-1.5 bg-yellow-900/20 border border-yellow-700/40 rounded p-2">
                        <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-[9px] text-yellow-300 font-mono">
                          Prices update every 90 seconds when unlocked
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="space-y-6">

            {/* Order Summary Box */}
            <div className="glass-panel p-6 rounded-xl border border-neon-purple/30 sticky top-8">
              <h3 className="text-sm font-display font-bold text-white mb-4 tracking-wider border-b border-white/10 pb-2">ORDER_DETAILS</h3>

              {/* AI Generated Cosplay Preview Image */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">AI Preview</p>
                </div>
                <div className="rounded-lg overflow-hidden border border-slate-700 bg-black/40">
                  {isGeneratingImage ? (
                    <div className="aspect-square flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/20 to-cyan-900/20">
                      <Loader className="w-8 h-8 text-neon-cyan animate-spin mb-3" />
                      <p className="text-xs font-mono text-slate-400">GENERATING_PREVIEW...</p>
                      <p className="text-[9px] font-mono text-slate-500 mt-1">This may take 10-30s</p>
                    </div>
                  ) : cosplayImage ? (
                    <div className="relative group">
                      <img
                        src={cosplayImage}
                        alt="AI Generated Cosplay Preview"
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-[10px] font-mono text-white/90">
                            AI GENERATED PREVIEW
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">
                            {cartData?.characterName} - {cartData?.tier?.toUpperCase()} TIER
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : imageError ? (
                    <div className="aspect-square flex flex-col items-center justify-center bg-red-900/10 border border-red-500/20 p-4">
                      <X className="w-8 h-8 text-red-400 mb-2" />
                      <p className="text-xs font-mono text-red-400 text-center">
                        IMAGE_GENERATION_FAILED
                      </p>
                      <p className="text-[9px] font-mono text-red-300 text-center mt-1">
                        {imageError}
                      </p>
                    </div>
                  ) : (
                    <div className="aspect-square flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                      <p className="text-xs font-mono text-slate-500">AWAITING_DATA...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Items Preview (Collapsed) */}
              <div className="mb-4 space-y-2 max-h-40 overflow-hidden pr-2">
                {cartData?.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-slate-400">
                    <span className="truncate max-w-[150px]">{item.name}</span>
                    <span className="text-slate-300">${item.price.toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 font-mono text-xs mb-6 border-t border-slate-800 pt-4">
                <div className="flex justify-between text-slate-400">
                  <span>SUBTOTAL</span>
                  <span className="text-slate-200">${cartData?.total?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>SHIPPING</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>TAX_{shippingInfo.state ? `(${shippingInfo.state})` : '(EST)'}</span>
                  <span className="text-slate-200">${taxAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-700 py-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-white">TOTAL</span>
                  <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-neon-cyan text-glow">
                      ${((cartData?.total || 0) + taxAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Solana / Figma Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {/* NFT Certificate Button */}
                <div className="space-y-2">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-200 font-mono tracking-wider font-semibold">POWERED BY SOLANA</span>
                  </div>
                  {nftStatus === 'idle' ? (
                    <button
                      onClick={() => setNftStatus('minting')}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded shadow-[0_0_15px_rgba(99,102,241,0.4)] transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <SolanaIcon className="w-4 h-4" />
                      <span className="font-mono text-xs tracking-wider">NFT_CERT</span>
                    </button>
                  ) : (
                    <div className="bg-indigo-950/50 border border-indigo-500/50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Loader className="w-3 h-3 text-indigo-400 animate-spin" />
                        <span className="text-[10px] font-mono text-indigo-300 font-bold tracking-wider">MINTING_IN_PROGRESS</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden relative">
                        <div className="absolute inset-0 bg-indigo-500/20 animate-pulse"></div>
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "25%" }}
                          transition={{ duration: 2, ease: "easeOut" }}
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full relative z-10"
                        />
                      </div>

                      <div className="bg-indigo-900/20 rounded p-2 border border-indigo-500/20">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <span className="text-[10px] text-slate-300 font-mono">EST_TIME:</span>
                          <span className="text-[10px] text-white font-mono font-bold">4-8 HOURS</span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-mono leading-tight">
                          Network congestion may vary.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Design File Download Button */}
                <div className="space-y-2">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-200 font-mono tracking-wider font-semibold">POWERED BY FIGMA</span>
                  </div>
                  <button
                    onClick={() => {
                      if (cosplayImage) {
                        const link = document.createElement('a')
                        link.href = cosplayImage
                        link.download = 'nfccosplay.png'
                        link.click()
                        console.log('💾 Image downloaded as nfccosplay.png')
                      } else {
                        console.warn('⚠️ No image available to download')
                      }
                    }}
                    disabled={!cosplayImage || isGeneratingImage}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded shadow-[0_0_15px_rgba(168,85,247,0.4)] transition transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Download className="w-4 h-4" />
                    <span className="font-mono text-xs tracking-wider">DESIGN_FILE</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
