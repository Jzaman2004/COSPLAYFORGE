import { AlertCircle, X } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function SafetyAlert({ message, type = 'warning' }) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const bgColor = type === 'warning' ? 'bg-yellow-900' : 'bg-red-900'
  const borderColor = type === 'warning' ? 'border-yellow-600' : 'border-red-600'
  const textColor = type === 'warning' ? 'text-yellow-200' : 'text-red-200'
  const iconColor = type === 'warning' ? 'text-yellow-400' : 'text-red-400'

  return (
    <motion.div
      className={`${bgColor} ${borderColor} ${textColor} rounded-lg border-2 p-4 flex items-start gap-3`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <AlertCircle className={`${iconColor} w-5 h-5 flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className="text-sm font-semibold">Dedalus Safety Alert</p>
        <p className="text-xs mt-1">{message}</p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="flex-shrink-0 hover:opacity-70 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
