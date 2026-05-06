import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { allTemplates } from "@/templates";
import { useCV } from "@/contexts/cv-context";
import { previewCVData } from "@/lib/cv-data";
import { LayoutTemplate, Check } from "lucide-react";

const CATEGORIES = ["All", "Classic", "Modern", "Creative", "Minimal", "Executive", "Bangladeshi"] as const;

export function TemplateSwitcherSheet() {
  const { selectedTemplateId, setSelectedTemplateId } = useCV();
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = activeCategory === "All" ? allTemplates : allTemplates.filter(t => t.category === activeCategory);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <LayoutTemplate className="w-4 h-4" />
          <span className="hidden sm:inline">Templates</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[90vw] sm:w-[600px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b shrink-0">
          <SheetTitle>Choose a Template</SheetTitle>
        </SheetHeader>
        <div className="flex gap-2 flex-wrap px-4 py-3 border-b shrink-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 gap-4 p-4">
            {filtered.map((template) => {
              const PreviewComponent = template.component;
              const isSelected = selectedTemplateId === template.id;
              return (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplateId(template.id);
                    setOpen(false);
                  }}
                  className={`group relative bg-white rounded-lg border-2 overflow-hidden transition-all text-left ${
                    isSelected ? "border-primary shadow-md" : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="aspect-[210/297] bg-gray-100 relative overflow-hidden">
                    <div
                      className="absolute bg-white origin-top-left pointer-events-none"
                      style={{ width: "210mm", height: "297mm", transform: "scale(0.175)", top: 0, left: 0 }}
                    >
                      <PreviewComponent data={previewCVData} />
                    </div>
                  </div>
                  <div className="p-2 border-t flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-xs text-gray-900 truncate">{template.name}</p>
                      <p className="text-[10px] text-gray-500">{template.category}</p>
                    </div>
                    <div className="w-4 h-4 rounded-full shrink-0 border border-gray-200" style={{ backgroundColor: template.colorSwatch }} />
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
