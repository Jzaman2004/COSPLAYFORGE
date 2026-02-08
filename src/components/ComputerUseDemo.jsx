import { useState } from 'react'
import { Play, Pause } from 'lucide-react'

export default function ComputerUseDemo() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden border-2 border-purple-500">
      <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
        {/* Video placeholder - will play demo video when "agent searches" */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-black">
          <div className="text-center">
            <div className="text-cyan-400 text-sm font-mono mb-4">
              [Computer Use Agent Demo]
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="mb-4 p-4 bg-purple-600 hover:bg-purple-700 rounded-full transition"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>
            <p className="text-gray-400 text-xs">
              video placeholder
            </p>
          </div>
        </div>
      </div>
      <div className="bg-purple-950 p-4">
        <p className="text-purple-300 text-xs font-mono">
          Playing simulated agent search sequence...
        </p>
      </div>
    </div>
  )
}
