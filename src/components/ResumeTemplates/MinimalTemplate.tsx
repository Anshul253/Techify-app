import React from "react";
import { StructuredResume } from "./types";

interface Props {
  resumeData: StructuredResume;
}

// ─── Minimal Modern Template ──────────────────────────────────────────────────
// Ultra-clean single column, generous whitespace. Best for design, startups, general roles.
const MinimalTemplate = ({ resumeData }: Props) => {
  const r = resumeData;
  if (!r) return null;

  return (
    <div
      id="resume-preview"
      className="w-[794px] min-h-[1123px] bg-white font-sans text-gray-800 p-[56px]"
      style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
    >
      {/* Header */}
      <header className="mb-8 border-b-2 border-gray-800 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-1">
          {r.personal?.name || "Your Name"}
        </h1>
        <p className="text-lg text-gray-500 mb-3 font-medium">
          {r.targetRole || "Professional Title"}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {r.personal?.email && <span>{r.personal.email}</span>}
          {r.personal?.phone && <span>· {r.personal.phone}</span>}
          {r.personal?.location && <span>· {r.personal.location}</span>}
          {r.personal?.linkedin && (
            <span>· <span className="text-blue-600">{r.personal.linkedin}</span></span>
          )}
          {r.personal?.github && (
            <span>· <span className="text-blue-600">{r.personal.github}</span></span>
          )}
        </div>
      </header>

      {/* Summary */}
      {r.summary && (
        <section className="mb-7">
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 mb-3">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">{r.summary}</p>
        </section>
      )}

      {/* Skills */}
      {(r.skills?.technical?.length > 0 || r.skills?.soft?.length > 0) && (
        <section className="mb-7">
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 mb-3">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {r.skills.technical?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Technical</p>
                <div className="flex flex-wrap gap-2">
                  {r.skills.technical.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {r.skills.soft?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Soft Skills</p>
                <div className="flex flex-wrap gap-2">
                  {r.skills.soft.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Experience */}
      {r.experience?.length > 0 && (
        <section className="mb-7">
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 mb-4">
            Experience
          </h2>
          <div className="space-y-5">
            {r.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{exp.title}</p>
                    <p className="text-sm text-gray-500">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap ml-4">
                    {exp.startDate} – {exp.endDate}
                  </p>
                </div>
                <ul className="mt-2 space-y-1">
                  {exp.bullets?.map((bullet, j) => (
                    <li key={j} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                      <span className="text-gray-400 mt-1.5 flex-shrink-0">—</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {r.projects?.length > 0 && (
        <section className="mb-7">
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 mb-4">
            Projects
          </h2>
          <div className="space-y-4">
            {r.projects.map((proj, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900 text-sm">{proj.name}</p>
                  {proj.url && (
                    <span className="text-xs text-blue-500">{proj.url}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{proj.description}</p>
                {proj.tech?.length > 0 && (
                  <p className="text-xs text-gray-400">{proj.tech.join(" · ")}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {r.education?.length > 0 && (
        <section className="mb-7">
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 mb-4">
            Education
          </h2>
          <div className="space-y-3">
            {r.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{edu.degree}</p>
                  <p className="text-sm text-gray-500">{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</p>
                </div>
                <p className="text-xs text-gray-400">{edu.year}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {r.certifications?.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 mb-3">
            Certifications
          </h2>
          <ul className="space-y-1">
            {r.certifications.map((cert, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                {cert}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
