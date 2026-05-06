import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCV } from "@/contexts/cv-context";
import { applyHiddenFields } from "@/lib/cv-data";
import { Loader2, AlertCircle, CheckCircle, TrendingUp, Zap, Star, ChevronDown, ChevronUp } from "lucide-react";

interface ScoreSection {
  name: string;
  score: number;
  maxScore: number;
  status: "excellent" | "good" | "needs-work" | "missing";
  feedback: string;
}

interface ScoreResult {
  overallScore: number;
  grade: string;
  summary: string;
  sections: ScoreSection[];
  quickWins: string[];
  strengths: string[];
}

const STATUS_CONFIG = {
  excellent: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", bar: "bg-emerald-500", label: "Excellent" },
  good:      { color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",    bar: "bg-blue-500",    label: "Good" },
  "needs-work": { color: "text-amber-700",bg: "bg-amber-50",   border: "border-amber-200",   bar: "bg-amber-400",   label: "Needs Work" },
  missing:   { color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",     bar: "bg-red-400",     label: "Missing" },
};

function getGradeColor(score: number) {
  if (score >= 85) return "text-emerald-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 55) return "text-amber-600";
  return "text-red-600";
}

function getScoreRingColor(score: number) {
  if (score >= 85) return "#10b981";
  if (score >= 70) return "#3b82f6";
  if (score >= 55) return "#f59e0b";
  return "#ef4444";
}

function CircularScore({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getScoreRingColor(score);

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-black ${getGradeColor(score)}`}>{score}</span>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">/ 100</span>
      </div>
    </div>
  );
}

function SectionRow({ section }: { section: ScoreSection }) {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[section.status];
  const pct = Math.round((section.score / section.maxScore) * 100);

  return (
    <div className={`border rounded-lg overflow-hidden ${config.border}`}>
      <button
        className={`w-full flex items-center justify-between px-4 py-3 text-left hover:opacity-90 transition-opacity ${config.bg}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className={`text-sm font-semibold truncate ${config.color}`}>{section.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${config.color} ${config.bg} ${config.border}`}>{config.label}</span>
                <span className={`text-sm font-bold ${config.color}`}>{section.score}/{section.maxScore}</span>
              </div>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden w-full">
              <div
                className={`h-full rounded-full transition-all duration-700 ${config.bar}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          {expanded ? <ChevronUp className={`w-4 h-4 ml-2 shrink-0 ${config.color}`} /> : <ChevronDown className={`w-4 h-4 ml-2 shrink-0 ${config.color}`} />}
        </div>
      </button>
      {expanded && (
        <div className={`px-4 py-3 text-sm text-gray-700 border-t ${config.border} bg-white`}>
          {section.feedback}
        </div>
      )}
    </div>
  );
}

export function CvScoreDialog() {
  const { cvData } = useCV();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const handleScore = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const previewData = applyHiddenFields(cvData);
      const res = await fetch(`${import.meta.env.BASE_URL}api/cv/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData: previewData }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error || `Server error ${res.status}`);
      }
      const data = await res.json() as { result: ScoreResult };
      setResult(data.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (v: boolean) => {
    if (!v) {
      setTimeout(() => { setResult(null); setError(null); }, 300);
    }
    setOpen(v);
    if (v && !result) {
      handleScore();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800">
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">CV Score</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-5 pb-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            CV Score
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-0.5">ATS analysis & improvement suggestions for your current CV.</p>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="px-6 py-5 space-y-5">
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                <p className="text-sm font-medium text-gray-600">Analyzing your CV...</p>
                <p className="text-xs text-gray-400 text-center max-w-xs">Checking completeness, ATS compatibility, and content quality across 7 dimensions.</p>
              </div>
            )}

            {error && !loading && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 w-full">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
                <Button onClick={handleScore} variant="outline" className="gap-2">
                  <TrendingUp className="w-4 h-4" /> Try Again
                </Button>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-5">
                {/* Score Circle */}
                <div className="text-center space-y-3">
                  <CircularScore score={result.overallScore} />
                  <div>
                    <div className={`text-2xl font-black ${getGradeColor(result.overallScore)}`}>Grade: {result.grade}</div>
                    {result.summary && <p className="text-sm text-gray-600 mt-1 max-w-sm mx-auto">{result.summary}</p>}
                  </div>
                </div>

                {/* Strengths */}
                {result.strengths?.length > 0 && (
                  <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/50 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-semibold text-sm text-emerald-800">What's Working Well</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                          <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick Wins */}
                {result.quickWins?.length > 0 && (
                  <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/50 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <h3 className="font-semibold text-sm text-amber-800">Quick Wins — Do These First</h3>
                    </div>
                    <ol className="space-y-2">
                      {result.quickWins.map((w, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-amber-700">
                          <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          {w}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Section breakdown */}
                {result.sections?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-gray-700 mb-3">Section Breakdown <span className="text-gray-400 font-normal">(click to expand)</span></h3>
                    {result.sections.map((section) => (
                      <SectionRow key={section.name} section={section} />
                    ))}
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full gap-2 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                  onClick={handleScore}
                >
                  <TrendingUp className="w-4 h-4" /> Re-analyze CV
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
