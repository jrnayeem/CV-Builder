import { classicTemplates } from "./classic";
import { modernTemplates } from "./modern";
import { creativeTemplates } from "./creative";
import { minimalTemplates } from "./minimal";
import { executiveTemplates } from "./executive";
import { bdTemplates } from "./bd";
import { bdExtraTemplates } from "./bd-extra";
import { TemplateDefinition } from "./types";

export const allTemplates: TemplateDefinition[] = [
  ...classicTemplates,
  ...modernTemplates,
  ...creativeTemplates,
  ...minimalTemplates,
  ...executiveTemplates,
  ...bdTemplates,
  ...bdExtraTemplates,
];

export function getTemplateById(id: string): TemplateDefinition | undefined {
  return allTemplates.find((t) => t.id === id);
}

export type { TemplateDefinition } from "./types";
