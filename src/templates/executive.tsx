import { TemplateDefinition, TemplateProps } from "./types";
import { PersonalDetailsBlock } from "./personal-details-block";
import { CustomSectionsBlock } from "./custom-sections-block";
import { SignatureBlock } from "./signature-block";

const ExecutiveLayout: React.FC<TemplateProps & { primaryColor: string; accentColor: string }> = ({ data, theme, primaryColor, accentColor }) => {
  const primary = theme?.primary ?? primaryColor;
  const accent = theme?.accent ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white text-left font-serif" style={{ fontFamily: "Georgia, serif" }}>
      <header className="px-16 pt-16 pb-8 border-b-4 flex justify-between items-end" style={{ borderColor: primary }}>
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-wide" style={{ color: primary }}>{data.name || 'Your Name'}</h1>
          {data.jobTitle && <p className="text-lg text-gray-600 mt-1 italic">{data.jobTitle}</p>}
        </div>
        <div className="text-right text-sm text-gray-600 space-y-1">
          <p>{data.email}</p>
          <p>{data.phone}</p>
          <p>{data.address}</p>
          {data.linkedin && <p>{data.linkedin}</p>}
        </div>
      </header>
      <div className="flex-1 px-16 py-8 flex flex-col gap-8">
        {data.objective && (
          <div className="border-l-4 pl-6" style={{ borderColor: accent }}>
            <p className="text-sm leading-relaxed text-gray-700 italic">{data.objective}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-12">
          <div className="flex flex-col gap-8">
            {data.experience.length > 0 && (
              <div>
                <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2" style={{ color: primary, borderColor: accent }}>Experience</h2>
                <div className="space-y-5">
                  {data.experience.map(exp => (
                    <div key={exp.id}>
                      <h3 className="font-bold text-gray-900">{exp.title}</h3>
                      <div className="text-sm font-semibold mb-1" style={{ color: accent }}>{exp.company}</div>
                      <div className="text-xs text-gray-500 mb-2 italic">{exp.startDate} – {exp.endDate} | {exp.location}</div>
                      <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <CustomSectionsBlock data={data} headingColor={primary} borderColor={accent} headingSize="text-lg font-bold uppercase tracking-widest" />
            <div className="mt-auto pt-4 border-t" style={{ borderColor: accent }}>
              <SignatureBlock data={data} textColor={primary} borderColor={primary} compact />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {data.education.length > 0 && (
              <div>
                <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2" style={{ color: primary, borderColor: accent }}>Education</h2>
                <div className="space-y-4">
                  {data.education.map(edu => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <div className="text-sm font-semibold" style={{ color: accent }}>{edu.institution}</div>
                      <p className="text-xs text-gray-500">{edu.year} • {edu.result}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2" style={{ color: primary, borderColor: accent }}>Core Competencies</h2>
                <div className="grid grid-cols-2 gap-2">
                  {data.skills.map(s => (
                    <div key={s.id} className="text-xs font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }}></span>
                      {s.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.languages.length > 0 && (
              <div>
                <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2" style={{ color: primary, borderColor: accent }}>Languages</h2>
                <div className="space-y-1">
                  {data.languages.map(l => (
                    <div key={l.id} className="flex justify-between text-sm">
                      <span className="font-medium">{l.name}</span>
                      <span className="text-gray-500">{l.level}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.references.length > 0 && (
              <div>
                <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2" style={{ color: primary, borderColor: accent }}>References</h2>
                <div className="space-y-3">
                  {data.references.map(ref => (
                    <div key={ref.id} className="text-xs">
                      <p className="font-bold">{ref.name}</p>
                      <p className="text-gray-600 italic">{ref.designation}, {ref.organization}</p>
                      <p className="text-gray-500">{ref.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <PersonalDetailsBlock data={data} headingColor={primary} borderColor={accent} compact />
          </div>
        </div>
      </div>
    </div>
  );
};

export const executiveTemplates: TemplateDefinition[] = [
  { id: "executive-navy", name: "Executive Navy", category: "Executive", colorSwatch: "#1e3a5f", component: (props) => <ExecutiveLayout {...props} primaryColor="#1e3a5f" accentColor="#2563eb" /> },
  { id: "executive-charcoal", name: "Executive Charcoal", category: "Executive", colorSwatch: "#1f2937", component: (props) => <ExecutiveLayout {...props} primaryColor="#1f2937" accentColor="#6b7280" /> },
  { id: "executive-forest", name: "Executive Forest", category: "Executive", colorSwatch: "#14532d", component: (props) => <ExecutiveLayout {...props} primaryColor="#14532d" accentColor="#16a34a" /> },
  { id: "executive-burgundy", name: "Executive Burgundy", category: "Executive", colorSwatch: "#881337", component: (props) => <ExecutiveLayout {...props} primaryColor="#881337" accentColor="#e11d48" /> },
  { id: "executive-slate", name: "Executive Slate", category: "Executive", colorSwatch: "#334155", component: (props) => <ExecutiveLayout {...props} primaryColor="#334155" accentColor="#64748b" /> },
  { id: "executive-bronze", name: "Executive Bronze", category: "Executive", colorSwatch: "#78350f", component: (props) => <ExecutiveLayout {...props} primaryColor="#78350f" accentColor="#d97706" /> },
  { id: "executive-midnight", name: "Executive Midnight", category: "Executive", colorSwatch: "#020617", component: (props) => <ExecutiveLayout {...props} primaryColor="#020617" accentColor="#6366f1" /> },
];
