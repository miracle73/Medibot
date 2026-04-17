"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { ConditionCard } from "@/components/symptom/ConditionCard";
import { SeverityBadge } from "@/components/symptom/SeverityBadge";

interface UsageData {
  tier: "free" | "premium";
  remaining: number;
  last_check_date?: string | null;
}

interface StreamEvent {
  type: string;
  token?: string;
  condition?: {
    name: string;
    confidence: number;
    description: string;
  };
  severity?: "mild" | "moderate" | "urgent";
  recommendations?: string[];
  message?: string;
  data?: {
    conditions: Array<{ name: string; confidence: number; description: string }>;
    severity: string;
    recommendations: string[];
    confidence_score: number;
  };
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [currentResponse, setCurrentResponse] = useState<{
    streamingText: string;
    conditions: Array<{ name: string; confidence: number; description: string }>;
    severity: "mild" | "moderate" | "urgent" | "";
    recommendations: string[];
    isComplete: boolean;
  }>({
    streamingText: "",
    conditions: [],
    severity: "",
    recommendations: [],
    isComplete: false,
  });

  // Fetch usage on mount
  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const res = await fetch("/api/usage");
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch (err) {
      console.error("Failed to fetch usage:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() || loading) return;

    setLoading(true);
    setError("");
    setCurrentResponse({
      streamingText: "",
      conditions: [],
      severity: "",
      recommendations: [],
      isComplete: false,
    });

    try {
      const res = await fetch("/api/check-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to analyze symptoms");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim()) {
            try {
              const event: StreamEvent = JSON.parse(line);
              switch (event.type) {
                case "token":
                  setCurrentResponse((prev) => ({
                    ...prev,
                    streamingText: prev.streamingText + event.token,
                  }));
                  break;
                case "condition":
                  if (event.condition) {
                    const newCondition = event.condition;
                    setCurrentResponse((prev) => ({
                      ...prev,
                      conditions: [...prev.conditions, newCondition],
                    }));
                  }
                  break;
                case "severity":
                  if (event.severity) {
                    const newSeverity = event.severity;
                    setCurrentResponse((prev) => ({
                      ...prev,
                      severity: newSeverity,
                    }));
                  }
                  break;
                case "recommendations":
                  if (event.recommendations) {
                    const newRecommendations = event.recommendations;
                    setCurrentResponse((prev) => ({
                      ...prev,
                      recommendations: newRecommendations,
                    }));
                  }
                  break;
                case "complete":
                  setCurrentResponse((prev) => ({ ...prev, isComplete: true }));
                  fetchUsage(); // Refresh usage stats
                  break;
                case "error":
                  setError(event.message || "An error occurred");
                  break;
              }
            } catch (e) {
              console.error("Failed to parse event:", e);
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Symptom Checker</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
            {usage && (
              <div className="text-sm">
                {usage.tier === "free" ? (
                  <span
                    className={
                      usage.remaining <= 0
                        ? "text-red-600 font-semibold"
                        : "text-gray-600"
                    }
                  >
                    {usage.remaining} checks remaining today
                  </span>
                ) : (
                  <span className="text-teal-600 font-medium">
                    Premium - Unlimited
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </span>
              <SignOutButton redirectUrl="/">
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  Sign out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>

        {/* Symptom Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="symptoms"
              className="block text-lg font-medium text-gray-900 mb-2"
            >
              Describe your symptoms:
            </label>
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="E.g., I have a headache, fever, and body aches..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              disabled={loading}
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading || !symptoms.trim()}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-full transition-colors"
              >
                {loading ? "Analyzing..." : "Check Symptoms"}
              </button>
            </div>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Response Area */}
        {(currentResponse.streamingText ||
          currentResponse.conditions.length > 0 ||
          currentResponse.severity) && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Analysis Results</h2>

            {/* Severity Badge */}
            {currentResponse.severity && (
              <div className="mb-4">
                <SeverityBadge severity={currentResponse.severity} />
              </div>
            )}

            {/* Condition Cards */}
            {currentResponse.conditions.length > 0 && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold">Possible Conditions</h3>
                {currentResponse.conditions.map((cond, idx) => (
                  <ConditionCard
                    key={idx}
                    name={cond.name}
                    confidence={cond.confidence}
                    description={cond.description}
                  />
                ))}
              </div>
            )}

            {/* Recommendations */}
            {currentResponse.recommendations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Recommended Next Steps
                </h3>
                <ul className="list-disc pl-5 space-y-2">
               {currentResponse.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-gray-700">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Raw streaming text (debug, optional) */}
            {currentResponse.streamingText && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                  Show raw analysis
                </summary>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-3 rounded border">
                  {currentResponse.streamingText}
                </pre>
              </details>
            )}

            {/* Disclaimer */}
            {currentResponse.isComplete && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800 font-medium">
                  ⚠️ This is not a medical diagnosis. Please consult a
                  healthcare professional for proper evaluation.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}