"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { PricingTableWrapper } from "@/components/billing/PricingTableWrapper";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Simple, transparent pricing. No hidden fees.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <PricingTableWrapper />
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
      <Footer />
    </div>
  );
}