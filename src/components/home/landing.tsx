import React from 'react';
import { ArrowRight, FileText, Sparkles, Zap, CheckCircle, Crosshair } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-obsidian-900 pt-20 flex flex-col justify-center items-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-cosmic-gradient pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-screen" />

      {/* Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center pb-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center items-center gap-4 mb-6"
        >
          <div className="relative group">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            >
              <Sparkles className="h-16 w-16 text-neon-cyan drop-shadow-neon-cyan" />
            </motion.div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-slate-800 dark:via-white to-neon-purple pb-2">
            Techify
          </h1>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-2xl md:text-4xl font-light text-slate-700 dark:text-slate-300 mb-8 max-w-3xl mx-auto"
        >
          Your AI-powered <span className="font-semibold text-slate-900 dark:text-white">Command Center</span> for career acceleration.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed font-mono"
        >
          > Initialize system sequence. Generating elite resumes, auditing ATS scores, and executing interview simulations in real-time.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Link href="/generate-resume" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto relative px-8 py-4 bg-slate-100 dark:bg-obsidian-800 rounded-xl overflow-hidden border border-neon-cyan/50 shadow-neon-cyan group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center justify-center gap-3 text-slate-900 dark:text-white font-bold text-lg font-mono">
                [ INIT_BUILDER ] <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </Link>
          
          <Link href="/ats-checker" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto relative px-8 py-4 bg-slate-50/50 dark:bg-obsidian-800/50 backdrop-blur-md rounded-xl border border-slate-300 dark:border-obsidian-700 hover:border-neon-purple/50 transition-colors group shadow-sm hover:shadow-neon-purple"
            >
              <span className="relative flex items-center justify-center gap-3 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white font-bold text-lg font-mono transition-colors">
                SCAN_ATS <CheckCircle className="h-5 w-5 text-neon-purple" />
              </span>
            </motion.button>
          </Link>

        </motion.div>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Hyper-Fast Processing",
              description: "Our AI processes data in milliseconds, generating resumes instantly.",
              color: "text-neon-cyan",
              bgBox: "bg-neon-cyan/10 border-neon-cyan/20 dark:bg-obsidian-900 dark:border-obsidian-700",
              hoverEffect: "hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] hover:border-neon-cyan/40 dark:hover:shadow-[0_8px_30px_rgba(0,240,255,0.3)]"
            },
            {
              icon: FileText,
              title: "Quantum Formatting",
              description: "Structured flawlessly for both human eyes and machine ATS algorithms.",
              color: "text-blue-500 dark:text-white",
              bgBox: "bg-blue-500/10 border-blue-500/20 dark:bg-obsidian-900 dark:border-obsidian-700",
              hoverEffect: "hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] hover:border-blue-500/40 dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)] dark:hover:border-white/40"
            },
            {
              icon: Sparkles,
              title: "Neural Engine AI",
              description: "Leveraging state-of-the-art LLMs to write compelling bullet points.",
              color: "text-neon-purple",
              bgBox: "bg-neon-purple/10 border-neon-purple/20 dark:bg-obsidian-900 dark:border-obsidian-700",
              hoverEffect: "hover:shadow-[0_8px_30px_rgba(191,0,255,0.15)] hover:border-neon-purple/40 dark:hover:shadow-[0_8px_30px_rgba(191,0,255,0.3)]"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + (i * 0.2) }}
              whileHover={{ y: -5 }}
              className={`bg-white/80 dark:bg-obsidian-800/60 backdrop-blur-xl border border-slate-200 dark:border-obsidian-700 rounded-2xl p-8 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-sm ${feature.hoverEffect}`}
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 border ${feature.bgBox}`}>
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white font-mono tracking-tight">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}