// FILE: src/components/Navigation.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  Menu, 
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const routes = [
    { name: 'Dashboard', path: '/dashboard', icon: FileText },
    { name: 'Resume Builder', path: '/generate-resume', icon: FileText },
    { name: 'ATS Scanner', path: '/ats-checker', icon: CheckCircle },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-obsidian-900/80 backdrop-blur-xl border-b border-obsidian-700/50 shadow-neon-cyan/5' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="text-3xl font-extrabold tracking-tighter flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src="/logo.svg" alt="Techify Logo" className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            </motion.div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-slate-800 dark:via-white to-neon-purple drop-shadow-sm">Techify</span>
          </Link>
          
          <div className="hidden md:flex space-x-2 lg:space-x-4 items-center bg-slate-100/80 dark:bg-obsidian-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-300 dark:border-obsidian-700/50">
            {routes.map((route) => {
              const Icon = route.icon;
              const isActive = pathname === route.path;
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors group"
                >
                  <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-neon-cyan'}`}>
                    <Icon size={16} />
                    {route.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-slate-200 dark:bg-obsidian-700 rounded-full border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {loading ? (
              <div className="w-24 h-10 bg-obsidian-800 rounded-full animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-neon-cyan/80">{user.email}</span>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="px-5 py-2 bg-slate-200 dark:bg-obsidian-800 hover:bg-slate-300 dark:hover:bg-obsidian-700 text-slate-900 dark:text-white text-sm font-medium rounded-full border border-slate-300 dark:border-obsidian-700 transition-colors shadow-sm"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login"
                  className="px-5 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-sm font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  href="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-neon-cyan to-blue-600 text-obsidian-900 font-bold text-sm rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={28} className="text-neon-pink" /> : <Menu size={28} className="text-neon-cyan" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-obsidian-900/95 backdrop-blur-3xl border-b border-slate-200 dark:border-obsidian-700"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {routes.map((route) => {
                 const Icon = route.icon;
                 const isActive = pathname === route.path;
                 return (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive 
                        ? 'bg-slate-100 dark:bg-obsidian-800 text-neon-cyan border border-neon-cyan/20' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-obsidian-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-neon-cyan" : ""} />
                    {route.name}
                  </Link>
                 )
              })}
              
              <div className="pt-4 mt-4 border-t border-obsidian-800 flex flex-col gap-3">
                {user ? (
                  <button 
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full text-center px-4 py-3 bg-slate-100 dark:bg-obsidian-800 text-slate-900 dark:text-white rounded-xl"
                  >
                    Logout ({user.email})
                  </button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full text-center px-4 py-3 bg-slate-100 dark:bg-obsidian-800 text-slate-900 dark:text-white rounded-xl">Login</Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full text-center px-4 py-3 bg-neon-cyan text-obsidian-900 font-bold rounded-xl shadow-neon-cyan">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;