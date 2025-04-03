import React, { useState, useEffect } from "react";
import TextAnalyzer from "./components/TextAnalyzer";
import ImageAnalyzer from "./components/ImageAnalyzer";
import AnalysisHistory from "./components/AnalysisHistory";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

function App() {
  const [analyses, setAnalyses] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load analyses from localStorage
    const savedAnalyses = localStorage.getItem("analyses");
    if (savedAnalyses) {
      setAnalyses(JSON.parse(savedAnalyses));
    }

    // Check system dark mode preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    // Save analyses to localStorage
    localStorage.setItem("analyses", JSON.stringify(analyses));
  }, [analyses]);

  useEffect(() => {
    // Update document class for dark mode
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAnalysisComplete = (result) => {
    setAnalyses((prev) => [result, ...prev]);
  };

  const handleDeleteAnalysis = (index) => {
    setAnalyses((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Cyberbullying Detector
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {darkMode ? (
                  <SunIcon className="h-6 w-6" />
                ) : (
                  <MoonIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TextAnalyzer onAnalysisComplete={handleAnalysisComplete} />
            <ImageAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          </div>
          <AnalysisHistory
            analyses={analyses}
            onDelete={handleDeleteAnalysis}
          />
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-sm mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            ©{new Date().getFullYear()} Cyberbullying Detector. All rights
            reserved Kodeman inc.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
