import React, { useState } from "react";
import { cyberbullyingModel } from "../utils/cyberbullyingModel";
import ResultModal from "./ResultModal";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const TextAnalyzer = ({ onAnalysisComplete }) => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const showError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonColor: "#0ea5e9",
      confirmButtonText: "OK",
    });
  };

  const analyzeText = async () => {
    if (!text.trim()) {
      showError("Please enter some text to analyze");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Add a 1-second delay to show the loading spinner
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = await cyberbullyingModel.predict(text);
      const analysisData = {
        ...result,
        timestamp: new Date().toISOString(),
        text: text.trim(),
      };

      setAnalysisResult(analysisData);
      setShowModal(true);
      onAnalysisComplete(analysisData);
    } catch (err) {
      showError("An error occurred while analyzing the text");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Text Analysis</h2>
      <div className="space-y-4">
        <textarea
          className="input min-h-[150px]"
          placeholder="Enter text to analyze for cyberbullying..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="btn btn-primary w-full flex items-center justify-center gap-2"
          onClick={analyzeText}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Text"
          )}
        </button>
      </div>

      <ResultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        result={analysisResult}
      />
    </div>
  );
};

export default TextAnalyzer;
