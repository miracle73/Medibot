"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SeverityBadge } from "@/components/symptom/SeverityBadge";

interface HistoryItem {
  id: string;
  symptoms: string;
  conditions: Array<{ name: string; confidence: number; description: string }>;
  severity: "mild" | "moderate" | "urgent";
  recommendations: string[];
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      } else {
        setError("Failed to load history");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Loading history...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Symptom Check History
        </h1>

        {history.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No symptom checks yet.</p>
            <a
              href="/dashboard"
              className="text-teal-600 hover:underline font-medium"
            >
              Go to Dashboard
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div
                  className="p-4 cursor-pointer flex justify-between items-start"
                  onClick={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <SeverityBadge severity={item.severity} />
                      <span className="text-sm text-gray-500">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium line-clamp-2">
                      {item.symptoms}
                    </p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 ml-4">
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        expandedId === item.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                {expandedId === item.id && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Possible Conditions
                      </h3>
                      <div className="space-y-3">
                        {item.conditions.map((cond, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-200 rounded p-3"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-medium text-gray-900">
                                {cond.name}
                              </h4>
                              <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2 py-1 rounded">
                                {cond.confidence}% confidence
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {cond.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {item.recommendations && item.recommendations.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">
                          Recommended Next Steps
                        </h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {item.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-gray-700 text-sm">
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-xs text-yellow-800 font-medium">
                        ⚠️ This is not a medical diagnosis. Please consult a
                        healthcare professional.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Medical Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Medical Disclaimer:</strong> Medibot is not a medical
            diagnosis tool. The information provided is for educational purposes
            only. Always consult a qualified healthcare provider for any health
            concerns.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
