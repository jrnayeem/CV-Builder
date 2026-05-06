import { Link } from "wouter";
import { allTemplates } from "@/templates";
import { Button } from "@/components/ui/button";
import { useCV } from "@/contexts/cv-context";
import { previewCVData } from "@/lib/cv-data";
import { FileText } from "lucide-react";

export default function Home() {
  const { setSelectedTemplateId } = useCV();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              CV
            </div>
            <span className="text-xl font-bold tracking-tight">CV Builder</span>
          </div>
          <Link href="/editor">
            <Button className="gap-2">
              <FileText className="w-4 h-4" />
              Go to Editor
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Build a Professional CV in Minutes
          </h1>
          <p className="text-xl text-gray-600">
            Choose from beautifully designed templates. Add custom sections, compare templates side-by-side, and export to PDF or DOCX.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {allTemplates.map((template) => {
            const PreviewComponent = template.component;
            return (
              <div key={template.id} className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="aspect-[210/297] bg-gray-100 relative overflow-hidden">
                  <div
                    className="absolute bg-white origin-top-left"
                    style={{ width: "210mm", height: "297mm", transform: "scale(0.18)", top: 0, left: 0 }}
                  >
                    <PreviewComponent data={previewCVData} />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Link href="/editor">
                      <Button
                        onClick={() => setSelectedTemplateId(template.id)}
                        className="scale-90 group-hover:scale-100 transition-transform"
                      >
                        Use Template
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between border-t border-gray-100">
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.category}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full shadow-inner border border-gray-200" style={{ backgroundColor: template.colorSwatch }} />
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
