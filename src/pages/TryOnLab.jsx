import { useNavigate } from 'react-router-dom'
import { Eye, Volume2, ShoppingCart, Loader, Check, X, Zap, Scan, Activity, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import { tryOnPresets, characterVoices } from '../simulation/sponsorMocks'
import { generateTryOnImage, generateOutfitVariations } from '../services/generationService'
import { motion, AnimatePresence } from 'framer-motion'
import { generateCharacterImage, generateCharacterVariation, regenerateCharacterImage } from '../services/stabilityAiService'

export default function TryOnLab() {
  const navigate = useNavigate()
  const [selectedPreset, setSelectedPreset] = useState('male')
  const [playingVoice, setPlayingVoice] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showVariations, setShowVariations] = useState(false)
  const [variations, setVariations] = useState([])
  const [tierData, setTierData] = useState(null)
  const [buildItems, setBuildItems] = useState([])

  useEffect(() => {
    document.documentElement.classList.add('dark')

    // Load data from cosplayBuild
    const buildDataStr = sessionStorage.getItem('cosplayBuild')
    if (buildDataStr) {
      const data = JSON.parse(buildDataStr)
      setTierData({
        characterName: data.character,
        tier: data.selectedTier || 'custom'
      })

      // Generate detailed items from the passed items list (handle object or array)
      const itemsList = Array.isArray(data.items) ? data.items : (data.items?.items || [])
      const detailedItems = generateDetailedItems(itemsList, data.selectedTier || 'budget', data.character)
      // All items selected by default
      const itemsWithSelection = detailedItems.map(item => ({ ...item, selected: item.inStock }))
      setBuildItems(itemsWithSelection)
      if (itemsWithSelection.length > 0) {
        // Select first available item
        const firstAvailable = itemsWithSelection.find(i => i.inStock)
        setSelectedItem(firstAvailable ? firstAvailable.id : itemsWithSelection[0].id)
      }

      // Also set the preset character name for the simulation if possible
      // This is a bit of a hack since we don't have infinite presets, but it syncs the name display
      // key is lower case
      if (data.character) {
        // If character is one of our presets, select it
        const lowerChar = data.character.toLowerCase()
        if (tryOnPresets[lowerChar]) {
          setSelectedPreset(lowerChar)
        }
      }
    }
  }, [])

  // Calculate cart totals
  const selectedItems = buildItems.filter(item => item.selected)
  const cartTotal = selectedItems.reduce((sum, item) => sum + item.price, 0)
  const averageRating = selectedItems.length > 0
    ? (selectedItems.reduce((sum, item) => sum + parseFloat(item.rating), 0) / selectedItems.length).toFixed(1)
    : 0

  // Toggle item selection
  const toggleItemSelection = (id) => {
    setBuildItems(buildItems.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ))
  }

  // Scroll to top and navigate to checkout
  const handleCheckout = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Navigate after scroll completes
    setTimeout(() => {
      sessionStorage.setItem('cart', JSON.stringify({
        items: selectedItems,
        total: cartTotal,
        characterName: tierData?.characterName,
        tier: tierData?.tier
      }))
      navigate('/auth', { state: { from: '/checkout' } })
    }, 500)
  }

  const generateDetailedItems = (items, tierType, characterName) => {
    return items.map((item, index) => {
      // Handle both string loop (legacy) or object loop (new API)
      const isObject = typeof item === 'object'
      const rawName = isObject ? item.name : item
      const itemName = rawName.split('(')[0].trim()

      // Use API price if available, otherwise parse or mock
      const apiPrice = isObject ? item.price : null
      const priceMatch = !apiPrice && typeof rawName === 'string' ? rawName.match(/\$[\d.]+/) : null
      const basePrice = apiPrice !== null ? apiPrice : (priceMatch ? parseFloat(priceMatch[0].replace('$', '')) : null)

      // Generate seller based on tier
      let seller, sellerLink
      if (tierType === 'diy') {
        const diyStores = ['Dollar Tree', 'Thrift Store', 'Goodwill', 'Hobby Lobby', 'Michaels']
        seller = diyStores[index % diyStores.length]
        sellerLink = `https://www.${seller.toLowerCase().replace(/\s+/g, '')}.com`
      } else if (tierType === 'budget') {
        const budgetStores = ['Amazon', 'AliExpress', 'CosplaySky', 'EZCosplay', 'Miccostumes']
        seller = budgetStores[index % budgetStores.length]
        sellerLink = seller === 'Amazon' ? `https://amazon.com/s?k=${encodeURIComponent(itemName + ' ' + characterName)}` : `https://www.${seller.toLowerCase()}.com`
      } else { // premium
        const premiumStores = ['ProCosplay', 'CosplayFU', 'Etsy Custom', 'EZCosplay Premium', 'Local Seamstress']
        seller = premiumStores[index % premiumStores.length]
        sellerLink = seller.includes('Etsy') ? `https://etsy.com/search?q=${encodeURIComponent(itemName + ' ' + characterName)}` : `https://www.${seller.toLowerCase().replace(/\s+/g, '')}.com`
      }

      // Generate price if not present (Fallback)
      let price = basePrice
      if (price === null) {
        if (tierType === 'diy') {
          price = Math.round(Math.random() * 15 + 5) // $5-20
        } else if (tierType === 'budget') {
          price = Math.round(Math.random() * 35 + 15) // $15-50
        } else {
          price = Math.round(Math.random() * 200 + 50) // $50-250
        }
      }

      // Generate description based on tier
      let description
      if (tierType === 'diy') {
        description = `DIY ${itemName}. Requires basic crafting skills. ${['Perfect for beginners', 'Easy to customize', 'Budget-friendly option', 'Recyclable materials'][index % 4]}.`
      } else if (tierType === 'budget') {
        description = `Ready-made ${itemName}. ${['Ships within 2-3 weeks', 'Good quality for price', 'Easy to modify', 'Popular choice'][index % 4]}. Suitable for casual cosplay.`
      } else {
        description = `Professional ${itemName}. ${['Screen-accurate details', 'Premium materials', 'Custom-fitted', 'Show-quality finish'][index % 4]}. Ideal for competitions.`
      }

      // Generate material based on item name
      let material = 'Mixed materials'
      if (itemName.toLowerCase().includes('wig') || itemName.toLowerCase().includes('hair')) {
        material = tierType === 'premium' ? 'Heat-resistant fiber' : 'Synthetic fiber'
      } else if (itemName.toLowerCase().includes('fabric') || itemName.toLowerCase().includes('cloth')) {
        material = tierType === 'premium' ? 'Silk blend' : 'Cotton/Polyester'
      } else if (itemName.toLowerCase().includes('foam') || itemName.toLowerCase().includes('armor')) {
        material = 'EVA foam'
      } else if (itemName.toLowerCase().includes('glove')) {
        material = tierType === 'premium' ? 'Leather' : 'Cotton'
      } else if (itemName.toLowerCase().includes('paint')) {
        material = 'Acrylic paint'
      }

      return {
        id: index,
        name: itemName,
        fullDescription: rawName,
        description: description,
        price: price,
        seller: seller,
        sellerLink: sellerLink,
        material: material,
        inStock: Math.random() > 0.2, // 80% in stock
        rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5-5.0 stars
        reviews: Math.floor(Math.random() * 1000) + 50,
        selected: true // All items selected by default
      }
    })
  }

  const currentPreset = tryOnPresets[selectedPreset]
  // const characterName = selectedPreset.charAt(0).toUpperCase() + selectedPreset.slice(1)
  // Logic fix: try to use tierData name first, else preset name
  const displayCharacterName = tierData ? tierData.characterName : (selectedPreset.charAt(0).toUpperCase() + selectedPreset.slice(1))

  // Generate try-on image when preset changes
  useEffect(() => {
    generateNewImage()
  }, [selectedPreset])

  const generateNewImage = async () => {
    setIsGenerating(true)
    try {
      // Use actual character name from tier data, falls back to preset capitalization for display
      const actualCharacter = tierData?.characterName || 'Gojo'
      const result = await regenerateCharacterImage(actualCharacter, selectedPreset)
      setGeneratedImage(result.imageUrl)
      if (result.mock) {
        console.log('[TryOnLab] Using mock image (API not available)')
      }
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateVariations = async () => {
    setIsGenerating(true)
    try {
      const actualCharacter = tierData?.characterName || 'Gojo'
      const result = await generateCharacterVariation(actualCharacter, selectedPreset)
      setVariations([result.imageUrl])
      setShowVariations(true)
      if (result.mock) {
        console.log('[TryOnLab] Using mock variation (API not available)')
      }
    } catch (error) {
      console.error('Variation generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <header className="w-full px-6 pt-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2 group">
              <Zap className="w-6 h-6 text-neon-purple group-hover:text-white transition" />
              <span className="font-display font-bold tracking-wider group-hover:text-neon-cyan transition">COSPLAYFORGE</span>
            </div>
            <span className="text-slate-600 text-sm">/</span>
            <span className="text-slate-400 text-sm font-mono">SIMULATION_LAB</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 border border-neon-cyan/30 bg-neon-cyan/10 rounded text-xs font-mono text-neon-cyan animate-pulse">
              LIVE SESSION
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-4 pb-32">
        {/* Header with Build Tier Info */}
        <div className="mb-8">
          {tierData ? (
            <div className="glass-panel p-6 rounded-xl border border-neon-purple/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 blur-[100px] rounded-full"></div>
              <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-neon-cyan">PROJECT_ID: {tierData.characterName.toUpperCase()}_v1</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 text-glow">
                    {tierData.characterName} <span className="text-slate-600">/</span> {tierData.tier.toUpperCase()} PROTOCOL
                  </h1>
                  <p className="text-slate-400 font-mono text-sm">
                    {tierData.tier === 'diy' && '>> FABRICATION_MODE: MANUAL_ASSEMBLY'}
                    {tierData.tier === 'budget' && '>> FABRICATION_MODE: PRE_FAB_SOURCING'}
                    {tierData.tier === 'premium' && '>> FABRICATION_MODE: HIGH_FIDELITY_REPLICA'}
                  </p>
                </div>
                <div className="text-right glass-panel p-4 rounded-lg bg-black/40">
                  <div className="text-xs text-slate-400 font-mono mb-1">REQ_ITEMS</div>
                  <div className="text-2xl font-bold text-white mb-1">{buildItems.length}</div>
                  <div className="text-xl font-bold text-neon-cyan text-glow">
                    ${buildItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">EST_COST</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2 flex items-center gap-2 text-glow">
                <Eye className="w-8 h-8 text-neon-cyan" />
                SIMULATION LAB
              </h1>
              <p className="text-slate-400 text-sm font-mono">&gt;&gt; POWERED_BY: FEATHERLESS_CLOTHSIM_7B</p>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 3D MODEL AREA */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-[4/3] bg-slate-900 rounded-xl border border-neon-cyan/30 flex items-center justify-center overflow-hidden relative glass-panel group">
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_4px,3px_100%]"></div>

              <div className="absolute top-4 right-4 z-30">
                <div className="px-2 py-1 bg-black/80 border border-neon-cyan/50 text-[10px] font-mono text-neon-cyan">
                  PREVIEW_MODE
                </div>
              </div>

              {isGenerating ? (
                <div className="flex flex-col items-center justify-center gap-4 z-10">
                  <Loader className="w-12 h-12 text-neon-cyan animate-spin" />
                  <div className="text-neon-cyan font-mono text-sm animate-pulse">RENDERING_PHYSICS...</div>
                </div>
              ) : generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated Preview"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="text-center flex flex-col items-center z-10">
                  <div className="w-24 h-24 rounded-full border border-slate-700 flex items-center justify-center mb-4">
                    <Eye className="w-10 h-10 text-slate-700" />
                  </div>
                  <p className="text-slate-500 font-display tracking-widest text-lg">NO_SIGNAL</p>
                  <p className="text-slate-700 text-xs font-mono mt-2">INITIATE GENERATION SEQUENCE</p>
                </div>
              )}
            </div>

            {/* Generation Controls */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={generateNewImage}
                disabled={isGenerating}
                className="group relative py-3 bg-transparent overflow-hidden rounded border border-neon-cyan/50 hover:border-neon-cyan transition"
              >
                <div className="absolute inset-0 bg-neon-cyan/10 group-hover:bg-neon-cyan/20 transition"></div>
                <span className="relative text-neon-cyan font-mono text-sm font-bold flex items-center justify-center gap-2">
                  <Scan className="w-4 h-4" /> REGENERATE
                </span>
              </button>
              <button
                onClick={generateVariations}
                disabled={isGenerating}
                className="group relative py-3 bg-transparent overflow-hidden rounded border border-neon-purple/50 hover:border-neon-purple transition"
              >
                <div className="absolute inset-0 bg-neon-purple/10 group-hover:bg-neon-purple/20 transition"></div>
                <span className="relative text-neon-purple font-mono text-sm font-bold flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4" /> VARIATIONS
                </span>
              </button>
            </div>

            {/* Preset selector */}
            {!tierData && (
              <div className="glass-panel p-4 rounded-lg border border-slate-800">
                <p className="text-slate-400 text-xs font-mono mb-3">&gt;&gt; MANUAL_PRESET_OVERRIDE:</p>
                <div className="grid grid-cols-3 gap-3">
                  {Object.keys(tryOnPresets).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPreset(key)}
                      className={`py-2 rounded text-xs font-mono transition border ${selectedPreset === key
                        ? 'bg-neon-cyan/20 border-neon-cyan text-white'
                        : 'bg-black/40 border-slate-700 text-slate-500 hover:border-slate-500'
                        }`}
                    >
                      {key.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Item Customization - Dynamic based on selected build tier */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-sm text-neon-cyan mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" /> REQUIRED_ASSETS
              <span className="h-px flex-1 bg-neon-cyan/30"></span>
            </h3>

            <div className="space-y-4 max-h-[800px] overflow-y-auto custom-scrollbar pr-2">
              {buildItems.length > 0 ? (
                buildItems.map((item) => (
                  <div
                    key={item.id}
                    className={`glass-panel p-4 rounded-lg border transition-all duration-300 relative group ${item.selected
                      ? selectedItem === item.id
                        ? 'border-neon-cyan bg-neon-cyan/5'
                        : 'border-green-500/50 bg-green-500/5'
                      : 'border-slate-800 opacity-60 grayscale hover:opacity-100'
                      }`}
                  >
                    {/* Checkbox */}
                    <div
                      className="absolute top-4 right-4 z-10 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); toggleItemSelection(item.id) }}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${item.selected
                        ? 'bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                        : 'bg-transparent border-slate-600'
                        }`}>
                        {item.selected && <Check className="w-3 h-3 text-black font-bold" />}
                      </div>
                    </div>

                    <div onClick={() => !item.selected || setSelectedItem(item.id)} className="flex gap-4 cursor-pointer">
                      {/* Icon Box */}
                      <div className="w-16 h-16 rounded border border-white/10 bg-black/50 flex items-center justify-center text-2xl flex-shrink-0">
                        {item.name.toLowerCase().includes('wig') || item.name.toLowerCase().includes('hair') ? '💇' :
                          item.name.toLowerCase().includes('glove') ? '🧤' :
                            item.name.toLowerCase().includes('shoe') || item.name.toLowerCase().includes('boot') ? '👟' :
                              item.name.toLowerCase().includes('paint') ? '🎨' :
                                item.name.toLowerCase().includes('foam') || item.name.toLowerCase().includes('armor') ? '🛡️' :
                                  item.name.toLowerCase().includes('fabric') || item.name.toLowerCase().includes('cloth') ? '🧵' :
                                    item.name.toLowerCase().includes('mask') || item.name.toLowerCase().includes('blindfold') ? '🎭' :
                                      '👕'}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between pr-8">
                          <h4 className="font-bold text-white text-sm mb-1">{item.name}</h4>
                        </div>
                        <p className="text-xs text-slate-400 mb-2 line-clamp-1">{item.description}</p>

                        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                            {item.material}
                          </span>
                          <span className={item.inStock ? 'text-green-400' : 'text-red-400'}>
                            {item.inStock ? 'IN_STOCK' : 'BACKORDER'}
                          </span>
                          <span className="text-yellow-500">★ {item.rating}</span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end pt-8">
                        <span className="font-mono text-neon-cyan text-lg">${item.price.toFixed(0)}</span>
                        <a
                          href={item.sellerLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-blue-400 hover:text-blue-300 underline"
                        >
                          {item.seller} ↗
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-center py-10">NO DATA FOUND</div>
              )}
            </div>
          </div>
        </div>

        {/* Fit Score & Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-lg border border-slate-800">
            <h3 className="text-slate-400 text-xs font-mono mb-4">&gt;&gt; COMPATIBILITY_ANALYSIS</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-display font-bold text-green-400 text-glow">{currentPreset.fitScore}%</span>
              <span className="text-sm text-slate-500 mb-1">FIT_MATCH</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-green-400 h-full shadow-[0_0_10px_#4ade80]"
                style={{ width: `${currentPreset.fitScore}%` }}
              />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-lg border border-slate-800">
            <h3 className="text-slate-400 text-xs font-mono mb-2">&gt;&gt; PHYSICS_ENGINE_NOTES</h3>
            <p className="text-slate-300 text-sm font-light italic opacity-80">
              "{currentPreset.physicsNotes}"
            </p>
            {currentPreset.weight && (
              <div className="mt-3 text-xs font-mono text-neon-purple">
                &gt;&gt; EST_WEIGHT: {currentPreset.weight}
              </div>
            )}
          </div>
        </div>

        {/* Outfit Variations */}
        <AnimatePresence>
          {showVariations && variations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 glass-panel border border-neon-purple/50 rounded-lg p-6 relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-cyan"></div>
              <h3 className="text-white font-display font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-neon-purple" />
                GENERATED_VARIATIONS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {variations.map((variation) => (
                  <div key={variation.id} className="bg-black/50 rounded border border-white/10 overflow-hidden hover:border-neon-cyan transition cursor-pointer group" onClick={() => {
                    if (variation.url) setGeneratedImage(variation.url)
                  }}>
                    {variation.url && (
                      <div className="relative overflow-hidden h-40">
                        <img src={variation.url} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-xs font-mono text-slate-300">{variation.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowVariations(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Cart Footer - Cyberpunk Style */}
        <div className="fixed bottom-0 left-0 w-full bg-slate-950/80 backdrop-blur-md border-t border-neon-cyan/20 z-50 py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <div>
                <div className="text-[10px] text-slate-500 font-mono tracking-widest">SELECTED</div>
                <div className="text-2xl font-display font-bold text-white">
                  {selectedItems.length} <span className="text-sm text-slate-600 font-sans font-normal">/ {buildItems.length}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-mono tracking-widest">TOTAL_COST</div>
                <div className="text-2xl font-display font-bold text-neon-cyan text-glow">
                  ${cartTotal.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-mono tracking-widest">RATING</div>
                <div className="text-lg font-bold text-yellow-500">
                  ★ {averageRating}
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="w-full md:w-auto px-8 py-3 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-bold font-mono tracking-widest rounded transition flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span>INITIALIZE_CHECKOUT</span>
                <ShoppingCart className="w-4 h-4 group-hover:animate-bounce" />
              </button>
              {selectedItems.length === 0 && (
                <div className="text-[10px] text-red-500 text-center font-mono mt-1 animate-pulse">
                  &gt;&gt; ERROR: NO_ASSETS_SELECTED
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
