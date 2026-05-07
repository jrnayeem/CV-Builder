import { TemplateDefinition, TemplateProps } from "./types";
import { PersonalDetailsBlock } from "./personal-details-block";
import { CustomSectionsBlock } from "./custom-sections-block";
import { SignatureBlock } from "./signature-block";

/* ─── NEXUS: Bold geometric left panel with sharp angles ─── */
const NexusLayout: React.FC<TemplateProps & { panelColor: string; accentColor: string }> = ({ data, theme, panelColor, accentColor }) => {
  const panel = theme?.primary ?? panelColor;
  const accent = theme?.accent ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex bg-white font-sans text-[10.5px] text-gray-900">
      <div className="w-[42%] flex flex-col text-white relative overflow-hidden" style={{ backgroundColor: panel }}>
        <div className="absolute top-0 right-0 w-16 h-16 opacity-10" style={{ background: `radial-gradient(circle, white, transparent)` }} />
        <div className="px-7 pt-10 pb-6 flex flex-col gap-1">
          {data.photo && (
            <div className="w-24 h-24 rounded-none overflow-hidden border-2 border-white/30 mb-4">
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-2xl font-black uppercase leading-tight tracking-tight">{data.name || 'YOUR NAME'}</h1>
          {data.jobTitle && <p className="text-xs font-semibold opacity-75 uppercase tracking-widest mt-1">{data.jobTitle}</p>}
        </div>
        <div className="h-0.5 mx-7 opacity-30" style={{ backgroundColor: accent }} />
        <div className="px-7 py-5 flex flex-col gap-5 flex-1 text-[9.5px]">
          <div>
            <h2 className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-2">Contact</h2>
            <div className="space-y-1.5 opacity-90 break-words">
              {data.email && <p>✉ {data.email}</p>}
              {data.phone && <p>☏ {data.phone}</p>}
              {data.address && <p>⊙ {data.address}</p>}
              {data.linkedin && <p>↗ {data.linkedin}</p>}
            </div>
          </div>
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-2">Skills</h2>
              <div className="flex flex-col gap-2">
                {data.skills.map(s => (
                  <div key={s.id}>
                    <div className="flex justify-between mb-1 opacity-90"><span>{s.name}</span></div>
                    <div className="h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                      <div className="h-full rounded-full" style={{ width: `${s.level * 20}%`, backgroundColor: accent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-2">Languages</h2>
              <div className="space-y-1 opacity-90">
                {data.languages.map(l => (
                  <div key={l.id} className="flex justify-between">
                    <span>{l.name}</span>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i <= l.level ? accent : 'rgba(255,255,255,0.2)' }} />
                    ))}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.hobbies && data.hobbies.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-2">Interests</h2>
              <p className="opacity-80 leading-relaxed">{data.hobbies.join(' · ')}</p>
            </div>
          )}
          <div className="mt-auto pt-4 border-t border-white/20">
            <SignatureBlock data={data} textColor="white" borderColor="white" compact layout="stack" />
          </div>
        </div>
      </div>
      <div className="w-[58%] flex flex-col px-8 py-8 gap-5">
        {data.objective && (
          <div className="border-l-[3px] pl-4" style={{ borderColor: accent }}>
            <p className="text-[9.5px] leading-relaxed text-gray-600 italic">{data.objective}</p>
          </div>
        )}
        {data.experience.length > 0 && (
          <div>
            <h2 className="text-[8px] font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: panel }}>
              Experience <span className="flex-1 h-px" style={{ backgroundColor: accent + '60' }} />
            </h2>
            <div className="space-y-4">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-bold text-[10px]" style={{ color: panel }}>{exp.title}</h3>
                    <span className="text-[8px] font-medium text-gray-400 shrink-0 ml-2">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-[9px] font-semibold mb-1" style={{ color: accent }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  <p className="text-[9px] text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-[8px] font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: panel }}>
              Education <span className="flex-1 h-px" style={{ backgroundColor: accent + '60' }} />
            </h2>
            <div className="space-y-3">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between">
                    <h3 className="font-bold text-[10px]" style={{ color: panel }}>{edu.degree}</h3>
                    <span className="text-[8px] text-gray-400">{edu.year}</span>
                  </div>
                  <p className="text-[9px] font-semibold" style={{ color: accent }}>{edu.institution}</p>
                  <p className="text-[8.5px] text-gray-500">{edu.board} · {edu.result}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <CustomSectionsBlock data={data} headingColor={panel} borderColor={accent + '60'} compact headingSize="text-[8px] font-black uppercase tracking-widest" />
        <PersonalDetailsBlock data={data} headingColor={panel} borderColor={accent + '60'} compact />
      </div>
    </div>
  );
};

/* ─── PRISM: Card-based sections with subtle depth ─── */
const PrismLayout: React.FC<TemplateProps & { topColor: string; accentColor: string }> = ({ data, theme, topColor, accentColor }) => {
  const top = theme?.primary ?? topColor;
  const accent = theme?.accent ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-gray-50 font-sans text-[10px] text-gray-900">
      <div className="px-10 py-7 flex items-center gap-6" style={{ background: `linear-gradient(135deg, ${top}, ${accent})` }}>
        {data.photo && (
          <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white/40 shrink-0">
            <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 text-white">
          <h1 className="text-3xl font-black tracking-tight">{data.name || 'YOUR NAME'}</h1>
          {data.jobTitle && <p className="text-sm opacity-85 font-medium mt-0.5">{data.jobTitle}</p>}
          <div className="flex flex-wrap gap-x-5 gap-y-0.5 mt-2 text-[9px] opacity-75">
            {data.phone && <span>{data.phone}</span>}
            {data.email && <span>{data.email}</span>}
            {data.address && <span>{data.address}</span>}
            {data.linkedin && <span>{data.linkedin}</span>}
          </div>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-3 gap-0 overflow-hidden">
        <div className="col-span-2 px-7 py-5 flex flex-col gap-4 bg-white border-r border-gray-100">
          {data.objective && (
            <div className="bg-gray-50 rounded-lg p-3 border-l-4" style={{ borderColor: accent }}>
              <p className="text-[9px] leading-relaxed text-gray-600">{data.objective}</p>
            </div>
          )}
          {data.experience.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: top, borderColor: accent }}>Work Experience</h2>
              <div className="space-y-3">
                {data.experience.map(exp => (
                  <div key={exp.id} className="bg-gray-50 rounded p-2.5">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-[10px]" style={{ color: top }}>{exp.title}</h3>
                      <span className="text-[7.5px] font-medium px-1.5 py-0.5 rounded text-white shrink-0 ml-1" style={{ backgroundColor: accent }}>{exp.startDate}–{exp.endDate}</span>
                    </div>
                    <p className="text-[8.5px] font-semibold text-gray-500 mb-1">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                    <p className="text-[8.5px] text-gray-600 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: top, borderColor: accent }}>Education</h2>
              <table className="w-full text-[8.5px] border-collapse border border-gray-200">
                <thead><tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1 text-left">Exam / Degree</th>
                  <th className="border border-gray-200 px-2 py-1 text-left">Institution</th>
                  <th className="border border-gray-200 px-2 py-1 text-center">Result</th>
                  <th className="border border-gray-200 px-2 py-1 text-center">Year</th>
                </tr></thead>
                <tbody>{data.education.map((edu, i) => (
                  <tr key={edu.id} className={i % 2 === 1 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-gray-200 px-2 py-1">{edu.degree}</td>
                    <td className="border border-gray-200 px-2 py-1">{edu.institution}</td>
                    <td className="border border-gray-200 px-2 py-1 text-center">{edu.result}</td>
                    <td className="border border-gray-200 px-2 py-1 text-center">{edu.year}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
          <CustomSectionsBlock data={data} headingColor={top} borderColor={accent} compact headingSize="text-[8px] font-black uppercase tracking-widest" />
          <div className="mt-auto pt-3 border-t border-gray-200">
            <SignatureBlock data={data} textColor={top} borderColor={top} compact />
          </div>
        </div>
        <div className="col-span-1 px-5 py-5 flex flex-col gap-4 bg-gray-50">
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-2" style={{ color: top }}>Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map(s => (
                  <span key={s.id} className="text-[8px] px-2 py-0.5 rounded-full font-semibold text-white" style={{ backgroundColor: s.level >= 4 ? top : accent }}>{s.name}</span>
                ))}
              </div>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-2" style={{ color: top }}>Languages</h2>
              {data.languages.map(l => (
                <div key={l.id} className="mb-1.5">
                  <div className="flex justify-between text-[8.5px] mb-0.5"><span className="font-medium">{l.name}</span></div>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${l.level * 20}%`, backgroundColor: accent }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {data.references.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-2" style={{ color: top }}>References</h2>
              <div className="space-y-2">
                {data.references.map(ref => (
                  <div key={ref.id} className="text-[8.5px] bg-white rounded p-1.5 border border-gray-100">
                    <p className="font-bold">{ref.name}</p>
                    <p className="text-gray-500">{ref.designation}</p>
                    <p className="text-gray-400">{ref.organization}</p>
                    <p className="text-gray-400">{ref.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <PersonalDetailsBlock data={data} headingColor={top} borderColor={accent} compact />
        </div>
      </div>
    </div>
  );
};

/* ─── NOVA: Dark header, clean two-zone layout ─── */
const NovaLayout: React.FC<TemplateProps & { darkColor: string; accentColor: string }> = ({ data, theme, darkColor, accentColor }) => {
  const dark = theme?.primary ?? darkColor;
  const accent = theme?.accent ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white font-sans text-[10px] text-gray-900">
      <div className="flex items-stretch" style={{ backgroundColor: dark }}>
        <div className="flex-1 px-10 py-8 text-white">
          <div className="text-[8px] font-black uppercase tracking-[0.3em] opacity-50 mb-2" style={{ color: accent }}>Curriculum Vitae</div>
          <h1 className="text-4xl font-black tracking-tight leading-none mb-1">{data.name || 'YOUR NAME'}</h1>
          {data.jobTitle && <p className="text-sm font-light opacity-70 tracking-widest uppercase">{data.jobTitle}</p>}
        </div>
        {data.photo && (
          <div className="w-28 shrink-0 overflow-hidden">
            <img src={data.photo} alt="Profile" className="w-full h-full object-cover opacity-80" />
          </div>
        )}
      </div>
      <div className="px-10 py-2 flex flex-wrap gap-x-6 gap-y-1 text-[8.5px] font-medium border-b border-gray-100" style={{ backgroundColor: dark + 'dd', color: 'rgba(255,255,255,0.7)' }}>
        {data.phone && <span>{data.phone}</span>}
        {data.email && <span>{data.email}</span>}
        {data.address && <span>{data.address}</span>}
        {data.linkedin && <span>{data.linkedin}</span>}
      </div>
      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        <div className="col-span-8 px-10 py-5 flex flex-col gap-4 border-r border-gray-100">
          {data.objective && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-2 pb-1 border-b border-gray-200" style={{ color: dark }}>Profile</h2>
              <p className="text-[9.5px] leading-relaxed text-gray-600">{data.objective}</p>
            </div>
          )}
          {data.experience.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-3 pb-1 border-b border-gray-200" style={{ color: dark }}>Experience</h2>
              <div className="space-y-3 relative">
                <div className="absolute left-[3px] top-0 bottom-0 w-px" style={{ backgroundColor: accent + '50' }} />
                {data.experience.map(exp => (
                  <div key={exp.id} className="pl-4 relative">
                    <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold" style={{ color: dark }}>{exp.title}</h3>
                      <span className="text-[8px] text-gray-400 shrink-0 ml-2">{exp.startDate}–{exp.endDate}</span>
                    </div>
                    <p className="text-[9px] font-semibold mb-1" style={{ color: accent }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                    <p className="text-[9px] text-gray-600 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-2 pb-1 border-b border-gray-200" style={{ color: dark }}>Education</h2>
              <div className="space-y-2">
                {data.education.map(edu => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ color: dark }}>{edu.degree}</h3>
                      <p className="text-[9px] font-medium" style={{ color: accent }}>{edu.institution}</p>
                      <p className="text-[8.5px] text-gray-500">{edu.board} · {edu.result}</p>
                    </div>
                    <span className="text-[8.5px] font-bold text-gray-400 shrink-0 ml-2">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <CustomSectionsBlock data={data} headingColor={dark} borderColor="#e5e7eb" compact headingSize="text-[8px] font-black uppercase tracking-widest" />
          <div className="mt-auto pt-3 border-t border-gray-200">
            <SignatureBlock data={data} textColor={dark} borderColor={dark} compact />
          </div>
        </div>
        <div className="col-span-4 px-6 py-5 flex flex-col gap-4 bg-gray-50">
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-2" style={{ color: dark }}>Skills</h2>
              <div className="space-y-2">
                {data.skills.map(s => (
                  <div key={s.id}>
                    <div className="flex justify-between text-[8.5px] mb-0.5"><span className="font-medium">{s.name}</span></div>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.level * 20}%`, backgroundColor: accent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-2" style={{ color: dark }}>Languages</h2>
              {data.languages.map(l => (
                <div key={l.id} className="flex justify-between text-[8.5px] py-1 border-b border-gray-200">
                  <span className="font-medium">{l.name}</span>
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i <= l.level ? accent : '#e5e7eb' }} />
                  ))}</div>
                </div>
              ))}
            </div>
          )}
          {data.references.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-2" style={{ color: dark }}>References</h2>
              <div className="space-y-2">
                {data.references.map(ref => (
                  <div key={ref.id} className="text-[8.5px]">
                    <p className="font-bold">{ref.name}</p>
                    <p className="text-gray-500">{ref.designation}</p>
                    <p className="text-gray-400">{ref.organization}</p>
                    <p className="text-gray-400">{ref.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <PersonalDetailsBlock data={data} headingColor={dark} borderColor="#e5e7eb" compact />
        </div>
      </div>
    </div>
  );
};

/* ─── PULSE: Accent strip, card-style heading labels ─── */
const PulseLayout: React.FC<TemplateProps & { primaryColor: string; accentColor: string }> = ({ data, theme, primaryColor, accentColor }) => {
  const primary = theme?.primary ?? primaryColor;
  const accent = theme?.accent ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex bg-white font-sans text-[10px] text-gray-900">
      <div className="w-2 shrink-0" style={{ background: `linear-gradient(to bottom, ${primary}, ${accent})` }} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-8 pt-8 pb-5 flex justify-between items-start border-b-2" style={{ borderColor: primary }}>
          <div className="flex-1">
            <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: primary }}>{data.name || 'YOUR NAME'}</h1>
            {data.jobTitle && <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">{data.jobTitle}</p>}
            <div className="flex flex-wrap gap-x-5 gap-y-0.5 mt-2 text-[8.5px] text-gray-500">
              {data.phone && <span>{data.phone}</span>}
              {data.email && <span>{data.email}</span>}
              {data.address && <span>{data.address}</span>}
              {data.linkedin && <span>{data.linkedin}</span>}
            </div>
          </div>
          {data.photo && (
            <div className="w-20 h-24 ml-4 shrink-0 overflow-hidden border border-gray-200">
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <div className="flex-1 grid grid-cols-3 gap-0 overflow-hidden">
          <div className="col-span-2 px-8 py-5 flex flex-col gap-4 border-r border-gray-100">
            {data.objective && (
              <div className="pl-3 border-l-2" style={{ borderColor: accent }}>
                <p className="text-[9px] leading-relaxed text-gray-600">{data.objective}</p>
              </div>
            )}
            {data.experience.length > 0 && (
              <div>
                <h2 className="text-[8px] font-black uppercase tracking-widest text-white px-2.5 py-1 mb-3 inline-block rounded" style={{ backgroundColor: primary }}>Experience</h2>
                <div className="space-y-3">
                  {data.experience.map(exp => (
                    <div key={exp.id} className="pl-3 border-l-2" style={{ borderColor: accent + '80' }}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-[10px]" style={{ color: primary }}>{exp.title}</h3>
                        <span className="text-[7.5px] text-gray-400 shrink-0 ml-1">{exp.startDate}–{exp.endDate}</span>
                      </div>
                      <p className="text-[8.5px] font-semibold mb-1" style={{ color: accent }}>{exp.company}</p>
                      <p className="text-[8.5px] text-gray-600 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.education.length > 0 && (
              <div>
                <h2 className="text-[8px] font-black uppercase tracking-widest text-white px-2.5 py-1 mb-3 inline-block rounded" style={{ backgroundColor: primary }}>Education</h2>
                <table className="w-full text-[8.5px] border-collapse border border-gray-200">
                  <thead><tr className="bg-gray-50">
                    <th className="border border-gray-200 px-1.5 py-1 text-left">Degree</th>
                    <th className="border border-gray-200 px-1.5 py-1 text-left">Institution</th>
                    <th className="border border-gray-200 px-1.5 py-1 text-center">Result</th>
                    <th className="border border-gray-200 px-1.5 py-1 text-center">Year</th>
                  </tr></thead>
                  <tbody>{data.education.map(edu => (
                    <tr key={edu.id}>
                      <td className="border border-gray-200 px-1.5 py-1">{edu.degree}</td>
                      <td className="border border-gray-200 px-1.5 py-1">{edu.institution}</td>
                      <td className="border border-gray-200 px-1.5 py-1 text-center">{edu.result}</td>
                      <td className="border border-gray-200 px-1.5 py-1 text-center">{edu.year}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            <CustomSectionsBlock data={data} headingColor={primary} borderColor={accent} compact headingSize="text-[8px] font-black uppercase tracking-widest" />
            <div className="mt-auto pt-3 border-t border-gray-200">
              <SignatureBlock data={data} textColor={primary} borderColor={primary} compact />
            </div>
          </div>
          <div className="col-span-1 px-5 py-5 flex flex-col gap-4 bg-gray-50">
            {data.skills.length > 0 && (
              <div>
                <h2 className="text-[8px] font-black uppercase tracking-widest mb-2" style={{ color: primary }}>Skills</h2>
                <div className="space-y-2">
                  {data.skills.map(s => (
                    <div key={s.id}>
                      <span className="text-[8.5px] font-medium">{s.name}</span>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden mt-0.5">
                        <div className="h-full rounded-full" style={{ width: `${s.level * 20}%`, backgroundColor: accent }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.languages.length > 0 && (
              <div>
                <h2 className="text-[8px] font-black uppercase tracking-widest mb-2" style={{ color: primary }}>Languages</h2>
                <div className="space-y-1">
                  {data.languages.map(l => (
                    <div key={l.id} className="flex justify-between text-[8.5px]">
                      <span className="font-medium">{l.name}</span>
                      <span className="text-gray-400">{l.level}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.references.length > 0 && (
              <div>
                <h2 className="text-[8px] font-black uppercase tracking-widest mb-2" style={{ color: primary }}>References</h2>
                {data.references.map(ref => (
                  <div key={ref.id} className="text-[8.5px] mb-2 pb-2 border-b border-gray-200 last:border-0">
                    <p className="font-bold">{ref.name}</p>
                    <p className="text-gray-500">{ref.designation}</p>
                    <p className="text-gray-400">{ref.organization}</p>
                    <p className="text-gray-400">{ref.phone}</p>
                  </div>
                ))}
              </div>
            )}
            <PersonalDetailsBlock data={data} headingColor={primary} borderColor={accent} compact />
          </div>
        </div>
      </div>
    </div>
  );
};

export const trendingTemplates: TemplateDefinition[] = [
  { id: "trending-nexus-blue", name: "Nexus Blue", category: "Modern", colorSwatch: "#1e40af", component: (p) => <NexusLayout {...p} panelColor="#1e40af" accentColor="#60a5fa" /> },
  { id: "trending-nexus-dark", name: "Nexus Dark", category: "Modern", colorSwatch: "#0f172a", component: (p) => <NexusLayout {...p} panelColor="#0f172a" accentColor="#f59e0b" /> },
  { id: "trending-nexus-teal", name: "Nexus Teal", category: "Modern", colorSwatch: "#0d9488", component: (p) => <NexusLayout {...p} panelColor="#0d9488" accentColor="#5eead4" /> },
  { id: "trending-prism-blue", name: "Prism Blue", category: "Modern", colorSwatch: "#2563eb", component: (p) => <PrismLayout {...p} topColor="#2563eb" accentColor="#0ea5e9" /> },
  { id: "trending-prism-violet", name: "Prism Violet", category: "Modern", colorSwatch: "#7c3aed", component: (p) => <PrismLayout {...p} topColor="#7c3aed" accentColor="#ec4899" /> },
  { id: "trending-prism-green", name: "Prism Green", category: "Modern", colorSwatch: "#059669", component: (p) => <PrismLayout {...p} topColor="#059669" accentColor="#10b981" /> },
  { id: "trending-nova-slate", name: "Nova Slate", category: "Modern", colorSwatch: "#334155", component: (p) => <NovaLayout {...p} darkColor="#334155" accentColor="#f59e0b" /> },
  { id: "trending-nova-indigo", name: "Nova Indigo", category: "Modern", colorSwatch: "#312e81", component: (p) => <NovaLayout {...p} darkColor="#312e81" accentColor="#818cf8" /> },
  { id: "trending-nova-rose", name: "Nova Rose", category: "Modern", colorSwatch: "#1f2937", component: (p) => <NovaLayout {...p} darkColor="#1f2937" accentColor="#fb7185" /> },
  { id: "trending-pulse-blue", name: "Pulse Blue", category: "Modern", colorSwatch: "#1d4ed8", component: (p) => <PulseLayout {...p} primaryColor="#1d4ed8" accentColor="#3b82f6" /> },
  { id: "trending-pulse-emerald", name: "Pulse Emerald", category: "Modern", colorSwatch: "#065f46", component: (p) => <PulseLayout {...p} primaryColor="#065f46" accentColor="#34d399" /> },
  { id: "trending-pulse-crimson", name: "Pulse Crimson", category: "Modern", colorSwatch: "#9f1239", component: (p) => <PulseLayout {...p} primaryColor="#9f1239" accentColor="#fb7185" /> },
];
