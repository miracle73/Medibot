"use client";

import { useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PricingPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    );
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for occasional symptom checks",
      features: [
        "3 symptom checks per day",
        "Basic condition matching",
        "Severity assessment",
        "7-day history",
      ],
      cta: "Get Started",
      ctaClass: "bg-teal-600 hover:bg-teal-700 text-white",
      popular: false,
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "/month",
      description: "Unlimited health insights and more",
      features: [
        "Unlimited symptom checks",
        "Follow-up questions",
        "Medication interaction checker",
        "Exportable PDF health reports",
        "Full history (no limit)",
        "Priority support",
      ],
      cta: "Upgrade to Premium",
      ctaClass: "bg-teal-600 hover:bg-teal-700 text-white",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Simple, transparent pricing. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? "ring-2 ring-teal-600 relative" : ""
              }`}
            >
              {plan.popular && (
                <div className="bg-teal-600 text-white text-sm font-semibold py-1 text-center">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h2>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-teal-500 mr-3 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <SignInButton mode="modal">
                  <button
                    className={`w-full py-3 px-6 rounded-full font-semibold transition-colors ${plan.ctaClass}`}
                  >
                    {plan.cta}
                  </button>
                </SignInButton>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            All plans include our medical disclaimer and AI-powered analysis.
          </p>
          <Link
            href="/"
            className="text-teal-600 hover:underline font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}