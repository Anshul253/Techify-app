import React from "react";
import MinimalTemplate from "./MinimalTemplate";
import ModernTemplate from "./ModernTemplate";
import { ResumeData } from "./types";

// Define the available templates
const TEMPLATES = {
    minimal: MinimalTemplate,
    modern: ModernTemplate
} as const;

// Create a type for the available template keys
type TemplateKey = keyof typeof TEMPLATES;

interface TemplatePreviewProps {
    selectedTemplate: TemplateKey;
    resumeData: ResumeData;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ selectedTemplate, resumeData }) => {
    const TemplateComponent = TEMPLATES[selectedTemplate];

    if (!TemplateComponent) {
        return <div>Invalid template selected</div>;
    }

    return (
        <div id="resume-preview">
            <TemplateComponent resumeData={resumeData} />
        </div>
    );
};

export default TemplatePreview;