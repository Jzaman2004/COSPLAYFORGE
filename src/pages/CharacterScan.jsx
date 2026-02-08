import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Loader, Sun, Moon } from 'lucide-react'
import { generateCharacterProfile, generateDALLEVisualization } from '../services/llamaService'

export default function CharacterScan() {
  const navigate = useNavigate()
  const [isForging, setIsForging] = useState(false)
  const [error, setError] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark
    setIsDark(initialDark)
    document.documentElement.classList.toggle('dark', initialDark)
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  const formatCharacterName = (filename) => {
    if (!filename) return ''
    const base = filename.replace(/\.[^/.]+$/, '')
    const spaced = base.replace(/[_-]+/g, ' ').trim()
    return spaced.replace(/\b\w/g, (char) => char.toUpperCase())
  }

  // Handle file upload - just store the image, don't forge yet
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setUploadedImage(event.target.result)
      setUploadedFileName(file.name)
      setSelectedCharacter(null)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  // Forge the image - triggered by Forge button
  const handleForge = async () => {
    if (!uploadedImage && !selectedCharacter) {
      setError('Please upload an image or select a character first')
      return
    }

    setIsForging(true)
    setError(null)
    
    try {
      const nameFromFile = formatCharacterName(uploadedFileName)
      const characterName = uploadedImage ? nameFromFile : selectedCharacter
      const desc = await generateCharacterProfile(characterName || 'Unknown Character')

      const viz = await generateDALLEVisualization(desc)
      
      // Store in sessionStorage and navigate to blueprint page
      sessionStorage.setItem('cosplayDescription', JSON.stringify({
        description: desc,
        visualization: viz,
        uploadedImage,
        character: characterName || selectedCharacter,
        filename: uploadedFileName
      }))

      // Navigate to blueprint/description page
      navigate('/blueprint')
    } catch (err) {
      setError(`Forging failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsForging(false)
    }
  }

  const handlePresetClick = (characterName) => {
    setSelectedCharacter(characterName)
    setUploadedImage(null)
    setError(null)
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

  return (
    <div 
      className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased overflow-x-hidden transition-colors duration-300 flex flex-col"
      style={{ 
        width: '100vw',
        maxWidth: '100vw',
        overflowX: 'hidden',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)'
      }}
    >
      
      <header className="w-full px-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="text-lg md:text-xl font-bold tracking-wide text-slate-900 dark:text-white">CosplayForge</div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-sm font-semibold px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-white transition"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="text-sm font-semibold px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 transition flex items-center gap-2"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col flex-1 pt-8 pb-12 w-full">
        <div className="text-center w-full px-4 mb-6">
          <h1 className="text-4xl md:text-6xl font-black mb-12 tracking-tight leading-[1.08] pb-2 bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-500">
            <span className="block mb-4">Forged by AI.</span>
            <span className="block mb-6">Built by You.</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-light">
            Upload a character image or pick a preset. Click Forge to generate cosplay description.
          </p>
        </div>

        {/* Upload Form */}
        <div className="w-full px-4 mb-8">
          <form className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl flex items-center p-2 border border-slate-200 dark:border-slate-700 max-w-3xl mx-auto">
            <input 
              type="file" 
              id="imageUpload" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileUpload}
            />
            
            <button 
              type="button" 
              onClick={() => !isForging && document.getElementById('imageUpload').click()} 
              disabled={isForging}
              className="p-4 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition disabled:opacity-50" 
              title="Upload Image">
              {isForging ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <i className="fas fa-paperclip text-xl"></i>
              )}
            </button>

            <input 
              type="text" 
              placeholder={uploadedImage ? `${uploadedFileName || 'Image'} selected ✓` : (selectedCharacter ? `${selectedCharacter} selected ✓` : "Upload character image or select preset...")} 
              className="flex-grow bg-transparent border-none outline-none text-lg px-4 text-slate-700 dark:text-slate-200 placeholder-slate-400 h-12"
              readOnly 
            />

            <button 
              type="button" 
              disabled={isForging || (!uploadedImage && !selectedCharacter)}
              onClick={handleForge}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg shadow-indigo-500/30 transition transform active:scale-95 flex items-center gap-2">
              <span>{isForging ? 'Forging...' : 'Forge'}</span>
              {isForging && <Loader className="w-4 h-4 animate-spin" />}
            </button>
          </form>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Preview Section */}
        {(uploadedImage || selectedCharacter) && (
          <div className="w-full px-4 mb-8">
            <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 border border-slate-300 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {uploadedImage ? "📸 Uploaded Image" : `⭐ Selected Character: ${selectedCharacter}`}
              </p>
              {uploadedImage && (
                <img src={uploadedImage} alt="Uploaded" className="w-full max-h-96 object-contain rounded-lg" />
              )}
              {selectedCharacter && !uploadedImage && (
                <img 
                  src={characterData.find(c => c.name === selectedCharacter)?.img} 
                  alt={selectedCharacter} 
                  className="w-full max-h-96 object-contain rounded-lg" 
                />
              )}
            </div>
          </div>
        )}

        {/* Character Carousel */}
        <div className="text-center w-full px-4 mb-4 mt-8">
          <p className="text-slate-600 dark:text-slate-400 text-sm">Or pick a preset character:</p>
        </div>
        
        <section 
          className="relative overflow-hidden pb-12 marquee-container bg-transparent"
          style={{ 
            width: '100vw',
            marginLeft: 'calc(50% - 50vw)',
            marginRight: 'calc(50% - 50vw)'
          }}
        >
          <div className="flex gap-6 animate-scroll marquee-content w-max">
            {displayList.map((character, idx) => (
              <div 
                key={idx} 
                className={`bg-white dark:bg-slate-900 border-2 rounded-lg p-3 min-w-[200px] shadow-lg backdrop-blur-sm card-pop cursor-pointer group transition hover:shadow-xl active:scale-95 ${
                  selectedCharacter === character.name 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                }`}
                onClick={() => handlePresetClick(character.name)}
              >
                <div className="w-full h-40 rounded-lg overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2">
                  <img 
                    src={character.img} 
                    alt={character.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="text-slate-400 text-xs">Image not found</div>';
                    }}
                  />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{character.name}</h3>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{character.level}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
