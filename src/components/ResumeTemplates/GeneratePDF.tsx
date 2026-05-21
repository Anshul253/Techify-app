import React, { useState } from "react";
import { Download } from 'lucide-react';

// Define the type for resumeData
interface ResumeData {
  name: string;
  contact: string;
  title: string;
  education: string;
  technicalSkills: string;
  softSkills: string;
  recentExperience: string;
  otherExperience: string;
  certifications: string;
  summary: string;
  projects: string;
}

interface GeneratePDFProps {
  fileName: string;
  resumeData: ResumeData;
}

const GeneratePDF: React.FC<GeneratePDFProps> = ({ fileName, resumeData }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    let loadingDiv: HTMLDivElement | null = null;
    
    try {
      // Create a loading indicator
      loadingDiv = document.createElement('div');
      loadingDiv.style.position = 'fixed';
      loadingDiv.style.top = '0';
      loadingDiv.style.left = '0';
      loadingDiv.style.width = '100%';
      loadingDiv.style.height = '100%';
      loadingDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
      loadingDiv.style.display = 'flex';
      loadingDiv.style.justifyContent = 'center';
      loadingDiv.style.alignItems = 'center';
      loadingDiv.style.zIndex = '9999';
      loadingDiv.innerHTML = '<div style="background: white; padding: 20px; border-radius: 8px;">Generating PDF...</div>';
      document.body.appendChild(loadingDiv);

      // Check if element exists
      const input = document.getElementById("resume-preview");
      if (!input) {
        throw new Error("Resume preview element with ID 'resume-preview' not found");
      }

      // Clone the element to modify it safely without affecting the display
      const clonedElement = input.cloneNode(true) as HTMLElement;
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '-9999px';
      document.body.appendChild(clonedElement);
      
      // Fix color functions by replacing unsupported colors with standard ones
      const allElements = clonedElement.querySelectorAll('*');
      allElements.forEach(el => {
        const element = el as HTMLElement;
        const computedStyle = window.getComputedStyle(element);
        
        // Apply computed RGB colors instead of functional notations
        element.style.color = computedStyle.color;
        element.style.backgroundColor = computedStyle.backgroundColor;
        element.style.borderColor = computedStyle.borderColor;
        
        // Remove any gradients or complex backgrounds that might cause issues
        if (computedStyle.backgroundImage !== 'none') {
          const bgColor = computedStyle.backgroundColor;
          element.style.backgroundImage = 'none';
          element.style.backgroundColor = bgColor;
        }
      });

      // Dynamically import jsPDF and html2canvas
      const jsPDFModule = await import('jspdf');
      const html2canvasModule = await import('html2canvas');
      
      // Handle different module formats
      const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
      const html2canvas = html2canvasModule.default;
      
      if (!jsPDF || !html2canvas) {
        throw new Error("Failed to load PDF libraries");
      }
      
      // Convert the cloned and fixed element to canvas
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: true
      });
      
      // Remove the cloned element
      document.body.removeChild(clonedElement);

      // Calculate dimensions for A4 page
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Convert canvas to image data
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      // Add image to PDF
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      
      // Handle multi-page content
      let heightLeft = imgHeight - pageHeight;
      let position = -pageHeight;
      
      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
      }

      // Save PDF
      const cleanFileName = (fileName || resumeData.name || 'resume').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      pdf.save(`${cleanFileName}.pdf`);

    } catch (error) {
      console.error("PDF generation error:", error);
      alert(`PDF generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      // Clean up loading indicator
      if (loadingDiv && loadingDiv.parentNode) {
        document.body.removeChild(loadingDiv);
      }
      setIsGenerating(false);
    }
  };

  return (
    <button 
      onClick={handleDownload} 
      disabled={isGenerating}
      className={`fixed bottom-4 right-4 ${isGenerating ? 'bg-gray-500' : 'bg-slate-900 hover:bg-slate-800'} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors`}
      aria-label="Download PDF"
    >
      <Download size={18} />
      <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
    </button>
  );
};

export default GeneratePDF;