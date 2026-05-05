"use client";

import { ScenarioForm } from "@/components/scenario-form";
import { RunHistory } from "@/components/run-history";
import { ObsLinks } from "@/components/obs-links";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Signal Lab</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ScenarioForm />
            <RunHistory />
          </div>
          <div>
            <ObsLinks />
          </div>
        </div>
      </div>
    </main>
  );
}
