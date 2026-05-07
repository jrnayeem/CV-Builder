import { CVData } from "@/lib/cv-data";

export interface TemplateTheme {
  primary: string;
  accent: string;
}

export interface TemplateProps {
  data: CVData;
  theme?: TemplateTheme;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: "Classic" | "Modern" | "Creative" | "Minimal" | "Executive" | "Bangladeshi";
  colorSwatch: string;
  component: React.FC<TemplateProps>;
}
