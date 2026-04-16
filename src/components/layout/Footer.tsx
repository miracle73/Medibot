import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Medibot</h3>
            <p className="text-gray-300 text-sm">
              AI-powered symptom checker providing instant health insights and guidance.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-gray-300 hover:text-white text-sm transition-colors">
                  History
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300 text-sm">
                  Medical Disclaimer
                </span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Medibot. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            This tool is not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}