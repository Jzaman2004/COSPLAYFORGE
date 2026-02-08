import { useEffect, useState } from 'react'

export default function AgentDemoOverlay({ text = 'Searching YouTube...', active = false }) {
  const [typed, setTyped] = useState('')
  const [cursorOn, setCursorOn] = useState(true)

  useEffect(() => {
    let timer = null
    if (active && text) {
      let i = 0
      setTyped('')
      timer = setInterval(() => {
        if (i < text.length) {
          setTyped(text.substring(0, i + 1))
          i++
        } else {
          clearInterval(timer)
        }
      }, 50) // 50ms per character for realistic typing speed
    } else {
      setTyped('')
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [active, text])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setCursorOn(prev => !prev)
    }, 530)
    return () => clearInterval(cursorTimer)
  }, [])

  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none flex items-start justify-center z-40">
      <div className="mt-20 bg-slate-900/95 text-white font-mono text-sm px-5 py-3 rounded-xl shadow-2xl border border-cyan-500/30 max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="text-cyan-300 text-xs mb-1 flex items-center gap-2">
              <span>🤖 Computer Use Agent</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400">LIVE</span>
            </div>
            <div className="text-white">
              {typed}
              <span className="ml-0.5 text-cyan-400" style={{ opacity: cursorOn ? 1 : 0 }}>▊</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
