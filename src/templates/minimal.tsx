import { TemplateDefinition, TemplateProps } from "./types";
import { PersonalDetailsBlock } from "./personal-details-block";
import { CustomSectionsBlock } from "./custom-sections-block";

const MinimalLayout: React.FC<TemplateProps & { accentColor?: string; font?: string; isCentered?: boolean }> = ({ data, theme, accentColor = "#000", font = "sans-serif", isCentered = false }) => {
  const accent = theme?.accent ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white text-left text-black px-16 py-16" style={{ fontFamily: font }}>
      <header className={`mb-10 ${isCentered ? 'text-center border-b pb-6' : 'border-b pb-6'}`}>
        <h1 className="text-4xl font-light tracking-widest uppercase mb-1">{data.name || 'Your Name'}</h1>
        {data.jobTitle && <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">{data.jobTitle}</p>}
        <div className={`flex flex-wrap gap-4 text-xs text-gray-600 ${isCentered ? 'justify-center' : ''}`}>
          <span>{data.phone}</span>
          <span>•</span>
          <span>{data.email}</span>
          <span>•</span>
          <span>{data.address}</span>
          {data.linkedin && <><span>•</span><span>{data.linkedin}</span></>}
        </div>
      </header>
      <div className="flex-1 grid grid-cols-12 gap-12">
        <div className="col-span-4 flex flex-col gap-8">
          {data.photo && (
            <div className="w-full aspect-square grayscale mb-4">
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          {data.objective && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Profile</h2>
              <p className="text-xs leading-relaxed text-gray-600 text-justify">{data.objective}</p>
            </div>
          )}
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Skills</h2>
              <ul className="text-xs space-y-1 text-gray-600">
                {data.skills.map(s => <li key={s.id}>{s.name}</li>)}
              </ul>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Languages</h2>
              <ul className="text-xs space-y-1 text-gray-600">
                {data.languages.map(l => <li key={l.id}>{l.name}</li>)}
              </ul>
            </div>
          )}
        </div>
        <div className="col-span-8 flex flex-col gap-10">
          {data.experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-6">Experience</h2>
              <div className="space-y-6">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <h3 className="font-semibold text-sm uppercase">{exp.title}</h3>
                    <div className="text-xs text-gray-500 mb-2">{exp.company} — {exp.startDate} to {exp.endDate}</div>
                    <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-6">Education</h2>
              <div className="space-y-4">
                {data.education.map(edu => (
                  <div key={edu.id}>
                    <h3 className="font-semibold text-sm uppercase">{edu.degree}</h3>
                    <div className="text-xs text-gray-500 mb-1">{edu.institution} — {edu.year}</div>
                    <p className="text-xs text-gray-500">{edu.board} | {edu.result}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <CustomSectionsBlock data={data} headingColor={accent} borderColor={accent} compact headingSize="text-xs font-bold uppercase tracking-widest" />
          <PersonalDetailsBlock data={data} headingColor={accent} borderColor={accent} compact />
        </div>
      </div>
    </div>
  );
};

export const minimalTemplates: TemplateDefinition[] = [
  { id: "minimal-white", name: "Minimal White", category: "Minimal", colorSwatch: "#ffffff", component: (props) => <MinimalLayout {...props} /> },
  { id: "minimal-gray", name: "Minimal Gray", category: "Minimal", colorSwatch: "#f3f4f6", component: (props) => <div className="bg-gray-50"><MinimalLayout {...props} /></div> },
  { id: "minimal-lines", name: "Minimal Lines", category: "Minimal", colorSwatch: "#d1d5db", component: (props) => <MinimalLayout {...props} /> },
  { id: "minimal-dot", name: "Minimal Dot", category: "Minimal", colorSwatch: "#000000", component: (props) => <MinimalLayout {...props} /> },
  { id: "minimal-edge", name: "Minimal Edge", category: "Minimal", colorSwatch: "#6b7280", component: (props) => <MinimalLayout {...props} isCentered /> },
  { id: "minimal-type", name: "Minimal Type", category: "Minimal", colorSwatch: "#111827", component: (props) => <MinimalLayout {...props} font="'Space Mono', monospace" /> },
  { id: "minimal-sand", name: "Minimal Sand", category: "Minimal", colorSwatch: "#fdfbf7", component: (props) => <div style={{backgroundColor: "#fdfbf7"}}><MinimalLayout {...props} /></div> },
  { id: "minimal-zen", name: "Minimal Zen", category: "Minimal", colorSwatch: "#fafafa", component: (props) => <MinimalLayout {...props} isCentered /> }
];
