import React from 'react';
import { Briefcase, GraduationCap, Award, Code, UserCircle2, Mail, Phone, FolderGit2 } from 'lucide-react';
import GeneratePDF from './ResumeTemplates/GeneratePDF';

interface ResumePreviewProps {
  resumeData: Record<number, string>
  questions: string[]
}

export default function ResumePreview({ resumeData, questions }: ResumePreviewProps) {
  // Extract data for the resume
  const name = resumeData[0] || "Your Name"
  const contact = resumeData[1] || "your.email@example.com | (123) 456-7890"
  const title = resumeData[2] || "Professional Title"
  const education = resumeData[3] || "Education details"
  const technicalSkills = resumeData[4] || "Technical skills"
  const softSkills = resumeData[5] || "Soft skills"
  const recentExperience = resumeData[6] || "Recent work experience"
  const otherExperience = resumeData[7] || "Other work experience"
  const certifications = resumeData[8] || "Certifications and awards"
  const summary = resumeData[9] || "Professional summary"
  const projects = resumeData[10] || "Notable projects"

  // Split contact information
  const [email, phone] = contact.split('|').map(item => item.trim());

  return (
    <div className="relative">
      <div id="resume-preview" className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-900 text-white px-8 py-12">
          <h1 className="text-4xl font-bold mb-2">{name}</h1>
          <h2 className="text-xl text-slate-300 font-medium mb-4">{title}</h2>
          <div className="flex items-center gap-6 text-slate-300">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>{phone}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Summary Section */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <UserCircle2 className="text-slate-700" size={24} />
              <h2 className="text-2xl font-semibold text-slate-900">Professional Summary</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">{summary}</p>
          </section>

          {/* Skills Section */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Code className="text-slate-700" size={24} />
              <h2 className="text-2xl font-semibold text-slate-900">Skills</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Technical Skills</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700">{technicalSkills}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Soft Skills</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700">{softSkills}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="text-slate-700" size={24} />
              <h2 className="text-2xl font-semibold text-slate-900">Professional Experience</h2>
            </div>
            <div className="space-y-6">
              <div className="border-l-4 border-slate-900 pl-4">
                <h3 className="font-semibold text-slate-900 mb-2">Recent Position</h3>
                <p className="text-slate-700">{recentExperience}</p>
              </div>
              <div className="border-l-4 border-slate-300 pl-4">
                <h3 className="font-semibold text-slate-900 mb-2">Previous Position</h3>
                <p className="text-slate-700">{otherExperience}</p>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FolderGit2 className="text-slate-700" size={24} />
              <h2 className="text-2xl font-semibold text-slate-900">Notable Projects</h2>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700 whitespace-pre-line">{projects}</p>
            </div>
          </section>

          {/* Education Section */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="text-slate-700" size={24} />
              <h2 className="text-2xl font-semibold text-slate-900">Education</h2>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700">{education}</p>
            </div>
          </section>

          {/* Certifications Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-slate-700" size={24} />
              <h2 className="text-2xl font-semibold text-slate-900">Certifications & Awards</h2>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700">{certifications}</p>
            </div>
          </section>
        </div>
      </div>
      <GeneratePDF 
        fileName={`${name.replace(/\s+/g, '_')}_resume`}
        resumeData={{
          name,
          contact,
          title,
          education,
          technicalSkills,
          softSkills,
          recentExperience,
          otherExperience,
          certifications,
          summary,
          projects
        }}
      />
    </div>
  );
}