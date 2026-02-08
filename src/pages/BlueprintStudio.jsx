import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Zap, Loader, Sun, Moon } from 'lucide-react'
import K2Simulator from '../components/K2Simulator'
import { generateCosplayTiers } from '../services/llamaService'

export default function BlueprintStudio() {
  const navigate = useNavigate()
  const [tiers, setTiers] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showK2, setShowK2] = useState(false)
  const [characterName, setCharacterName] = useState('')
  const [characterBio, setCharacterBio] = useState('')
  const [isDark, setIsDark] = useState(true)
  const [selectedTier, setSelectedTier] = useState(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark
    setIsDark(initialDark)
    document.documentElement.classList.toggle('dark', initialDark)
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  useEffect(() => {
    const loadTiers = async () => {
      const data = sessionStorage.getItem('cosplayDescription')
      if (data) {
        try {
          const parsed = JSON.parse(data)
          const charName = parsed.character || 'Unknown Character'
          setCharacterName(charName)

          // Show K2 thinking animation
          setShowK2(true)

          let context = parsed.description || ''

          // If we have an uploaded image, generate a fresh detailed description for better tiers
          if (parsed.uploadedImage) {
            console.log("Generating fresh description from image for context...")
            try {
              // We need to import this function first! 
              // (I'll add the import in a separate edit or verify it exists)
              // Actually, I can just use the import from above if I add it to the import list.
              const { generateImageDescription } = await import('../services/llamaService')
              const detailedDesc = await generateImageDescription(parsed.uploadedImage)

              if (detailedDesc) {
                console.log("Generated detailed context:", detailedDesc)
                context = detailedDesc
                setCharacterBio(detailedDesc) // Update UI with the better description
              }
            } catch (err) {
              console.error("Failed to generate image description:", err)
              // Fallback to existing bio
              setCharacterBio(parsed.description || '')
            }
          } else {
            setCharacterBio(parsed.description || '')
          }

          const tiersData = await generateCosplayTiers(charName, context)
          setTiers(tiersData)

          // Hide K2 after generation
          setShowK2(false)
        } catch (error) {
          console.error('Error loading tiers:', error)
          setTiers(null)
          setShowK2(false)
        }
      }
      setIsLoading(false)
    }

    loadTiers()
  }, [])

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-400" />
            Cosplay Build Options
          </h1>
          <p className="text-purple-600 dark:text-purple-300">{characterName} - Choose your build tier</p>
          {characterBio && (
            <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-3xl">{characterBio}</p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && !showK2 && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-indigo-500 mr-4" />
            <p className="text-purple-600 dark:text-purple-300">Loading character data...</p>
          </div>
        )}

        {/* K2 Thinking Animation */}
        {showK2 && (
          <div className="w-full mb-8">
            <K2Simulator isActive={showK2} onComplete={() => setShowK2(false)} />
          </div>
        )}

        {/* 3-Column Tier Display */}
        {!isLoading && !showK2 && tiers && (
          <div>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-4">Select your build tier to continue</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* DIY Tier */}
              <button
                onClick={() => setSelectedTier('diy')}
                className={`text-left bg-slate-100 dark:bg-slate-900 border-2 rounded-lg p-6 transition-all transform hover:scale-105 ${selectedTier === 'diy'
                    ? 'border-orange-500 ring-4 ring-orange-500/30 shadow-lg shadow-orange-500/20'
                    : 'border-orange-500/30 hover:border-orange-500'
                  }`}
              >
                <h2 className="text-2xl font-bold text-orange-500 dark:text-orange-400 mb-4 flex items-center justify-between">
                  DIY BUILD
                  {selectedTier === 'diy' && <span className="text-sm">✓</span>}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Make everything yourself from scratch</p>
                <ul className="space-y-2">
                  {tiers.diy && tiers.diy.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-orange-500 dark:text-orange-400 font-bold">•</span>
                      <span className="text-slate-700 dark:text-slate-200 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </button>

              {/* Budget Tier */}
              <button
                onClick={() => setSelectedTier('budget')}
                className={`text-left bg-slate-100 dark:bg-slate-900 border-2 rounded-lg p-6 transition-all transform hover:scale-105 ${selectedTier === 'budget'
                    ? 'border-green-500 ring-4 ring-green-500/30 shadow-lg shadow-green-500/20'
                    : 'border-green-500/30 hover:border-green-500'
                  }`}
              >
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center justify-between">
                  BUDGET BUILD
                  {selectedTier === 'budget' && <span className="text-sm">✓</span>}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Affordable ready-made items</p>
                <ul className="space-y-2">
                  {tiers.budget && tiers.budget.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                      <span className="text-slate-700 dark:text-slate-200 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </button>

              {/* Premium Tier */}
              <button
                onClick={() => setSelectedTier('premium')}
                className={`text-left bg-slate-100 dark:bg-slate-900 border-2 rounded-lg p-6 transition-all transform hover:scale-105 ${selectedTier === 'premium'
                    ? 'border-indigo-500 ring-4 ring-indigo-500/30 shadow-lg shadow-indigo-500/20'
                    : 'border-indigo-500/30 hover:border-indigo-500'
                  }`}
              >
                <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center justify-between">
                  PREMIUM BUILD
                  {selectedTier === 'premium' && <span className="text-sm">✓</span>}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Professional-grade materials</p>
                <ul className="space-y-2">
                  {tiers.premium && tiers.premium.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                      <span className="text-slate-700 dark:text-slate-200 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </button>
            </div>
          </div>
        )}

        {/* Proceed Button */}
        {!isLoading && !showK2 && tiers && selectedTier && (
          <button
            onClick={() => {
              // Store selected tier data in sessionStorage
              const tierData = {
                tier: selectedTier,
                items: tiers[selectedTier === 'budget' ? 'budget' : selectedTier],
                characterName: characterName
              }
              sessionStorage.setItem('selectedTier', JSON.stringify(tierData))
              navigate('/tryonlab')
            }}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition duration-300 text-lg shadow-lg"
          >
            Proceed with {selectedTier.toUpperCase()} Build →
          </button>
        )}
      </div>
    </div>
  )
}
