import { TemplateDefinition, TemplateProps } from "./types";
import { PersonalDetailsBlock } from "./personal-details-block";
import { CustomSectionsBlock } from "./custom-sections-block";
import { SignatureBlock } from "./signature-block";

const ModernSplitLayout: React.FC<TemplateProps & { leftColor: string; textColor: string; accentColor: string }> = ({ data, theme, leftColor, textColor, accentColor }) => {
  const primary = theme?.primary ?? leftColor;
  const accent = theme?.accent ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex bg-white text-left font-sans">
      <div className="w-[40%] p-8 text-white h-full flex flex-col gap-6" style={{ backgroundColor: primary }}>
        {data.photo && (
          <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg mb-2">
            <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-black tracking-tighter leading-none mb-1">{data.name || 'Your Name'}</h1>
          {data.jobTitle && <p className="text-lg font-medium opacity-90">{data.jobTitle}</p>}
        </div>
        <div className="space-y-2 text-sm mt-4 opacity-90 break-words">
          <p className="flex items-center gap-2"><span className="w-4 font-bold">@</span> {data.email}</p>
          <p className="flex items-center gap-2"><span className="w-4 font-bold">#</span> {data.phone}</p>
          <p className="flex items-center gap-2"><span className="w-4 font-bold">📍</span> {data.address}</p>
          {data.linkedin && <p className="flex items-center gap-2"><span className="w-4 font-bold">in</span> {data.linkedin}</p>}
        </div>
        {data.skills.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-3 opacity-50">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map(s => (
                <span key={s.id} className="px-2 py-1 bg-white/10 rounded text-xs font-medium backdrop-blur-sm">{s.name}</span>
              ))}
            </div>
          </div>
        )}
        {data.languages.length > 0 && (
          <div className="mt-2">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-3 opacity-50">Languages</h2>
            <div className="space-y-1">
              {data.languages.map(l => (
                <div key={l.id} className="text-sm font-medium flex justify-between">
                  <span>{l.name}</span>
                  <span className="opacity-50">{l.level}/5</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-auto pt-4 border-t border-white/30">
          <SignatureBlock data={data} textColor="white" borderColor="white" compact layout="stack" />
        </div>
      </div>
      <div className="w-[60%] p-10 text-gray-800 h-full flex flex-col gap-8">
        {data.objective && (
          <div>
            <h2 className="text-lg font-black uppercase tracking-widest mb-3" style={{ color: accent }}>Profile</h2>
            <p className="text-sm leading-relaxed text-gray-600">{data.objective}</p>
          </div>
        )}
        {data.experience.length > 0 && (
          <div>
            <h2 className="text-lg font-black uppercase tracking-widest mb-4" style={{ color: accent }}>Experience</h2>
            <div className="space-y-6">
              {data.experience.map(exp => (
                <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: accent }}>
                  <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1.5" style={{ backgroundColor: accent }}></div>
                  <h3 className="font-bold text-gray-900">{exp.title}</h3>
                  <div className="text-sm font-medium mb-2" style={{ color: primary }}>{exp.company} | {exp.startDate} - {exp.endDate}</div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-lg font-black uppercase tracking-widest mb-4" style={{ color: accent }}>Education</h2>
            <div className="space-y-4">
              {data.education.map(edu => (
                <div key={edu.id} className="relative pl-4 border-l-2" style={{ borderColor: accent }}>
                  <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1.5" style={{ backgroundColor: accent }}></div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <div className="text-sm font-medium mb-1" style={{ color: primary }}>{edu.institution} | {edu.year}</div>
                  <p className="text-sm text-gray-500">{edu.board} • {edu.result}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <CustomSectionsBlock data={data} headingColor={accent} borderColor={accent} compact headingSize="text-lg font-black uppercase tracking-widest" />
        <PersonalDetailsBlock data={data} headingColor={accent} borderColor={accent} compact />
      </div>
    </div>
  );
};

const ModernHeaderLayout: React.FC<TemplateProps & { headerColor: string; textColor: string; isGradient?: boolean }> = ({ data, theme, headerColor, textColor, isGradient = false }) => {
  const primary = theme?.primary ?? headerColor;
  const secondary = theme?.accent ?? textColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white text-left font-sans">
      <div className="w-full px-12 py-10 text-white flex justify-between items-center"
           style={(!theme && isGradient) ? { background: `linear-gradient(135deg, ${headerColor}, ${textColor})` } : { backgroundColor: primary }}>
        <div className="flex-1">
          <h1 className="text-5xl font-black tracking-tight mb-1">{data.name || 'Your Name'}</h1>
          {data.jobTitle && <p className="text-2xl font-light opacity-90">{data.jobTitle}</p>}
        </div>
        {data.photo && (
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 ml-6 shrink-0">
            <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      <div className="px-12 py-4 bg-gray-50 border-b flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <span>{data.phone}</span>
        <span>{data.email}</span>
        <span>{data.address}</span>
        {data.linkedin && <span>{data.linkedin}</span>}
      </div>
      <div className="flex-1 p-12 grid grid-cols-12 gap-8 text-gray-800">
        <div className="col-span-8 flex flex-col gap-8">
          {data.objective && (
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3 border-b pb-2">Profile</h2>
              <p className="text-sm leading-relaxed">{data.objective}</p>
            </div>
          )}
          {data.experience.length > 0 && (
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 border-b pb-2">Experience</h2>
              <div className="space-y-6">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">{exp.title}</h3>
                      <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-sm font-medium mb-2" style={{ color: primary }}>{exp.company}, {exp.location}</div>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <CustomSectionsBlock data={data} headingColor={primary} borderColor="#e5e7eb" headingSize="text-sm font-black uppercase tracking-widest" />
          <div className="mt-auto pt-4 border-t border-gray-200">
            <SignatureBlock data={data} textColor={primary} borderColor={primary} compact />
          </div>
        </div>
        <div className="col-span-4 flex flex-col gap-8">
          {data.education.length > 0 && (
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 border-b pb-2">Education</h2>
              <div className="space-y-4">
                {data.education.map(edu => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <div className="text-sm font-medium mb-1" style={{ color: primary }}>{edu.institution}</div>
                    <p className="text-xs text-gray-500">{edu.year} • {edu.result}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 border-b pb-2">Skills</h2>
              <div className="flex flex-col gap-2">
                {data.skills.map(s => (
                  <div key={s.id}>
                    <div className="flex justify-between text-xs font-bold mb-1"><span>{s.name}</span></div>
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.level * 20}%`, backgroundColor: primary }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 border-b pb-2">Languages</h2>
              <div className="flex flex-col gap-1">
                {data.languages.map(l => (
                  <div key={l.id} className="text-sm flex justify-between border-b border-dashed border-gray-200 pb-1">
                    <span className="font-medium text-gray-700">{l.name}</span>
                    <span className="text-gray-400">{l.level}/5</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <PersonalDetailsBlock data={data} headingColor={primary} borderColor="#e5e7eb" compact />
        </div>
      </div>
    </div>
  );
};

export const modernTemplates: TemplateDefinition[] = [
  { id: "modern-dark", name: "Modern Dark", category: "Modern", colorSwatch: "#1e293b", component: (props) => <ModernHeaderLayout {...props} headerColor="#1e293b" textColor="#475569" /> },
  { id: "modern-blue-gradient", name: "Modern Blue Gradient", category: "Modern", colorSwatch: "#2563eb", component: (props) => <ModernHeaderLayout {...props} headerColor="#2563eb" textColor="#3b82f6" isGradient /> },
  { id: "modern-split", name: "Modern Split", category: "Modern", colorSwatch: "#4f46e5", component: (props) => <ModernSplitLayout {...props} leftColor="#4f46e5" textColor="#4338ca" accentColor="#6366f1" /> },
  { id: "modern-coral", name: "Modern Coral", category: "Modern", colorSwatch: "#f43f5e", component: (props) => <ModernSplitLayout {...props} leftColor="#f43f5e" textColor="#e11d48" accentColor="#fb7185" /> },
  { id: "modern-indigo", name: "Modern Indigo", category: "Modern", colorSwatch: "#4338ca", component: (props) => <ModernHeaderLayout {...props} headerColor="#4338ca" textColor="#4f46e5" /> },
  { id: "modern-rose", name: "Modern Rose", category: "Modern", colorSwatch: "#e11d48", component: (props) => <ModernSplitLayout {...props} leftColor="#e11d48" textColor="#be123c" accentColor="#f43f5e" /> },
  { id: "modern-sky", name: "Modern Sky", category: "Modern", colorSwatch: "#0ea5e9", component: (props) => <ModernHeaderLayout {...props} headerColor="#0ea5e9" textColor="#38bdf8" /> },
  { id: "modern-emerald", name: "Modern Emerald", category: "Modern", colorSwatch: "#10b981", component: (props) => <ModernSplitLayout {...props} leftColor="#10b981" textColor="#059669" accentColor="#34d399" /> },
  { id: "modern-carbon", name: "Modern Carbon", category: "Modern", colorSwatch: "#0f172a", component: (props) => <ModernSplitLayout {...props} leftColor="#0f172a" textColor="#1e293b" accentColor="#334155" /> }
];
