import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { allTemplates, TemplateDefinition } from "@/templates";
import { Button } from "@/components/ui/button";
import { useCV } from "@/contexts/cv-context";
import { previewCVData } from "@/lib/cv-data";
import { FileText, Eye, X, ChevronRight, Search } from "lucide-react";

const CATEGORIES = ["All", "Classic", "Modern", "Creative", "Minimal", "Executive", "Bangladeshi"] as const;

function TemplatePreviewModal({
  template,
  onClose,
  onUse,
}: {
  template: TemplateDefinition;
  onClose: () => void;
  onUse: () => void;
}) {
  const PreviewComponent = template.component;
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-gray-900/95"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gray-900 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-4 h-4 rounded-full shrink-0 border border-gray-500" style={{ backgroundColor: template.colorSwatch }} />
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{template.name}</p>
            <p className="text-gray-400 text-xs">{template.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" onClick={onUse} className="gap-1.5 text-xs bg-white text-gray-900 hover:bg-gray-100">
            Use Template <ChevronRight className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:text-gray-300 hover:bg-gray-800 h-8 w-8 shrink-0">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex items-start justify-center p-4 sm:p-8">
        <div className="bg-white shadow-2xl w-full max-w-[210mm]" style={{ minHeight: "297mm" }}>
          <PreviewComponent data={previewCVData} />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { setSelectedTemplateId } = useCV();
  const [, navigate] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);

  const filtered = useMemo(() => {
    let list = activeCategory === "All"
      ? allTemplates
      : allTemplates.filter((t) => t.category === activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  const handleUseTemplate = (id: string) => {
    setSelectedTemplateId(id);
    setPreviewTemplate(null);
    navigate("/editor");
  };

  const bdCount = allTemplates.filter(t => t.category === "Bangladeshi").length;
  const totalCount = allTemplates.length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
              CV
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight truncate">CV Builder</span>
          </div>
          <Link href="/editor">
            <Button className="gap-1.5 h-9 text-sm" size="sm">
              <FileText className="w-4 h-4" />
              <span className="hidden xs:inline">Go to Editor</span>
              <span className="xs:hidden">Editor</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto pt-10 sm:pt-14 mb-8 sm:mb-10 px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-3 leading-tight">
            Build a Professional CV in Minutes
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-2">
            <span className="font-semibold text-primary">{totalCount} templates</span> including{" "}
            <span className="font-semibold text-primary">{bdCount} Bangladeshi</span> designs.
            Tap <strong>Preview</strong> to see full-size, then <strong>Use</strong> to start editing.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-lg mx-auto mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by name or category…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category filter — hidden when searching */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mb-6 sm:mb-8">
            {CATEGORIES.map((cat) => {
              const count = cat === "All"
                ? allTemplates.length
                : allTemplates.filter(t => t.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1.5 rounded-full border font-medium transition-colors touch-manipulation ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 active:bg-gray-100"
                  }`}
                >
                  {cat}
                  <span className={`text-[10px] font-bold px-1 rounded-full ${activeCategory === cat ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Results summary when searching */}
        {searchQuery && (
          <p className="text-center text-sm text-gray-500 mb-6">
            {filtered.length === 0
              ? `No templates found for "${searchQuery}"`
              : `${filtered.length} template${filtered.length !== 1 ? "s" : ""} found for "${searchQuery}"`}
          </p>
        )}

        {/* Template grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map((template) => {
              const PreviewComponent = template.component;
              return (
                <div
                  key={template.id}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-all duration-200"
                >
                  {/* Thumbnail */}
                  <div className="aspect-[210/297] bg-gray-100 relative overflow-hidden">
                    <div
                      className="absolute bg-white origin-top-left pointer-events-none"
                      style={{
                        width: "210mm",
                        height: "297mm",
                        transform: "scale(0.175)",
                        top: 0,
                        left: 0,
                      }}
                    >
                      <PreviewComponent data={previewCVData} />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 pointer-events-none" />
                  </div>

                  {/* Card footer — always visible, touch-friendly */}
                  <div className="p-2 sm:p-2.5 border-t border-gray-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-1 min-w-0">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-[11px] sm:text-xs truncate leading-tight">{template.name}</h3>
                        <p className="text-[9px] sm:text-[10px] text-gray-500">{template.category}</p>
                      </div>
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full shrink-0 border border-gray-200" style={{ backgroundColor: template.colorSwatch }} />
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-medium py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                      >
                        <Eye className="w-3 h-3 shrink-0" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleUseTemplate(template.id)}
                        className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-medium py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-colors touch-manipulation"
                      >
                        <FileText className="w-3 h-3 shrink-0" />
                        Use
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No templates found</h3>
            <p className="text-gray-500 text-sm mb-4">Try a different search or browse all categories</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="text-sm text-primary font-medium hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={() => handleUseTemplate(previewTemplate.id)}
        />
      )}
    </div>
  );
}
