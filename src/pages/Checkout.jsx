import { ShoppingCart, Zap as SolanaIcon, Download, TrendingDown, Lock, Sun, Moon, Check, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { solanaNft, flowgladLock, figmaExport, snowflakeInsight, vultrBadge } from '../simulation/sponsorMocks'

export default function Checkout() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [nftMinted, setNftMinted] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [cartData, setCartData] = useState(null)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark
    setIsDark(initialDark)
    document.documentElement.classList.toggle('dark', initialDark)

    // Load cart data from sessionStorage
    const cart = sessionStorage.getItem('cart')
    if (cart) {
      const parsedCart = JSON.parse(cart)
      setCartData(parsedCart)
      
      // Calculate average rating
      if (parsedCart.items && parsedCart.items.length > 0) {
        const avgRating = (parsedCart.items.reduce((sum, item) => sum + parseFloat(item.rating || 0), 0) / parsedCart.items.length).toFixed(1)
        setAverageRating(avgRating)
      }
    }
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  const handleCheckout = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setNftMinted(true)
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div 
      className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden flex flex-col"
      style={{
        width: '100vw',
        maxWidth: '100vw',
        overflowX: 'hidden',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)'
      }}
    >
      <header className="w-full px-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="text-lg md:text-xl font-bold tracking-wide text-slate-900 dark:text-white">CosplayForge</div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-sm font-semibold px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-white transition"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="text-sm font-semibold px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 transition flex items-center gap-2"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      </header>

      <div className="w-full flex-1 px-8 py-8 flex justify-center">
        <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-green-600 dark:text-green-400" />
            Order Summary & Checkout
          </h1>
          <p className="text-slate-700 dark:text-slate-400">Review your selected cosplay items before completing purchase</p>
          {cartData && <p className="text-sm text-slate-600 dark:text-slate-500 mt-2">Build: <span className="font-semibold capitalize">{cartData.characterName}</span> - <span className="capitalize">{cartData.tier}</span> Tier</p>}
        </div>

        {/* Order Items */}
        {cartData && cartData.items && cartData.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {cartData.items.map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-5 hover:shadow-lg transition duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg">{item.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{item.material}</p>
                  </div>
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-3 line-clamp-2">{item.description}</p>
                
                <div className="space-y-2 bg-white dark:bg-slate-800/50 rounded p-3 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Price</span>
                    <span className="font-bold text-green-600 dark:text-green-400">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Seller</span>
                    <span className="text-slate-900 dark:text-slate-200 text-right max-w-xs">{item.seller}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Rating</span>
                    <span className="text-yellow-600 dark:text-yellow-400">⭐ {item.rating} / 5.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Stock</span>
                    <span className={item.inStock ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-red-600 dark:text-red-400'}>{item.inStock ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                </div>
                
                <a href={item.sellerLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  View on {item.seller} →
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-500 rounded-lg p-6 mb-8">
            <p className="text-yellow-800 dark:text-yellow-300 font-semibold">No items in cart. Please go back and select items from your build.</p>
          </div>
        )}

        {/* Order summary */}
        {cartData && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 border-2 border-green-400 dark:border-green-500 rounded-lg p-6 mb-6">
            <h2 className="text-slate-900 dark:text-green-200 font-bold mb-4 text-lg">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-700 dark:text-green-300">
                <span>Selected Items ({cartData.items?.length || 0})</span>
                <span className="text-slate-900 dark:text-green-400 font-semibold">${cartData.total?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-green-300">
                <span>Average Rating</span>
                <span className="text-yellow-600 dark:text-yellow-400 font-semibold">⭐ {averageRating}</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-green-300">
                <span>Average Item Cost</span>
                <span className="text-slate-900 dark:text-green-400 font-semibold">${cartData.items && cartData.items.length > 0 ? (cartData.total / cartData.items.length).toFixed(2) : '0.00'}</span>
              </div>

              <div className="border-t border-green-400 dark:border-green-500 pt-3 mt-3">
                <div className="flex justify-between text-slate-700 dark:text-green-300 font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-700 dark:text-green-300">${cartData.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shipping info */}
        <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-400 dark:border-blue-500 rounded-lg p-6 mb-6">
          <h3 className="text-slate-900 dark:text-blue-200 font-bold mb-4">Shipping & Delivery</h3>
          <div className="space-y-2 text-slate-700 dark:text-blue-300 text-sm">
            <p>✓ Estimated delivery: 5-7 business days</p>
            <p>✓ Free shipping included</p>
            <p>✓ Tracking number will be provided</p>
            <p className="text-xs text-slate-600 dark:text-blue-400 mt-3">Your cart items will be shipped from multiple sellers. Delivery times may vary.</p>
          </div>
        </div>

        {/* Build Info */}
        {cartData && (
          <div className="bg-indigo-100 dark:bg-indigo-900/20 border border-indigo-400 dark:border-indigo-500 rounded-lg p-6 mb-6">
            <h3 className="text-slate-900 dark:text-indigo-200 font-bold mb-3 flex items-center gap-2">
              <span className="text-lg">🎨</span>
              Your Build Details
            </h3>
            <div className="space-y-2 text-slate-700 dark:text-indigo-300 text-sm">
              <p><span className="font-semibold">Character:</span> {cartData.characterName}</p>
              <p><span className="font-semibold">Tier:</span> <span className="capitalize font-bold text-indigo-600 dark:text-indigo-400">{cartData.tier}</span></p>
              <p><span className="font-semibold">Items:</span> {cartData.items?.length || 0} selected</p>
            </div>
          </div>
        )}

        {/* Checkout button */}
        {!nftMinted ? (
          <button
            onClick={handleCheckout}
            disabled={isProcessing || !cartData || !cartData.items || cartData.items.length === 0}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition duration-300 text-lg flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin">⚙️</div>
                Processing Order...
              </>
            ) : cartData && cartData.items && cartData.items.length > 0 ? (
              <>
                <ShoppingCart className="w-5 h-5" />
                Complete Order → ${cartData.total?.toFixed(2) || '0.00'}
              </>
            ) : (
              <>
                <X className="w-5 h-5" />
                No items selected
              </>
            )}
          </button>
        ) : (
          <div className="bg-green-900/20 border-2 border-green-500 rounded-lg p-6 text-center">
            <h2 className="text-green-400 font-bold text-xl mb-2">✓ Order Confirmation!</h2>
            <p className="text-green-300 mb-3">Your cosplay build order has been placed successfully</p>
            <p className="text-xs text-green-400 font-mono">Order ID: {solanaNft.transactionHash.substring(0, 16)}</p>
            <p className="text-xs text-green-400 mt-2">Tracking information will be sent to your email</p>
          </div>
        )}

        <p className="text-slate-500 dark:text-slate-400 text-xs text-center mt-4">
          This is a demonstration. Order details are displayed for review purposes.
        </p>

        {/* Sponsor Features Grid - Figma, Snowflake, FlowGlad, Solana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mb-8">
          {/* Figma Blueprint Export */}
          <div className="bg-purple-100 dark:bg-purple-900/30 border border-purple-400 dark:border-purple-500 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">FIGMA</span>
              <h3 className="text-slate-900 dark:text-purple-200 font-bold">Blueprint Export</h3>
            </div>
            <p className="text-slate-700 dark:text-purple-300 text-sm mb-4">
              {figmaExport.projectName}
            </p>
            <div className="space-y-2 mb-4">
              {figmaExport.layers.slice(0, 4).map((layer, idx) => (
                <p key={idx} className="text-xs text-slate-600 dark:text-purple-400">• {layer}</p>
              ))}
              <p className="text-xs text-slate-600 dark:text-purple-400">+ {figmaExport.layers.length - 4} more layers</p>
            </div>
            <button className="w-full bg-purple-200 dark:bg-purple-950 hover:bg-purple-300 dark:hover:bg-purple-900 text-slate-900 dark:text-purple-200 py-2 px-3 rounded text-sm flex items-center justify-center gap-2 transition">
              <Download className="w-4 h-4" />
              Download .fig
            </button>
          </div>

          {/* Snowflake Analytics */}
          <div className="bg-purple-100 dark:bg-purple-900/30 border border-purple-400 dark:border-purple-500 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">SNOWFLAKE</span>
              <h3 className="text-slate-900 dark:text-purple-200 font-bold">Price Analysis</h3>
            </div>
            <p className="text-slate-700 dark:text-purple-300 text-sm mb-3">
              {snowflakeInsight.insight}
            </p>
            <div className="bg-purple-200 dark:bg-purple-950 rounded p-3 mb-3">
              <div className="flex items-center justify-between text-xs text-slate-700 dark:text-purple-300 mb-2">
                <span>Material Price History</span>
                <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs text-cyan-700 dark:text-cyan-400">↓ 38% price drop detected</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-purple-400">Trend: {snowflakeInsight.marketTrend}</p>
          </div>

          {/* FlowGlad Price Lock */}
          <div className="bg-purple-100 dark:bg-purple-900/30 border border-purple-400 dark:border-purple-500 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="text-slate-900 dark:text-purple-200 font-bold">Price Lock Active</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 dark:text-purple-300 text-sm">Original Price:</span>
                <span className="text-slate-600 dark:text-purple-400 line-through">{flowgladLock.originalPrice}</span>
              </div>
              <div className="flex justify-between items-center bg-green-100 dark:bg-green-900/20 border border-green-600 rounded p-2">
                <span className="text-green-800 dark:text-green-300 text-sm font-bold">Locked Price:</span>
                <span className="text-green-800 dark:text-green-400 font-bold">{flowgladLock.lockedPrice}</span>
              </div>
              <p className="text-center text-green-800 dark:text-green-400 font-mono text-xs">{flowgladLock.timer}</p>
              <p className="text-xs text-green-800 dark:text-green-300">{flowgladLock.badge}</p>
            </div>
          </div>

          {/* Solana NFT Certification */}
          <div className="bg-purple-100 dark:bg-purple-900/30 border border-purple-400 dark:border-purple-500 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">SOLANA</span>
              <h3 className="text-slate-900 dark:text-purple-200 font-bold">NFT Certification</h3>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-slate-900 dark:text-purple-300 font-semibold">{solanaNft.metadata.name}</p>
              <p className="text-xs text-slate-600 dark:text-purple-400">Creator: {solanaNft.metadata.creator}</p>
              <p className="text-xs text-slate-600 dark:text-purple-400">Build Time: {solanaNft.metadata.constructionTime}</p>
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-2 transition">
              <SolanaIcon className="w-4 h-4" />
              Mint as NFT
            </button>
          </div>
        </div>

        {/* Solana NFT Info Details */}
        <div className="bg-purple-100 dark:bg-purple-900/40 border border-indigo-500 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">SOLANA</span>
            <h3 className="text-slate-900 dark:text-purple-200 font-bold">Verified Build NFT Certificate</h3>
          </div>
          <p className="text-slate-700 dark:text-purple-300 text-sm mb-3">
            Your cosplay will be minted as a verified NFT on Solana blockchain to prove authenticity and official recognition.
          </p>
          <div className="bg-purple-200 dark:bg-purple-950 rounded p-3 text-xs text-slate-700 dark:text-purple-400">
            <p className="mb-2">Transaction: {solanaNft.transactionHash.substring(0, 20)}...</p>
            <p>Contract: {solanaNft.contractAddress}</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
