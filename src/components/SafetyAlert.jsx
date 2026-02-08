import { AlertTriangle, X, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SafetyAlert({ message, type = 'warning' }) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const isWarning = type === 'warning'
  const borderColor = isWarning ? 'border-yellow-500/50' : 'border-red-500/50'
  const glowColor = isWarning ? 'shadow-yellow-500/20' : 'shadow-red-500/20'
  const textColor = isWarning ? 'text-yellow-400' : 'text-red-400'

  return (
    <AnimatePresence>
      <motion.div
        className={`relative overflow-hidden rounded-lg border ${borderColor} bg-black/80 p-4 shadow-lg ${glowColor} backdrop-blur-sm`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
      >
        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-20"></div>

        <div className="flex items-start gap-4 relative z-10">
          <div className={`p-2 rounded bg-black border ${borderColor}`}>
            {isWarning ? <AlertTriangle className={`w-6 h-6 ${textColor} animate-pulse`} /> : <ShieldAlert className={`w-6 h-6 ${textColor} animate-pulse`} />}
          </div>

          <div className="flex-1">
            <div className={`font-mono text-xs ${textColor} mb-1 flex items-center justify-between`}>
              <span>DEDALUS_SAFETY_PROTOCOL_v9.0</span>
              <span className="opacity-50">ID: {Math.floor(Math.random() * 99999)}</span>
            </div>
            <p className="font-display font-bold text-white text-sm tracking-wide mb-1">
              SAFETY ADVISORY DETECTED
            </p>
            <p className="text-slate-400 text-xs font-mono leading-relaxed">
              {message}
            </p>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-500 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
