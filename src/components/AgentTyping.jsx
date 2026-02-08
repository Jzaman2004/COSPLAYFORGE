import { useEffect, useState } from 'react'

export default function AgentTyping({ text = 'Saitama bald cap tutorial', speed = 60, playing }) {
  const [visible, setVisible] = useState('')
  useEffect(() => {
    if (!playing) return setVisible('')
    let i = 0
    setVisible('')
    const t = setInterval(() => {
      i += 1
      setVisible(text.slice(0, i))
      if (i >= text.length) clearInterval(t)
    }, speed)
    return () => clearInterval(t)
  }, [playing, text, speed])

  return (
    <div className="absolute left-4 bottom-4 bg-black/60 text-white text-sm px-3 py-2 rounded font-mono pointer-events-none">
      {visible}
      <span className="inline-block w-2">{visible && <span className="blink">|</span>}</span>
      <style>{`.blink{opacity:1;animation:blink 1s steps(2, start) infinite}@keyframes blink{50%{opacity:0}}`}</style>
    </div>
  )
}
