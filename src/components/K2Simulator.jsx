import { useState, useEffect } from 'react'

export default function K2Simulator({ isActive, onComplete }) {
  const [thoughts, setThoughts] = useState([])
  const [stage, setStage] = useState(0)

  const thinkingStages = [
    "🔍 Analyzing image composition...",
    "👗 Identifying costume elements...",
    "🎨 Mapping color palettes...",
    "📐 Calculating proportions...",
    "🔧 Identifying materials needed...",
    "💡 Generating description...",
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
      }, (idx + 1) * 800)
    })

    return () => intervals.forEach(clearTimeout)
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-lg border border-indigo-500/50 mb-6">
      <div className="flex items-start gap-4">
        <div className="text-2xl animate-pulse text-white">🧠 K2 Reasoning Engine</div>
        <div className="flex-1">
          <div className="space-y-2">
            {thoughts.map((thought, idx) => (
              <div key={idx} className="text-sm text-slate-200 flex items-center gap-2 animate-fadeIn">
                <span className="text-indigo-400">→</span>
                {thought}
              </div>
            ))}
          </div>
          {stage < thinkingStages.length && (
            <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
                style={{ width: `${(stage / thinkingStages.length) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
