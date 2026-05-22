// page.tsx - home page, just wraps Dashboard
// user opens localhost:3000 and sees this

import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white px-4 py-5 sm:px-8">
        <h1 className="text-2xl font-bold text-slate-900">Portfolio Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Holdings from Excel · live CMP & fundamentals via Yahoo
        </p>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        <Dashboard />
      </div>
    </main>
  );
}
