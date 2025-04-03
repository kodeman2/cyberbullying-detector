import React, { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ResultModal = ({ isOpen, onClose, result }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 animate-slide-up"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analysis Results
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            {result.imageUrl && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Extracted Image:
                </h3>
                <img
                  src={result.imageUrl}
                  alt="Analyzed Image"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}

            {result.imageUrl && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Extracted Text:
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {result.text}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.isCyberbullying
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                }`}
              >
                {result.isCyberbullying
                  ? "Cyberbullying Detected"
                  : "Safe Content"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Confidence:
              </span>
              <span className="text-gray-900 dark:text-white">
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Severity:
              </span>
              <span className="text-gray-900 dark:text-white capitalize">
                {result.severity}
              </span>
            </div>

            {result.features.harmfulWords.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Detected Harmful Words:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.features.harmfulWords.map((word, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-sm"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Text Properties:
              </h3>
              <ul className="space-y-1">
                {result.features.textProperties.containsAllCaps && (
                  <li className="text-gray-700 dark:text-gray-300">
                    • Contains excessive capitalization
                  </li>
                )}
                {result.features.textProperties.containsRepeatedPunctuation && (
                  <li className="text-gray-700 dark:text-gray-300">
                    • Contains repeated punctuation
                  </li>
                )}
                {result.features.textProperties.containsThreateningEmoji && (
                  <li className="text-gray-700 dark:text-gray-300">
                    • Contains potentially threatening emoji
                  </li>
                )}
                {result.features.textProperties.containsRepeatedWords && (
                  <li className="text-gray-700 dark:text-gray-300">
                    • Contains repeated words
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
