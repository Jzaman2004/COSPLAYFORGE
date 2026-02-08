import { motion } from 'framer-motion'
import { Check, Shield, Zap, Info, ArrowRight, Star, Crown, Hammer, ShoppingBag } from 'lucide-react'

export default function AnalysisResult({ analysisData, onSelectTier, onBack }) {
    if (!analysisData) return null

    const { character, description, tiers, uploadedImage, visualization } = analysisData

    // Helper to render a tier card with specific styling per type
    const TierCard = ({ title, priceRange, items, icon: Icon, color, delay, tierId, accentColor }) => {
        // Styling variants based on tier
        const isPremium = tierId === 'premium'
        const isDIY = tierId === 'diy'

        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.5 }}
                className={`relative h-full flex flex-col group rounded-xl overflow-hidden transition-all duration-500
          ${isPremium
                        ? 'glass-panel border-purple-500/50 hover:border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]'
                        : isDIY
                            ? 'glass-panel border-slate-700 hover:border-orange-500/50'
                            : 'glass-panel border-neon-cyan/20 hover:border-neon-cyan/50'
                    }
        `}
            >
                {/* Animated Background for Premium */}
                {isPremium && (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-700"></div>
                )}

                {/* Top Strip */}
                <div className={`h-1 w-full ${isPremium ? 'bg-gradient-to-r from-purple-500 to-pink-500' : isDIY ? 'bg-orange-500/70' : 'bg-neon-cyan/70'}`}></div>

                <div className="p-6 flex-1 flex flex-col relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                {isPremium && <Crown className="w-4 h-4 text-yellow-500 animate-pulse" />}
                                <h3 className={`font-display font-bold text-2xl ${isPremium ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white' : 'text-white'}`}>
                                    {title}
                                </h3>
                            </div>
                            <p className={`font-mono text-xs ${isPremium ? 'text-purple-300' : 'text-slate-400'}`}>{priceRange}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${isPremium ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
                            : isDIY ? 'bg-orange-500/10 border border-orange-500/30 text-orange-400'
                                : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                            }`}>
                            <Icon className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/5 mb-6"></div>

                    {/* Normalize items if they come as an object (new format) or array (legacy) */}
                    <ul className="space-y-4 mb-8 flex-1">
                        {(Array.isArray(items) ? items : items?.items || []).slice(0, 5).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm group/item">
                                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${isPremium ? 'bg-purple-500 group-hover/item:bg-purple-300 group-hover/item:shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                                    : isDIY ? 'bg-orange-500'
                                        : 'bg-cyan-500'
                                    }`}></span>
                                <span className="leading-tight text-slate-300 group-hover/item:text-white transition-colors">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => onSelectTier(tierId, items)}
                        className={`w-full py-4 rounded font-bold font-mono text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02]
              ${isPremium
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/20'
                                : isDIY
                                    ? 'border border-orange-500/50 text-orange-400 hover:bg-orange-500/10'
                                    : 'border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10'
                            }
            `}
                    >
                        {isPremium ? 'FORGE LEGENDARY' : 'INITIATE BUILD'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </button>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 animate-fadeIn">
            {/* Back Nav */}
            <button
                onClick={onBack}
                className="mb-8 text-slate-500 hover:text-white text-xs font-mono flex items-center gap-2 transition group"
            >
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition" />
                RE-SCAN TARGET
            </button>

            {/* Header Section with Image */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-slate-800 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4">
                        <div className="flex gap-2">
                            <div className="px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-mono rounded">
                                SCAN_COMPLETE
                            </div>
                            <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-mono rounded">
                                CONFIDENCE: 99.8%
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* Character Image Display */}
                        <div className="relative group shrink-0">
                            <div className="absolute -inset-1 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-xl opacity-50 blur group-hover:opacity-75 transition duration-1000"></div>
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden bg-slate-900 ring-2 ring-white/10">
                                {uploadedImage ? (
                                    <img src={uploadedImage} alt={character} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                        <Zap className="w-12 h-12 text-slate-600" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 text-glow">
                                {character?.toUpperCase()}
                            </h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-neon-purple to-transparent mb-4 mx-auto md:mx-0"></div>
                            <p className="text-slate-300 leading-relaxed font-light text-sm md:text-base max-w-2xl">
                                {description}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats / Info Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-center gap-4 bg-slate-900/50"
                >
                    <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Analysis Vector</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">Complexity Rating</div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-neon-purple h-full w-[85%] shadow-[0_0_10px_#a855f7]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">Material Integrity</div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-neon-cyan h-full w-[92%] shadow-[0_0_10px_#06b6d4]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">Fabrication Time</div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-pink-500 h-full w-[65%] shadow-[0_0_10px_#ec4899]"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                <TierCard
                    title="DIY PROTOCOL"
                    priceRange="$0 - $50 (Scavenger Mode)"
                    items={tiers.diy}
                    icon={Hammer}
                    color="orange-500"
                    delay={0.2}
                    tierId="diy"
                />

                <TierCard
                    title="BUDGET BUILD"
                    priceRange="$50 - $150 (Efficiency)"
                    items={tiers.budget}
                    icon={ShoppingBag}
                    color="neon-cyan"
                    delay={0.3}
                    tierId="budget"
                />

                <TierCard
                    title="PREMIUM FORGE"
                    priceRange="$150 - $500+ (Cinema Quality)"
                    items={tiers.premium}
                    icon={Crown}
                    color="purple-500"
                    delay={0.4}
                    tierId="premium"
                />
            </div>
        </div>
    )
}
