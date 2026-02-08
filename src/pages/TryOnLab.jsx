import { useNavigate } from 'react-router-dom'
import { Eye, Volume2, ShoppingCart, Loader, Sun, Moon, Check, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { tryOnPresets, characterVoices, dedalusAlert } from '../simulation/sponsorMocks'
import { generateTryOnImage, generateOutfitVariations } from '../services/generationService'
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
  const [isDark, setIsDark] = useState(true)
  const [tierData, setTierData] = useState(null)
  const [buildItems, setBuildItems] = useState([])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark
    setIsDark(initialDark)
    document.documentElement.classList.toggle('dark', initialDark)

    // Load selected tier data
    const tierDataStr = sessionStorage.getItem('selectedTier')
    if (tierDataStr) {
      const data = JSON.parse(tierDataStr)
      setTierData(data)
      
      // Generate detailed items from tier items
      const detailedItems = generateDetailedItems(data.items, data.tier, data.characterName)
      // All items selected by default
      const itemsWithSelection = detailedItems.map(item => ({ ...item, selected: true }))
      setBuildItems(itemsWithSelection)
      if (itemsWithSelection.length > 0) {
        setSelectedItem(0) // Select first item by default
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
      navigate('/checkout')
    }, 500)
  }

  const generateDetailedItems = (items, tierType, characterName) => {
    return items.map((item, index) => {
      const itemName = item.split('(')[0].trim() // Remove price if present
      const priceMatch = item.match(/\$[\d.]+/)
      const basePrice = priceMatch ? parseFloat(priceMatch[0].replace('$', '')) : null
      
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

      // Generate price if not present
      let price = basePrice
      if (!price) {
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
        fullDescription: item,
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

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  const currentPreset = tryOnPresets[selectedPreset]
  const characterName = selectedPreset.charAt(0).toUpperCase() + selectedPreset.slice(1)

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

      <div className="w-full flex-1 px-8 py-8">
        {/* Header with Build Tier Info */}
        <div className="mb-8">
          {tierData ? (
            <div className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-400 dark:border-purple-500 rounded-lg p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {tierData.characterName} Cosplay - {tierData.tier.toUpperCase()} Build
                  </h1>
                  <p className="text-slate-700 dark:text-slate-300">
                    {tierData.tier === 'diy' && '🛠️ DIY Build - Make everything yourself from scratch'}
                    {tierData.tier === 'budget' && '💰 Budget Build - Affordable ready-made items'}
                    {tierData.tier === 'premium' && '✨ Premium Build - Professional-grade materials'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600 dark:text-slate-400">{buildItems.length} items</div>
                  <div className="text-xl font-bold text-green-700 dark:text-green-400">
                    ${buildItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">Total estimated cost</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Eye className="w-8 h-8 text-blue-400" />
                Virtual Try-On Lab
              </h1>
              <p className="text-slate-600 dark:text-gray-400 text-sm">Powered by Featherless ClothSim-7B • Nano Banana Render</p>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 3D MODEL AREA */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-gradient-to-b from-slate-200 to-slate-300 dark:from-gray-800 dark:to-black rounded-lg border-2 border-blue-500/50 flex items-center justify-center overflow-hidden relative">
              <div className="absolute top-2 right-2 bg-blue-200/70 dark:bg-blue-900/70 text-xs px-2 py-1 rounded font-mono text-blue-900 dark:text-blue-100">
                AI-Generated Preview
              </div>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center gap-3">
                  <Loader className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
                  <p className="text-blue-700 dark:text-blue-300 text-sm">Generating cosplay preview...</p>
                </div>
              ) : generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt={characterName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center w-full h-full flex flex-col items-center justify-center">
                  <Eye className="w-20 h-20 text-blue-500 dark:text-blue-400 mb-4 opacity-30" />
                  <p className="text-blue-700 dark:text-blue-300 text-lg font-bold">{characterName}</p>
                  <p className="text-slate-600 dark:text-gray-400 text-xs mt-2 max-w-xs">AI-generated preview loading...</p>
                </div>
              )}
            </div>

            {/* Generation Controls */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={generateNewImage}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white py-2 rounded font-semibold text-sm transition"
              >
                {isGenerating ? 'Generating...' : 'Regenerate'}
              </button>
              <button
                onClick={generateVariations}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-500 text-white py-2 rounded font-semibold text-sm transition"
              >
                {isGenerating ? 'Generating...' : 'Variations'}
              </button>
            </div>

            {/* Preset selector */}
            <div className="mt-6 space-y-3">
              <p className="text-slate-700 dark:text-gray-300 text-sm font-semibold">Select Fit Model:</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(tryOnPresets).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPreset(key)}
                    className={`p-2 rounded text-sm font-semibold transition ${
                      selectedPreset === key
                        ? 'bg-blue-600 text-white border border-blue-400'
                        : 'bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-gray-700 border border-slate-300 dark:border-gray-700'
                    }`}
                  >
                    {key === 'male' && '👨'}
                    {key === 'female' && '👩'}
                    {' '}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Item Customization - Dynamic based on selected build tier */}
          {buildItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {buildItems.map((item) => (
                <div 
                  key={item.id}
                  className={`bg-slate-100 dark:bg-gray-800 rounded-lg p-4 border-2 cursor-pointer transition hover:shadow-lg ${
                    item.selected 
                      ? selectedItem === item.id 
                        ? 'border-yellow-400 ring-2 ring-yellow-400/30' 
                        : 'border-green-400 ring-2 ring-green-400/20'
                      : 'border-slate-300 dark:border-gray-700 opacity-50'
                  }`}
                >
                  {/* Checkbox in top right corner */}
                  <div className="absolute top-3 right-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleItemSelection(item.id) }}>
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${
                      item.selected 
                        ? 'bg-green-500 border-green-600' 
                        : 'bg-slate-300 dark:bg-slate-600 border-slate-400 dark:border-slate-500'
                    }`}>
                      {item.selected && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  
                  <div onClick={() => !item.selected || setSelectedItem(item.id)} className="relative">
                    <div className="aspect-square bg-gradient-to-br from-blue-600 to-cyan-600 rounded mb-3 flex items-center justify-center text-4xl">
                      {item.name.toLowerCase().includes('wig') || item.name.toLowerCase().includes('hair') ? '💇' :
                       item.name.toLowerCase().includes('glove') ? '🧤' :
                       item.name.toLowerCase().includes('shoe') || item.name.toLowerCase().includes('boot') ? '👟' :
                       item.name.toLowerCase().includes('paint') ? '🎨' :
                       item.name.toLowerCase().includes('foam') || item.name.toLowerCase().includes('armor') ? '🛡️' :
                       item.name.toLowerCase().includes('fabric') || item.name.toLowerCase().includes('cloth') ? '🧵' :
                       item.name.toLowerCase().includes('mask') || item.name.toLowerCase().includes('blindfold') ? '🎭' :
                       '👕'}
                    </div>
                    
                    <div className="font-bold text-sm text-slate-900 dark:text-white mb-2 line-clamp-2 min-h-[2.5rem]">
                      {item.name}
                    </div>
                    
                    <div className="text-xs text-slate-600 dark:text-gray-400 mb-3 line-clamp-2 min-h-[2rem]">
                      {item.description}
                    </div>
                    
                    <div className="space-y-1.5 text-xs mb-3 border-t border-slate-300 dark:border-gray-700 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-gray-400">Price:</span>
                        <span className="text-green-700 dark:text-green-400 font-bold">${item.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-gray-400">Material:</span>
                        <span className="text-blue-700 dark:text-blue-300 text-xs">{item.material}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-gray-400">Seller:</span>
                        <span className="text-purple-700 dark:text-purple-300 text-xs">{item.seller}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-gray-400">Rating:</span>
                        <span className="text-yellow-700 dark:text-yellow-400">⭐ {item.rating} ({item.reviews})</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-gray-400">Stock:</span>
                        <span className={item.inStock ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                          {item.inStock ? '✓ In Stock' : '⏱ Backorder'}
                        </span>
                      </div>
                    </div>
                    
                    <a 
                      href={item.sellerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-xs font-semibold transition flex items-center justify-center gap-2 block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ShoppingCart className="w-3 h-3" /> View on {item.seller}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Fallback to old hardcoded items if no tier data */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['suit', 'mask', 'accessories'].map((item) => (
                <div 
                  key={item}
                  onClick={() => setSelectedItem(item)}
                  className={`bg-slate-100 dark:bg-gray-800 rounded-lg p-4 border-2 cursor-pointer transition ${
                    selectedItem === item ? 'border-yellow-400' : 'border-slate-300 dark:border-gray-700'
                  }`}
                >
                  <div className="aspect-square bg-gradient-to-br from-blue-600 to-cyan-600 rounded mb-3 flex items-center justify-center">
                    <div className="text-4xl">{'🧥🎭🎀'['suit,mask,accessories'.split(',').indexOf(item)]}</div>
                  </div>
                  <div className="font-bold capitalize text-slate-900 dark:text-white mb-3">{item}</div>
                  <div className="text-xs text-slate-600 dark:text-gray-400 mb-3">Drag or click to select</div>
                  
                  <div className="space-y-2 text-xs mb-4 border-t border-slate-300 dark:border-gray-700 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-gray-400">Material:</span>
                      <span className="text-blue-700 dark:text-blue-300">Spandex</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-gray-400">Physics:</span>
                      <span className="text-green-700 dark:text-green-300">✓ Simulated</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-xs font-semibold transition flex items-center justify-center gap-2">
                    <ShoppingCart className="w-3 h-3" /> Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

{/* Fit Score Panel with Item Rating */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-100 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-slate-700 dark:text-gray-300 font-bold mb-2">Fit Score</h3>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{currentPreset.fitScore}%</div>
              <div className="w-full bg-slate-300 dark:bg-gray-900 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${currentPreset.fitScore}%` }}
                />
              </div>
              <div className="mt-3 border-t border-slate-300 dark:border-gray-600 pt-3">
                <div className="text-xs text-slate-600 dark:text-gray-400 mb-1">Average Item Rating</div>
                <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400">⭐ {averageRating} / 5.0</div>
              </div>
            </div>

            {/* Physics Panel */}
            <div className="bg-slate-100 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-slate-700 dark:text-gray-300 font-bold mb-2">Physics</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400">{currentPreset.physicsNotes}</p>
              {currentPreset.weight && (
                <p className="text-green-700 dark:text-green-400 text-xs mt-2 font-mono">Weight: {currentPreset.weight}</p>
              )}
              <div className="mt-3 border-t border-slate-300 dark:border-gray-600 pt-3">
                <div className="text-xs text-slate-600 dark:text-gray-400">Selected Items</div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{selectedItems.length} / {buildItems.length}</div>
              </div>
          </div>

          {/* Voice Panel */}
          {characterVoices[selectedPreset] && (
            <div className="bg-slate-100 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-slate-700 dark:text-gray-300 font-bold mb-2 flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> Voice
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 italic mb-3 line-clamp-2">
                "{characterVoices[selectedPreset].transcript}"
              </p>
              <button
                onClick={() => setPlayingVoice(playingVoice === selectedPreset ? null : selectedPreset)}
                className={`w-full py-2 rounded text-xs font-semibold transition ${
                  playingVoice === selectedPreset
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-300 dark:bg-gray-900 text-slate-700 dark:text-gray-300 hover:bg-slate-400 dark:hover:bg-gray-800'
                }`}
              >
                {playingVoice === selectedPreset ? '🔊 Playing' : '▶ Listen'}
              </button>
            </div>
          )}
        </div>

        {/* Outfit Variations */}
        {showVariations && variations.length > 0 && (
          <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-slate-900 dark:text-white font-bold mb-4">✨ Outfit Variations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {variations.map((variation) => (
                <div key={variation.id} className="bg-slate-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-slate-300 dark:border-gray-700 hover:border-blue-500 transition cursor-pointer" onClick={() => {
                  if (variation.url) setGeneratedImage(variation.url)
                }}>
                  {variation.url && (
                    <img src={variation.url} alt={variation.description} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-3">
                    <p className="text-sm text-slate-700 dark:text-gray-300">{variation.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowVariations(false)}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
            >
              Close Variations
            </button>
          </div>
        )}

        {/* Cart Summary Panel at Bottom */}
        <div className="mt-8 sticky bottom-0 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 border-2 border-green-400 dark:border-green-500 rounded-lg p-6 shadow-2xl z-40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Items Selected</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedItems.length}</div>
              <div className="text-xs text-slate-500 dark:text-slate-500">of {buildItems.length}</div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Cost</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">${cartTotal.toFixed(2)}</div>
              <div className="text-xs text-slate-500 dark:text-slate-500">Estimated</div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Rating</div>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">⭐ {averageRating}</div>
              <div className="text-xs text-slate-500 dark:text-slate-500">Selected Items</div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Item Cost</div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">${selectedItems.length > 0 ? (cartTotal / selectedItems.length).toFixed(2) : '0.00'}</div>
              <div className="text-xs text-slate-500 dark:text-slate-500">Per Item</div>
            </div>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition duration-300 text-lg flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            Proceed to Checkout → ${cartTotal.toFixed(2)}
          </button>
          
          {selectedItems.length === 0 && (
            <p className="text-center text-red-600 dark:text-red-400 text-xs mt-2 font-semibold">Please select at least one item to checkout</p>
          )}
        </div>
      </div>
    </div>
  )
}
