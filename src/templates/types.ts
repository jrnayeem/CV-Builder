import { CVData } from "@/lib/cv-data";

export interface TemplateProps {
  data: CVData;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: "Classic" | "Modern" | "Creative" | "Minimal" | "Executive" | "Bangladeshi";
  colorSwatch: string;
  component: React.FC<TemplateProps>;
}
