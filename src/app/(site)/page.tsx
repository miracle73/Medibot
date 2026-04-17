"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function LandingPage() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Medibot
          </h1>
          <p className="text-2xl md:text-3xl mb-8">
            AI-Powered Symptom Checker
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Describe your symptoms in plain language and receive possible conditions,
            severity levels, and recommended next steps. Get the guidance you need, when you need it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="bg-white text-teal-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full text-lg transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <SignUpButton mode="modal">
                  <button className="bg-white text-teal-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full text-lg transition-colors">
                    Get Started Free
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal-700 font-semibold py-3 px-8 rounded-full text-lg transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How Medibot Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Describe Symptoms</h3>
              <p className="text-gray-600 text-center">
                Tell us what you're feeling in plain language. No medical jargon required.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">AI Analysis</h3>
              <p className="text-gray-600 text-center">
                Our AI analyzes your symptoms and cross-references medical knowledge.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Severity Assessment</h3>
              <p className="text-gray-600 text-center">
                Get color-coded severity indicators: mild, moderate, or urgent.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Next Steps</h3>
              <p className="text-gray-600 text-center">
                Clear recommendations for home care, doctor visits, or emergency care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="py-8 px-4 bg-yellow-50 border-t border-yellow-200">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-semibold text-yellow-800 mb-2">Medical Disclaimer</h3>
          <p className="text-yellow-700 text-sm">
            Medibot is not a medical diagnosis tool. The information provided is for educational purposes only
            and should not replace professional medical advice. Always consult a qualified healthcare
            provider for any health concerns or before making decisions about your health.
          </p>
        </div>
      </section>

     
    </div>
  );
}