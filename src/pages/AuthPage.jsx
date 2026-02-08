import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Zap, Lock, Mail, User, ShieldCheck, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AuthPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Check if already authenticated
    useEffect(() => {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated')
        if (isAuthenticated) {
            const from = location.state?.from || '/'
            navigate(from, { replace: true })
        }
    }, [navigate, location])

    const handleLogin = (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        // Simulate API delay
        setTimeout(() => {
            // Mock validation
            if ((email === 'admin' && password === 'admin') || (email === 'admin@cosplayforge.com' && password === 'admin')) {
                sessionStorage.setItem('isAuthenticated', 'true')
                const from = location.state?.from || '/'
                navigate(from, { replace: true })
            } else {
                setError('ACCESS_DENIED: INVALID_CREDENTIALS')
                setIsLoading(false)
            }
        }, 1500)
    }

    const handleGoogleLogin = () => {
        // Mock Google Login
        setIsLoading(true)
        setTimeout(() => {
            sessionStorage.setItem('isAuthenticated', 'true')
            const from = location.state?.from || '/'
            navigate(from, { replace: true })
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%] opacity-20"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/20 blur-[150px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel w-full max-w-md p-8 rounded-2xl border border-white/10 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-slate-900 border border-neon-cyan flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            <ShieldCheck className="w-8 h-8 text-neon-cyan" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-wider text-glow">
                        SECURE <span className="text-neon-cyan">LOGIN</span>
                    </h1>
                    <p className="text-slate-400 font-mono text-xs">&gt;&gt; AUTHENTICATION_REQUIRED_FOR_CHECKOUT</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 bg-red-500/10 border border-red-500/50 rounded p-3 flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-red-400 font-mono text-xs pt-0.5">{error}</span>
                    </motion.div>
                )}

                <div className="space-y-4">
                    {/* Google Sign In - Mock */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full bg-white text-slate-900 font-bold py-3 rounded flex items-center justify-center gap-3 hover:bg-slate-200 transition relative overflow-hidden group"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        <span>Sign in with Google</span>
                        {isLoading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div></div>}
                    </button>

                    <div className="relative flex items-center justify-center my-6">
                        <div className="h-px bg-slate-700 w-full absolute"></div>
                        <span className="bg-slate-950 px-3 text-xs text-slate-500 font-mono relative z-10">OR_USE_CREDENTIALS</span>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 font-mono ml-1">USER_ID / EMAIL</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan placeholder-slate-600 outline-none transition font-mono text-sm"
                                    placeholder="admin"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 font-mono ml-1">ACCESS_KEY</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    className="w-full bg-black/40 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan placeholder-slate-600 outline-none transition font-mono text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-purple/80 hover:to-neon-cyan/80 text-white font-bold py-4 rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.3)] transition transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2 font-mono">
                                    <Zap className="w-5 h-5 animate-pulse" />
                                    AUTHENTICATING...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2 font-mono tracking-widest">
                                    <ShieldCheck className="w-5 h-5" />
                                    INITIALIZE_SESSION
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-slate-500 text-xs">
                        Don't have an account? <span className="text-neon-cyan hover:underline cursor-pointer">Register New ID</span>
                    </p>
                </div>
            </motion.div>

            <div className="mt-8 text-slate-600 font-mono text-[10px] text-center max-w-sm">
                SECURE CONNECTION ESTABLISHED via QUANTUM-ENCRYPTION PROTOCOL v4.2<br />
                ALL ACCESS MONITORED BY DEDALUS SYSTEMS
            </div>
        </div>
    )
}
