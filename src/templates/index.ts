import { classicTemplates } from "./classic";
import { modernTemplates } from "./modern";
import { creativeTemplates } from "./creative";
import { minimalTemplates } from "./minimal";
import { executiveTemplates } from "./executive";
import { bdTemplates } from "./bd";
import { bdExtraTemplates } from "./bd-extra";
import { bdExtra2Templates } from "./bd-extra2";
import { trendingTemplates } from "./trending";
import { TemplateDefinition } from "./types";

export const allTemplates: TemplateDefinition[] = [
  ...classicTemplates,
  ...modernTemplates,
  ...trendingTemplates,
  ...creativeTemplates,
  ...minimalTemplates,
  ...executiveTemplates,
  ...bdTemplates,
  ...bdExtraTemplates,
  ...bdExtra2Templates,
];

export function getTemplateById(id: string): TemplateDefinition | undefined {
  return allTemplates.find((t) => t.id === id);
}

export type { TemplateDefinition } from "./types";
