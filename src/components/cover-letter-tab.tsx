import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCV } from "@/contexts/cv-context";
import { applyHiddenFields } from "@/lib/cv-data";
import { Loader2, AlertCircle, Copy, Check, Download, Mail, Wand2 } from "lucide-react";
import { Document, Paragraph, TextRun, Packer, AlignmentType } from "docx";
import { saveAs } from "file-saver";

const TONES = [
  { value: "professional", label: "Professional", desc: "Formal & confident" },
  { value: "friendly", label: "Friendly", desc: "Warm & personable" },
  { value: "enthusiastic", label: "Enthusiastic", desc: "Energetic & passionate" },
];

async function downloadCoverLetterDocx(letter: string, name: string) {
  const paragraphs = letter.split(/\n+/).filter(Boolean).map(
    (line) =>
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 200 },
        children: [new TextRun({ text: line, size: 24, font: "Calibri" })],
      })
  );

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `cover-letter-${name.replace(/\s+/g, "-").toLowerCase() || "download"}.docx`);
}

export function CoverLetterTab() {
  const { cvData } = useCV();

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [tone, setTone] = useState("professional");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [letter, setLetter] = useState("");
  const [copied, setCopied] = useState(false);
  const [docxLoading, setDocxLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setLetter("");
    try {
      const previewData = applyHiddenFields(cvData);
      const res = await fetch(`${import.meta.env.BASE_URL}api/cv/cover-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvData: previewData,
          jobTitle: jobTitle.trim(),
          companyName: companyName.trim(),
          recipientName: recipientName.trim(),
          tone,
          additionalNotes: additionalNotes.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error || `Server error ${res.status}`);
      }
      const data = await res.json() as { letter: string };
      setLetter(data.letter || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadDocx = async () => {
    setDocxLoading(true);
    try {
      await downloadCoverLetterDocx(letter, cvData.name || "cover-letter");
    } catch {
      /* ignore */
    } finally {
      setDocxLoading(false);
    }
  };

  const wordCount = letter.trim() ? letter.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-5 pb-4">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-violet-50 border border-violet-200 rounded-xl">
        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
          <Mail className="w-4 h-4 text-violet-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-violet-900">AI Cover Letter Generator</p>
          <p className="text-xs text-violet-600 mt-0.5">Fill in the role details below and the AI will write a tailored cover letter using your CV data.</p>
        </div>
      </div>

      {/* Role details */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role Details</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="cl-jobtitle" className="text-sm">Job Title <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Input
              id="cl-jobtitle"
              placeholder="e.g. Senior Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cl-company" className="text-sm">Company Name <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Input
              id="cl-company"
              placeholder="e.g. Acme Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cl-recipient" className="text-sm">Recipient Name <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Input
              id="cl-recipient"
              placeholder="e.g. Sarah Johnson (leave blank for 'Hiring Manager')"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tone selector */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tone</h3>
        <div className="grid grid-cols-3 gap-2">
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTone(t.value)}
              className={`p-3 rounded-lg border text-left transition-all ${
                tone === t.value
                  ? "border-violet-500 bg-violet-50 ring-1 ring-violet-500"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <p className={`text-xs font-semibold ${tone === t.value ? "text-violet-700" : "text-gray-700"}`}>{t.label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Additional notes */}
      <div className="space-y-1.5">
        <Label htmlFor="cl-notes" className="text-sm">Additional Context <span className="text-gray-400 font-normal">(optional)</span></Label>
        <Textarea
          id="cl-notes"
          placeholder="e.g. I'm particularly excited about their AI products team, or mention my 5 years in fintech..."
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          rows={2}
          className="text-sm resize-none"
        />
      </div>

      {/* Generate button */}
      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
        {loading ? "Writing your cover letter..." : letter ? "Regenerate Cover Letter" : "Generate Cover Letter"}
      </Button>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated letter */}
      {letter && !loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Generated Letter</h3>
            <span className="text-xs text-gray-400">{wordCount} words</span>
          </div>
          <Textarea
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            rows={16}
            className="text-sm font-mono leading-relaxed resize-y"
          />
          <p className="text-xs text-gray-400 text-center">You can edit the letter directly above before copying or downloading.</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-2 text-violet-700 border-violet-200 hover:bg-violet-50"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Text"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2 text-gray-700 border-gray-200 hover:bg-gray-50"
              onClick={handleDownloadDocx}
              disabled={docxLoading}
            >
              {docxLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Download DOCX
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
