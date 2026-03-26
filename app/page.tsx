"use client";

import { useState } from "react";

type Requirement = {
  text: string;
  type: "skill" | "vibe";
  status: "match" | "reword" | "gap";
  note: string;
};

type AnalysisResult = {
  matchPercent: number;
  summary: string;
  requirements: Requirement[];
  easyWins: string[];
  genuineGaps: string[];
};

const statusConfig = {
  match: { label: "Match", bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" },
  reword: { label: "Easy win", bg: "bg-amber-100", text: "text-amber-800", dot: "bg-amber-500" },
  gap: { label: "Gap", bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
};

const typeConfig = {
  skill: { label: "Skill", bg: "bg-blue-100", text: "text-blue-700" },
  vibe: { label: "Vibe", bg: "bg-purple-100", text: "text-purple-700" },
};

export default function Home() {
  const [cv, setCv] = useState("");
  const [jobSpec, setJobSpec] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyse() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, jobSpec }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const matchColor =
    !result ? ""
    : result.matchPercent >= 70 ? "text-green-600"
    : result.matchPercent >= 40 ? "text-amber-600"
    : "text-red-600";

  const skills = result?.requirements.filter((r) => r.type === "skill") ?? [];
  const vibes = result?.requirements.filter((r) => r.type === "vibe") ?? [];
  const vibePercent = result
    ? Math.round((vibes.length / result.requirements.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-zinc-900 mb-1">CV vs Job Spec</h1>
        <p className="text-zinc-500 mb-8">Find out if it&apos;s worth applying — or just a reword job.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Your CV</label>
            <textarea
              className="w-full h-64 p-3 rounded-lg border border-zinc-300 text-sm text-zinc-800 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-400"
              placeholder="Paste your CV here..."
              value={cv}
              onChange={(e) => setCv(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Job Spec</label>
            <textarea
              className="w-full h-64 p-3 rounded-lg border border-zinc-300 text-sm text-zinc-800 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-400"
              placeholder="Paste the job description here..."
              value={jobSpec}
              onChange={(e) => setJobSpec(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={analyse}
          disabled={loading || !cv.trim() || !jobSpec.trim()}
          className="w-full py-3 rounded-lg bg-zinc-900 text-white font-medium text-sm hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mb-8"
        >
          {loading ? "Analysing..." : "Analyse"}
        </button>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Score row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-zinc-200 p-5 text-center">
                <div className={`text-5xl font-bold ${matchColor}`}>{result.matchPercent}%</div>
                <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">Overall match</div>
              </div>
              <div className="bg-white rounded-xl border border-zinc-200 p-5 text-center">
                <div className="text-5xl font-bold text-purple-600">{vibePercent}%</div>
                <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">Spec is vibes</div>
              </div>
              <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col justify-center">
                <p className="text-sm text-zinc-700 italic">&ldquo;{result.summary}&rdquo;</p>
              </div>
            </div>

            {/* Easy wins */}
            {result.easyWins.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h2 className="font-semibold text-amber-900 mb-3">Easy wins — just reword your CV</h2>
                <ul className="space-y-2">
                  {result.easyWins.map((w, i) => (
                    <li key={i} className="flex gap-2 text-sm text-amber-800">
                      <span className="mt-0.5">✏️</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Genuine gaps */}
            {result.genuineGaps.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h2 className="font-semibold text-red-900 mb-3">Genuine gaps</h2>
                <ul className="space-y-2">
                  {result.genuineGaps.map((g, i) => (
                    <li key={i} className="flex gap-2 text-sm text-red-800">
                      <span className="mt-0.5">❌</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills breakdown */}
            {skills.length > 0 && (
              <div className="bg-white rounded-xl border border-zinc-200 p-5">
                <h2 className="font-semibold text-zinc-900 mb-4">Real requirements</h2>
                <div className="space-y-3">
                  {skills.map((r, i) => {
                    const s = statusConfig[r.status];
                    return (
                      <div key={i} className={`rounded-lg p-3 ${s.bg}`}>
                        <div className="flex items-start gap-2">
                          <span className={`inline-block mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${s.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-semibold uppercase tracking-wide ${s.text}`}>{s.label}</span>
                            </div>
                            <p className={`text-sm font-medium mt-0.5 ${s.text}`}>{r.text}</p>
                            {r.note && <p className={`text-xs mt-1 ${s.text} opacity-80`}>{r.note}</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Vibes breakdown */}
            {vibes.length > 0 && (
              <div className="bg-white rounded-xl border border-zinc-200 p-5">
                <h2 className="font-semibold text-zinc-900 mb-1">Vibes &amp; fluff</h2>
                <p className="text-xs text-zinc-500 mb-4">These are subjective — if you can say them with a straight face, add them.</p>
                <div className="flex flex-wrap gap-2">
                  {vibes.map((r, i) => {
                    const t = typeConfig[r.type];
                    return (
                      <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ${t.bg} ${t.text}`}>
                        {r.text}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
