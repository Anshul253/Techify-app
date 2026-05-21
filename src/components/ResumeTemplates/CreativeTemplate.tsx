import React from "react";
import { StructuredResume } from "./types";

interface Props {
  resumeData: StructuredResume;
}

export default function CreativeTemplate({ resumeData }: Props) {
  const { personal, summary, skills, experience, education, projects, certifications } = resumeData;

  return (
    <div className="w-[800px] min-h-[1131px] bg-white text-zinc-900 font-sans p-10 mx-auto relative overflow-hidden box-border">
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-teal-500 to-coral-500" style={{ backgroundImage: 'linear-gradient(to right, #008080, #FF7F50)' }} />

      {/* Header */}
      <div className="mb-6 border-b-2 border-teal-500 pb-4 mt-2">
        <h1 className="text-4xl font-extrabold text-zinc-900 uppercase tracking-tight" style={{ color: '#008080' }}>
          {personal?.name || "Your Name"}
        </h1>
        <p className="text-xl font-medium text-coral-500 mt-1" style={{ color: '#FF7F50' }}>
          {resumeData.targetRole || "Professional Title"}
        </p>

        {/* Contact Info - Icon Row (Simulated with text/symbols for ATS safety) */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-zinc-700 font-medium">
          {personal?.email && <span>Email: {personal.email}</span>}
          {personal?.phone && <span>Phone: {personal.phone}</span>}
          {personal?.location && <span>Location: {personal.location}</span>}
          {personal?.linkedin && <span>LinkedIn: {personal.linkedin}</span>}
          {personal?.github && <span>GitHub: {personal.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-teal-600 mb-2 uppercase tracking-wide border-b border-zinc-200 pb-1" style={{ color: '#008080' }}>Professional Summary</h2>
          <p className="text-sm leading-relaxed text-zinc-800">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-teal-600 mb-3 uppercase tracking-wide border-b border-zinc-200 pb-1" style={{ color: '#008080' }}>Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-3 top-1.5 w-1.5 h-1.5 rounded-full bg-coral-500" style={{ backgroundColor: '#FF7F50' }} />
                <div className="pl-2 border-l-2 border-teal-100">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-zinc-900">{exp.title}</h3>
                    <span className="text-sm font-semibold text-teal-600" style={{ color: '#008080' }}>{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2 text-zinc-700">
                    <span className="font-medium">{exp.company}</span>
                    <span>{exp.location}</span>
                  </div>
                  <ul className="list-disc list-outside ml-4 text-sm text-zinc-800 space-y-1">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} className="pl-1">{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-teal-600 mb-3 uppercase tracking-wide border-b border-zinc-200 pb-1" style={{ color: '#008080' }}>Education</h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-zinc-900">{edu.degree}</h3>
                  <p className="text-sm text-zinc-700">{edu.institution}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-teal-600" style={{ color: '#008080' }}>{edu.year}</span>
                  {edu.gpa && <p className="text-sm text-zinc-600">GPA: {edu.gpa}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-teal-600 mb-3 uppercase tracking-wide border-b border-zinc-200 pb-1" style={{ color: '#008080' }}>Projects</h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="font-bold text-zinc-900">{proj.name}</h3>
                  {proj.url && <span className="text-xs text-coral-500 font-medium" style={{ color: '#FF7F50' }}>{proj.url}</span>}
                </div>
                <p className="text-sm text-zinc-800 mb-1">{proj.description}</p>
                {proj.tech && proj.tech.length > 0 && (
                  <p className="text-xs font-semibold text-teal-700" style={{ color: '#008080' }}>
                    Technologies: <span className="font-normal text-zinc-700">{proj.tech.join(" · ")}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-teal-600 mb-3 uppercase tracking-wide border-b border-zinc-200 pb-1" style={{ color: '#008080' }}>Skills</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {skills.technical && skills.technical.length > 0 && (
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">Technical Skills</h3>
                <p className="text-zinc-800 leading-relaxed">{skills.technical.join(", ")}</p>
              </div>
            )}
            {skills.soft && skills.soft.length > 0 && (
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">Core Competencies</h3>
                <p className="text-zinc-800 leading-relaxed">{skills.soft.join(", ")}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-teal-600 mb-2 uppercase tracking-wide border-b border-zinc-200 pb-1" style={{ color: '#008080' }}>Certifications</h2>
          <p className="text-sm text-zinc-800">{certifications.join(" · ")}</p>
        </div>
      )}
      
    </div>
  );
}
