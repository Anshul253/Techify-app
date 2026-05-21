"use client";
import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { StructuredResume } from "./ResumeTemplates/types";

interface PDFButtonProps {
  resumeData: StructuredResume | any;
  fileName?: string;
}

const PDFButton: React.FC<PDFButtonProps> = ({ resumeData, fileName }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = () => {
    setIsGenerating(true);
    // Use the browser's built-in print dialog targeting the resume-preview div
    const element = document.getElementById("resume-preview");
    if (!element) {
      alert("Resume preview not found. Please view the Resume tab first.");
      setIsGenerating(false);
      return;
    }

    const originalBody = document.body.innerHTML;
    document.body.innerHTML = element.outerHTML;
    window.print();
    document.body.innerHTML = originalBody;
    window.location.reload();
    setIsGenerating(false);
  };

  const handleDownloadDocx = async () => {
    setIsGenerating(true);
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import("docx");

      const r = resumeData as StructuredResume;

      // Build document paragraphs from StructuredResume
      const children: any[] = [];

      // Name
      children.push(new Paragraph({
        text: r.personal?.name || "",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }));

      // Title
      if (r.targetRole) {
        children.push(new Paragraph({
          text: r.targetRole,
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ text: r.targetRole, color: "444444", size: 24 })],
        }));
      }

      // Contact
      const contactParts = [r.personal?.email, r.personal?.phone, r.personal?.location, r.personal?.linkedin].filter(Boolean);
      children.push(new Paragraph({
        text: contactParts.join("  |  "),
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }));

      // Summary
      if (r.summary) {
        children.push(new Paragraph({ text: "PROFESSIONAL SUMMARY", heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 120 } }));
        children.push(new Paragraph({ text: r.summary, spacing: { after: 240 } }));
      }

      // Skills
      if (r.skills?.technical?.length > 0 || r.skills?.soft?.length > 0) {
        children.push(new Paragraph({ text: "SKILLS", heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 120 } }));
        if (r.skills.technical?.length > 0) {
          children.push(new Paragraph({ text: "Technical: " + r.skills.technical.join(", "), spacing: { after: 120 } }));
        }
        if (r.skills.soft?.length > 0) {
          children.push(new Paragraph({ text: "Soft Skills: " + r.skills.soft.join(", "), spacing: { after: 240 } }));
        }
      }

      // Experience
      if (r.experience?.length > 0) {
        children.push(new Paragraph({ text: "PROFESSIONAL EXPERIENCE", heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 120 } }));
        r.experience.forEach((exp) => {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: exp.title, bold: true, size: 24 }),
              new TextRun({ text: `  |  ${exp.company}${exp.location ? ", " + exp.location : ""}`, size: 24 }),
              new TextRun({ text: `  (${exp.startDate} – ${exp.endDate})`, color: "666666", size: 22 }),
            ],
            spacing: { before: 200, after: 100 },
          }));
          exp.bullets?.forEach((bullet) => {
            children.push(new Paragraph({ text: `• ${bullet}`, spacing: { after: 80 }, indent: { left: 360 } }));
          });
        });
      }

      // Projects
      if (r.projects?.length > 0) {
        children.push(new Paragraph({ text: "PROJECTS", heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 120 } }));
        r.projects.forEach((proj) => {
          children.push(new Paragraph({
            children: [new TextRun({ text: proj.name, bold: true }), new TextRun({ text: proj.tech?.length > 0 ? `  —  ${proj.tech.join(", ")}` : "" })],
            spacing: { before: 160, after: 80 },
          }));
          children.push(new Paragraph({ text: proj.description, spacing: { after: 120 } }));
        });
      }

      // Education
      if (r.education?.length > 0) {
        children.push(new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 120 } }));
        r.education.forEach((edu) => {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: edu.degree, bold: true }),
              new TextRun({ text: `  —  ${edu.institution}` }),
              new TextRun({ text: `  (${edu.year})`, color: "666666" }),
            ],
            spacing: { after: 120 },
          }));
        });
      }

      // Certifications
      if (r.certifications?.length > 0) {
        children.push(new Paragraph({ text: "CERTIFICATIONS", heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 120 } }));
        r.certifications.forEach((cert) => {
          children.push(new Paragraph({ text: `• ${cert}`, spacing: { after: 80 } }));
        });
      }

      const doc = new Document({
        sections: [{ properties: {}, children }],
        styles: {
          paragraphStyles: [{
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            run: { size: 32, bold: true, color: "000000" },
          }],
        },
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${r.personal?.name?.replace(/\s+/g, "_") || "resume"}_resume.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("DOCX generation error:", err);
      alert("Failed to generate document. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePrint}
        disabled={isGenerating}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg transition-all"
      >
        <Download className="w-4 h-4" />
        Print / PDF
      </button>
      <button
        onClick={handleDownloadDocx}
        disabled={isGenerating}
        className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-all disabled:opacity-50"
      >
        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Download DOCX
      </button>
    </div>
  );
};

export default PDFButton;