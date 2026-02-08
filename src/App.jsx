import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Pages
import CharacterScan from './pages/CharacterScan'
// BlueprintStudio removed
import TryOnLab from './pages/TryOnLab'
import AuthPage from './pages/AuthPage'
import Checkout from './pages/Checkout'

// Components
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div
        className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden flex flex-col selection:bg-neon-purple selection:text-white"
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
          {/* Blueprint route removed */}
          <Route path="/tryonlab" element={<TryOnLab />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>

        {/* Footer Component */}
        <Footer />
      </div>
    </Router>
  )
}

export default App
