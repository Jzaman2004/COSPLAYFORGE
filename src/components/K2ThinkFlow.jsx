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
    }, 20) // Fast terminal speed

    return () => clearInterval(interval)
  }, [])

  const percentComplete = (visibleSteps / maxSteps) * 100

  return (
    <div className="w-full glass-panel rounded-lg p-1 border border-neon-purple/30 relative overflow-hidden group">
      {/* Search/Scan Line Animation */}
      <div className="absolute top-0 left-0 w-full h-1 bg-neon-purple/50 shadow-[0_0_20px_rgba(217,70,239,0.5)] animate-scan-line z-10"></div>

      <div className="bg-black/90 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-neon-purple rounded-full animate-pulse shadow-[0_0_10px_#d946ef]"></div>
            <span className="text-white font-mono text-xs tracking-wider">K2 DEEP REASONING ENGINE v4.0</span>
          </div>
          <span className="text-neon-cyan font-mono text-s">{visibleSteps} / {maxSteps} OPS</span>
        </div>

        <div
          ref={scrollContainerRef}
          className="h-64 overflow-hidden font-mono text-xs p-2"
        >
          {k2Reasoning.steps.slice(0, visibleSteps).map((text, i) => (
            <div key={i} className="mb-0.5 flex gap-2">
              <span className="text-slate-600 w-8 text-right">0x{i.toString(16).toUpperCase().padStart(2, '0')}</span>
              <span className="text-neon-purple/80 opacity-0 animate-fadeIn" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>&gt; {text}</span>
            </div>
          ))}
          {visibleSteps < maxSteps && (
            <div className="text-neon-cyan animate-pulse">_</div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
            <span>PROCESSING TENSOR TILE...</span>
            <span>{(percentComplete).toFixed(1)}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan shadow-[0_0_10px_#06b6d4]"
              animate={{ width: `${percentComplete}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 font-mono">
          <span>CONFIDENCE: <span className="text-green-400">{(k2Reasoning.confidence * 100).toFixed(6)}%</span></span>
          <span className="text-slate-400">LATENCY: {k2Reasoning.completionTime}</span>
        </div>
      </div>
    </div>
  )
}
