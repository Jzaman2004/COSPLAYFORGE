import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Pages
import CharacterScan from './pages/CharacterScan'
import BlueprintStudio from './pages/BlueprintStudio'
import TryOnLab from './pages/TryOnLab'
import Checkout from './pages/Checkout'

function App() {
  return (
    <Router>
      <div 
        className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden flex flex-col"
        style={{
          width: '100vw',
          maxWidth: '100vw',
          overflowX: 'hidden',
          marginLeft: 'calc(50% - 50vw)',
          marginRight: 'calc(50% - 50vw)'
        }}
      >
        <Routes>
          <Route path="/" element={<CharacterScan />} />
          <Route path="/character-scan" element={<CharacterScan />} />
          <Route path="/blueprint" element={<BlueprintStudio />} />
          <Route path="/tryonlab" element={<TryOnLab />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        
        {/* FOOTER WITH SPONSOR INFO */}
        <footer className="py-8 text-center text-xs md:text-sm border-t border-slate-300 dark:border-gray-700 mt-12 w-full bg-slate-50 dark:bg-slate-950">
          <div className="w-full px-4">
            <div className="mb-4 text-slate-600 dark:text-gray-400">🎭 The Illusion Architecture™</div>
            <div className="text-indigo-600 dark:text-purple-300 text-xs font-mono mb-2">
              A hackathon simulation showcasing 11 sponsor integrations
            </div>
            <div className="mt-3 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700/30 rounded-lg inline-block">
              <div className="text-yellow-700 dark:text-yellow-300 text-xs font-semibold mb-1">⚠️ Demo Disclaimer</div>
              <div className="text-yellow-700 dark:text-yellow-200/80 text-xs max-w-2xl">
                All AI/sponsor responses are pre-recorded or simulated for demonstration reliability.
                No real API calls are made during this presentation.
              </div>
            </div>
            <div className="text-slate-500 dark:text-gray-600 text-xs mt-4">
              Built with React • Vite • Tailwind • Framer Motion
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
