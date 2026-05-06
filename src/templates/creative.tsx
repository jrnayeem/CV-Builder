import { TemplateDefinition, TemplateProps } from "./types";
import { PersonalDetailsBlock } from "./personal-details-block";
import { CustomSectionsBlock } from "./custom-sections-block";

const CreativeLayout: React.FC<TemplateProps & { bgColor: string; accentColor: string; gradient?: string }> = ({ data, theme, bgColor, accentColor, gradient }) => {
  const primary = theme?.primary ?? bgColor;
  const accent = theme?.accent ?? accentColor;
  const headerStyle = (theme || !gradient)
    ? { backgroundColor: primary }
    : { background: gradient };
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white text-left font-sans">
      <div className="relative w-full h-48 overflow-hidden" style={headerStyle}>
        <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "20px 20px" }}></div>
        <div className="absolute -bottom-16 right-12 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl z-10 bg-white">
          {data.photo ? <img src={data.photo} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"></div>}
        </div>
      </div>
      <div className="px-12 pt-8 pb-4">
        <h1 className="text-5xl font-black tracking-tighter" style={{ color: primary }}>{data.name || 'Your Name'}</h1>
        {data.jobTitle && <p className="text-xl font-bold text-gray-500 mt-1 uppercase tracking-widest">{data.jobTitle}</p>}
      </div>
      <div className="flex-1 flex">
        <div className="w-1/3 px-12 py-4 flex flex-col gap-6 bg-gray-50 border-r border-gray-100">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Contact</h2>
            <div className="space-y-2 text-sm font-medium text-gray-700 break-words">
              <p>{data.phone}</p>
              <p>{data.email}</p>
              <p>{data.address}</p>
              {data.linkedin && <p>{data.linkedin}</p>}
            </div>
          </div>
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map(s => (
                  <div key={s.id} className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm" style={{ backgroundColor: accent }}>
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Languages</h2>
              <div className="space-y-2">
                {data.languages.map(l => (
                  <div key={l.id} className="text-sm font-bold text-gray-700 flex items-center justify-between">
                    <span>{l.name}</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i <= l.level ? '' : 'opacity-20'}`} style={{ backgroundColor: accent }}></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-2/3 px-12 py-4 flex flex-col gap-8">
          {data.objective && (
            <div className="relative">
              <div className="absolute -left-4 top-0 text-6xl opacity-10" style={{ color: primary }}>"</div>
              <p className="text-sm font-medium leading-relaxed text-gray-600 italic z-10 relative">{data.objective}</p>
            </div>
          )}
          {data.experience.length > 0 && (
            <div>
              <h2 className="flex items-center gap-4 text-xl font-black uppercase tracking-widest mb-6" style={{ color: primary }}>
                Experience <div className="flex-1 h-px bg-gray-200"></div>
              </h2>
              <div className="space-y-6">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <h3 className="font-bold text-lg text-gray-900">{exp.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold" style={{ color: accent }}>{exp.company}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.education.length > 0 && (
            <div>
              <h2 className="flex items-center gap-4 text-xl font-black uppercase tracking-widest mb-6" style={{ color: primary }}>
                Education <div className="flex-1 h-px bg-gray-200"></div>
              </h2>
              <div className="space-y-4">
                {data.education.map(edu => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <div className="text-sm font-medium" style={{ color: accent }}>{edu.institution}</div>
                      <p className="text-xs text-gray-500 mt-1">{edu.board} • {edu.result}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <CustomSectionsBlock data={data} headingColor={primary} borderColor="#e5e7eb" headingSize="text-xl font-black uppercase tracking-widest" />
          <PersonalDetailsBlock data={data} headingColor={primary} borderColor="#e5e7eb" compact />
        </div>
      </div>
    </div>
  );
};

export const creativeTemplates: TemplateDefinition[] = [
  { id: "creative-sunset", name: "Creative Sunset", category: "Creative", colorSwatch: "#f97316", component: (props) => <CreativeLayout {...props} bgColor="#f97316" accentColor="#ea580c" gradient="linear-gradient(to right, #f97316, #ef4444)" /> },
  { id: "creative-ocean", name: "Creative Ocean", category: "Creative", colorSwatch: "#0ea5e9", component: (props) => <CreativeLayout {...props} bgColor="#0ea5e9" accentColor="#0284c7" gradient="linear-gradient(to right, #0ea5e9, #3b82f6)" /> },
  { id: "creative-forest", name: "Creative Forest", category: "Creative", colorSwatch: "#166534", component: (props) => <CreativeLayout {...props} bgColor="#166534" accentColor="#15803d" /> },
  { id: "creative-violet", name: "Creative Violet", category: "Creative", colorSwatch: "#8b5cf6", component: (props) => <CreativeLayout {...props} bgColor="#8b5cf6" accentColor="#7c3aed" gradient="linear-gradient(to right, #8b5cf6, #d946ef)" /> },
  { id: "creative-noir", name: "Creative Noir", category: "Creative", colorSwatch: "#171717", component: (props) => <CreativeLayout {...props} bgColor="#171717" accentColor="#eab308" /> },
  { id: "creative-mint", name: "Creative Mint", category: "Creative", colorSwatch: "#14b8a6", component: (props) => <CreativeLayout {...props} bgColor="#14b8a6" accentColor="#0d9488" /> },
  { id: "creative-peach", name: "Creative Peach", category: "Creative", colorSwatch: "#f43f5e", component: (props) => <CreativeLayout {...props} bgColor="#f43f5e" accentColor="#e11d48" gradient="linear-gradient(to right, #fb923c, #f43f5e)" /> },
  { id: "creative-cobalt", name: "Creative Cobalt", category: "Creative", colorSwatch: "#4338ca", component: (props) => <CreativeLayout {...props} bgColor="#4338ca" accentColor="#4f46e5" /> },
  { id: "creative-ruby", name: "Creative Ruby", category: "Creative", colorSwatch: "#be123c", component: (props) => <CreativeLayout {...props} bgColor="#be123c" accentColor="#9f1239" /> },
  { id: "creative-graphite", name: "Creative Graphite", category: "Creative", colorSwatch: "#334155", component: (props) => <CreativeLayout {...props} bgColor="#334155" accentColor="#f59e0b" /> }
];
