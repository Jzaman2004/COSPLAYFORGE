import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Zap, Loader, Shield, Box, Layout } from 'lucide-react'
import K2Simulator from '../components/K2Simulator'
import { generateCosplayTiers } from '../services/llamaService'

export default function BlueprintStudio() {
  const navigate = useNavigate()
  const [tiers, setTiers] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showK2, setShowK2] = useState(false)
  const [characterName, setCharacterName] = useState('')
  const [characterBio, setCharacterBio] = useState('')
  const [selectedTier, setSelectedTier] = useState(null)

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  useEffect(() => {
    const loadTiers = async () => {
      const data = sessionStorage.getItem('cosplayDescription')
      if (data) {
        try {
          const parsed = JSON.parse(data)
          const charName = parsed.character || 'Unknown Character'
          setCharacterName(charName)
          setCharacterBio(parsed.description || '')

          // Show K2 thinking animation
          setShowK2(true)

          const tiersData = await generateCosplayTiers(charName)
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

  const TierCard = ({ id, title, icon: Icon, color, items, price }) => (
    <div
      onClick={() => setSelectedTier(id)}
      className={`relative group cursor-pointer transition-all duration-300 ${selectedTier === id ? 'scale-105' : 'hover:scale-[1.02]'}`}
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500 ${selectedTier === id ? 'opacity-100' : ''}`}></div>
      <div className="relative glass-panel rounded-xl p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-white/5 ${selectedTier === id ? 'text-white' : 'text-slate-400'}`}>
            <Icon className="w-8 h-8" />
          </div>
          {selectedTier === id && (
            <div className="px-2 py-1 bg-neon-cyan/20 rounded border border-neon-cyan/50 text-neon-cyan text-xs font-mono">
              SELECTED
            </div>
          )}
        </div>

        <h3 className="text-2xl font-display font-bold text-white mb-2">{title}</h3>
        <div className="w-full h-px bg-white/10 my-4"></div>

        <ul className="space-y-3 flex-grow mb-6">
          {items && items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
              <span className={`mt-1 w-1.5 h-1.5 rounded-full ${selectedTier === id ? 'bg-neon-cyan' : 'bg-slate-600'}`}></span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <div className="font-mono text-xs text-slate-500 mb-1">ESTIMATED COST</div>
          <div className={`text-xl font-bold ${selectedTier === id ? 'text-neon-cyan text-glow' : 'text-slate-300'}`}>
            {price}
          </div>
        </div>
      </div>
    </div>
  )

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
            <span className="text-slate-400 text-sm font-mono">BLUEPRINT_STUDIO</span>
          </div>
          <div className="px-3 py-1 border border-neon-purple/30 bg-neon-purple/10 rounded text-xs font-mono text-neon-purple">
            PROJECT: {characterName ? characterName.toUpperCase() : 'UNKNOWN'}
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-4 pb-20 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 text-glow">
            FABRICATION BLUEPRINTS
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            K2 Engine has analyzed the character geometry and material requirements. Select a fabrication tier to proceed with asset generation.
          </p>
        </div>

        {/* Loading / Thinking */}
        {(isLoading || showK2) && (
          <div className="flex-1 flex flex-col justify-center items-center pb-20">
            {showK2 ? (
              <div className="w-full max-w-3xl">
                <K2Simulator isActive={showK2} onComplete={() => setShowK2(false)} />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-neon-purple blur-xl opacity-20 animate-pulse"></div>
                  <Loader className="w-12 h-12 text-neon-cyan animate-spin relative z-10" />
                </div>
                <div className="font-mono text-neon-cyan animate-pulse">RETRIEVING BLUEPRINT DATA...</div>
              </div>
            )}
          </div>
        )}

        {/* content */}
        {!isLoading && !showK2 && tiers && (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <TierCard
                id="diy"
                title="DIY PROTO"
                icon={Box}
                color="from-orange-500 to-red-500"
                items={tiers.diy}
                price="~ $150 - $300"
              />
              <TierCard
                id="budget"
                title="READY-MADE"
                icon={Layout}
                color="from-green-400 to-emerald-600"
                items={tiers.budget}
                price="~ $400 - $600"
              />
              <TierCard
                id="premium"
                title="PROFESSIONAL"
                icon={Shield}
                color="from-neon-purple to-neon-cyan"
                items={tiers.premium}
                price="~ $1200+"
              />
            </div>

            <div className="text-center">
              <button
                disabled={!selectedTier}
                onClick={() => {
                  const tierData = {
                    tier: selectedTier,
                    items: tiers[selectedTier === 'budget' ? 'budget' : selectedTier],
                    characterName: characterName
                  }
                  sessionStorage.setItem('selectedTier', JSON.stringify(tierData))
                  navigate('/tryonlab')
                }}
                className="group relative px-12 py-4 bg-transparent overflow-hidden rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-purple to-neon-cyan opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/50 group-hover:h-full transition-all duration-500 opacity-20"></div>
                <span className="relative font-display font-bold text-white text-xl tracking-widest flex items-center gap-3">
                  INITIALIZE {selectedTier ? selectedTier.toUpperCase() : ''} PROTOCOL
                  <Zap className={`w-5 h-5 ${selectedTier ? 'animate-pulse' : ''}`} />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
