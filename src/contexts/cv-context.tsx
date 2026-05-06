import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CVData, CustomSection, sampleCVData } from "@/lib/cv-data";
import { TemplateTheme } from "@/templates/types";

interface CVContextValue {
  cvData: CVData;
  updateCV: (updates: Partial<CVData>) => void;
  setCvData: (data: CVData) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  toggleField: (fieldName: string) => void;
  isFieldHidden: (fieldName: string) => boolean;
  addCustomSection: (title: string) => void;
  updateCustomSection: (id: string, updates: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  customTheme: TemplateTheme | null;
  setCustomTheme: (theme: TemplateTheme | null) => void;
}

const CVContext = createContext<CVContextValue | null>(null);

export function CVProvider({ children }: { children: ReactNode }) {
  const [cvData, setCvData] = useState<CVData>(() => {
    const saved = localStorage.getItem("cvData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.hiddenFields) parsed.hiddenFields = [];
        if (!parsed.customSections) parsed.customSections = [];
        return parsed;
      } catch {
        return sampleCVData;
      }
    }
    return sampleCVData;
  });

  const [selectedTemplateId, setSelectedTemplateIdState] = useState<string>(() => {
    return localStorage.getItem("cvTemplateId") || "classic-blue";
  });

  const [customTheme, setCustomThemeState] = useState<TemplateTheme | null>(() => {
    const saved = localStorage.getItem("cvCustomTheme");
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem("cvData", JSON.stringify(cvData));
  }, [cvData]);

  const setSelectedTemplateId = (id: string) => {
    localStorage.setItem("cvTemplateId", id);
    setSelectedTemplateIdState(id);
  };

  const setCustomTheme = (theme: TemplateTheme | null) => {
    if (theme) {
      localStorage.setItem("cvCustomTheme", JSON.stringify(theme));
    } else {
      localStorage.removeItem("cvCustomTheme");
    }
    setCustomThemeState(theme);
  };

  const updateCV = (updates: Partial<CVData>) => {
    setCvData((prev) => ({ ...prev, ...updates }));
  };

  const toggleField = (fieldName: string) => {
    setCvData((prev) => {
      const hidden = new Set(prev.hiddenFields || []);
      if (hidden.has(fieldName)) {
        hidden.delete(fieldName);
      } else {
        hidden.add(fieldName);
      }
      return { ...prev, hiddenFields: Array.from(hidden) };
    });
  };

  const isFieldHidden = (fieldName: string) => {
    return (cvData.hiddenFields || []).includes(fieldName);
  };

  const addCustomSection = (title: string) => {
    const newSection: CustomSection = {
      id: Date.now().toString(),
      title,
      items: [],
    };
    setCvData((prev) => ({
      ...prev,
      customSections: [...(prev.customSections || []), newSection],
    }));
  };

  const updateCustomSection = (id: string, updates: Partial<CustomSection>) => {
    setCvData((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  };

  const removeCustomSection = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).filter((s) => s.id !== id),
    }));
  };

  return (
    <CVContext.Provider
      value={{
        cvData,
        updateCV,
        setCvData,
        selectedTemplateId,
        setSelectedTemplateId,
        toggleField,
        isFieldHidden,
        addCustomSection,
        updateCustomSection,
        removeCustomSection,
        customTheme,
        setCustomTheme,
      }}
    >
      {children}
    </CVContext.Provider>
  );
}

export function useCV() {
  const ctx = useContext(CVContext);
  if (!ctx) throw new Error("useCV must be used inside CVProvider");
  return ctx;
}
