import React from "react";
import { StructuredResume } from "./types";

interface Props { resumeData: StructuredResume; }

const ExecutiveTemplate = ({ resumeData }: Props) => {
  const r = resumeData;
  if (!r) return null;
  const sidebarBg = "#1a1a2e";
  const gold = "#c9a84c";

  return (
    <div id="resume-preview" className="w-[794px] min-h-[1123px] bg-white font-sans flex" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {/* Dark Sidebar */}
      <aside className="w-[240px] flex-shrink-0 min-h-full text-white px-6 py-8" style={{ backgroundColor: sidebarBg }}>
        <div className="mb-8 pb-6 border-b border-white/10">
          <h1 className="text-2xl font-bold leading-tight mb-2" style={{ color: gold }}>{r.personal?.name || "Your Name"}</h1>
          <p className="text-sm text-gray-400 font-light">{r.targetRole || "Professional Title"}</p>
        </div>
        <div className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: gold }}>Contact</h2>
          <div className="space-y-2 text-xs text-gray-300">
            {r.personal?.email && <p className="break-all">{r.personal.email}</p>}
            {r.personal?.phone && <p>{r.personal.phone}</p>}
            {r.personal?.location && <p>{r.personal.location}</p>}
            {r.personal?.linkedin && <p className="break-all">{r.personal.linkedin}</p>}
            {r.personal?.github && <p className="break-all">{r.personal.github}</p>}
          </div>
        </div>
        {r.skills?.technical?.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: gold }}>Technical Skills</h2>
            <ul className="space-y-1.5">
              {r.skills.technical.map((s, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: gold }} />{s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {r.skills?.soft?.length > 0 && (
          <div className="mb-7">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: gold }}>Soft Skills</h2>
            <ul className="space-y-1.5">
              {r.skills.soft.map((s, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: gold }} />{s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {r.education?.length > 0 && (
          <div className="mb-7">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: gold }}>Education</h2>
            <div className="space-y-4">
              {r.education.map((edu, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-white">{edu.degree}</p>
                  <p className="text-xs text-gray-400">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.year}{edu.gpa ? ` | GPA ${edu.gpa}` : ""}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {r.certifications?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: gold }}>Certifications</h2>
            <ul className="space-y-2">
              {r.certifications.map((cert, i) => <li key={i} className="text-xs text-gray-300 leading-relaxed">{cert}</li>)}
            </ul>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-8">
        {r.summary && (
          <section className="mb-7">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: sidebarBg, borderBottom: `2px solid ${gold}` }}>Executive Profile</h2>
            <p className="text-sm leading-relaxed text-gray-700">{r.summary}</p>
          </section>
        )}
        {r.experience?.length > 0 && (
          <section className="mb-7">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 pb-1" style={{ color: sidebarBg, borderBottom: `2px solid ${gold}` }}>Career History</h2>
            <div className="space-y-6">
              {r.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="font-bold text-gray-900 text-sm">{exp.title}</p>
                    <p className="text-xs text-gray-400 ml-4 whitespace-nowrap">{exp.startDate} – {exp.endDate}</p>
                  </div>
                  <p className="text-sm font-semibold mb-2" style={{ color: gold }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  <ul className="space-y-1.5">
                    {exp.bullets?.map((b, j) => (
                      <li key={j} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                        <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gold }} /><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
        {r.projects?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 pb-1" style={{ color: sidebarBg, borderBottom: `2px solid ${gold}` }}>Notable Projects</h2>
            <div className="space-y-4">
              {r.projects.map((proj, i) => (
                <div key={i}>
                  <p className="font-bold text-sm text-gray-900">{proj.name}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{proj.description}</p>
                  {proj.tech?.length > 0 && <p className="text-xs mt-1 font-medium text-gray-500">Stack: {proj.tech.join(", ")}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ExecutiveTemplate;
