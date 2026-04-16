"use client";

import { useUser } from "@clerk/nextjs";

export function BillingPortalWrapper() {
  const { user } = useUser();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Manage Subscription</h2>
      <p className="text-gray-600 mb-4">
        Manage your billing, update your plan, or cancel your subscription.
      </p>
      <a
        href="https://accounts.clerk.com/user/billing"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-full transition-colors"
      >
        Manage Billing
      </a>
    </div>
  );
}