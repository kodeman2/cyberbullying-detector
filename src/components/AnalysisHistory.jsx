import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

const AnalysisHistory = ({ analyses, onDelete }) => {
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filter, setFilter] = useState("all");

  const sortedAnalyses = [...analyses].sort((a, b) => {
    const order = sortOrder === "asc" ? 1 : -1;
    if (sortBy === "timestamp") {
      return order * (new Date(a.timestamp) - new Date(b.timestamp));
    }
    if (sortBy === "confidence") {
      return order * (a.confidence - b.confidence);
    }
    return 0;
  });

  const filteredAnalyses = sortedAnalyses.filter((analysis) => {
    if (filter === "all") return true;
    if (filter === "cyberbullying") return analysis.isCyberbullying;
    return !analysis.isCyberbullying;
  });

  return (
    <div className="card animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Analysis History</h2>
        <div className="flex space-x-2">
          <select
            className="input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="timestamp">Sort by Date</option>
            <option value="confidence">Sort by Confidence</option>
          </select>
          <button
            className="btn btn-secondary"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Results</option>
            <option value="cyberbullying">Cyberbullying Only</option>
            <option value="safe">Safe Only</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Result
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Confidence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Text
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAnalyses.map((analysis, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(analysis.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      analysis.isCyberbullying
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }`}
                  >
                    {analysis.isCyberbullying ? "Cyberbullying" : "Safe"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {(analysis.confidence * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="max-w-xs truncate">{analysis.text}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onDelete(index)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalysisHistory;
