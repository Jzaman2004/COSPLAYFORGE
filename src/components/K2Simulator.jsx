import { useState, useEffect } from 'react'

export default function K2Simulator({ isActive, onComplete }) {
  const [thoughts, setThoughts] = useState([])
  const [stage, setStage] = useState(0)

  const thinkingStages = [
    "SCANNING_IMAGE_VECTOR_SPACE...",
    "IDENTIFYING_COSTUME_ELEMENTS...",
    "MAPPING_COLOR_PALETTES...",
    "CALCULATING_PROPORTIONS...",
    "OPTIMIZING_MATERIAL_COSTS...",
    "GENERATING_BLUEPRINT_DATA...",
  ]

  useEffect(() => {
    if (!isActive) {
      setThoughts([])
      setStage(0)
      return
    }

    const intervals = thinkingStages.map((thought, idx) => {
      return setTimeout(() => {
        setThoughts(prev => [...prev, thought])
        setStage(idx + 1)

        if (idx === thinkingStages.length - 1) {
          setTimeout(() => onComplete?.(), 500)
        }
      }, (idx + 1) * 600)
    })

    return () => intervals.forEach(clearTimeout)
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="w-full max-w-3xl mx-auto p-1 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-lg border border-neon-purple/50 mb-6 glass-panel">
      <div className="bg-black/80 rounded p-6">
        <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
          <div className="w-4 h-4 bg-neon-purple rounded-full animate-pulse shadow-[0_0_15px_#d946ef]"></div>
          <div className="text-xl font-display font-bold text-white tracking-widest text-glow">K2 REASONING ENGINE</div>
        </div>

        <div className="space-y-2 font-mono text-sm mb-6 h-48 overflow-hidden">
          {thoughts.map((thought, idx) => (
            <div key={idx} className="flex items-center gap-3 animate-fadeIn">
              <span className="text-slate-600">[{new Date().toISOString().split('T')[1].slice(0, -1)}]</span>
              <span className="text-neon-cyan">&gt; {thought}</span>
            </div>
          ))}
          {stage < thinkingStages.length && (
            <div className="flex items-center gap-3 animate-pulse">
              <span className="text-slate-600">[{new Date().toISOString().split('T')[1].slice(0, -1)}]</span>
              <span className="text-neon-purple">_PROCESSING...</span>
            </div>
          )}
        </div>

        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan shadow-[0_0_10px_#06b6d4] transition-all duration-300"
            style={{ width: `${(stage / thinkingStages.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
