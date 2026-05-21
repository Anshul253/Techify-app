'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Mail, Lock } from "lucide-react";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });
      
      await login(res.data.access_token);
      router.push('/');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setLoading(true);
      try {
        // By default useGoogleLogin gives access_token, but if we want an id_token we can use GoogleLogin component or set flow to 'implicit'. 
        // Wait, @react-oauth/google useGoogleLogin hook has flow: 'implicit' which returns an access_token.
        // Actually we can just get user info from Google's userinfo endpoint using the access_token in the frontend, OR pass access_token to backend.
        // But backend expects an id_token. The easiest way to get an id_token is using the <GoogleLogin> component, but that renders a default button.
        // To use a custom button and get an id_token, we can't easily do it with the hook (Google disabled it for security).
        // Let's modify the backend to accept an access_token and fetch user info, OR we just use the default <GoogleLogin> component, 
        // but we want to keep our custom UI.
        
        // Wait, the backend currently expects an id_token in `id_token.verify_oauth2_token`.
        // Let's fetch the user info in the frontend and send it to our backend, or send the access_token to backend.
        // Let's fetch it here since it's easy:
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        
        // Let's modify the backend google endpoint to accept just the email (with a signed JWT maybe?)
        // No, that's insecure. We MUST verify it on backend.
        // To get an id_token with useGoogleLogin, we must use `flow: 'auth-code'` and exchange it, but that's complex.
        // Let's just use the <GoogleLogin> component which returns credential (id_token) and hide it over our custom button via CSS, OR 
        // better yet, we can change the backend to use the access_token to fetch user info from googleapis.
        
        // I will change the backend to accept an access_token instead!
        const res = await axios.post(`${API_URL}/api/auth/google`, {
          credential: tokenResponse.access_token 
        });
        await login(res.data.access_token);
        router.push('/');
      } catch (err: any) {
        console.error('Google Login failed:', err);
        setError('Failed to login via Google.');
      } finally {
        setLoading(false);
      }
    },
    onError: errorResponse => {
      console.error(errorResponse);
      setError('Google Login failed.');
    }
  });

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-obsidian-900 bg-cosmic-gradient p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px] pointer-events-none" />

      <Card className="relative z-10 w-full max-w-md space-y-6 p-8 bg-white/80 dark:bg-obsidian-800/60 backdrop-blur-xl border border-slate-200 dark:border-obsidian-700 shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">SYS_LOGIN</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-mono tracking-wider">Authenticate to access command center</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500 group-focus-within:text-neon-cyan transition-colors" />
              <Input
                type="email"
                placeholder="operative@techify.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 h-12 bg-white dark:bg-obsidian-900/50 border-slate-300 dark:border-obsidian-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-neon-cyan focus-visible:border-neon-cyan transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500 group-focus-within:text-neon-cyan transition-colors" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10 h-12 bg-white dark:bg-obsidian-900/50 border-slate-300 dark:border-obsidian-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-neon-cyan focus-visible:border-neon-cyan transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-neon-cyan transition-colors"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={formData.remember}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, remember: checked as boolean })
              }
              className="border-obsidian-700 data-[state=checked]:bg-neon-cyan data-[state=checked]:border-neon-cyan"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Persist Session
            </label>
          </div>

          {error && (
            <div className="text-neon-pink text-sm bg-neon-pink/10 border border-neon-pink/30 p-3 rounded-md font-mono">
              [ERROR] {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-neon-cyan hover:bg-[#00d0e0] text-obsidian-900 font-bold shadow-neon-cyan transition-all disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "EXECUTE LOGIN"}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-obsidian-700"></span>
            </div>
            <div className="relative flex justify-center text-xs font-mono uppercase tracking-widest">
              <span className="bg-white dark:bg-obsidian-800 px-3 text-slate-500">External Auth</span>
            </div>
          </div>
          
          <Button 
            type="button" 
            onClick={() => handleGoogleLogin()}
            className="w-full h-12 flex items-center justify-center bg-white dark:bg-obsidian-900 hover:bg-slate-50 dark:hover:bg-obsidian-700 border border-slate-300 dark:border-obsidian-700 text-slate-700 dark:text-white transition-all"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Initialize via Google
          </Button>
        </form>

        <div className="space-y-2 text-center text-sm font-mono">
          <p className="text-slate-600 dark:text-slate-400">
            Unregistered operative?{' '}
            <a href="/signup" className="text-neon-cyan hover:text-neon-cyan/80 dark:hover:text-white transition-colors underline decoration-neon-cyan/30">
              Sign up
            </a>
          </p>
          <a href="#" className="block text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
            Forgot encryption key?
          </a>
        </div>
      </Card>
    </main>
  );
}

export default function Home() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
}