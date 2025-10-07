"use client";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to TS Sender
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          A simple and fast transaction sender built with RainbowKit
        </p>
        {/* Additional UI */}
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Get Started
          </h2>
          <p className="text-gray-600">
            Connect your wallet to start sending transactions securely.
          </p>
        </div>
      </div>
    </div>
  );
}
