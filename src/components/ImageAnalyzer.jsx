import React, { useState } from "react";
import { createWorker } from "tesseract.js";
import { cyberbullyingModel } from "../utils/cyberbullyingModel";
import ResultModal from "./ResultModal";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const ImageAnalyzer = ({ onAnalysisComplete }) => {
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState(null);
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Please upload an image file");
      return;
    }

    setImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!image) {
      showError("Please upload an image first");
      return;
    }

    setIsProcessing(true);

    try {
      // Add a 1-second delay to show the loading spinner
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Initialize Tesseract worker
      const worker = await createWorker();

      // Perform OCR
      const {
        data: { text },
      } = await worker.recognize(image);
      await worker.terminate();

      if (!text.trim()) {
        showError("No text could be extracted from the image");
        return;
      }

      // Analyze extracted text
      const result = await cyberbullyingModel.predict(text);
      const analysisData = {
        ...result,
        timestamp: new Date().toISOString(),
        text: text.trim(),
        imageUrl: preview,
      };

      setAnalysisResult(analysisData);
      setShowModal(true);
      onAnalysisComplete(analysisData);
    } catch (err) {
      showError("An error occurred while analyzing the image");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="card animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Image Analysis</h2>
      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="btn btn-secondary cursor-pointer"
          >
            Upload Image
          </label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto rounded-lg"
            />
          )}
        </div>
        <button
          className="btn btn-primary w-full flex items-center justify-center gap-2"
          onClick={analyzeImage}
          disabled={isProcessing || !image}
        >
          {isProcessing ? (
            <>
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Analyze Image"
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

export default ImageAnalyzer;
