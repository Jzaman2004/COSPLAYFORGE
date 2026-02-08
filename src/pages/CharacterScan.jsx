import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader, Upload, Scan, Zap, LogIn, LogOut, User } from 'lucide-react'
import { generateCharacterProfile, generateCosplayTiers, generateDALLEVisualization } from '../services/llamaService'
import K2ThinkFlow from '../components/K2ThinkFlow'
import AnalysisResult from '../components/AnalysisResult'

export default function CharacterScan() {
  const navigate = useNavigate()
  const [isForging, setIsForging] = useState(false)
  const [error, setError] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // New State for Analysis Flow
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)

  // Force dark mode and check auth
  useEffect(() => {
    document.documentElement.classList.add('dark')
    const auth = sessionStorage.getItem('isAuthenticated')
    setIsAuthenticated(!!auth)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated')
    setIsAuthenticated(false)
  }

  const formatCharacterName = (filename) => {
    if (!filename) return ''
    const base = filename.replace(/\.[^/.]+$/, '')
    const spaced = base.replace(/[_-]+/g, ' ').trim()
    return spaced.replace(/\b\w/g, (char) => char.toUpperCase())
  }

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setUploadedImage(event.target.result)
      setUploadedFileName(file.name)
      setSelectedCharacter(null)
      setError(null)
      setAnalysisComplete(false) // Reset analysis state
    }
    reader.readAsDataURL(file)
  }

  // Forge the image / Initialize Analysis
  const handleForge = async () => {
    if (!uploadedImage && !selectedCharacter) {
      setError('INITIALIZATION ERROR: No Subject Detected')
      return
    }

    setIsForging(true)
    setError(null)

    try {
      const nameFromFile = formatCharacterName(uploadedFileName)
      const characterName = selectedCharacter || (uploadedFileName ? nameFromFile : 'Unknown Character')

      // 1. Generate Description & Tiers in parallel (or sequential if dependency needed)
      console.log("Starting analysis for:", characterName)

      const MIN_LOADING_TIME = 2000 // 2 seconds
      const [desc, tiers] = await Promise.all([
        generateCharacterProfile(characterName),
        generateCosplayTiers(characterName),
        new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME))
      ])

      const viz = await generateDALLEVisualization(desc)

      // Determine image to show (Upload OR Preset Image)
      let displayImage = uploadedImage
      if (!displayImage && selectedCharacter) {
        const preset = characterData.find(c => c.name === selectedCharacter)
        if (preset) displayImage = preset.img
      }

      setAnalysisData({
        character: characterName,
        description: desc,
        tiers: tiers,
        visualization: viz,
        uploadedImage: displayImage, // Use the resolved image
        filename: uploadedFileName
      })

      // Introduce a slight artificial delay if API is too fast, to show the cool K2 animation
      // But if it took long enough, show immediately.
      // For now, let's just wait a moment to ensure user sees "Thinking"
      // actually, just proceed.

      setAnalysisComplete(true)
    } catch (err) {
      console.error(err)
      setError(`SYSTEM FAILURE: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsForging(false)
    }
  }

  const handleTierSelect = (tierId, items) => {
    // Save selected build to session and navigate
    sessionStorage.setItem('cosplayBuild', JSON.stringify({
      ...analysisData,
      selectedTier: tierId,
      items: items
    }))

    // Also save legacy format for compatibility if needed, but 'cosplayBuild' is our new gold standard
    sessionStorage.setItem('cosplayDescription', JSON.stringify({
      description: analysisData.description,
      visualization: analysisData.visualization,
      uploadedImage: analysisData.uploadedImage,
      character: analysisData.character,
      items: items // Pass specific items
    }))

    navigate('/tryonlab')
  }

  const handlePresetClick = (characterName) => {
    setSelectedCharacter(characterName)
    setUploadedImage(null)
    setError(null)
    setAnalysisComplete(false)
  }

  const characterData = [
    { name: "Miku", level: "Expert", img: "/miku.webp" },
    { name: "Spiderman", level: "Beginner", img: "/spiderman.jpeg" },
    { name: "Luffy", level: "Beginner", img: "/luffy.jpeg" },
    { name: "Naruto", level: "Intermediate", img: "/naruto.jpg" },
    { name: "Gojo", level: "Intermediate", img: "/gojo.jpg" },
    { name: "Mikasa", level: "Expert", img: "/mikasa.jpeg" }
  ]

  const displayList = [...characterData, ...characterData]

  // RENDER: Loading State (K2 Animation)
  if (isForging) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <h2 className="text-neon-cyan font-mono text-xl mb-6 text-center animate-pulse">
            INITIATING K2 REASONING ENGINE...
          </h2>
          <K2ThinkFlow />
        </div>
      </div>
    )
  }

  // RENDER: Analysis Results (Tier Selection)
  if (analysisComplete && analysisData) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 pb-20">
        {/* Re-using header just for consistency or a simplified back button */}
        <AnalysisResult
          analysisData={analysisData}
          onSelectTier={handleTierSelect}
          onBack={() => setAnalysisComplete(false)}
        />
      </div>
    )
  }

  // RENDER: Initial Scan View
  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-6 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 text-neon-purple animate-pulse" />
          <div className="text-2xl font-display font-bold tracking-wider text-white text-glow">
            COSPLAY<span className="text-neon-cyan">FORGE</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 border border-neon-cyan/30 bg-neon-cyan/10 rounded text-xs font-mono text-neon-cyan hidden md:block">
            SYSTEM: ONLINE
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 border border-neon-purple/30 bg-neon-purple/10 rounded text-xs font-mono text-neon-purple">
                <User className="w-3 h-3" />
                ADMIN_USER
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-mono"
              >
                <LogOut className="w-4 h-4" />
                LOGOUT
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth', { state: { from: '/' } })}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-neon-cyan text-white rounded transition text-xs font-mono group"
            >
              <LogIn className="w-4 h-4 group-hover:text-neon-cyan transition" />
              SIGN_IN
            </button>
          )}
        </div>
      </header>

      <main className="grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Column: Text & Instructions */}
        <div>
          <h1 className="text-5xl md:text-7xl font-display font-black mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">FORGED BY</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan text-glow">INTELLIGENCE</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 font-light max-w-lg border-l-2 border-neon-purple/50 pl-4">
            Upload a reference image or select a preset to initialize the generative cosplay engine.
          </p>

          <div className="flex flex-col gap-4 max-w-md">
            {/* Upload Box */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative glass-panel rounded-lg p-1">
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => !isForging && document.getElementById('imageUpload').click()}
                  className="w-full h-32 border-2 border-dashed border-slate-600 hover:border-neon-cyan/50 rounded flex flex-col items-center justify-center gap-2 group-hover:bg-slate-900/50 transition cursor-pointer"
                >
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Preview" className="h-28 w-full object-contain" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-500 group-hover:text-neon-cyan transition" />
                      <span className="text-slate-500 font-mono text-sm group-hover:text-neon-cyan">INITIALIZE DATA UPLOAD</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Selection Display */}
            <div className="glass-panel p-3 rounded border-l-4 border-neon-cyan flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">TARGET:</span>
              <span className="font-mono text-neon-cyan font-bold truncate max-w-[200px]">
                {uploadedFileName || selectedCharacter || "WAITING FOR INPUT..."}
              </span>
            </div>

            {/* Forge Button */}
            <button
              onClick={handleForge}
              disabled={isForging || (!uploadedImage && !selectedCharacter)}
              className="relative w-full py-4 bg-neon-purple/20 hover:bg-neon-purple/40 border border-neon-purple/50 text-white font-display font-bold tracking-widest text-xl rounded transition overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isForging ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>ANALYZING GEOMETRY...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Scan className="w-6 h-6 group-hover:animate-pulse" />
                  <span>INITIATE FORGE</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Preset Carousel */}
        <div className="relative">
          <div className="absolute inset-0 bg-neon-purple/5 blur-[100px] rounded-full"></div>
          <p className="font-mono text-xs text-slate-500 mb-4 tracking-widest text-center">OR SELECT FROM DATABASE:</p>

          <div className="h-[600px] overflow-hidden relative fade-y-mask marquee-vertical-container">
            <div className="space-y-6 animate-scroll-vertical hover:pause">
              {[...displayList, ...displayList].map((character, idx) => {
                const isSelected = selectedCharacter === character.name
                return (
                  <motion.div
                    key={`${character.name}-${idx}`}
                    layout
                    onClick={() => handlePresetClick(character.name)}
                    initial={{ opacity: 0.8 }}
                    whileHover={{ scale: 1.02, opacity: 1 }}
                    animate={{
                      scale: isSelected ? 1.05 : 1,
                      borderColor: isSelected ? 'rgba(6, 182, 212, 0.8)' : 'rgba(148, 163, 184, 0.1)',
                      backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.1)' : 'rgba(15, 23, 42, 0.6)'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`glass-panel p-4 flex items-center gap-6 cursor-pointer border rounded-xl relative overflow-hidden group/card`}
                  >
                    <div className="relative">
                      <img
                        src={character.img}
                        className={`object-cover rounded-lg transition-all duration-500 ${isSelected ? 'w-32 h-40 ring-2 ring-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'w-24 h-32 grayscale group-hover/card:grayscale-0'}`}
                        alt={character.name}
                      />
                      {isSelected && (
                        <motion.div
                          layoutId="selection-glow"
                          className="absolute inset-0 rounded-lg bg-neon-cyan/20 animate-pulse"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className={`font-display font-bold text-2xl mb-1 ${isSelected ? 'text-neon-cyan text-glow' : 'text-white'}`}>
                        {character.name.toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-neon-purple animate-ping' : 'bg-slate-500'}`}></div>
                        <span className="font-mono text-xs text-slate-400 tracked-widest">{character.level.toUpperCase()} PROTOCOL</span>
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="font-mono text-xs text-neon-cyan/80 mt-2"
                        >
                          &gt; SUBJECT_SELECTED<br />
                          &gt; READY_TO_FORGE
                        </motion.div>
                      )}
                    </div>

                    {/* Decorative selection corners */}
                    {isSelected && (
                      <>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-cyan"></div>
                      </>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
