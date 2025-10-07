"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and App Name */}
        <Link
          href="/"
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg shadow-md">
            TS
          </div>
          <span className="text-xl font-bold text-gray-900">TSender</span>
        </Link>

        {/* Connect Button */}
        <div className="flex items-center space-x-4">
          {mounted ? (
            <ConnectButton showBalance={false} />
          ) : (
            <div className="bg-gray-200 animate-pulse h-10 w-32 rounded-lg"></div>
          )}
        </div>
      </div>
    </header>
  );
}
