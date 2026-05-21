import React from "react";
import { StructuredResume } from "./types";

interface Props { resumeData: StructuredResume; }

// Tech Sidebar Template — Color-block left sidebar for Engineering/DevOps/Data Science
const ModernTemplate = ({ resumeData }: Props) => {
  const r = resumeData;
  if (!r) return null;
  const accent = "#6366f1"; // Indigo

  return (
    <div id="resume-preview" className="w-[794px] min-h-[1123px] bg-white font-sans flex" style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}>
      {/* Color Sidebar */}
      <aside className="w-[220px] flex-shrink-0 min-h-full px-6 py-8" style={{ backgroundColor: "#f0f1ff", borderRight: `3px solid ${accent}` }}>
        <div className="mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 text-2xl font-bold text-white" style={{ backgroundColor: accent }}>
            {r.personal?.name?.charAt(0) || "?"}
          </div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{r.personal?.name || "Your Name"}</h1>
          <p className="text-sm font-medium mt-1" style={{ color: accent }}>{r.targetRole || "Role"}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Contact</h2>
          <div className="space-y-1.5 text-xs text-gray-600">
            {r.personal?.email && <p className="break-all">{r.personal.email}</p>}
            {r.personal?.phone && <p>{r.personal.phone}</p>}
            {r.personal?.location && <p>{r.personal.location}</p>}
            {r.personal?.linkedin && <p className="break-all" style={{ color: accent }}>{r.personal.linkedin}</p>}
            {r.personal?.github && <p className="break-all" style={{ color: accent }}>{r.personal.github}</p>}
          </div>
        </div>

        {r.skills?.technical?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>Tech Stack</h2>
            <div className="space-y-2">
              {r.skills.technical.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700 font-medium">{skill}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: accent, width: `${Math.min(95, 70 + (i % 4) * 8)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {r.skills?.soft?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Soft Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {r.skills.soft.map((s, i) => (
                <span key={i} className="px-2 py-0.5 text-xs rounded-full font-medium text-white" style={{ backgroundColor: accent }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {r.certifications?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Certifications</h2>
            <ul className="space-y-1.5">
              {r.certifications.map((c, i) => <li key={i} className="text-xs text-gray-600 leading-relaxed">{c}</li>)}
            </ul>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-8">
        {r.summary && (
          <section className="mb-6 pb-6 border-b border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>About</h2>
            <p className="text-sm leading-relaxed text-gray-700">{r.summary}</p>
          </section>
        )}

        {r.experience?.length > 0 && (
          <section className="mb-6 pb-6 border-b border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>Experience</h2>
            <div className="space-y-5">
              {r.experience.map((exp, i) => (
                <div key={i} className="relative pl-4" style={{ borderLeft: `2px solid ${accent}` }}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-gray-900 text-sm">{exp.title}</p>
                    <p className="text-xs text-gray-400 whitespace-nowrap ml-4">{exp.startDate} – {exp.endDate}</p>
                  </div>
                  <p className="text-xs font-semibold mb-2" style={{ color: accent }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  <ul className="space-y-1">
                    {exp.bullets?.map((b, j) => (
                      <li key={j} className="text-sm text-gray-600 leading-relaxed flex items-start gap-1.5">
                        <span className="text-xs mt-1 flex-shrink-0" style={{ color: accent }}>▸</span><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {r.projects?.length > 0 && (
          <section className="mb-6 pb-6 border-b border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>Projects</h2>
            <div className="space-y-4">
              {r.projects.map((proj, i) => (
                <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: "#f8f9ff", border: `1px solid ${accent}20` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm text-gray-900">{proj.name}</p>
                    {proj.url && <span className="text-xs" style={{ color: accent }}>{proj.url}</span>}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{proj.description}</p>
                  {proj.tech?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {proj.tech.map((t, j) => <span key={j} className="px-1.5 py-0.5 bg-white text-xs rounded border font-mono" style={{ color: accent, borderColor: `${accent}40` }}>{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {r.education?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>Education</h2>
            <div className="space-y-3">
              {r.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{edu.degree}</p>
                    <p className="text-sm text-gray-500">{edu.institution}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</p>
                  </div>
                  <p className="text-xs text-gray-400">{edu.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ModernTemplate;