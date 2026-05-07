import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { allTemplates, TemplateDefinition } from "@/templates";
import { useCV } from "@/contexts/cv-context";
import { previewCVData } from "@/lib/cv-data";
import { LayoutTemplate, Check, Eye, X, ChevronRight } from "lucide-react";

const CATEGORIES = ["All", "Classic", "Modern", "Creative", "Minimal", "Executive", "Bangladeshi"] as const;

function FullPreviewModal({
  template,
  onClose,
  onSelect,
}: {
  template: TemplateDefinition;
  onClose: () => void;
  onSelect: () => void;
}) {
  const PreviewComponent = template.component;
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-gray-900/95">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-4 h-4 rounded-full shrink-0 border border-gray-500" style={{ backgroundColor: template.colorSwatch }} />
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{template.name}</p>
            <p className="text-gray-400 text-xs">{template.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" onClick={onSelect} className="gap-1.5 text-xs bg-white text-gray-900 hover:bg-gray-100">
            Use This Template <ChevronRight className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:text-gray-300 hover:bg-gray-800 h-8 w-8">
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

export function TemplateSwitcherSheet() {
  const { selectedTemplateId, setSelectedTemplateId } = useCV();
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);

  const filtered = activeCategory === "All" ? allTemplates : allTemplates.filter(t => t.category === activeCategory);

  const handleSelect = (id: string) => {
    setSelectedTemplateId(id);
    setPreviewTemplate(null);
    setOpen(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <LayoutTemplate className="w-4 h-4" />
            <span className="hidden sm:inline">Templates</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[92vw] sm:w-[620px] p-0 flex flex-col">
          <SheetHeader className="p-4 border-b shrink-0">
            <SheetTitle>Choose a Template</SheetTitle>
          </SheetHeader>
          <div className="flex gap-1.5 flex-wrap px-4 py-3 border-b shrink-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors touch-manipulation ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 active:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 gap-3 p-3 sm:p-4">
              {filtered.map((template) => {
                const PreviewComponent = template.component;
                const isSelected = selectedTemplateId === template.id;
                return (
                  <div
                    key={template.id}
                    className={`group relative bg-white rounded-lg border-2 overflow-hidden transition-all flex flex-col ${
                      isSelected ? "border-primary shadow-md" : "border-gray-200"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {/* Thumbnail */}
                    <div className="aspect-[210/297] bg-gray-100 relative overflow-hidden">
                      <div
                        className="absolute bg-white origin-top-left pointer-events-none"
                        style={{ width: "210mm", height: "297mm", transform: "scale(0.175)", top: 0, left: 0 }}
                      >
                        <PreviewComponent data={previewCVData} />
                      </div>
                    </div>
                    {/* Footer */}
                    <div className="p-2 border-t flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-1 min-w-0">
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-gray-900 truncate">{template.name}</p>
                          <p className="text-[10px] text-gray-500">{template.category}</p>
                        </div>
                        <div className="w-4 h-4 rounded-full shrink-0 border border-gray-200" style={{ backgroundColor: template.colorSwatch }} />
                      </div>
                      {/* Action buttons — always visible, touch-friendly */}
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="flex items-center justify-center gap-1 text-[10px] font-medium py-1.5 rounded border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                        >
                          <Eye className="w-3 h-3" /> Preview
                        </button>
                        <button
                          onClick={() => handleSelect(template.id)}
                          className={`flex items-center justify-center gap-1 text-[10px] font-medium py-1.5 rounded transition-colors touch-manipulation ${
                            isSelected
                              ? "bg-primary/10 text-primary border border-primary/30"
                              : "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80"
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          {isSelected ? "Selected" : "Use"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Full-screen preview overlay (above the sheet) */}
      {previewTemplate && (
        <FullPreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={() => handleSelect(previewTemplate.id)}
        />
      )}
    </>
  );
}
