"use client";
import { useState } from "react";
import { TEMPLATE_MAP } from "@/components/ResumeTemplates/TemplateSelection";
import TemplateSelection from "@/components/ResumeTemplates/TemplateSelection";
import PDFButton from "@/components/PDFButton";
import { emptyResume, StructuredResume } from "@/components/ResumeTemplates/types";

const sampleResume: StructuredResume = {
  personal: {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
  },
  targetRole: "Senior Software Engineer",
  summary: "Results-driven software engineer with 5+ years of experience building scalable web applications. Proven track record of leading cross-functional teams and delivering high-impact products used by millions of users.",
  skills: {
    technical: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "Kubernetes"],
    soft: ["Team Leadership", "Problem Solving", "Communication", "Agile"],
  },
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Google",
      location: "Mountain View, CA",
      startDate: "Jan 2022",
      endDate: "Present",
      bullets: [
        "Led development of a real-time data pipeline processing 10M+ events/day, reducing latency by 40%",
        "Architected and shipped a microservices migration for the Search Ads platform, improving deployment frequency by 3x",
        "Mentored a team of 4 junior engineers, resulting in 25% faster delivery cycle",
      ],
    },
    {
      title: "Software Engineer",
      company: "Meta",
      location: "Menlo Park, CA",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      bullets: [
        "Built React components for the News Feed ranking interface serving 2B+ daily active users",
        "Optimized SQL queries and introduced caching, reducing page load time by 35%",
      ],
    },
  ],
  education: [
    {
      degree: "M.S. Computer Science",
      institution: "Stanford University",
      year: "2019",
      gpa: "3.9",
    },
    {
      degree: "B.Tech Computer Science",
      institution: "IIT Bombay",
      year: "2017",
    },
  ],
  certifications: ["AWS Certified Solutions Architect", "Google Cloud Professional Data Engineer"],
  projects: [
    {
      name: "AI Resume Builder",
      description: "NLP-powered resume builder using Gemini AI with real-time ATS scoring",
      tech: ["Next.js", "FastAPI", "Gemini API", "TypeScript"],
      url: "github.com/alexjohnson/ai-resume",
    },
    {
      name: "Distributed Task Queue",
      description: "High-throughput async task processing system built with Redis and Celery",
      tech: ["Python", "Redis", "Celery", "Docker"],
    },
  ],
  atsScore: 91,
};

export default function TemplateResumePage() {
  const [selected, setSelected] = useState("minimal");
  const TemplateComponent = TEMPLATE_MAP[selected] || TEMPLATE_MAP["minimal"];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white p-8 transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Resume Templates</h1>
          <p className="text-slate-600 dark:text-zinc-400">Preview and download any of our 4 premium ATS-optimized templates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TemplateSelection
              selectedTemplate={selected}
              onTemplateChange={setSelected}
              resumeData={sampleResume}
            />
            <div className="mt-4">
              <PDFButton resumeData={sampleResume} />
            </div>
          </div>

          <div className="lg:col-span-2 overflow-auto rounded-xl border border-slate-300 dark:border-zinc-800 shadow-xl shadow-slate-300/50 dark:shadow-2xl dark:shadow-black/50 max-h-[800px] bg-white dark:bg-zinc-900">
            <TemplateComponent resumeData={sampleResume} />
          </div>
        </div>
      </div>
    </div>
  );
}
