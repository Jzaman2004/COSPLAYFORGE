import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { k2Reasoning } from '../simulation/sponsorMocks'

export default function K2ThinkFlow() {
  const [visibleSteps, setVisibleSteps] = useState(0)
  const maxSteps = k2Reasoning.totalSteps
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    // Animate through K2 reasoning steps
    const interval = setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev < maxSteps) {
          setTimeout(() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
            }
          }, 50)
          return prev + 1
        }
        return prev
      })
    }, 30) // Faster animation

    return () => clearInterval(interval)
  }, [])

  const percentComplete = (visibleSteps / maxSteps) * 100

  return (
    <div className="w-full bg-gray-900 rounded-lg p-4 border border-emerald-500/50 mb-6">
      <div className="flex items-center mb-3">
        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
        <span className="text-white font-mono text-sm">K2 Think Reasoning Engine • {visibleSteps}/300 steps</span>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="h-48 overflow-y-auto text-xs text-gray-300 font-mono p-3 bg-black rounded border border-emerald-500/20 mb-3"
      >
        {k2Reasoning.steps.slice(0, visibleSteps).map((text, i) => (
          <div key={i} className="mb-1 text-emerald-600/70 hover:text-emerald-400 transition">
            <span className="text-emerald-500">[{i+1}/300]</span> <span className="text-gray-400">{text}</span>
          </div>
        ))}
        {visibleSteps < maxSteps && (
          <div className="text-emerald-500 animate-pulse">▌ thinking...</div>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
          animate={{ width: `${percentComplete}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Confidence: {(k2Reasoning.confidence * 100).toFixed(1)}%</span>
        <span className="text-emerald-400">Time: {k2Reasoning.completionTime}</span>
      </div>
    </div>
  )
}
