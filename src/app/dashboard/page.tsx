"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { FileText, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface ResumeHistory {
  id: number;
  title: string;
  ats_score: number | null;
  created_at: string;
}

function DashboardContent() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ResumeHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/resume/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchHistory();
    }
  }, [user]);

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-colors duration-300 text-slate-900 dark:text-slate-200">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">Welcome back, {user?.email}. Here is your history of resumes and ATS scans.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-neon-cyan border-t-transparent animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-slate-100 dark:bg-obsidian-800 rounded-2xl border border-slate-200 dark:border-obsidian-700">
          <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-xl font-medium">No history yet</h3>
          <p className="text-slate-500 mt-2">Generate a resume or scan one to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item.id} 
              className="bg-white dark:bg-obsidian-800/80 backdrop-blur-md border border-slate-200 dark:border-obsidian-700 rounded-2xl p-6 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-md hover:dark:shadow-[0_4px_25px_rgba(0,240,255,0.15)] hover:dark:border-neon-cyan/30 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-neon-cyan/10 p-3 rounded-lg text-neon-cyan">
                  {item.title.includes('ATS') ? <CheckCircle size={24} /> : <FileText size={24} />}
                </div>
                {item.ats_score !== null && (
                  <span className="px-3 py-1 bg-neon-purple/10 text-neon-purple rounded-full text-sm font-bold">
                    Score: {item.ats_score}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2 line-clamp-1">{item.title}</h3>
              <div className="flex items-center text-sm text-slate-500">
                <Clock size={14} className="mr-2" />
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
