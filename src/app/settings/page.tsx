"use client";

import { useEffect, useState } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface UsageData {
  tier: "free" | "premium";
  remaining: number;
  last_check_date?: string | null;
}

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Name
              </label>
              <p className="text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Email
              </label>
              <p className="text-gray-900">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Subscription & Usage
          </h2>
          {usage ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Plan
                </label>
                <p className="text-gray-900 capitalize">{usage.tier}</p>
              </div>
              {usage.tier === "free" && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Remaining Checks Today
                  </label>
                  <p
                    className={`text-lg font-semibold ${
                      usage.remaining <= 0
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {usage.remaining}
                  </p>
                </div>
              )}
              {usage.tier === "free" && (
                <div>
                  <a
                    href="/pricing"
                    className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-full"
                  >
                    Upgrade to Premium
                  </a>
                </div>
              )}
              {usage.tier === "premium" && (
                <p className="text-sm text-gray-600">
                  You have unlimited symptom checks.
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">
              Unable to load usage information.
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <SignOutButton afterSignOutUrl="/">
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded">
              Sign Out
            </button>
          </SignOutButton>
        </div>

        {/* Medical Disclaimer */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
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
