import { ShoppingCart, Zap as SolanaIcon, Download, TrendingDown, Lock, Check, X, CreditCard, ShieldCheck, MapPin, Truck, ChevronRight, Edit2 } from 'lucide-react'
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
  const [cartData, setCartData] = useState(null)
  const [currentStep, setCurrentStep] = useState(1) // 1: Shipping, 2: Payment

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

  useEffect(() => {
    // Check auth
    const isAuthenticated = sessionStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }

    document.documentElement.classList.add('dark')

    // Load cart data
    const cart = sessionStorage.getItem('cart')
    if (cart) {
      const parsedCart = JSON.parse(cart)
      setCartData(parsedCart)
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
                      className="bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-bold py-3 px-8 rounded transition flex items-center gap-2 group"
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
                            type="text"
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
                      className="bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-purple/80 hover:to-neon-cyan/80 text-white font-bold py-3 px-8 rounded shadow-[0_0_20px_rgba(139,92,246,0.3)] transition transform hover:scale-[1.02] flex items-center gap-2 group relative overflow-hidden"
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
                      <span className="text-white">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
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

            {/* Sponsor Integrations (Kept below for context) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {/* Snowflake */}
              <div className="glass-panel p-4 rounded-lg border border-slate-800 opacity-60 hover:opacity-100 transition">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-blue-900/50 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono">SNOWFLAKE</span>
                  <span className="text-xs font-bold text-slate-300">MARKET_ANALYSIS</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  "{snowflakeInsight.insight}"
                </p>
              </div>

              {/* FlowGlad */}
              <div className="glass-panel p-4 rounded-lg border border-slate-800 opacity-60 hover:opacity-100 transition">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-green-900/50 text-green-300 border border-green-500/30 px-1.5 py-0.5 rounded font-mono">FLOWGLAD</span>
                  <span className="text-xs font-bold text-slate-300">PRICE_LOCK</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>LOCKED_RATE: <span className="text-green-400">{flowgladLock.lockedPrice}</span></span>
                  <span>{flowgladLock.timer}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="space-y-6">

            {/* Order Summary Box */}
            <div className="glass-panel p-6 rounded-xl border border-neon-purple/30 sticky top-8">
              <h3 className="text-sm font-display font-bold text-white mb-4 tracking-wider border-b border-white/10 pb-2">ORDER_DETAILS</h3>

              {/* Cart Items Preview (Collapsed) */}
              <div className="mb-4 space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
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

              {/* Solana / Figma Badges */}
              <div className="flex gap-2 mt-4">
                <div className="flex-1 bg-indigo-900/20 border border-indigo-500/30 rounded p-2 text-center">
                  <span className="text-[10px] text-indigo-300 font-mono flex items-center justify-center gap-1">
                    <SolanaIcon className="w-3 h-3" /> NFT_CERT
                  </span>
                </div>
                <div className="flex-1 bg-purple-900/20 border border-purple-500/30 rounded p-2 text-center">
                  <span className="text-[10px] text-purple-300 font-mono flex items-center justify-center gap-1">
                    <Download className="w-3 h-3" /> FIGMA_DOC
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
