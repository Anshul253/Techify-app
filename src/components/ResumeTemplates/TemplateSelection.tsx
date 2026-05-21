"use client";
import React, { useState } from "react";
import { StructuredResume } from "./types";
import MinimalTemplate from "./MinimalTemplate";
import ModernTemplate from "./ModernTemplate";
import CreativeTemplate from "./CreativeTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";

interface Props {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  resumeData?: StructuredResume;
}

const TEMPLATES = [
  {
    id: "minimal",
    name: "Apex Classic",
    description: "Single-column, clean, minimal",
    bestFor: "Corporate · Finance · Law",
    accent: "#000080", // Navy
    preview: "bg-white border border-gray-200",
  },
  {
    id: "modern",
    name: "Nova Modern",
    description: "Two-column sidebar layout",
    bestFor: "Tech · Engineering · Data",
    accent: "#2f4f4f", // Dark Slate
    preview: "bg-white border border-cyan-200",
  },
  {
    id: "executive",
    name: "Prestige Executive",
    description: "Bold header, section dividers",
    bestFor: "Senior Roles · Leadership · MBA",
    accent: "#36454F", // Charcoal
    preview: "bg-white border border-yellow-700/30",
  },
  {
    id: "creative",
    name: "Spark Creative",
    description: "Colorful accent bars, icon-row",
    bestFor: "Design · Marketing · Startups",
    accent: "#008080", // Teal
    preview: "bg-white border border-teal-200",
  },
];

const TemplateSelection = ({ selectedTemplate, onTemplateChange, resumeData }: Props) => {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => onTemplateChange(tmpl.id)}
            className={`relative text-left rounded-xl p-4 transition-all duration-200 border-2 ${
              selectedTemplate === tmpl.id
                ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20"
                : "border-zinc-700/50 bg-zinc-800/40 hover:border-zinc-500"
            }`}
          >
            {/* Mini preview box */}
            <div className={`w-full h-16 rounded-lg mb-3 overflow-hidden relative ${tmpl.preview}`}>
              <div
                className="absolute top-0 left-0 right-0 h-5 opacity-80"
                style={{ backgroundColor: tmpl.accent }}
              />
              <div className="absolute left-2 top-6 right-2 space-y-1">
                <div className="h-1.5 rounded bg-gray-300/60 w-2/3" />
                <div className="h-1 rounded bg-gray-200/60 w-1/2" />
                <div className="h-1 rounded bg-gray-200/60 w-3/4" />
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-white text-sm">{tmpl.name}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{tmpl.description}</p>
                <p className="text-xs mt-1.5 font-medium" style={{ color: tmpl.accent === "#1a1a2e" ? "#6366f1" : tmpl.accent }}>
                  {tmpl.bestFor}
                </p>
              </div>
              {selectedTemplate === tmpl.id && (
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Live preview label */}
      <p className="text-xs text-zinc-500 text-center">Click a template above to select it · Preview updates below</p>
    </div>
  );
};

export default TemplateSelection;

// Re-export all templates + map for easy import
export { MinimalTemplate, ModernTemplate, CreativeTemplate, ExecutiveTemplate };

export const TEMPLATE_MAP: Record<string, React.ComponentType<{ resumeData: StructuredResume }>> = {
  minimal:   MinimalTemplate,
  modern:    ModernTemplate,
  creative:  CreativeTemplate,
  executive: ExecutiveTemplate,
};