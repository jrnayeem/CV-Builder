import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCV } from "@/contexts/cv-context";
import { Sparkles, Loader2, CheckCircle, ChevronRight, AlertCircle, Copy, Check, Lightbulb, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GenerateResult {
  suggestedJobTitle: string;
  suggestedObjective: string;
  matchingSkills: string[];
  missingSkills: string[];
  keywordsToUse: string[];
  tips: string[];
}

export function GenerateFromJobDialog() {
  const { cvData, updateCV } = useCV();
  const [open, setOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (jobDescription.trim().length < 20) {
      setError("Please paste a longer job description (at least 20 characters).");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setApplied(new Set());

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/cv/generate-from-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          currentCV: {
            name: cvData.name,
            jobTitle: cvData.jobTitle,
            objective: cvData.objective,
            skills: cvData.skills,
            experience: cvData.experience,
          },
        }),
      });

      const body = await res.json().catch(() => ({})) as { error?: string; result?: GenerateResult; setup_required?: boolean };
      if (!res.ok) {
        if (body.setup_required) {
          throw new Error("__setup__");
        }
        throw new Error(body.error || `Server error ${res.status}`);
      }
      setResult(body.result!);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      setError(msg === "__setup__" ? "setup_required" : msg);
    } finally {
      setLoading(false);
    }
  };

  const applyJobTitle = () => {
    if (!result) return;
    updateCV({ jobTitle: result.suggestedJobTitle });
    setApplied(p => new Set([...p, "jobTitle"]));
  };

  const applyObjective = () => {
    if (!result) return;
    updateCV({ objective: result.suggestedObjective });
    setApplied(p => new Set([...p, "objective"]));
  };

  const applyMatchingSkills = () => {
    if (!result) return;
    const existingNames = new Set(cvData.skills.map(s => s.name.toLowerCase()));
    const newSkills = result.matchingSkills
      .filter(name => !existingNames.has(name.toLowerCase()))
      .map(name => ({ id: Date.now().toString() + Math.random(), name, level: 4 }));
    if (newSkills.length > 0) {
      updateCV({ skills: [...cvData.skills, ...newSkills] });
    }
    setApplied(p => new Set([...p, "skills"]));
  };

  const copyKeyword = async (kw: string) => {
    await navigator.clipboard.writeText(kw).catch(() => {});
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(null), 1500);
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      setTimeout(() => {
        setResult(null);
        setError(null);
        setJobDescription("");
        setApplied(new Set());
      }, 300);
    }
    setOpen(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white border-0">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">AI Generate</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-5 pb-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-600" />
            </div>
            Generate from Job Description
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-0.5">
            Paste a job posting and AI will suggest a tailored objective, highlight matching skills, and give you actionable tips.
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="px-6 py-5 space-y-5">
            {!result ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Job Description</Label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => { setJobDescription(e.target.value); setError(null); }}
                    placeholder="Paste the full job description here — job title, responsibilities, requirements, etc."
                    className="h-56 text-sm resize-none"
                  />
                  <p className="text-xs text-gray-400">The more detail you paste, the better the suggestions.</p>
                </div>

                {error && error === "setup_required" ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-4 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-amber-800 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      AI features need an OpenAI API key
                    </div>
                    <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
                      <li>Go to <strong>platform.openai.com/api-keys</strong> and create a key</li>
                      <li>Open your <strong>Netlify dashboard → Site settings → Environment variables</strong></li>
                      <li>Add a variable named <strong>OPENAI_API_KEY</strong> with your key</li>
                      <li>Click <strong>Deploy site</strong> (or trigger a redeploy)</li>
                    </ol>
                  </div>
                ) : error ? (
                  <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                ) : null}

                <Button
                  onClick={handleGenerate}
                  disabled={loading || jobDescription.trim().length < 20}
                  className="w-full gap-2 bg-violet-600 hover:bg-violet-700 h-11 text-base"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing job description...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generate Suggestions</>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>AI analysis complete — apply the suggestions you like, then close.</span>
                </div>

                {/* Job Title */}
                {result.suggestedJobTitle && (
                  <div className="border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-violet-500" />
                        <h3 className="font-semibold text-sm">Suggested Job Title</h3>
                      </div>
                      <Button
                        size="sm"
                        variant={applied.has("jobTitle") ? "secondary" : "outline"}
                        className="gap-1.5 h-7 text-xs"
                        onClick={applyJobTitle}
                        disabled={applied.has("jobTitle")}
                      >
                        {applied.has("jobTitle") ? <><CheckCircle className="w-3 h-3 text-green-600" /> Applied</> : <><ChevronRight className="w-3 h-3" /> Apply</>}
                      </Button>
                    </div>
                    <div className={`text-sm font-medium px-3 py-2 rounded-lg border ${applied.has("jobTitle") ? "bg-green-50 border-green-200 text-green-800" : "bg-gray-50 border-gray-200"}`}>
                      {result.suggestedJobTitle}
                    </div>
                    {applied.has("jobTitle") && <p className="text-xs text-green-600">✓ Job title updated in your CV</p>}
                  </div>
                )}

                {/* Objective */}
                {result.suggestedObjective && (
                  <div className="border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-violet-500" />
                        <h3 className="font-semibold text-sm">Tailored Career Objective</h3>
                      </div>
                      <Button
                        size="sm"
                        variant={applied.has("objective") ? "secondary" : "outline"}
                        className="gap-1.5 h-7 text-xs"
                        onClick={applyObjective}
                        disabled={applied.has("objective")}
                      >
                        {applied.has("objective") ? <><CheckCircle className="w-3 h-3 text-green-600" /> Applied</> : <><ChevronRight className="w-3 h-3" /> Apply</>}
                      </Button>
                    </div>
                    <p className={`text-sm leading-relaxed px-3 py-2 rounded-lg border ${applied.has("objective") ? "bg-green-50 border-green-200 text-green-800" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
                      {result.suggestedObjective}
                    </p>
                    {applied.has("objective") && <p className="text-xs text-green-600">✓ Career objective updated in your CV</p>}
                  </div>
                )}

                {/* Matching Skills */}
                {result.matchingSkills?.length > 0 && (
                  <div className="border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <h3 className="font-semibold text-sm">Skills to Highlight</h3>
                        <span className="text-xs text-gray-400">(add these to your skills section)</span>
                      </div>
                      <Button
                        size="sm"
                        variant={applied.has("skills") ? "secondary" : "outline"}
                        className="gap-1.5 h-7 text-xs"
                        onClick={applyMatchingSkills}
                        disabled={applied.has("skills")}
                      >
                        {applied.has("skills") ? <><CheckCircle className="w-3 h-3 text-green-600" /> Added</> : <><ChevronRight className="w-3 h-3" /> Add All</>}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.matchingSkills.map(skill => (
                        <span key={skill} className={`text-xs px-2.5 py-1 rounded-full font-medium border ${applied.has("skills") ? "bg-green-50 border-green-200 text-green-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    {applied.has("skills") && <p className="text-xs text-green-600">✓ New skills added to your CV (duplicates skipped)</p>}
                  </div>
                )}

                {/* Missing Skills */}
                {result.missingSkills?.length > 0 && (
                  <div className="border border-amber-200 rounded-xl p-4 space-y-3 bg-amber-50/40">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <h3 className="font-semibold text-sm text-amber-800">Skills Gap</h3>
                      <span className="text-xs text-amber-600">(consider developing these)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.missingSkills.map(skill => (
                        <span key={skill} className="text-xs px-2.5 py-1 rounded-full font-medium bg-white border border-amber-300 text-amber-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords */}
                {result.keywordsToUse?.length > 0 && (
                  <div className="border rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      <h3 className="font-semibold text-sm">Keywords to Use</h3>
                      <span className="text-xs text-gray-400">(click to copy into your descriptions)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.keywordsToUse.map(kw => (
                        <button
                          key={kw}
                          onClick={() => copyKeyword(kw)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-100 transition-colors"
                        >
                          {copiedKeyword === kw ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {result.tips?.length > 0 && (
                  <div className="border rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <h3 className="font-semibold text-sm">Actionable Tips</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <span className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => { setResult(null); setError(null); setApplied(new Set()); }}
                >
                  <Sparkles className="w-4 h-4" /> Try a Different Job Description
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
