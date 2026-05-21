"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, RotateCcw, Download, ChevronRight, Bot, User, Loader2, FileText, Palette } from "lucide-react";
import { StructuredResume, emptyResume } from "./ResumeTemplates/types";
import { TEMPLATE_MAP } from "./ResumeTemplates/TemplateSelection";
import TemplateSelection from "./ResumeTemplates/TemplateSelection";
import PDFButton from "./PDFButton";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
};

type TabType = "chat" | "resume" | "template";

interface ResumeBuilderProps {
  onBack: () => void;
  initialData?: any;
}

// ─── Typing indicator component ───────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3 bg-slate-100 dark:bg-zinc-800/60 rounded-2xl rounded-tl-none w-fit border border-slate-200 dark:border-zinc-700/30">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
        style={{ animationDelay: `${i * 150}ms` }}
      />
    ))}
  </div>
);

// ─── ATS Score Badge ──────────────────────────────────────────────────────────
const ATSBadge = ({ score }: { score: number }) => {
  const color = score >= 75 ? "text-green-400 border-green-500/40 bg-green-500/10"
              : score >= 50 ? "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"
              : "text-red-400 border-red-500/40 bg-red-500/10";
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${color}`}>
      <Sparkles className="w-3 h-3" />
      ATS Score: {score}/100
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ResumeBuilder({ onBack, initialData }: ResumeBuilderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [resumeData, setResumeData] = useState<StructuredResume | null>(initialData || null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);
  const [isResumeReady, setIsResumeReady] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ─── Scroll to bottom ──────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Initialization ────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialData) {
      setResumeData(initialData);
      setIsResumeReady(true);
      setActiveTab("resume");
    } else {
      const welcomeMsg: Message = {
        id: "welcome",
        role: "assistant",
        content: `👋 Hi! I'm **TechifyAI**, your AI resume builder.\n\nDescribe yourself in **one or two sentences** — I'll extract everything and build your full ATS-optimized resume instantly. The more detail you give, the better the result!\n\n✨ *Try: "I'm a full-stack developer with 4 years at Amazon building React and Node.js apps. I hold a B.Tech in CS from IIT Bombay and want to apply for senior SDE roles."*`,
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  // ─── Send message to NLP API ───────────────────────────────────────────────
  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
    };

    const typingMsg: Message = {
      id: "typing",
      role: "assistant",
      content: "",
      isTyping: true,
    };

    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setInput("");
    setIsLoading(true);

    const newHistory = [...conversationHistory, { role: "user", content: userText }];
    setConversationHistory(newHistory);

    try {
      const res = await fetch(`${API_BASE}/api/resume/nlp-build`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_history: newHistory.slice(-12),
          user_prompt: userText,
          target_role: resumeData?.targetRole || null,
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();

      // Build assistant reply message
      const assistantReply: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "Got it! I'm working on your resume.",
      };

      setMessages((prev) => prev.filter((m) => m.id !== "typing").concat(assistantReply));
      setConversationHistory((h) => [...h, { role: "assistant", content: assistantReply.content }]);

      // Update resume data if we have extracted data
      if (data.extracted_data) {
        const extracted = data.extracted_data;
        const newResume: StructuredResume = {
          personal: {
            name: extracted.personal?.name || resumeData?.personal?.name || "",
            email: extracted.personal?.email || resumeData?.personal?.email || "",
            phone: extracted.personal?.phone || resumeData?.personal?.phone || "",
            location: extracted.personal?.location || resumeData?.personal?.location || "",
            linkedin: extracted.personal?.linkedin || resumeData?.personal?.linkedin || "",
            github: extracted.personal?.github || resumeData?.personal?.github || "",
          },
          targetRole: extracted.target_role || resumeData?.targetRole || "",
          summary: extracted.summary || resumeData?.summary || "",
          skills: {
            technical: extracted.skills?.technical?.length > 0 ? extracted.skills.technical : (resumeData?.skills?.technical || []),
            soft: extracted.skills?.soft?.length > 0 ? extracted.skills.soft : (resumeData?.skills?.soft || []),
          },
          experience: extracted.experience?.length > 0 ? extracted.experience : (resumeData?.experience || []),
          education: extracted.education?.length > 0 ? extracted.education : (resumeData?.education || []),
          certifications: extracted.certifications?.length > 0 ? extracted.certifications : (resumeData?.certifications || []),
          projects: extracted.projects?.length > 0 ? extracted.projects : (resumeData?.projects || []),
          atsScore: data.ats_score ?? resumeData?.atsScore,
        };
        setResumeData(newResume);
        if (data.ats_score) setAtsScore(data.ats_score);

        // Trigger resume generation only when the backend decides it has gathered all info
        if (data.intent === "ready_to_generate") {
          setIsResumeReady(true);
          setTimeout(() => setActiveTab("resume"), 800);
        }
      }

    } catch (err) {
      console.error("NLP Build error:", err);
      setMessages((prev) =>
        prev.filter((m) => m.id !== "typing").concat({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I had trouble connecting to the server. Please make sure the backend is running and try again.",
        })
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, conversationHistory, resumeData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setConversationHistory([]);
    setResumeData(null);
    setAtsScore(null);
    setIsResumeReady(false);
    setActiveTab("chat");
    setTimeout(() => {
      setMessages([{
        id: "welcome2",
        role: "assistant",
        content: "👋 Fresh start! Tell me about your professional background and the role you're targeting.",
      }]);
    }, 100);
  };

  // Format message content (basic markdown-ish)
  const formatContent = (content: string) => {
    return content
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} className="font-bold">{line.slice(2, -2)}</p>;
        }
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className={line === "" ? "h-2" : ""}>
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j}>{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      });
  };

  const TemplateComponent = TEMPLATE_MAP[selectedTemplate] || TEMPLATE_MAP["minimal"];

  // ─── Tabs ──────────────────────────────────────────────────────────────────
  const tabs: { id: TabType; label: string; icon: React.ReactNode; disabled?: boolean }[] = [
    { id: "chat", label: "Chat", icon: <Bot className="w-4 h-4" /> },
    { id: "resume", label: "Resume", icon: <FileText className="w-4 h-4" />, disabled: !isResumeReady },
    { id: "template", label: "Templates", icon: <Palette className="w-4 h-4" />, disabled: !isResumeReady },
  ];

  return (
    <div className="flex h-full w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-black text-slate-900 dark:text-white transition-colors">

      {/* ── Left Panel: Chat ─────────────────────────────────────────────── */}
      <div className="flex flex-col w-full lg:w-[480px] xl:w-[520px] flex-shrink-0 border-r border-slate-200 dark:border-zinc-800/60">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-zinc-800/60 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800 dark:text-white">TechifyAI Resume Builder</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Powered by Gemini · NLP Intent Engine</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* ATS Score Banner */}
        {atsScore !== null && (
          <div className="px-5 py-2 border-b border-slate-200 dark:border-zinc-800/40 bg-slate-50 dark:bg-zinc-900/40 flex items-center justify-between">
            <ATSBadge score={atsScore} />
            <p className="text-xs text-slate-500 dark:text-zinc-500">
              {atsScore >= 75 ? "Excellent! Your resume is ATS-ready" : atsScore >= 50 ? "Good — keep adding more details" : "Needs more information for ATS"}
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                  : "bg-zinc-700"
              }`}>
                {msg.role === "assistant"
                  ? <Bot className="w-4 h-4 text-white" />
                  : <User className="w-4 h-4 text-zinc-300" />
                }
              </div>

              {/* Bubble */}
              {msg.isTyping ? (
                <TypingIndicator />
              ) : (
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed space-y-1 shadow-sm ${
                  msg.role === "assistant"
                    ? "bg-white dark:bg-zinc-800/60 text-slate-800 dark:text-zinc-100 rounded-tl-none border border-slate-200 dark:border-zinc-700/30"
                    : "bg-indigo-600 text-white rounded-tr-none"
                }`}>
                  {formatContent(msg.content)}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-4">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell me about your background, skills, or experience..."
              className="w-full pl-4 pr-14 py-3.5 bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700/50 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-sm"
              rows={2}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 bottom-3 w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center disabled:opacity-40 hover:scale-105 transition-all"
            >
              {isLoading
                ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                : <Send className="w-4 h-4 text-white" />
              }
            </button>
          </form>
          <p className="text-center text-xs text-zinc-600 mt-2">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>

      {/* ── Right Panel: Preview ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-4 py-3 border-b border-slate-200 dark:border-zinc-800/60 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : tab.disabled
                  ? "text-slate-400 dark:text-zinc-600 cursor-not-allowed"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.disabled && <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 dark:bg-zinc-800 rounded text-slate-500 dark:text-zinc-500">Soon</span>}
            </button>
          ))}
          {isResumeReady && resumeData && (
            <div className="ml-auto">
              <PDFButton resumeData={resumeData} />
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === "chat" && (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="text-center max-w-lg">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Start with a quick prompt</h2>
                <p className="text-slate-500 dark:text-zinc-400 leading-relaxed mb-6 text-sm">
                  Click a starter below or type your own description in the chat
                </p>
                <div className="flex flex-col gap-2 text-left">
                  {[
                    "I'm a software engineer with 3 years at Infosys building Java Spring Boot microservices. B.Tech in CS from VIT Vellore. Looking for backend developer roles.",
                    "I'm a data analyst with 2 years experience in Python, SQL, and Tableau at a fintech startup. I have a Masters in Statistics and want a senior data analyst role.",
                    "Recent MBA graduate with internships in marketing at FMCG companies. Skilled in Excel, PowerPoint, market research. Looking for product manager roles.",
                    "I'm a React and Node.js developer with 4 years freelance experience building e-commerce apps. Looking for full-stack developer positions.",
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt)}
                      disabled={isLoading}
                      className="text-left px-4 py-3 bg-white hover:bg-slate-50 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700/50 hover:border-indigo-400 dark:hover:border-indigo-500/40 rounded-xl text-sm text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-white transition-all disabled:opacity-40 shadow-sm"
                    >
                      <ChevronRight className="w-3.5 h-3.5 inline mr-1.5 text-indigo-500 dark:text-indigo-400" />
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "resume" && resumeData && (
            <div className="p-6 flex justify-center">
              <div className="w-full max-w-[850px] shadow-2xl shadow-black/50 rounded-lg overflow-hidden">
                <TemplateComponent resumeData={resumeData} />
              </div>
            </div>
          )}

          {activeTab === "resume" && !resumeData && (
            <div className="h-full flex items-center justify-center text-zinc-500">
              <p>Chat with TechifyAI to generate your resume →</p>
            </div>
          )}

          {activeTab === "template" && (
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Choose Your Template</h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mb-5">Select a template — your resume updates instantly</p>
              <TemplateSelection
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
                resumeData={resumeData || undefined}
              />
              {resumeData && (
                <div className="mt-8">
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mb-3 uppercase tracking-wider font-medium">Live Preview</p>
                  <div className="shadow-xl shadow-slate-300/50 dark:shadow-black/40 rounded-lg overflow-auto max-h-[600px] border border-slate-200 dark:border-zinc-800">
                    <TemplateComponent resumeData={resumeData} />
                  </div>
                </div>
              )}
            </div>
          )}


        </div>
      </div>
    </div>
  );
}