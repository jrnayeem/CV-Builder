import { useState } from "react";
import { useCV } from "@/contexts/cv-context";
import { TemplateTheme } from "@/templates/types";
import { Palette, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRESET_THEMES: { name: string; primary: string; accent: string }[] = [
  { name: "Ocean Blue",    primary: "#1e3a8a", accent: "#3b82f6" },
  { name: "Forest Green",  primary: "#14532d", accent: "#22c55e" },
  { name: "Crimson",       primary: "#7f1d1d", accent: "#ef4444" },
  { name: "Royal Purple",  primary: "#4c1d95", accent: "#8b5cf6" },
  { name: "Teal",          primary: "#134e4a", accent: "#14b8a6" },
  { name: "Slate",         primary: "#1e293b", accent: "#64748b" },
  { name: "Indigo",        primary: "#312e81", accent: "#6366f1" },
  { name: "Amber",         primary: "#78350f", accent: "#f59e0b" },
  { name: "Rose",          primary: "#881337", accent: "#f43f5e" },
  { name: "Emerald",       primary: "#064e3b", accent: "#10b981" },
  { name: "Cobalt",        primary: "#1e40af", accent: "#60a5fa" },
  { name: "Graphite",      primary: "#111827", accent: "#6b7280" },
];

export function ColorThemePicker() {
  const { customTheme, setCustomTheme } = useCV();
  const [open, setOpen] = useState(false);

  const current: TemplateTheme = customTheme ?? { primary: "#1e3a8a", accent: "#3b82f6" };

  const handlePreset = (theme: TemplateTheme) => {
    setCustomTheme(theme);
  };

  const handleCustomColor = (key: "primary" | "accent", value: string) => {
    setCustomTheme({ ...current, [key]: value });
  };

  const handleReset = () => {
    setCustomTheme(null);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Color Theme</span>
          {customTheme && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: customTheme.primary }} />
              <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: customTheme.accent }} />
            </div>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="p-3 space-y-4 border-t bg-white">
          {/* Preset themes */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Preset Themes</p>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_THEMES.map((preset) => {
                const isActive =
                  customTheme?.primary === preset.primary &&
                  customTheme?.accent === preset.accent;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    title={preset.name}
                    onClick={() => handlePreset(preset)}
                    className={`relative flex flex-col rounded overflow-hidden border-2 transition-all ${
                      isActive ? "border-gray-800 shadow-md scale-105" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <div className="h-5 w-full" style={{ backgroundColor: preset.primary }} />
                    <div className="h-2.5 w-full" style={{ backgroundColor: preset.accent }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom color pickers */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Custom Colors</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-600 font-medium">Primary / Sidebar</label>
                <div className="flex items-center gap-2 border rounded px-2 py-1.5 bg-gray-50">
                  <input
                    type="color"
                    value={current.primary}
                    onChange={(e) => handleCustomColor("primary", e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                  />
                  <span className="text-xs font-mono text-gray-600">{current.primary}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600 font-medium">Accent / Highlights</label>
                <div className="flex items-center gap-2 border rounded px-2 py-1.5 bg-gray-50">
                  <input
                    type="color"
                    value={current.accent}
                    onChange={(e) => handleCustomColor("accent", e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                  />
                  <span className="text-xs font-mono text-gray-600">{current.accent}</span>
                </div>
              </div>
            </div>
          </div>

          {customTheme && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="w-full gap-1.5 text-gray-500 hover:text-gray-700 text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to template default
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
