import { useState } from 'react'
import { Play, Pause, Terminal } from 'lucide-react'

export default function ComputerUseDemo() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="w-full glass-panel rounded-lg overflow-hidden border border-neon-purple/50 relative group">
      <div className="bg-black/90 p-2 flex items-center gap-2 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
        </div>
        <div className="ml-4 flex-1 text-center font-mono text-xs text-slate-500">
          agent_browser_session_v4.2.exe
        </div>
      </div>

      <div className="aspect-video bg-slate-950 flex items-center justify-center relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="glass-panel p-8 rounded-xl flex flex-col items-center border border-neon-cyan/30 backdrop-blur-md">
            <Terminal className="w-12 h-12 text-neon-cyan mb-4 animate-pulse" />
            <div className="text-center">
              <div className="text-neon-cyan font-mono text-sm mb-6 tracking-widest">
                [AGENT_COMPUTER_USE_DEMO]
              </div>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="group relative px-6 py-2 bg-transparent overflow-hidden rounded-full transition-all hover:scale-105"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-purple to-neon-cyan opacity-80 group-hover:opacity-100"></div>
                <div className="relative flex items-center gap-2 text-white font-bold text-sm">
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>PAUSE SIMULATION</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 ml-1" />
                      <span>LINITIATE AGENT</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/80 p-3 border-t border-neon-purple/30">
        <p className="text-neon-cyan/70 text-xs font-mono flex items-center gap-2">
          <span className="animate-pulse">_</span>
          WAITING FOR USER COMMAND INPUT...
        </p>
      </div>
    </div>
  )
}
