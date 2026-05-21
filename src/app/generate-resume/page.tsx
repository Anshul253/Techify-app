"use client";

import { useState } from "react";
import ResumeBuilder from "../../components/resumebuilder";
import { Sparkles, FileJson, ArrowRight, Zap, Target, Download } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

function GenerateResumeContent() {
  const [resumeData, setResumeData] = useState<any>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);

        // Map LinkedIn JSON export to StructuredResume format
        const mappedData = {
          personal: {
            name: `${json.firstName || ""} ${json.lastName || ""}`.trim(),
            email: json.emailAddress || "",
            phone: json.phoneNumbers?.[0]?.number || "",
            location: json.address || json.geoPosition || "",
            linkedin: "linkedin.com/in/profile",
            github: "",
          },
          targetRole: "",
          summary: "",
          skills: {
            technical: (json.skills || []).map((s: any) => s.name).slice(0, 10),
            soft: [],
          },
          experience: (json.positions || []).map((pos: any) => ({
            title: pos.title || "",
            company: pos.companyName || "",
            location: "",
            startDate: pos.startDate ? `${pos.startDate.month}/${pos.startDate.year}` : "",
            endDate: pos.endDate ? `${pos.endDate.month}/${pos.endDate.year}` : "Present",
            bullets: pos.description ? [pos.description] : [],
          })),
          education: (json.educations || []).map((edu: any) => ({
            degree: edu.degreeName || "",
            institution: edu.schoolName || "",
            year: edu.endDate?.year?.toString() || "",
            gpa: edu.grade || "",
          })),
          certifications: (json.certifications || []).map((c: any) => c.name),
          projects: [],
        };

        setResumeData(mappedData);
        setShowBuilder(true);
      } catch (err) {
        console.error("Failed to parse LinkedIn JSON", err);
        alert("Invalid JSON format. Please upload a valid LinkedIn data export.");
      }
    };
    reader.readAsText(file);
  };

  if (showBuilder) {
    return (
      <div className="h-[calc(100vh-5rem)] mt-20 flex animate-in fade-in duration-500">
        <ResumeBuilder onBack={() => setShowBuilder(false)} initialData={resumeData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-obsidian-900 text-slate-900 dark:text-white flex items-center justify-center p-6 transition-colors">
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 dark:bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> NLP-Powered · Gemini AI
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:via-indigo-200 dark:to-purple-300 dark:bg-clip-text mb-3">
            Resume Builder
          </h1>
          <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
            Just describe your background in plain English — TechifyAI understands your intent and builds an ATS-optimized resume instantly.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { icon: <Zap className="w-3.5 h-3.5" />, text: "Intent detection" },
            { icon: <Target className="w-3.5 h-3.5" />, text: "Real-time ATS scoring" },
            { icon: <Download className="w-3.5 h-3.5" />, text: "4 premium templates" },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-full text-xs text-slate-600 dark:text-zinc-400 shadow-sm">
              <span className="text-indigo-500 dark:text-indigo-400">{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/50 space-y-4 transition-colors">

          {/* Build from scratch */}
          <button
            onClick={() => setShowBuilder(true)}
            className="w-full group flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-500 dark:hover:to-purple-500 rounded-xl font-bold text-white transition-all shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 dark:bg-white/15 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">Start with TechifyAI</p>
                <p className="text-xs text-indigo-100 dark:text-indigo-200 font-normal">Just tell me about yourself</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-800" />
            <span className="text-xs text-slate-500 dark:text-zinc-600 font-medium uppercase tracking-wider">or import</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-800" />
          </div>

          {/* LinkedIn import */}
          <label className="w-full group flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-slate-200 hover:border-slate-300 dark:border-zinc-700/50 dark:hover:border-zinc-600 rounded-xl cursor-pointer transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg flex items-center justify-center">
                <FileJson className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-zinc-200">Import LinkedIn JSON</p>
                <p className="text-xs text-slate-500 dark:text-zinc-500">Upload your LinkedIn data export</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:text-zinc-600 dark:group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <p className="text-center text-xs text-slate-500 dark:text-zinc-600">
            LinkedIn JSON: Settings → Data Privacy → Get a copy of your data
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <GenerateResumeContent />
    </ProtectedRoute>
  );
}
