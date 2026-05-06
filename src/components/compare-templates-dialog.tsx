import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { allTemplates } from "@/templates";
import { useCV } from "@/contexts/cv-context";
import { applyHiddenFields } from "@/lib/cv-data";
import { Columns2, ChevronDown, Check } from "lucide-react";

const CATEGORIES = ["All", "Classic", "Modern", "Creative", "Minimal", "Executive", "Bangladeshi"] as const;

function TemplatePicker({ label, selectedId, onSelect, excludeId }: { label: string; selectedId: string; onSelect: (id: string) => void; excludeId?: string }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("All");

  const filtered = (category === "All" ? allTemplates : allTemplates.filter(t => t.category === category))
    .filter(t => t.id !== excludeId);

  const selected = allTemplates.find(t => t.id === selectedId);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-xs px-2 py-1 border rounded hover:bg-gray-50 transition-colors"
        >
          <span className="w-3 h-3 rounded-full inline-block border border-gray-200" style={{ backgroundColor: selected?.colorSwatch }} />
          {selected?.name || "Pick template"}
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
      {open && (
        <div className="border rounded-lg bg-white shadow-lg z-20 absolute mt-8 right-0 w-72">
          <div className="flex gap-1 flex-wrap p-2 border-b">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                  category === cat ? "bg-primary text-primary-foreground border-primary" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <ScrollArea className="h-64">
            <div className="p-2 space-y-1">
              {filtered.map(t => (
                <button
                  key={t.id}
                  onClick={() => { onSelect(t.id); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-left text-xs hover:bg-gray-50 transition-colors ${selectedId === t.id ? "bg-primary/10" : ""}`}
                >
                  <span className="w-4 h-4 rounded-full shrink-0 border border-gray-200" style={{ backgroundColor: t.colorSwatch }} />
                  <span className="flex-1 font-medium">{t.name}</span>
                  {selectedId === t.id && <Check className="w-3 h-3 text-primary" />}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

export function CompareTemplatesDialog() {
  const { cvData, selectedTemplateId, setSelectedTemplateId } = useCV();
  const [open, setOpen] = useState(false);
  const [leftId, setLeftId] = useState(selectedTemplateId);
  const [rightId, setRightId] = useState(() => {
    const others = allTemplates.filter(t => t.id !== selectedTemplateId);
    return others[0]?.id || allTemplates[0]?.id;
  });

  const previewData = applyHiddenFields(cvData);

  const LeftTemplate = allTemplates.find(t => t.id === leftId)?.component;
  const RightTemplate = allTemplates.find(t => t.id === rightId)?.component;
  const leftTemplateDef = allTemplates.find(t => t.id === leftId);
  const rightTemplateDef = allTemplates.find(t => t.id === rightId);

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (v) {
      setLeftId(selectedTemplateId);
      const others = allTemplates.filter(t => t.id !== selectedTemplateId);
      setRightId(others[0]?.id || allTemplates[0]?.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Columns2 className="w-4 h-4" />
          <span className="hidden sm:inline">Compare</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Compare Templates Side by Side</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="grid grid-cols-2 gap-0 border-b shrink-0">
            <div className="px-6 py-3 border-r relative">
              <TemplatePicker label="Left Template" selectedId={leftId} onSelect={setLeftId} excludeId={rightId} />
            </div>
            <div className="px-6 py-3 relative">
              <TemplatePicker label="Right Template" selectedId={rightId} onSelect={setRightId} excludeId={leftId} />
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-gray-100">
            <div className="grid grid-cols-2 gap-0 min-h-full">
              <div className="border-r bg-gray-50 flex flex-col">
                <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
                  <div
                    className="bg-white shadow-lg origin-top-left"
                    style={{ width: "210mm", height: "297mm", transform: "scale(0.55)", transformOrigin: "top center", marginBottom: "calc(297mm * 0.55 - 297mm)" }}
                  >
                    {LeftTemplate && <LeftTemplate data={previewData} />}
                  </div>
                </div>
                {leftTemplateDef && (
                  <div className="p-3 border-t bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: leftTemplateDef.colorSwatch }} />
                      <span className="font-semibold text-sm">{leftTemplateDef.name}</span>
                      <span className="text-xs text-gray-500">{leftTemplateDef.category}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => { setSelectedTemplateId(leftId); setOpen(false); }}
                      variant={selectedTemplateId === leftId ? "default" : "outline"}
                    >
                      {selectedTemplateId === leftId ? "Current" : "Use This"}
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
                  <div
                    className="bg-white shadow-lg"
                    style={{ width: "210mm", height: "297mm", transform: "scale(0.55)", transformOrigin: "top center", marginBottom: "calc(297mm * 0.55 - 297mm)" }}
                  >
                    {RightTemplate && <RightTemplate data={previewData} />}
                  </div>
                </div>
                {rightTemplateDef && (
                  <div className="p-3 border-t bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: rightTemplateDef.colorSwatch }} />
                      <span className="font-semibold text-sm">{rightTemplateDef.name}</span>
                      <span className="text-xs text-gray-500">{rightTemplateDef.category}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => { setSelectedTemplateId(rightId); setOpen(false); }}
                      variant={selectedTemplateId === rightId ? "default" : "outline"}
                    >
                      {selectedTemplateId === rightId ? "Current" : "Use This"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
