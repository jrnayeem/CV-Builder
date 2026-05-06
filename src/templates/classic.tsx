import { TemplateDefinition, TemplateProps, TemplateTheme } from "./types";
import { PersonalDetailsBlock } from "./personal-details-block";
import { CustomSectionsBlock } from "./custom-sections-block";

const ClassicLayout: React.FC<TemplateProps & { sidebarColor: string; textColor: string; accentColor: string; fontFamily?: string }> = ({ data, theme, sidebarColor, textColor, accentColor, fontFamily = '"Times New Roman", Times, serif' }) => {
  const primary = theme?.primary ?? sidebarColor;
  const accent = theme?.accent ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex bg-white text-left" style={{ fontFamily }}>
      <div className="w-[35%] p-8 text-white h-full flex flex-col gap-6" style={{ backgroundColor: primary }}>
        {data.photo && (
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 mx-auto mb-4" style={{ borderColor: accent }}>
            <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold border-b-2 pb-2 mb-4" style={{ borderColor: accent }}>Contact</h2>
          <div className="text-sm space-y-2 opacity-90 break-words">
            <p>{data.phone}</p>
            <p>{data.email}</p>
            <p>{data.address}</p>
            {data.linkedin && <p>{data.linkedin}</p>}
            {data.website && <p>{data.website}</p>}
          </div>
        </div>
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 pb-2 mb-4" style={{ borderColor: accent }}>Skills</h2>
            <div className="space-y-3 text-sm">
              {data.skills.map(s => (
                <div key={s.id}>
                  <div className="flex justify-between mb-1"><span>{s.name}</span></div>
                  <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white" style={{ width: `${s.level * 20}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.languages.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 pb-2 mb-4" style={{ borderColor: accent }}>Languages</h2>
            <div className="space-y-2 text-sm">
              {data.languages.map(l => (
                <div key={l.id} className="flex justify-between">
                  <span>{l.name}</span>
                  <span className="opacity-75">{l.level}/5</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.hobbies && data.hobbies.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 pb-2 mb-4" style={{ borderColor: accent }}>Hobbies</h2>
            <div className="text-sm opacity-90">{data.hobbies.join(", ")}</div>
          </div>
        )}
      </div>
      <div className="w-[65%] p-8 text-gray-800 h-full flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-1 uppercase tracking-wider" style={{ color: primary }}>{data.name || 'Your Name'}</h1>
          {data.jobTitle && <p className="text-xl text-gray-600 mb-4">{data.jobTitle}</p>}
          {data.objective && <p className="text-sm leading-relaxed">{data.objective}</p>}
        </div>
        {data.experience.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4 uppercase tracking-wide" style={{ borderColor: accent, color: primary }}>Experience</h2>
            <div className="space-y-4">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <h3 className="font-bold text-lg">{exp.title}</h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-2 font-semibold">
                    <span>{exp.company}, {exp.location}</span>
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4 uppercase tracking-wide" style={{ borderColor: accent, color: primary }}>Education</h2>
            <div className="space-y-4">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <h3 className="font-bold text-lg">{edu.degree}</h3>
                  <div className="flex justify-between text-sm text-gray-600 font-semibold">
                    <span>{edu.institution}</span>
                    <span>{edu.year}</span>
                  </div>
                  <p className="text-sm text-gray-500">{edu.board} • {edu.result}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <CustomSectionsBlock data={data} headingColor={primary} borderColor={accent} />
        {data.references.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4 uppercase tracking-wide" style={{ borderColor: accent, color: primary }}>References</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.references.map(ref => (
                <div key={ref.id} className="text-sm">
                  <p className="font-bold">{ref.name}</p>
                  <p className="text-gray-600">{ref.designation}</p>
                  <p className="text-gray-600">{ref.organization}</p>
                  <p className="text-gray-500">{ref.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <PersonalDetailsBlock data={data} headingColor={primary} borderColor={accent} />
      </div>
    </div>
  );
};

const ClassicHeaderLayout: React.FC<TemplateProps & { headerColor: string; accentColor: string }> = ({ data, theme, headerColor, accentColor }) => {
  const primary = theme?.primary ?? headerColor;
  const accent = theme?.accent ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white text-left font-serif" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      <div className="w-full p-8 text-white text-center flex flex-col items-center" style={{ backgroundColor: primary }}>
        {data.photo && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white mb-4 shadow-md">
            <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-1">{data.name || 'Your Name'}</h1>
        {data.jobTitle && <p className="text-xl mb-4 opacity-90">{data.jobTitle}</p>}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm opacity-80 max-w-2xl">
          <span>{data.phone}</span>
          <span>{data.email}</span>
          <span>{data.address}</span>
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </div>
      <div className="flex-1 p-10 flex flex-col gap-6 text-gray-800">
        {data.objective && (
          <div>
            <h2 className="text-xl font-bold border-b-2 pb-1 mb-3 uppercase tracking-wide" style={{ borderColor: accent, color: primary }}>Objective</h2>
            <p className="text-sm leading-relaxed">{data.objective}</p>
          </div>
        )}
        {data.experience.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 pb-1 mb-4 uppercase tracking-wide" style={{ borderColor: accent, color: primary }}>Experience</h2>
            <div className="space-y-4">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between font-bold text-md">
                    <span>{exp.title}</span>
                    <span className="text-sm font-normal text-gray-600">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-sm text-gray-700 italic mb-1">{exp.company}, {exp.location}</div>
                  <p className="text-sm whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 pb-1 mb-4 uppercase tracking-wide" style={{ borderColor: accent, color: primary }}>Education</h2>
            <div className="space-y-3">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between font-bold text-md">
                    <span>{edu.degree}</span>
                    <span className="text-sm font-normal text-gray-600">{edu.year}</span>
                  </div>
                  <div className="text-sm text-gray-700">{edu.institution}</div>
                  <p className="text-sm text-gray-500">{edu.board} • {edu.result}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-8">
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-xl font-bold border-b-2 pb-1 mb-3 uppercase tracking-wide" style={{ borderColor: accent, color: primary }}>Skills</h2>
              <div className="space-y-2">
                {data.skills.map(s => (
                  <div key={s.id}>
                    <div className="flex justify-between text-sm mb-1"><span>{s.name}</span></div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.level * 20}%`, backgroundColor: accent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <h2 className="text-xl font-bold border-b-2 pb-1 mb-3 uppercase tracking-wide" style={{ borderColor: accent, color: primary }}>Languages</h2>
              <div className="space-y-1">
                {data.languages.map(l => (
                  <div key={l.id} className="flex justify-between text-sm">
                    <span>{l.name}</span>
                    <span className="text-gray-500">{l.level}/5</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <CustomSectionsBlock data={data} headingColor={primary} borderColor={accent} />
        <PersonalDetailsBlock data={data} headingColor={primary} borderColor={accent} />
      </div>
    </div>
  );
};

export const classicTemplates: TemplateDefinition[] = [
  { id: "classic-blue", name: "Classic Blue", category: "Classic", colorSwatch: "#1e3a8a", component: (props) => <ClassicLayout {...props} sidebarColor="#1e3a8a" textColor="#1e3a8a" accentColor="#3b82f6" /> },
  { id: "classic-green", name: "Classic Green", category: "Classic", colorSwatch: "#14532d", component: (props) => <ClassicLayout {...props} sidebarColor="#14532d" textColor="#14532d" accentColor="#22c55e" /> },
  { id: "classic-red", name: "Classic Red", category: "Classic", colorSwatch: "#7f1d1d", component: (props) => <ClassicLayout {...props} sidebarColor="#7f1d1d" textColor="#7f1d1d" accentColor="#ef4444" /> },
  { id: "classic-purple", name: "Classic Purple", category: "Classic", colorSwatch: "#4c1d95", component: (props) => <ClassicLayout {...props} sidebarColor="#4c1d95" textColor="#4c1d95" accentColor="#8b5cf6" /> },
  { id: "classic-teal", name: "Classic Teal", category: "Classic", colorSwatch: "#134e4a", component: (props) => <ClassicLayout {...props} sidebarColor="#134e4a" textColor="#134e4a" accentColor="#14b8a6" /> },
  { id: "classic-header-navy", name: "Classic Header Navy", category: "Classic", colorSwatch: "#1e3a8a", component: (props) => <ClassicHeaderLayout {...props} headerColor="#1e3a8a" accentColor="#3b82f6" /> },
  { id: "classic-header-crimson", name: "Classic Header Crimson", category: "Classic", colorSwatch: "#9f1239", component: (props) => <ClassicHeaderLayout {...props} headerColor="#9f1239" accentColor="#f43f5e" /> },
  { id: "classic-header-forest", name: "Classic Header Forest", category: "Classic", colorSwatch: "#14532d", component: (props) => <ClassicHeaderLayout {...props} headerColor="#14532d" accentColor="#22c55e" /> },
  { id: "classic-slate", name: "Classic Slate", category: "Classic", colorSwatch: "#0f172a", component: (props) => <ClassicLayout {...props} sidebarColor="#0f172a" textColor="#1e293b" accentColor="#64748b" /> },
  { id: "classic-maroon", name: "Classic Maroon", category: "Classic", colorSwatch: "#881337", component: (props) => <ClassicLayout {...props} sidebarColor="#881337" textColor="#881337" accentColor="#f43f5e" /> },
];
