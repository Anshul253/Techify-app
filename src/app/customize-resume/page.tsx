"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wand2, Layout, Download, Check, X, ChevronRight, Loader2 } from 'lucide-react';

const API_URL = "http://localhost:8000/api/resume";

export default function CustomizeResume() {
  const [sectionText, setSectionText] = useState("");
  const [role, setRole] = useState("Software Engineer");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rewrittenText, setRewrittenText] = useState("");

  const handleRewrite = async () => {
    if (!sectionText) return;
    setLoading(true);
    setRewrittenText("");
    try {
        const res = await axios.post(`${API_URL}/rewrite`, {
            section_text: sectionText,
            role: role
        });
        setRewrittenText(res.data.rewritten_text || "The AI generated an empty response. Try entering different text.");
    } catch (err) {
        console.error("Rewrite API failed:", err);
        setRewrittenText("Error rewriting section. Please make sure the backend is running and the Gemini API key is configured.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black p-6 md:p-10 text-slate-200 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 relative">
        
        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${drawerOpen ? 'md:pr-96' : ''}`}>
             <div className="space-y-6">
                <div>
                   <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Customize Resume</h1>
                   <p className="text-slate-400 mt-2 text-lg">Adjust templates, edit content, and use AI to enhance your profile.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-slate-900 border-slate-800 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2"><Layout size={20} className="text-blue-400"/> Templates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 border border-blue-500/50 bg-blue-500/10 rounded-xl hover:border-blue-400 transition-colors shadow-lg shadow-blue-900/20">
                            <p className="text-blue-400 font-bold">Minimal</p>
                        </button>
                        <button className="p-4 border border-slate-800 bg-slate-950 rounded-xl hover:border-slate-600 transition-colors group">
                            <p className="text-slate-400 font-medium group-hover:text-slate-200">Modern</p>
                        </button>
                        </div>
                    </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2"><Download size={20} className="text-emerald-400"/> Export</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-medium flex-1 shadow-lg shadow-blue-900/20">
                            Download PDF
                        </button>
                        <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all font-medium flex-1 hover:border-slate-500">
                            Download DOCX
                        </button>
                        </div>
                    </CardContent>
                    </Card>
                </div>

                <Card className="bg-slate-900 border-slate-800 shadow-xl flex-1 min-h-[500px]">
                    <CardHeader className="flex flex-row justify-between items-center bg-slate-800/30 border-b border-slate-800 pb-4">
                        <CardTitle className="text-white">Resume Preview</CardTitle>
                        <button 
                            onClick={() => setDrawerOpen(true)}
                            className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all border border-emerald-500/30 hover:shadow-lg shadow-emerald-900/20 hover:scale-[1.02]"
                        >
                            <Wand2 size={18} /> Call AI Assistant
                        </button>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="aspect-[1/1.4] bg-slate-100 rounded-lg p-8 shadow-inner text-slate-900 relative">
                             <div className="border-2 border-dashed border-slate-300 h-full flex flex-col items-center justify-center text-slate-400 bg-white rounded-md">
                                 <Layout className="w-16 h-16 text-slate-300 mb-4" />
                                 <span className="font-medium text-lg">Select a template to view preview</span>
                             </div>
                        </div>
                    </CardContent>
                </Card>
             </div>
        </div>

        {/* AI Rewrite Drawer */}
        <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-slate-900 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 h-full flex flex-col pt-20 md:pt-6">
                <button 
                    onClick={() => setDrawerOpen(false)}
                    className="absolute top-6 left-6 text-slate-400 hover:text-white bg-slate-800 rounded-full p-1.5 border border-slate-700"
                >
                    <ChevronRight size={24} />
                </button>
                
                <h2 className="text-2xl font-bold text-white mb-2 pl-12 flex items-center gap-2">
                    <Wand2 className="text-emerald-400" /> AI Rewriter
                </h2>
                <p className="text-slate-400 text-sm mb-6 pl-12">Select text from your resume and let AI optimize it for ATS systems.</p>

                <div className="space-y-6 flex-1 flex flex-col">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-300 uppercase tracking-widest text-xs">Target Role</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g. Senior Frontend Developer"
                        />
                    </div>

                    <div className="space-y-2 flex-1 flex flex-col min-h-[200px]">
                        <label className="text-sm font-bold text-slate-300 flex justify-between uppercase tracking-widest text-xs">
                            Content to Rewrite
                            <span className="text-slate-500 lowercase font-normal">{sectionText.length} chars</span>
                        </label>
                        <textarea 
                            className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none placeholder:text-slate-600 custom-scrollbar"
                            placeholder="Paste your bullet points, summary, or an entire section here. The AI will make it professional and impactful..."
                            value={sectionText}
                            onChange={(e) => setSectionText(e.target.value)}
                        />
                    </div>

                    <button 
                        onClick={handleRewrite}
                        disabled={loading || !sectionText.trim()}
                        className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 border border-emerald-400/20"
                    >
                        {loading && <Loader2 className="animate-spin" size={18} />}
                        {loading ? 'Enhancing with Gemini...' : 'Enhance with AI'}
                    </button>

                    {rewrittenText && (
                        <div className="space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-500 pb-8">
                            <label className="text-sm font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-widest text-xs mt-6 border-t border-slate-800 pt-6">
                                <Check size={16} /> Optimized Content
                            </label>
                            <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-lg p-4 text-slate-200 min-h-[150px] whitespace-pre-wrap leading-relaxed shadow-inner font-medium text-sm">
                                {rewrittenText}
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-lg py-3 font-semibold transition-colors shadow-lg shadow-blue-900/20">Apply to Resume</button>
                                <button onClick={() => setRewrittenText("")} className="px-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 rounded-lg transition-colors"><X size={20}/></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Mobile overlay for drawer */}
        {drawerOpen && (
             <div 
                 className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
                 onClick={() => setDrawerOpen(false)}
             />
        )}
      </div>
    </div>
  );
}
