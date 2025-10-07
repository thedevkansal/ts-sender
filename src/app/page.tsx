"use client";

import AirdropForm from "@/components/AirdropForm";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8">
        <AirdropForm />
      </div>
    </div>
  );
}
