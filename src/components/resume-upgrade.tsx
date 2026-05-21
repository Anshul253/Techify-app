import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function ResumeProcessor() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (event : any) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a resume file.");

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://localhost:5000/process-resume", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg p-6 bg-white shadow-lg rounded-2xl">
        <CardContent className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Upload Resume for Analysis</h2>
          <Input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="mb-4" />
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Processing..." : <><Upload className="w-5 h-5 mr-2" /> Submit</>}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card className="w-full max-w-lg mt-6 p-6 bg-white shadow-lg rounded-2xl">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Analysis Results:</h3>
            {analysis.issues.length > 0 ? (
              <ul className="list-disc list-inside text-red-500">
                {analysis.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            ) : (
              <p className="text-green-500">✅ No major issues found!</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}