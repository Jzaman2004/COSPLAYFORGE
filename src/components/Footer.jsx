import { Github, ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative w-full bg-slate-950 border-t border-slate-800 pt-8 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main footer content */}
        <div className="flex items-center justify-between mb-4">
          {/* Left: Copyright */}
          <div className="text-slate-400 text-sm font-mono">
            © 2026 CosplayForge All rights reserved
          </div>

          {/* Right: GitHub link */}
          <a
            href="https://github.com/Jzaman2004/COSPLAYFORGE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <Github className="w-5 h-5 transition-colors" />
            <ArrowRight className="w-5 h-5 transition-colors group-hover:text-neon-purple" />
          </a>
        </div>

        {/* Center: Tech stack (very faint at bottom) */}
        <div className="text-center text-slate-600 text-xs font-mono mt-6">
          Built with React • Vite • Tailwind CSS • Framer Motion
        </div>
      </div>
    </footer>
  )
}
