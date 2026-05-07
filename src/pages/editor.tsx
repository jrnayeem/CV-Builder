import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "wouter";
import { useCV } from "@/contexts/cv-context";
import { getTemplateById } from "@/templates";
import { applyHiddenFields, sampleCVData, CustomSectionItem } from "@/lib/cv-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Home,
  Download,
  Eye,
  EyeOff,
  FileText,
  Mail,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  PenLine,
  Maximize2,
  X,
  SlidersHorizontal,
  GripVertical,
} from "lucide-react";
import { downloadDocx } from "@/lib/docx-generator";
import { TemplateSwitcherSheet } from "@/components/template-switcher-sheet";
import { CompareTemplatesDialog } from "@/components/compare-templates-dialog";
import { GenerateFromJobDialog } from "@/components/generate-from-job-dialog";
import { CvScoreDialog } from "@/components/cv-score-dialog";
import { CoverLetterTab } from "@/components/cover-letter-tab";
import { ColorThemePicker } from "@/components/color-theme-picker";
import { SignaturePad } from "@/components/signature-pad";

/* ─── Drag helpers ─── */
function reorder<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
}

function useDragList() {
  const dragFrom = useRef<number | null>(null);
  const dragTo   = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  function dragProps(idx: number, onDrop: (from: number, to: number) => void) {
    return {
      draggable: true as const,
      onDragStart: () => { dragFrom.current = idx; setDragging(true); },
      onDragEnter: () => { dragTo.current = idx; setOverIdx(idx); },
      onDragOver:  (e: React.DragEvent) => e.preventDefault(),
      onDragEnd:   () => {
        if (dragFrom.current !== null && dragTo.current !== null && dragFrom.current !== dragTo.current) {
          onDrop(dragFrom.current, dragTo.current);
        }
        dragFrom.current = null;
        dragTo.current   = null;
        setDragging(false);
        setOverIdx(null);
      },
    };
  }

  return { dragging, overIdx, dragProps };
}

export default function Editor() {
  const {
    cvData,
    updateCV,
    setCvData,
    selectedTemplateId,
    toggleField,
    isFieldHidden,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    customTheme,
  } = useCV();

  const template = getTemplateById(selectedTemplateId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [docxLoading, setDocxLoading] = useState(false);
  const [newSectionDialogOpen, setNewSectionDialogOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [fullscreenPreview, setFullscreenPreview] = useState(false);

  const TemplateComponent = template?.component || (() => <div>Template not found</div>);
  const previewData = applyHiddenFields(cvData);

  /* ── PDF via browser print with auto-scale to fit A4 ── */
  const handleDownloadPDF = () => {
    const container = document.getElementById("cv-print-container");
    let scaledDown = false;
    if (container) {
      const inner = container.firstElementChild as HTMLElement | null;
      if (inner) {
        const savedH = inner.style.height;
        const savedOv = inner.style.overflow;
        inner.style.height = "auto";
        inner.style.overflow = "visible";
        const naturalH = inner.scrollHeight;
        inner.style.height = savedH;
        inner.style.overflow = savedOv;
        const PAGE_PX = 297 * 3.7795;
        if (naturalH > PAGE_PX * 1.01) {
          const scale = PAGE_PX / naturalH;
          inner.style.transform = `scale(${scale})`;
          inner.style.transformOrigin = "top left";
          inner.style.height = `${naturalH}px`;
          inner.style.overflow = "visible";
          scaledDown = true;
        }
      }
    }
    window.print();
    setTimeout(() => {
      if (scaledDown && container) {
        const inner = container.firstElementChild as HTMLElement | null;
        if (inner) {
          inner.style.transform = "";
          inner.style.transformOrigin = "";
          inner.style.height = "";
          inner.style.overflow = "";
        }
      }
    }, 2000);
  };

  const handleDownloadDocx = async () => {
    setDocxLoading(true);
    try {
      const filename = (previewData.name || "CV").replace(/\s+/g, "_");
      await downloadDocx(previewData, filename);
    } finally { setDocxLoading(false); }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { updateCV({ photo: reader.result as string }); };
      reader.readAsDataURL(file);
    }
  };

  /* ── Drag lists ── */
  const expDrag  = useDragList();
  const eduDrag  = useDragList();
  const skillDrag = useDragList();
  const langDrag  = useDragList();
  const refDrag   = useDragList();
  const secDrag   = useDragList();

  /* ── Helpers ── */
  const FieldLabel = ({ label, fieldKey }: { label: string; fieldKey: string }) => {
    const hidden = isFieldHidden(fieldKey);
    return (
      <div className="flex items-center justify-between">
        <Label className={`text-xs ${hidden ? "text-gray-400" : ""}`}>{label}</Label>
        <button
          type="button"
          onClick={() => toggleField(fieldKey)}
          className={`ml-2 p-0.5 rounded transition-colors ${hidden ? "text-amber-500 hover:text-amber-700" : "text-gray-300 hover:text-gray-500"}`}
          title={hidden ? `Restore "${label}" in CV` : `Hide "${label}" from CV`}
        >
          {hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  };

  const HiddenNote = ({ fieldKey, label }: { fieldKey: string; label: string }) => (
    <button
      type="button"
      onClick={() => toggleField(fieldKey)}
      className="w-full text-left text-xs text-amber-700 bg-amber-50 border border-amber-200 border-dashed rounded px-3 py-1.5 hover:bg-amber-100 transition-colors"
    >
      <EyeOff className="inline w-3 h-3 mr-1" />
      {label} hidden — click to restore
    </button>
  );

  const SectionToggle = ({ label, fieldKey }: { label: string; fieldKey: string }) => {
    const hidden = isFieldHidden(fieldKey);
    return (
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-semibold ${hidden ? "text-gray-400" : ""}`}>{label}</h3>
        <button
          type="button"
          onClick={() => toggleField(fieldKey)}
          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors border ${hidden ? "text-amber-600 border-amber-300 bg-amber-50 hover:bg-amber-100" : "text-gray-400 border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
        >
          {hidden ? <><EyeOff className="w-3 h-3" /> Hidden</> : <><Eye className="w-3 h-3" /> Visible</>}
        </button>
      </div>
    );
  };

  const DragHandle = () => (
    <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 self-stretch flex items-center px-0.5 shrink-0" title="Drag to reorder">
      <GripVertical className="w-4 h-4" />
    </div>
  );

  const handleAddCustomSection = () => {
    if (newSectionTitle.trim()) {
      addCustomSection(newSectionTitle.trim());
      setNewSectionTitle("");
      setNewSectionDialogOpen(false);
    }
  };

  const addCustomSectionItem = (sectionId: string) => {
    const section = cvData.customSections.find(s => s.id === sectionId);
    if (!section) return;
    const newItem: CustomSectionItem = {
      id: Date.now().toString(),
      heading: "",
      subheading: "",
      date: "",
      description: "",
    };
    updateCustomSection(sectionId, { items: [...section.items, newItem] });
  };

  const updateCustomSectionItem = (sectionId: string, itemId: string, updates: Partial<CustomSectionItem>) => {
    const section = cvData.customSections.find(s => s.id === sectionId);
    if (!section) return;
    updateCustomSection(sectionId, {
      items: section.items.map(item => item.id === itemId ? { ...item, ...updates } : item),
    });
  };

  const removeCustomSectionItem = (sectionId: string, itemId: string) => {
    const section = cvData.customSections.find(s => s.id === sectionId);
    if (!section) return;
    updateCustomSection(sectionId, { items: section.items.filter(item => item.id !== itemId) });
  };

  /* ── CV Preview Pane ── */
  const CVPreviewPane = () => (
    <div className="flex-1 overflow-auto bg-gray-200 flex items-start justify-center p-4 sm:p-8">
      <div className="bg-white shadow-2xl w-full max-w-[210mm]" style={{ minHeight: "297mm" }}>
        <TemplateComponent data={previewData} theme={customTheme ?? undefined} />
      </div>
    </div>
  );

  /* ── Sidebar ── */
  const editorSidebar = (
    <div className={`w-full md:w-[420px] lg:w-[480px] flex flex-col bg-white border-r border-gray-200 shadow-sm z-10 no-print flex-shrink-0 h-full ${mobileView === "preview" ? "hidden md:flex" : "flex"}`}>
      <header className="h-14 px-3 flex items-center justify-between border-b border-gray-200 shrink-0 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Link href="/">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2 shrink-0 text-gray-600 hover:text-gray-900">
              <Home className="w-3.5 h-3.5" />
              <span className="text-xs font-medium hidden xs:inline">Home</span>
            </Button>
          </Link>
          <span className="font-semibold truncate text-sm hidden sm:block text-gray-700">
            {template?.name || "CV Editor"}
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 flex-wrap justify-end">
          <TemplateSwitcherSheet />
          <CompareTemplatesDialog />
          <GenerateFromJobDialog />
          <CvScoreDialog />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 px-2">
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-xs">Clear</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently erase everything you've entered. This cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => setCvData({ ...sampleCVData })}>
                  Yes, clear all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" size="sm" onClick={handleDownloadDocx} disabled={docxLoading} className="gap-1 text-blue-700 border-blue-200 hover:bg-blue-50 px-2">
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">{docxLoading ? "…" : "DOCX"}</span>
          </Button>
          <Button size="sm" onClick={handleDownloadPDF} className="gap-1 px-2">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">PDF</span>
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-3 md:p-5">
          <div className="mb-4">
            <ColorThemePicker />
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-4 h-auto gap-1 bg-transparent p-0 mb-4">
              <TabsTrigger value="personal"    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-gray-50 text-xs py-1.5">Personal</TabsTrigger>
              <TabsTrigger value="experience"  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-gray-50 text-xs py-1.5">Experience</TabsTrigger>
              <TabsTrigger value="education"   className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-gray-50 text-xs py-1.5">Education</TabsTrigger>
              <TabsTrigger value="skills"      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-gray-50 text-xs py-1.5">Skills</TabsTrigger>
              <TabsTrigger value="details"     className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-gray-50 text-xs py-1.5">Details</TabsTrigger>
              <TabsTrigger value="custom"      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-gray-50 text-xs py-1.5">
                <PenLine className="w-3 h-3 mr-1" />Custom
              </TabsTrigger>
              <TabsTrigger value="signature"   className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-gray-50 text-xs gap-1 py-1.5">
                <PenLine className="w-3 h-3" />Sign
              </TabsTrigger>
              <TabsTrigger value="cover-letter" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white border bg-gray-50 text-xs gap-1 py-1.5">
                <Mail className="w-3 h-3" />Letter
              </TabsTrigger>
            </TabsList>

            {/* ── PERSONAL ── */}
            <TabsContent value="personal" className="space-y-4 mt-0">
              <div className="flex items-center gap-4">
                <div className={`h-20 w-20 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50 shrink-0 ${isFieldHidden("photo") ? "border-amber-300 opacity-50" : "border-gray-300"}`}>
                  {cvData.photo && !isFieldHidden("photo") ? (
                    <img src={cvData.photo} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <Upload className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isFieldHidden("photo")}>Upload Photo</Button>
                    {cvData.photo && (
                      <Button variant="ghost" size="sm" className="text-red-500 text-xs" onClick={() => updateCV({ photo: null })}>Remove</Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">Square image works best</p>
                    <button type="button" onClick={() => toggleField("photo")} className={`p-0.5 rounded transition-colors ${isFieldHidden("photo") ? "text-amber-500 hover:text-amber-700" : "text-gray-300 hover:text-gray-500"}`}>
                      {isFieldHidden("photo") ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel label="Full Name" fieldKey="name" />
                  {isFieldHidden("name") ? <HiddenNote fieldKey="name" label="Full Name" /> : (
                    <Input value={cvData.name} onChange={(e) => updateCV({ name: e.target.value })} placeholder="Your full name" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <FieldLabel label="Job Title" fieldKey="jobTitle" />
                  {isFieldHidden("jobTitle") ? <HiddenNote fieldKey="jobTitle" label="Job Title" /> : (
                    <Input value={cvData.jobTitle} onChange={(e) => updateCV({ jobTitle: e.target.value })} placeholder="e.g. Software Engineer" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel label="Email" fieldKey="email" />
                  {isFieldHidden("email") ? <HiddenNote fieldKey="email" label="Email" /> : (
                    <Input value={cvData.email} onChange={(e) => updateCV({ email: e.target.value })} placeholder="you@email.com" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <FieldLabel label="Phone" fieldKey="phone" />
                  {isFieldHidden("phone") ? <HiddenNote fieldKey="phone" label="Phone" /> : (
                    <Input value={cvData.phone} onChange={(e) => updateCV({ phone: e.target.value })} placeholder="+1 555 000 0000" />
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <FieldLabel label="Address" fieldKey="address" />
                {isFieldHidden("address") ? <HiddenNote fieldKey="address" label="Address" /> : (
                  <Input value={cvData.address} onChange={(e) => updateCV({ address: e.target.value })} placeholder="City, Country" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel label="LinkedIn" fieldKey="linkedin" />
                  {isFieldHidden("linkedin") ? <HiddenNote fieldKey="linkedin" label="LinkedIn" /> : (
                    <Input value={cvData.linkedin} onChange={(e) => updateCV({ linkedin: e.target.value })} placeholder="linkedin.com/in/you" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <FieldLabel label="Website" fieldKey="website" />
                  {isFieldHidden("website") ? <HiddenNote fieldKey="website" label="Website" /> : (
                    <Input value={cvData.website} onChange={(e) => updateCV({ website: e.target.value })} placeholder="yourwebsite.com" />
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <SectionToggle label="Career Objective / Summary" fieldKey="objective" />
                {isFieldHidden("objective") ? <HiddenNote fieldKey="objective" label="Objective" /> : (
                  <Textarea value={cvData.objective} onChange={(e) => updateCV({ objective: e.target.value })} placeholder="Brief professional summary..." className="h-24 text-sm resize-none" />
                )}
              </div>
            </TabsContent>

            {/* ── EXPERIENCE ── */}
            <TabsContent value="experience" className="space-y-4 mt-0">
              <p className="text-xs text-gray-400 flex items-center gap-1"><GripVertical className="w-3 h-3" /> Drag the handle to reorder entries</p>
              {cvData.experience.map((exp, i) => (
                <div
                  key={exp.id}
                  {...expDrag.dragProps(i, (from, to) => updateCV({ experience: reorder(cvData.experience, from, to) }))}
                  className={`border rounded-lg bg-gray-50/50 overflow-hidden transition-opacity ${expDrag.overIdx === i && expDrag.dragging ? "opacity-50 border-primary border-dashed" : ""}`}
                >
                  <div className="flex items-center gap-1 px-3 pt-3 pb-0">
                    <DragHandle />
                    <h4 className="text-xs font-semibold text-gray-500 flex-1">Experience #{i + 1}</h4>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => updateCV({ experience: cvData.experience.filter(e => e.id !== exp.id) })}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label className="text-xs">Job Title</Label><Input value={exp.title} onChange={(e) => updateCV({ experience: cvData.experience.map(x => x.id === exp.id ? { ...x, title: e.target.value } : x) })} placeholder="Software Engineer" /></div>
                      <div className="space-y-1"><Label className="text-xs">Company</Label><Input value={exp.company} onChange={(e) => updateCV({ experience: cvData.experience.map(x => x.id === exp.id ? { ...x, company: e.target.value } : x) })} placeholder="Company Name" /></div>
                    </div>
                    <div className="space-y-1"><Label className="text-xs">Location</Label><Input value={exp.location} onChange={(e) => updateCV({ experience: cvData.experience.map(x => x.id === exp.id ? { ...x, location: e.target.value } : x) })} placeholder="City, Country" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label className="text-xs">Start Date</Label><Input value={exp.startDate} onChange={(e) => updateCV({ experience: cvData.experience.map(x => x.id === exp.id ? { ...x, startDate: e.target.value } : x) })} placeholder="Jan 2022" /></div>
                      <div className="space-y-1"><Label className="text-xs">End Date</Label><Input value={exp.endDate} onChange={(e) => updateCV({ experience: cvData.experience.map(x => x.id === exp.id ? { ...x, endDate: e.target.value } : x) })} placeholder="Present" /></div>
                    </div>
                    <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea value={exp.description} onChange={(e) => updateCV({ experience: cvData.experience.map(x => x.id === exp.id ? { ...x, description: e.target.value } : x) })} placeholder="- Key achievement&#10;- Responsibility" className="h-20 text-xs resize-none" /></div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => updateCV({ experience: [...cvData.experience, { id: Date.now().toString(), title: "", company: "", location: "", startDate: "", endDate: "", description: "" }] })}>
                <Plus className="w-4 h-4" /> Add Experience
              </Button>
            </TabsContent>

            {/* ── EDUCATION ── */}
            <TabsContent value="education" className="space-y-4 mt-0">
              <p className="text-xs text-gray-400 flex items-center gap-1"><GripVertical className="w-3 h-3" /> Drag the handle to reorder entries</p>
              {cvData.education.map((edu, i) => (
                <div
                  key={edu.id}
                  {...eduDrag.dragProps(i, (from, to) => updateCV({ education: reorder(cvData.education, from, to) }))}
                  className={`border rounded-lg bg-gray-50/50 overflow-hidden transition-opacity ${eduDrag.overIdx === i && eduDrag.dragging ? "opacity-50 border-primary border-dashed" : ""}`}
                >
                  <div className="flex items-center gap-1 px-3 pt-3 pb-0">
                    <DragHandle />
                    <h4 className="text-xs font-semibold text-gray-500 flex-1">Education #{i + 1}</h4>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                      onClick={() => updateCV({ education: cvData.education.filter(e => e.id !== edu.id) })}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="space-y-1"><Label className="text-xs">Degree / Exam</Label><Input value={edu.degree} onChange={(e) => updateCV({ education: cvData.education.map(x => x.id === edu.id ? { ...x, degree: e.target.value } : x) })} placeholder="BSc Computer Science" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label className="text-xs">Institution</Label><Input value={edu.institution} onChange={(e) => updateCV({ education: cvData.education.map(x => x.id === edu.id ? { ...x, institution: e.target.value } : x) })} placeholder="University Name" /></div>
                      <div className="space-y-1"><Label className="text-xs">Board / University</Label><Input value={edu.board} onChange={(e) => updateCV({ education: cvData.education.map(x => x.id === edu.id ? { ...x, board: e.target.value } : x) })} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label className="text-xs">Result / GPA</Label><Input value={edu.result} onChange={(e) => updateCV({ education: cvData.education.map(x => x.id === edu.id ? { ...x, result: e.target.value } : x) })} placeholder="GPA 3.8" /></div>
                      <div className="space-y-1"><Label className="text-xs">Year</Label><Input value={edu.year} onChange={(e) => updateCV({ education: cvData.education.map(x => x.id === edu.id ? { ...x, year: e.target.value } : x) })} placeholder="2023" /></div>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => updateCV({ education: [...cvData.education, { id: Date.now().toString(), degree: "", institution: "", board: "", result: "", year: "" }] })}>
                <Plus className="w-4 h-4" /> Add Education
              </Button>
            </TabsContent>

            {/* ── SKILLS & LANGUAGES ── */}
            <TabsContent value="skills" className="space-y-6 mt-0">
              <div>
                <SectionToggle label="Skills" fieldKey="skills" />
                {!isFieldHidden("skills") && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 flex items-center gap-1"><GripVertical className="w-3 h-3" /> Drag to reorder</p>
                    {cvData.skills.map((skill, i) => (
                      <div
                        key={skill.id}
                        {...skillDrag.dragProps(i, (from, to) => updateCV({ skills: reorder(cvData.skills, from, to) }))}
                        className={`flex items-center gap-2 transition-opacity ${skillDrag.overIdx === i && skillDrag.dragging ? "opacity-40" : ""}`}
                      >
                        <DragHandle />
                        <Input value={skill.name} onChange={(e) => updateCV({ skills: cvData.skills.map(s => s.id === skill.id ? { ...s, name: e.target.value } : s) })} placeholder="Skill name" className="flex-1" />
                        <select value={skill.level} onChange={(e) => updateCV({ skills: cvData.skills.map(s => s.id === skill.id ? { ...s, level: Number(e.target.value) } : s) })} className="w-20 h-9 rounded-md border border-gray-200 text-sm px-2">
                          {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}/5</option>)}
                        </select>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-red-400" onClick={() => updateCV({ skills: cvData.skills.filter(s => s.id !== skill.id) })}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => updateCV({ skills: [...cvData.skills, { id: Date.now().toString(), name: "", level: 3 }] })}>
                      <Plus className="w-4 h-4" /> Add Skill
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <SectionToggle label="Languages" fieldKey="languages" />
                {!isFieldHidden("languages") && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 flex items-center gap-1"><GripVertical className="w-3 h-3" /> Drag to reorder</p>
                    {cvData.languages.map((lang, i) => (
                      <div
                        key={lang.id}
                        {...langDrag.dragProps(i, (from, to) => updateCV({ languages: reorder(cvData.languages, from, to) }))}
                        className={`flex items-center gap-2 transition-opacity ${langDrag.overIdx === i && langDrag.dragging ? "opacity-40" : ""}`}
                      >
                        <DragHandle />
                        <Input value={lang.name} onChange={(e) => updateCV({ languages: cvData.languages.map(l => l.id === lang.id ? { ...l, name: e.target.value } : l) })} placeholder="Language" className="flex-1" />
                        <select value={lang.level} onChange={(e) => updateCV({ languages: cvData.languages.map(l => l.id === lang.id ? { ...l, level: Number(e.target.value) } : l) })} className="w-20 h-9 rounded-md border border-gray-200 text-sm px-2">
                          {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}/5</option>)}
                        </select>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-red-400" onClick={() => updateCV({ languages: cvData.languages.filter(l => l.id !== lang.id) })}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => updateCV({ languages: [...cvData.languages, { id: Date.now().toString(), name: "", level: 3 }] })}>
                      <Plus className="w-4 h-4" /> Add Language
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <SectionToggle label="Hobbies & Interests" fieldKey="hobbies" />
                {!isFieldHidden("hobbies") && (
                  <div className="space-y-2">
                    <Input value={cvData.hobbies.join(", ")} onChange={(e) => updateCV({ hobbies: e.target.value.split(",").map(h => h.trim()).filter(Boolean) })} placeholder="Photography, Travel, Reading" />
                    <p className="text-xs text-gray-400">Separate with commas</p>
                  </div>
                )}
              </div>

              <div>
                <SectionToggle label="References" fieldKey="references" />
                {!isFieldHidden("references") && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-400 flex items-center gap-1"><GripVertical className="w-3 h-3" /> Drag to reorder</p>
                    {cvData.references.map((ref, i) => (
                      <div
                        key={ref.id}
                        {...refDrag.dragProps(i, (from, to) => updateCV({ references: reorder(cvData.references, from, to) }))}
                        className={`border rounded-lg bg-gray-50/50 overflow-hidden transition-opacity ${refDrag.overIdx === i && refDrag.dragging ? "opacity-40" : ""}`}
                      >
                        <div className="flex items-center gap-1 px-3 pt-3 pb-0">
                          <DragHandle />
                          <span className="text-xs text-gray-500 flex-1">Reference #{i + 1}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                            onClick={() => updateCV({ references: cvData.references.filter(r => r.id !== ref.id) })}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={ref.name} onChange={(e) => updateCV({ references: cvData.references.map(r => r.id === ref.id ? { ...r, name: e.target.value } : r) })} /></div>
                            <div className="space-y-1"><Label className="text-xs">Designation</Label><Input value={ref.designation} onChange={(e) => updateCV({ references: cvData.references.map(r => r.id === ref.id ? { ...r, designation: e.target.value } : r) })} /></div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1"><Label className="text-xs">Organization</Label><Input value={ref.organization} onChange={(e) => updateCV({ references: cvData.references.map(r => r.id === ref.id ? { ...r, organization: e.target.value } : r) })} /></div>
                            <div className="space-y-1"><Label className="text-xs">Phone</Label><Input value={ref.phone} onChange={(e) => updateCV({ references: cvData.references.map(r => r.id === ref.id ? { ...r, phone: e.target.value } : r) })} /></div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => updateCV({ references: [...cvData.references, { id: Date.now().toString(), name: "", designation: "", organization: "", phone: "" }] })}>
                      <Plus className="w-4 h-4" /> Add Reference
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── PERSONAL DETAILS ── */}
            <TabsContent value="details" className="space-y-4 mt-0">
              <p className="text-xs text-gray-500 bg-gray-50 rounded p-3 border">These personal details appear in the "Personal Details" section of your CV.</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Father's Name",  field: "fathersName"   as const },
                  { label: "Mother's Name",  field: "mothersName"   as const },
                  { label: "Date of Birth",  field: "dob"           as const },
                  { label: "Nationality",    field: "nationality"   as const },
                  { label: "Religion",       field: "religion"      as const },
                  { label: "Marital Status", field: "maritalStatus" as const },
                  { label: "Blood Group",    field: "bloodGroup"    as const },
                  { label: "National ID",    field: "nid"           as const },
                ].map(({ label, field }) => (
                  <div key={field} className="space-y-1.5">
                    <FieldLabel label={label} fieldKey={field} />
                    {isFieldHidden(field) ? <HiddenNote fieldKey={field} label={label} /> : (
                      <Input value={cvData[field]} onChange={(e) => updateCV({ [field]: e.target.value })} placeholder={label} />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ── CUSTOM SECTIONS ── */}
            <TabsContent value="custom" className="space-y-4 mt-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Custom Sections</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Add Certifications, Projects, etc.</p>
                </div>
                <Button size="sm" className="gap-1.5" onClick={() => setNewSectionDialogOpen(true)}>
                  <Plus className="w-4 h-4" /> Add Section
                </Button>
              </div>

              {cvData.customSections.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed rounded-lg border-gray-200">
                  <PenLine className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">No custom sections yet</p>
                  <p className="text-xs text-gray-400 mt-1">Click "Add Section" to get started</p>
                </div>
              )}

              {cvData.customSections.length > 1 && (
                <p className="text-xs text-gray-400 flex items-center gap-1"><GripVertical className="w-3 h-3" /> Drag sections to reorder</p>
              )}

              {cvData.customSections.map((section, si) => {
                const isHidden = isFieldHidden(`customSection_${section.id}`);
                return (
                  <div
                    key={section.id}
                    {...secDrag.dragProps(si, (from, to) => {
                      const reordered = reorder(cvData.customSections, from, to);
                      updateCV({ customSections: reordered });
                    })}
                    className={`border rounded-lg overflow-hidden transition-opacity ${secDrag.overIdx === si && secDrag.dragging ? "opacity-40 border-primary border-dashed" : ""}`}
                  >
                    <div className="flex items-center justify-between px-3 py-3 bg-gray-50 border-b gap-2">
                      <DragHandle />
                      <Input
                        value={section.title}
                        onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                        className="h-7 text-sm font-semibold border-0 bg-transparent p-0 focus-visible:ring-0 w-auto flex-1"
                        placeholder="Section title"
                      />
                      <div className="flex items-center gap-1 ml-2 shrink-0">
                        <button
                          onClick={() => toggleField(`customSection_${section.id}`)}
                          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-colors ${isHidden ? "text-amber-600 border-amber-300 bg-amber-50" : "text-gray-400 border-gray-200 bg-white"}`}
                        >
                          {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => removeCustomSection(section.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {section.items.map((item, idx) => (
                        <div key={item.id} className="border rounded p-3 space-y-2 bg-gray-50/50">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Entry #{idx + 1}</span>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-red-400 hover:text-red-600" onClick={() => removeCustomSectionItem(section.id, item.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Title / Name *</Label>
                              <Input value={item.heading} onChange={(e) => updateCustomSectionItem(section.id, item.id, { heading: e.target.value })} placeholder="e.g. AWS Certified" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Issuer / Subtitle</Label>
                              <Input value={item.subheading || ""} onChange={(e) => updateCustomSectionItem(section.id, item.id, { subheading: e.target.value })} placeholder="e.g. Amazon Web Services" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Date / Year</Label>
                            <Input value={item.date || ""} onChange={(e) => updateCustomSectionItem(section.id, item.id, { date: e.target.value })} placeholder="e.g. 2024" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Description (optional)</Label>
                            <Textarea value={item.description || ""} onChange={(e) => updateCustomSectionItem(section.id, item.id, { description: e.target.value })} placeholder="Brief description..." className="h-14 text-xs resize-none" />
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={() => addCustomSectionItem(section.id)}>
                        <Plus className="w-3.5 h-3.5" /> Add Entry to "{section.title}"
                      </Button>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            {/* ── SIGNATURE ── */}
            <TabsContent value="signature" className="space-y-5 mt-0">
              <div>
                <h3 className="text-sm font-semibold mb-1">Signature</h3>
                <p className="text-xs text-gray-500 mb-4">Your signature will appear at the bottom of every CV template. For two-column templates it appears in the left column.</p>
                <SignaturePad />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Date</Label>
                <p className="text-xs text-gray-500">This date appears below your signature on the CV.</p>
                <Input
                  value={cvData.signatureDate}
                  onChange={(e) => updateCV({ signatureDate: e.target.value })}
                  placeholder="e.g. May 7, 2026"
                />
              </div>
            </TabsContent>

            {/* ── COVER LETTER ── */}
            <TabsContent value="cover-letter" className="mt-0">
              <CoverLetterTab />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-gray-50">
      {/* Mobile top bar */}
      <div className="flex md:hidden items-center justify-between px-3 py-2 bg-white border-b border-gray-200 shrink-0 no-print">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2.5 text-gray-600">
              <Home className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Home</span>
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex rounded-md border border-gray-200 overflow-hidden">
            <button onClick={() => setMobileView("edit")} className={`text-xs px-3 py-1.5 flex items-center gap-1 transition-colors ${mobileView === "edit" ? "bg-gray-900 text-white" : "bg-white text-gray-600"}`}>
              <SlidersHorizontal className="w-3 h-3" />Edit
            </button>
            <button onClick={() => setMobileView("preview")} className={`text-xs px-3 py-1.5 flex items-center gap-1 transition-colors ${mobileView === "preview" ? "bg-gray-900 text-white" : "bg-white text-gray-600"}`}>
              <Eye className="w-3 h-3" />Preview
            </button>
          </div>
          <Button size="sm" onClick={handleDownloadPDF} className="gap-1 px-2.5 h-8">
            <Download className="w-3.5 h-3.5" />
            <span className="text-xs">PDF</span>
          </Button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {editorSidebar}

        {/* Preview pane */}
        <div className={`flex-1 overflow-hidden flex-col relative ${mobileView === "edit" ? "hidden md:flex" : "flex"}`}>
          <div className="hidden md:flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 no-print shrink-0">
            <span className="text-xs text-gray-500 font-medium">Preview — A4 (210×297mm)</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadDocx} disabled={docxLoading} className="gap-1.5 text-blue-700 border-blue-200 text-xs h-7">
                <FileText className="w-3.5 h-3.5" />
                {docxLoading ? "…" : "DOCX"}
              </Button>
              <Button size="sm" onClick={handleDownloadPDF} className="gap-1.5 text-xs h-7">
                <Download className="w-3.5 h-3.5" />
                PDF
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7" onClick={() => setFullscreenPreview(true)}>
                <Maximize2 className="w-3.5 h-3.5" />
                Full Screen
              </Button>
            </div>
          </div>
          <CVPreviewPane />
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {fullscreenPreview && (
        <div className="fixed inset-0 z-50 bg-gray-900/95 flex flex-col no-print">
          <div className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-700 shrink-0">
            <span className="text-white text-sm font-medium">{template?.name} — Full Preview</span>
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={handleDownloadPDF} className="gap-1.5 bg-white text-gray-900 hover:bg-gray-100 text-xs">
                <Download className="w-3.5 h-3.5" />
                PDF
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setFullscreenPreview(false)} className="text-white hover:text-gray-300 hover:bg-gray-800 h-8 w-8">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto flex items-start justify-center p-8">
            <div className="bg-white shadow-2xl" style={{ width: "210mm", minHeight: "297mm" }}>
              <TemplateComponent data={previewData} theme={customTheme ?? undefined} />
            </div>
          </div>
        </div>
      )}

      {/* New Section Dialog */}
      <Dialog open={newSectionDialogOpen} onOpenChange={setNewSectionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Custom Section</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Section Name</Label>
              <Input value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddCustomSection()} placeholder="e.g. Certifications, Projects, Volunteering..." autoFocus />
            </div>
            <div className="flex flex-wrap gap-2">
              {["Certifications", "Projects", "Volunteering", "Awards", "Publications", "Languages", "Courses"].map(suggestion => (
                <button key={suggestion} onClick={() => setNewSectionTitle(suggestion)} className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${newSectionTitle === suggestion ? "bg-primary text-primary-foreground border-primary" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewSectionDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCustomSection} disabled={!newSectionTitle.trim()}>
              <Plus className="w-4 h-4 mr-1" /> Create Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print-only portal: rendered directly in <body>, outside #root.
          During print: #root is display:none, this div becomes display:block.
          Content flows to multiple A4 pages with no clipping. */}
      {createPortal(
        <div id="cv-print-container">
          <TemplateComponent data={previewData} theme={customTheme ?? undefined} />
        </div>,
        document.body
      )}
    </div>
  );
}
