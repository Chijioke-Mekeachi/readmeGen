"use client";

import { useState } from "react";

export default function ReadmeGenerator() {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    techStack: "",
    installation: "",
    usage: "",
    features: "",
    contributing: "",
    license: "MIT",
    demo: "",
  });
  const [loading, setLoading] = useState(false);
  const [readmeContent, setReadmeContent] = useState("");
  const [error, setError] = useState("");

  const formFields = [
    { key: "projectName", label: "Project Name", required: true, placeholder: "My Awesome Project" },
    { key: "description", label: "Description", required: true, placeholder: "Brief description...", type: "textarea" },
    { key: "techStack", label: "Tech Stack", placeholder: "React, Node.js, MongoDB..." },
    { key: "installation", label: "Installation", type: "textarea", placeholder: "Steps to install..." },
    { key: "usage", label: "Usage", type: "textarea", placeholder: "How to use the project..." },
    { key: "features", label: "Features", type: "textarea", placeholder: "Key features..." },
    { key: "contributing", label: "Contributing Guidelines", type: "textarea", placeholder: "How others can contribute..." },
    { key: "license", label: "License", type: "select", options: ["MIT", "Apache 2.0", "GPLv3", "BSD-3-Clause", "None"] },
    { key: "demo", label: "Demo/Live URL", placeholder: "https://your-project-demo.com" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.projectName.trim()) { setError("Project name is required"); return false; }
    if (!formData.description.trim()) { setError("Description is required"); return false; }
    return true;
  };

  const generateReadme = async () => {
  if (!validateForm()) return;

  setLoading(true);
  setError("");
  setReadmeContent("");

  const userPrompt = `
Create a professional README.md for a GitHub project.
Project Name: ${formData.projectName}
Description: ${formData.description}
Tech Stack: ${formData.techStack}
Installation: ${formData.installation}
Usage: ${formData.usage}
Features: ${formData.features}
Contributing: ${formData.contributing || "Contributions welcome."}
License: ${formData.license}
Demo: ${formData.demo || "No demo URL provided"}

Include badges, markdown formatting, table of contents, and code examples.
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt }
            ]
          }
        ]
      })
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    const generatedReadme = data?.choices?.[0]?.message?.content?.[0]?.text || "No content generated";
    setReadmeContent(generatedReadme);

  } catch (err) {
    console.error("Generation error:", err);
    setError(err.message || "Failed to generate README. Try again.");
  } finally {
    setLoading(false);
  }
};


  const downloadReadme = () => {
    if (!readmeContent) return;
    const blob = new Blob([readmeContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!readmeContent) return;
    try { await navigator.clipboard.writeText(readmeContent); alert("README copied!"); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-yellow-400 font-bold text-lg">Generating your README...</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">🚀 AI README Generator</h1>
        <p className="text-gray-300 mb-6">Create professional, modern README files for your projects with AI.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {formFields.map((field) => (
            <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
              <label className="block mb-2 font-medium">
                {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea name={field.key} value={formData[field.key]} onChange={handleChange} placeholder={field.placeholder} className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-yellow-500 focus:outline-none min-h-[100px]" rows={4} />
              ) : field.type === "select" ? (
                <select name={field.key} value={formData[field.key]} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-yellow-500 focus:outline-none">
                  {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : (
                <input type="text" name={field.key} value={formData[field.key]} onChange={handleChange} placeholder={field.placeholder} className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-yellow-500 focus:outline-none" />
              )}
            </div>
          ))}
        </div>

        {error && <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200">{error}</div>}

        <button onClick={generateReadme} disabled={loading} className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6">
          Generate README
        </button>

        {readmeContent && (
          <div className="mt-8 p-6 bg-gray-800 rounded-lg overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Generated README</h2>
              <div className="flex gap-2">
                <button onClick={copyToClipboard} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Copy</button>
                <button onClick={downloadReadme} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">Download</button>
              </div>
            </div>
            <div className="bg-gray-900 rounded p-4 border border-gray-700 text-sm md:text-base font-mono whitespace-pre-wrap break-words">
              {readmeContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
