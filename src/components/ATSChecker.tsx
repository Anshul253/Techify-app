"use client";
import React, { useState, useRef } from "react";
import {
  Upload, FileText, CheckCircle2, XCircle, Loader2,
  Sparkles, Zap, Target, AlertTriangle, BarChart3, ChevronDown, ChevronUp, RefreshCw
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type ScanMode = "quick" | "jd-match" | "full-scan";

interface ScoreCardProps {
  label: string;
  score: number;
  max: number;
  color: string;
}

const ScoreCard = ({ label, score, max, color }: ScoreCardProps) => {
  const pct = Math.round((score / max) * 100);
  return (
    <div className="bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/40 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">{label}</p>
        <p className="text-sm font-bold" style={{ color }}>{score}<span className="text-slate-400 dark:text-zinc-500 text-xs">/{max}</span></p>
      </div>
      <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

const CircleScore = ({ score, label }: { score: number; label: string }) => {
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const dash = score * 2.83;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-slate-100 dark:text-zinc-800" strokeWidth="8" />
          <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${dash} 283`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1.2s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black" style={{ color }}>{score}</span>
          <span className="text-xs text-slate-500 dark:text-zinc-400">/100</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-800 dark:text-zinc-300 mt-2">{label}</p>
      <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
        {score >= 75 ? "🟢 ATS Ready" : score >= 50 ? "🟡 Needs Work" : "🔴 Major Issues"}
      </p>
    </div>
  );
};

const ATSChecker: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<ScanMode>("quick");
  const [jobDescription, setJobDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [showAllImprovements, setShowAllImprovements] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are supported.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB.");
      return;
    }
    setFile(f);
    setError("");
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".pdf")) { setError("Only PDF files are supported."); return; }
    setFile(f);
    setError("");
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError("Please upload a PDF resume first."); return; }
    if ((mode === "jd-match" || mode === "full-scan") && !jobDescription.trim()) {
      setError("Please paste a job description for this scan mode."); return;
    }

    setUploading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    if (jobDescription.trim()) formData.append("job_description", jobDescription);

    try {
      let endpoint = "/api/ats/";
      if (mode === "jd-match") endpoint = "/api/ats/jd-match";
      if (mode === "full-scan") endpoint = "/api/ats/full-scan";

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setResult({ mode, ...data });
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please check if the backend server is running.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setError("");
    setJobDescription("");
    setShowAllImprovements(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Extract display values from different result formats ─────────────────
  const getScore = () => {
    if (!result) return 0;
    if (result.mode === "full-scan") return result.final_ats_score ?? 0;
    if (result.mode === "jd-match") return result.overall_match_score ?? 0;
    return result.resume?.resume_score ?? 0;
  };

  const getScoreLabel = () => {
    if (result?.mode === "full-scan") return "Final ATS Score";
    if (result?.mode === "jd-match") return "JD Match Score";
    return "ATS Score";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e1a] text-slate-900 dark:text-white transition-colors">
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered · Multi-Dimensional Analysis
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:via-indigo-200 dark:to-purple-300 dark:bg-clip-text mb-3">
            ATS Resume Scanner
          </h1>
          <p className="text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
            Upload your resume and get a deep analysis across 7 dimensions — keyword density, section completeness, bullet quality, readability, and more.
          </p>
        </div>

        {!result ? (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Scan Mode Selector */}
            <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm transition-colors">
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-300 mb-4">Choose Scan Mode</p>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: "quick", icon: <Zap className="w-4 h-4" />, label: "Quick Scan", desc: "Upload only · Fast score" },
                  { id: "jd-match", icon: <Target className="w-4 h-4" />, label: "JD Match", desc: "Upload + Job description" },
                  { id: "full-scan", icon: <BarChart3 className="w-4 h-4" />, label: "Deep Analysis", desc: "AI-powered full report" },
                ] as const).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      mode === m.id
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                        : "border-slate-200 dark:border-zinc-700/50 hover:border-slate-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <div className={`mb-1 ${mode === m.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-zinc-500"}`}>{m.icon}</div>
                    <p className={`text-sm font-semibold ${mode === m.id ? "text-indigo-900 dark:text-white" : "text-slate-700 dark:text-white"}`}>{m.label}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                  file
                    ? "border-green-500/50 bg-green-50 dark:bg-green-500/5"
                    : "border-slate-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 bg-white/50 dark:bg-zinc-900/40"
                }`}
              >
                <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                {file ? (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 flex items-center justify-center mb-3">
                      <FileText className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB · PDF</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">✓ Ready to analyze</p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center mb-3">
                      <Upload className="w-7 h-7 text-slate-400 dark:text-zinc-500" />
                    </div>
                    <p className="font-semibold text-slate-700 dark:text-zinc-300">Drop your resume PDF here</p>
                    <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1">or click to browse · Max 10MB</p>
                  </>
                )}
              </div>

              {/* Job Description */}
              {(mode === "jd-match" || mode === "full-scan") && (
                <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm transition-colors">
                  <label className="block text-sm font-semibold text-slate-800 dark:text-zinc-300 mb-2">
                    Job Description <span className="text-indigo-500 dark:text-indigo-400">*</span>
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here for accurate keyword matching and tailored recommendations..."
                    className="w-full h-36 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner"
                  />
                  <p className="text-xs text-slate-400 dark:text-zinc-600 mt-2">{jobDescription.length} characters</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {uploading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing your resume...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Analyze Resume</>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* ─── Results Dashboard ─── */
          <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analysis Results</h2>
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm text-slate-700 dark:text-zinc-300 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> New Analysis
              </button>
            </div>

            {/* Score + Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-1 bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm">
                <CircleScore score={getScore()} label={getScoreLabel()} />
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-3">
                {(result.mode === "quick" && result.resume) || (result.mode === "full-scan" && result.rule_based) ? (() => {
                  const data = result.mode === "quick" ? result.resume : result.rule_based;
                  return (
                    <>
                      <ScoreCard label="Keyword Match" score={data.keyword_score} max={25} color="#8b5cf6" />
                      <ScoreCard label="Formatting & Parseability" score={data.formatting_score} max={20} color="#6366f1" />
                      <ScoreCard label="Work Experience Quality" score={data.work_experience_score} max={20} color="#22c55e" />
                      <ScoreCard label="Contact Info" score={data.contact_score} max={10} color="#f59e0b" />
                      <ScoreCard label="Education" score={data.education_score} max={10} color="#3b82f6" />
                      <ScoreCard label="Skills Section" score={data.skills_score} max={10} color="#ec4899" />
                      <ScoreCard label="Section Completeness" score={data.section_score} max={5} color="#14b8a6" />
                    </>
                  );
                })() : null}
                {result.mode === "jd-match" && result.section_scores && (
                  <>
                    <ScoreCard label="Skills Match" score={result.section_scores.skills} max={100} color="#6366f1" />
                    <ScoreCard label="Experience Match" score={result.section_scores.experience} max={100} color="#8b5cf6" />
                    <ScoreCard label="Education Match" score={result.section_scores.education} max={100} color="#22c55e" />
                    <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl p-4 flex items-center justify-center">
                      <p className="text-sm text-zinc-400 text-center">Powered by Gemini AI</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Keywords Section */}
            {(result.matched_keywords?.length > 0 || result.missing_keywords?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {result.matched_keywords?.length > 0 && (
                  <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                      <p className="font-semibold text-sm text-slate-800 dark:text-white">Keywords Found ({result.matched_keywords.length})</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.matched_keywords.map((kw: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.missing_keywords?.length > 0 && (
                  <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                      <p className="font-semibold text-sm text-slate-800 dark:text-white">Missing Keywords ({result.missing_keywords.length})</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_keywords.map((kw: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs rounded-full font-medium">
                          ✗ {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Analysis (full-scan only) */}
            {result.mode === "full-scan" && result.ai_analysis && (
              <div className="space-y-5">
                {/* Optimized Summary */}
                {result.ai_analysis.professional_summary_rewrite && (
                  <div className="bg-indigo-50/50 dark:bg-gradient-to-r dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-100 dark:border-indigo-500/30 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                      <p className="font-semibold text-indigo-800 dark:text-indigo-300">AI-Optimized Professional Summary</p>
                      <span className="text-xs text-indigo-600 dark:text-indigo-500 bg-indigo-100 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full">Copy & Use</span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed italic">
                      "{result.ai_analysis.professional_summary_rewrite}"
                    </p>
                  </div>
                )}

                {/* Strengths */}
                {result.ai_analysis.top_strengths?.length > 0 && (
                  <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                      <p className="font-semibold text-sm text-slate-800 dark:text-white">Top Strengths</p>
                    </div>
                    <ul className="space-y-2">
                      {result.ai_analysis.top_strengths.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-zinc-300">
                          <span className="text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0">✓</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {result.ai_analysis.top_improvements?.length > 0 && (
                  <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      <p className="font-semibold text-sm text-slate-800 dark:text-white">Improvements Ranked by Impact</p>
                    </div>
                    <div className="space-y-3">
                      {(showAllImprovements ? result.ai_analysis.top_improvements : result.ai_analysis.top_improvements.slice(0, 3))
                        .map((item: any, i: number) => (
                          <div key={i} className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-200 dark:border-zinc-700/30">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-sm font-medium text-slate-800 dark:text-white">{i + 1}. {item.issue}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                                item.impact === "high" ? "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400" :
                                item.impact === "medium" ? "bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" :
                                "bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
                              }`}>
                                {item.impact?.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">→ {item.fix}</p>
                          </div>
                        ))}
                    </div>
                    {result.ai_analysis.top_improvements.length > 3 && (
                      <button
                        onClick={() => setShowAllImprovements(!showAllImprovements)}
                        className="mt-3 flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                      >
                        {showAllImprovements ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {showAllImprovements ? "Show less" : `Show ${result.ai_analysis.top_improvements.length - 3} more`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Recommendations (JD match) */}
            {result.mode === "jd-match" && result.recommendations?.length > 0 && (
              <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <p className="font-semibold text-sm text-slate-800 dark:text-white">AI Recommendations</p>
                </div>
                <ul className="space-y-2">
                  {result.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-zinc-300">
                      <span className="text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0">{i + 1}.</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Grammar (quick scan) */}
            {result.grammar && (
              <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <p className="font-semibold text-sm text-slate-800 dark:text-white">Grammar & Language</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 dark:text-zinc-500">{result.grammar.error_count} errors found</span>
                    <span className="font-bold text-blue-500 dark:text-blue-400">{result.grammar.mistake_score}/100</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSChecker;