import { TemplateDefinition, TemplateProps } from "./types";
import { CustomSectionsBlock } from "./custom-sections-block";
import { SignatureBlock } from "./signature-block";

/* ─────────────────────────────────────────────────────────────
   LAYOUT 1: BD Two-Column Sidebar
   Left: photo + contact + skills + languages + signature
   Right: main CV content + personal details
───────────────────────────────────────────────────────────── */
const BDTwoColumnLayout: React.FC<TemplateProps & { sidebarColor: string; accentColor: string }> = ({ data, theme, sidebarColor, accentColor }) => {
  const sidebar = theme?.primary ?? sidebarColor;
  const accent  = theme?.accent  ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex bg-white text-left font-sans text-gray-900 text-[11px]">
      {/* Left sidebar */}
      <div className="w-[38%] flex flex-col text-white" style={{ backgroundColor: sidebar }}>
        {data.photo && (
          <div className="mx-auto mt-6 w-24 h-28 border-2 border-white/40 overflow-hidden">
            <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="px-5 py-4 flex flex-col gap-5 text-[10px] flex-1">
          <div className="text-center">
            <h1 className="text-lg font-bold uppercase leading-tight">{data.name || 'YOUR NAME'}</h1>
            {data.jobTitle && <p className="opacity-80 mt-1 text-[10px]">{data.jobTitle}</p>}
          </div>
          <div>
            <h2 className="font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2 text-[9px]">Contact</h2>
            <div className="space-y-1 opacity-90 break-words">
              {data.phone && <p>📞 {data.phone}</p>}
              {data.email && <p>✉ {data.email}</p>}
              {data.address && <p>📍 {data.address}</p>}
              {data.linkedin && <p>in {data.linkedin}</p>}
            </div>
          </div>
          {data.skills.length > 0 && (
            <div>
              <h2 className="font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2 text-[9px]">Skills</h2>
              <ul className="space-y-1 opacity-90">
                {data.skills.map(s => (
                  <li key={s.id} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                    {s.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <h2 className="font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2 text-[9px]">Languages</h2>
              <ul className="space-y-1 opacity-90">
                {data.languages.map(l => (
                  <li key={l.id} className="flex justify-between">
                    <span>{l.name}</span><span className="opacity-60">{l.level}/5</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.hobbies && data.hobbies.length > 0 && (
            <div>
              <h2 className="font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2 text-[9px]">Interests</h2>
              <p className="opacity-80 leading-relaxed">{data.hobbies.join(', ')}</p>
            </div>
          )}
          <div className="mt-auto pt-3 border-t border-white/30">
            <SignatureBlock data={data} textColor="white" borderColor="white" compact layout="stack" />
          </div>
        </div>
      </div>
      {/* Right content */}
      <div className="w-[62%] flex flex-col px-6 py-5 gap-4 overflow-hidden">
        <div className="border-b-2 pb-2" style={{ borderColor: accent }}>
          <h1 className="text-xl font-bold uppercase" style={{ color: sidebar }}>{data.name || 'YOUR NAME'}</h1>
          {data.jobTitle && <p className="text-[10px] text-gray-500 mt-0.5">{data.jobTitle}</p>}
        </div>
        {data.objective && (
          <div>
            <h2 className="font-bold uppercase text-[9px] tracking-wider py-0.5 mb-1.5 border-b" style={{ color: sidebar, borderColor: accent }}>Career Objective</h2>
            <p className="text-justify leading-relaxed text-gray-700">{data.objective}</p>
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <h2 className="font-bold uppercase text-[9px] tracking-wider py-0.5 mb-1.5 border-b" style={{ color: sidebar, borderColor: accent }}>Educational Qualification</h2>
            <table className="w-full border-collapse border border-gray-300 text-[9px]">
              <thead><tr style={{ backgroundColor: sidebar + '15' }}>
                <th className="border border-gray-300 px-1.5 py-1 text-left">Degree</th>
                <th className="border border-gray-300 px-1.5 py-1 text-left">Institution</th>
                <th className="border border-gray-300 px-1.5 py-1 text-left">Board</th>
                <th className="border border-gray-300 px-1.5 py-1 text-center">Result</th>
                <th className="border border-gray-300 px-1.5 py-1 text-center">Year</th>
              </tr></thead>
              <tbody>{data.education.map(edu => (
                <tr key={edu.id}>
                  <td className="border border-gray-300 px-1.5 py-1">{edu.degree}</td>
                  <td className="border border-gray-300 px-1.5 py-1">{edu.institution}</td>
                  <td className="border border-gray-300 px-1.5 py-1">{edu.board}</td>
                  <td className="border border-gray-300 px-1.5 py-1 text-center">{edu.result}</td>
                  <td className="border border-gray-300 px-1.5 py-1 text-center">{edu.year}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {data.experience.length > 0 && (
          <div>
            <h2 className="font-bold uppercase text-[9px] tracking-wider py-0.5 mb-1.5 border-b" style={{ color: sidebar, borderColor: accent }}>Work Experience</h2>
            <div className="space-y-2">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <p className="font-bold">{exp.title} — <span className="font-normal text-gray-600">{exp.company}</span></p>
                  <p className="text-gray-500 text-[9px]">{exp.startDate} to {exp.endDate} | {exp.location}</p>
                  {exp.description && <p className="text-gray-700 mt-0.5 whitespace-pre-wrap">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        <CustomSectionsBlock data={data} headingColor={sidebar} borderColor={accent} compact headingSize="font-bold uppercase text-[9px] tracking-wider" />
        {data.references.length > 0 && (
          <div>
            <h2 className="font-bold uppercase text-[9px] tracking-wider py-0.5 mb-1.5 border-b" style={{ color: sidebar, borderColor: accent }}>References</h2>
            <div className="grid grid-cols-2 gap-3">
              {data.references.map(ref => (
                <div key={ref.id}>
                  <p className="font-bold">{ref.name}</p>
                  <p className="text-gray-600 text-[9px]">{ref.designation}, {ref.organization}</p>
                  <p className="text-gray-500 text-[9px]">Phone: {ref.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Personal details on RIGHT side */}
        <div>
          <h2 className="font-bold uppercase text-[9px] tracking-wider py-0.5 mb-1.5 border-b" style={{ color: sidebar, borderColor: accent }}>Personal Information</h2>
          <table className="w-full text-[9px]">
            <tbody>
              {data.fathersName && <tr><td className="font-semibold py-0.5 w-2/5">Father's Name</td><td className="w-4">:</td><td>{data.fathersName}</td></tr>}
              {data.mothersName && <tr><td className="font-semibold py-0.5">Mother's Name</td><td>:</td><td>{data.mothersName}</td></tr>}
              {data.dob && <tr><td className="font-semibold py-0.5">Date of Birth</td><td>:</td><td>{data.dob}</td></tr>}
              {data.nationality && <tr><td className="font-semibold py-0.5">Nationality</td><td>:</td><td>{data.nationality}</td></tr>}
              {data.religion && <tr><td className="font-semibold py-0.5">Religion</td><td>:</td><td>{data.religion}</td></tr>}
              {data.maritalStatus && <tr><td className="font-semibold py-0.5">Marital Status</td><td>:</td><td>{data.maritalStatus}</td></tr>}
              {data.bloodGroup && <tr><td className="font-semibold py-0.5">Blood Group</td><td>:</td><td>{data.bloodGroup}</td></tr>}
              {data.nid && <tr><td className="font-semibold py-0.5">National ID</td><td>:</td><td>{data.nid}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LAYOUT 2: BD Modern Professional (Accent Strip)
   Bold left accent strip, boxed section headings
   Personal details on right, signature at bottom
───────────────────────────────────────────────────────────── */
const BDModernProfLayout: React.FC<TemplateProps & { stripColor: string; accentColor: string }> = ({ data, theme, stripColor, accentColor }) => {
  const strip  = theme?.primary ?? stripColor;
  const accent = theme?.accent  ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex bg-white font-sans text-[11px] text-gray-900">
      <div className="w-3 shrink-0" style={{ backgroundColor: strip }} />
      <div className="flex-1 flex flex-col px-8 py-6 gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 pb-3" style={{ borderColor: strip }}>
          <div className="flex-1">
            <h1 className="text-2xl font-black uppercase tracking-wide" style={{ color: strip }}>{data.name || 'YOUR NAME'}</h1>
            {data.jobTitle && <p className="text-sm text-gray-500 font-medium mt-0.5">{data.jobTitle}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[10px] text-gray-600">
              {data.phone && <span>📞 {data.phone}</span>}
              {data.email && <span>✉ {data.email}</span>}
              {data.address && <span>📍 {data.address}</span>}
              {data.linkedin && <span>🔗 {data.linkedin}</span>}
            </div>
          </div>
          {data.photo && (
            <div className="w-20 h-24 border border-gray-200 ml-4 shrink-0 overflow-hidden">
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        {data.objective && (
          <div className="pl-3 border-l-4" style={{ borderColor: accent }}>
            <p className="text-[10px] leading-relaxed text-gray-700">{data.objective}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-4">
            {data.education.length > 0 && (
              <div>
                <h2 className="text-[9px] font-black uppercase tracking-widest text-white px-2 py-0.5 mb-2 inline-block" style={{ backgroundColor: strip }}>Education</h2>
                <table className="w-full border-collapse text-[9px]">
                  <thead><tr className="bg-gray-100">
                    <th className="border border-gray-300 px-1 py-0.5 text-left">Exam</th>
                    <th className="border border-gray-300 px-1 py-0.5 text-left">Institution</th>
                    <th className="border border-gray-300 px-1 py-0.5 text-center">Result</th>
                    <th className="border border-gray-300 px-1 py-0.5 text-center">Year</th>
                  </tr></thead>
                  <tbody>{data.education.map(edu => (
                    <tr key={edu.id}>
                      <td className="border border-gray-300 px-1 py-0.5">{edu.degree}</td>
                      <td className="border border-gray-300 px-1 py-0.5">{edu.institution}</td>
                      <td className="border border-gray-300 px-1 py-0.5 text-center">{edu.result}</td>
                      <td className="border border-gray-300 px-1 py-0.5 text-center">{edu.year}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            {data.experience.length > 0 && (
              <div>
                <h2 className="text-[9px] font-black uppercase tracking-widest text-white px-2 py-0.5 mb-2 inline-block" style={{ backgroundColor: strip }}>Experience</h2>
                <div className="space-y-2">
                  {data.experience.map(exp => (
                    <div key={exp.id} className="pl-2 border-l-2" style={{ borderColor: accent }}>
                      <p className="font-bold text-[10px]">{exp.title}</p>
                      <p className="text-gray-500 text-[9px]">{exp.company} | {exp.startDate}–{exp.endDate}</p>
                      {exp.description && <p className="text-gray-600 text-[9px] mt-0.5 whitespace-pre-wrap">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <CustomSectionsBlock data={data} headingColor={strip} borderColor={accent} compact headingSize="text-[9px] font-black uppercase tracking-widest" />
          </div>
          <div className="flex flex-col gap-4">
            {data.skills.length > 0 && (
              <div>
                <h2 className="text-[9px] font-black uppercase tracking-widest text-white px-2 py-0.5 mb-2 inline-block" style={{ backgroundColor: strip }}>Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map(s => (
                    <span key={s.id} className="text-[9px] px-2 py-0.5 border rounded" style={{ borderColor: accent, color: strip }}>{s.name}</span>
                  ))}
                </div>
              </div>
            )}
            {/* Personal Details on RIGHT side */}
            <div>
              <h2 className="text-[9px] font-black uppercase tracking-widest text-white px-2 py-0.5 mb-2 inline-block" style={{ backgroundColor: strip }}>Personal Details</h2>
              <table className="w-full text-[9px]">
                <tbody>
                  {data.fathersName && <tr><td className="font-semibold py-0.5 w-2/5">Father's Name</td><td className="w-4">:</td><td>{data.fathersName}</td></tr>}
                  {data.mothersName && <tr><td className="font-semibold py-0.5">Mother's Name</td><td>:</td><td>{data.mothersName}</td></tr>}
                  {data.dob && <tr><td className="font-semibold py-0.5">Date of Birth</td><td>:</td><td>{data.dob}</td></tr>}
                  {data.nationality && <tr><td className="font-semibold py-0.5">Nationality</td><td>:</td><td>{data.nationality}</td></tr>}
                  {data.religion && <tr><td className="font-semibold py-0.5">Religion</td><td>:</td><td>{data.religion}</td></tr>}
                  {data.maritalStatus && <tr><td className="font-semibold py-0.5">Marital Status</td><td>:</td><td>{data.maritalStatus}</td></tr>}
                  {data.bloodGroup && <tr><td className="font-semibold py-0.5">Blood Group</td><td>:</td><td>{data.bloodGroup}</td></tr>}
                  {data.nid && <tr><td className="font-semibold py-0.5">National ID</td><td>:</td><td>{data.nid}</td></tr>}
                </tbody>
              </table>
            </div>
            {data.languages.length > 0 && (
              <div>
                <h2 className="text-[9px] font-black uppercase tracking-widest text-white px-2 py-0.5 mb-2 inline-block" style={{ backgroundColor: strip }}>Languages</h2>
                <ul className="space-y-1">
                  {data.languages.map(l => <li key={l.id} className="flex justify-between text-[9px]"><span>{l.name}</span><span className="text-gray-500">{l.level}/5</span></li>)}
                </ul>
              </div>
            )}
            {data.references.length > 0 && (
              <div>
                <h2 className="text-[9px] font-black uppercase tracking-widest text-white px-2 py-0.5 mb-2 inline-block" style={{ backgroundColor: strip }}>References</h2>
                <div className="space-y-2">
                  {data.references.map(ref => (
                    <div key={ref.id} className="text-[9px]">
                      <p className="font-bold">{ref.name}</p>
                      <p className="text-gray-600">{ref.designation}, {ref.organization}</p>
                      <p className="text-gray-500">{ref.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-auto pt-2 border-t border-gray-200">
          <SignatureBlock data={data} textColor={strip} borderColor={strip} compact />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LAYOUT 3: BD Government / Formal (Traditional single-column)
───────────────────────────────────────────────────────────── */
const BDGovLayout: React.FC<TemplateProps & { accentColor: string }> = ({ data, theme, accentColor }) => {
  const accent = theme?.accent ?? theme?.primary ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white font-sans text-[10.5px] text-gray-900 px-14 pt-8 pb-6 gap-3">
      <div className="text-center border-b-2 pb-3 mb-1" style={{ borderColor: accent }}>
        <h1 className="text-[22px] font-extrabold uppercase tracking-widest" style={{ color: accent }}>{data.name || 'YOUR NAME'}</h1>
        {data.jobTitle && <p className="text-sm text-gray-600 mt-1">{data.jobTitle}</p>}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-2 text-[10px] text-gray-500">
          {data.phone && <span>{data.phone}</span>}
          {data.email && <span>{data.email}</span>}
          {data.address && <span>{data.address}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </div>
      {data.objective && (
        <div>
          <h2 className="font-bold uppercase text-[10px] tracking-wide border-b pb-0.5 mb-1" style={{ color: accent, borderColor: accent }}>Career Objective</h2>
          <p className="text-justify leading-relaxed">{data.objective}</p>
        </div>
      )}
      {data.education.length > 0 && (
        <div>
          <h2 className="font-bold uppercase text-[10px] tracking-wide border-b pb-0.5 mb-1.5" style={{ color: accent, borderColor: accent }}>Educational Qualification</h2>
          <table className="w-full border-collapse border border-gray-400 text-[9px]">
            <thead><tr style={{ backgroundColor: accent + '20' }}>
              <th className="border border-gray-400 px-2 py-1 text-left">Exam / Degree</th>
              <th className="border border-gray-400 px-2 py-1 text-left">Institution</th>
              <th className="border border-gray-400 px-2 py-1 text-left">Board/University</th>
              <th className="border border-gray-400 px-2 py-1 text-center">Result/Grade</th>
              <th className="border border-gray-400 px-2 py-1 text-center">Passing Year</th>
            </tr></thead>
            <tbody>{data.education.map((edu, i) => (
              <tr key={edu.id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                <td className="border border-gray-400 px-2 py-1">{edu.degree}</td>
                <td className="border border-gray-400 px-2 py-1">{edu.institution}</td>
                <td className="border border-gray-400 px-2 py-1">{edu.board}</td>
                <td className="border border-gray-400 px-2 py-1 text-center">{edu.result}</td>
                <td className="border border-gray-400 px-2 py-1 text-center">{edu.year}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          {data.experience.length > 0 && (
            <div>
              <h2 className="font-bold uppercase text-[10px] tracking-wide border-b pb-0.5 mb-1.5" style={{ color: accent, borderColor: accent }}>Work Experience</h2>
              <div className="space-y-2">
                {data.experience.map(exp => (
                  <div key={exp.id} className="text-[9px]">
                    <p className="font-bold">{exp.title}</p>
                    <p>Organization: {exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                    <p>Duration: {exp.startDate} to {exp.endDate}</p>
                    {exp.description && <p className="mt-0.5 whitespace-pre-wrap text-gray-600">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.skills.length > 0 && (
            <div>
              <h2 className="font-bold uppercase text-[10px] tracking-wide border-b pb-0.5 mb-1.5" style={{ color: accent, borderColor: accent }}>Skills</h2>
              <ul className="text-[9px] space-y-0.5">
                {data.skills.map(s => <li key={s.id}>• {s.name}</li>)}
              </ul>
            </div>
          )}
          <CustomSectionsBlock data={data} headingColor={accent} borderColor={accent} compact headingSize="font-bold uppercase text-[10px] tracking-wide" />
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="font-bold uppercase text-[10px] tracking-wide border-b pb-0.5 mb-1.5" style={{ color: accent, borderColor: accent }}>Personal Information</h2>
            <table className="w-full text-[9px]">
              <tbody>
                <tr><td className="font-semibold py-0.5 w-2/5">Father's Name</td><td className="w-4">:</td><td>{data.fathersName}</td></tr>
                <tr><td className="font-semibold py-0.5">Mother's Name</td><td>:</td><td>{data.mothersName}</td></tr>
                <tr><td className="font-semibold py-0.5">Date of Birth</td><td>:</td><td>{data.dob}</td></tr>
                <tr><td className="font-semibold py-0.5">Nationality</td><td>:</td><td>{data.nationality}</td></tr>
                <tr><td className="font-semibold py-0.5">Religion</td><td>:</td><td>{data.religion}</td></tr>
                <tr><td className="font-semibold py-0.5">Marital Status</td><td>:</td><td>{data.maritalStatus}</td></tr>
                <tr><td className="font-semibold py-0.5">Blood Group</td><td>:</td><td>{data.bloodGroup}</td></tr>
                <tr><td className="font-semibold py-0.5">National ID</td><td>:</td><td>{data.nid}</td></tr>
              </tbody>
            </table>
          </div>
          {data.languages.length > 0 && (
            <div>
              <h2 className="font-bold uppercase text-[10px] tracking-wide border-b pb-0.5 mb-1.5" style={{ color: accent, borderColor: accent }}>Language Proficiency</h2>
              <ul className="text-[9px] space-y-0.5">
                {data.languages.map(l => (
                  <li key={l.id} className="flex justify-between"><span>• {l.name}</span><span className="text-gray-500">{l.level}/5</span></li>
                ))}
              </ul>
            </div>
          )}
          {data.references.length > 0 && (
            <div>
              <h2 className="font-bold uppercase text-[10px] tracking-wide border-b pb-0.5 mb-1.5" style={{ color: accent, borderColor: accent }}>References</h2>
              <div className="grid grid-cols-2 gap-2 text-[9px]">
                {data.references.map(ref => (
                  <div key={ref.id}>
                    <p className="font-bold">{ref.name}</p>
                    <p>{ref.designation}</p>
                    <p>{ref.organization}</p>
                    <p>Ph: {ref.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-auto pt-3 border-t border-gray-200">
        <SignatureBlock data={data} textColor={accent} borderColor={accent} compact />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LAYOUT 4: BD Elegant (Top banner + bordered sections)
   Personal details on RIGHT, signature at bottom
───────────────────────────────────────────────────────────── */
const BDElegantLayout: React.FC<TemplateProps & { bannerColor: string; accentColor: string }> = ({ data, theme, bannerColor, accentColor }) => {
  const banner = theme?.primary ?? bannerColor;
  const accent = theme?.accent  ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white font-sans text-[10.5px] text-gray-900">
      <div className="px-10 py-5 flex justify-between items-center" style={{ backgroundColor: banner }}>
        <div className="flex-1 text-white">
          <h1 className="text-2xl font-black uppercase tracking-widest">{data.name || 'YOUR NAME'}</h1>
          {data.jobTitle && <p className="mt-1 text-sm opacity-80">{data.jobTitle}</p>}
        </div>
        <div className="text-white text-right text-[10px] opacity-80 space-y-0.5">
          {data.phone && <p>{data.phone}</p>}
          {data.email && <p>{data.email}</p>}
          {data.address && <p>{data.address}</p>}
        </div>
        {data.photo && (
          <div className="ml-4 w-16 h-20 border-2 border-white/40 overflow-hidden shrink-0">
            <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
      <div className="flex-1 px-10 py-5 flex flex-col gap-4 overflow-hidden">
        {data.objective && (
          <div className="border border-gray-200 rounded p-3 bg-gray-50">
            <h2 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: banner }}>Career Objective</h2>
            <p className="text-justify leading-relaxed text-gray-700">{data.objective}</p>
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-[9px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-2" style={{ color: banner }}>
              <span className="flex-1 h-px bg-gray-200" />Educational Qualification<span className="flex-1 h-px bg-gray-200" />
            </h2>
            <table className="w-full border-collapse border border-gray-300 text-[9px]">
              <thead><tr style={{ backgroundColor: banner }}>
                <th className="border border-gray-300 px-2 py-1 text-white text-left">Exam</th>
                <th className="border border-gray-300 px-2 py-1 text-white text-left">Institution</th>
                <th className="border border-gray-300 px-2 py-1 text-white text-left">Board/Univ.</th>
                <th className="border border-gray-300 px-2 py-1 text-white text-center">Result</th>
                <th className="border border-gray-300 px-2 py-1 text-white text-center">Year</th>
              </tr></thead>
              <tbody>{data.education.map((edu, i) => (
                <tr key={edu.id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                  <td className="border border-gray-300 px-2 py-1">{edu.degree}</td>
                  <td className="border border-gray-300 px-2 py-1">{edu.institution}</td>
                  <td className="border border-gray-300 px-2 py-1">{edu.board}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">{edu.result}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">{edu.year}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-3">
            {data.experience.length > 0 && (
              <div>
                <h2 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: banner }}>Work Experience</h2>
                <div className="space-y-2">
                  {data.experience.map(exp => (
                    <div key={exp.id} className="border-l-2 pl-2" style={{ borderColor: accent }}>
                      <p className="font-bold text-[10px]">{exp.title}</p>
                      <p className="text-gray-500 text-[9px]">{exp.company} | {exp.startDate}–{exp.endDate}</p>
                      {exp.description && <p className="text-gray-600 text-[9px] whitespace-pre-wrap mt-0.5">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.skills.length > 0 && (
              <div>
                <h2 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: banner }}>Skills</h2>
                <div className="flex flex-wrap gap-1">
                  {data.skills.map(s => (
                    <span key={s.id} className="text-[9px] px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accent }}>{s.name}</span>
                  ))}
                </div>
              </div>
            )}
            <CustomSectionsBlock data={data} headingColor={banner} borderColor={accent} compact headingSize="text-[9px] font-black uppercase tracking-widest" />
          </div>
          {/* Personal Information on RIGHT side */}
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: banner }}>Personal Information</h2>
              <table className="w-full text-[9px]">
                <tbody>
                  {data.fathersName && <tr><td className="font-semibold py-0.5 w-2/5">Father's Name</td><td className="w-3">:</td><td>{data.fathersName}</td></tr>}
                  {data.mothersName && <tr><td className="font-semibold py-0.5">Mother's Name</td><td>:</td><td>{data.mothersName}</td></tr>}
                  {data.dob && <tr><td className="font-semibold py-0.5">Date of Birth</td><td>:</td><td>{data.dob}</td></tr>}
                  {data.nationality && <tr><td className="font-semibold py-0.5">Nationality</td><td>:</td><td>{data.nationality}</td></tr>}
                  {data.religion && <tr><td className="font-semibold py-0.5">Religion</td><td>:</td><td>{data.religion}</td></tr>}
                  {data.maritalStatus && <tr><td className="font-semibold py-0.5">Marital Status</td><td>:</td><td>{data.maritalStatus}</td></tr>}
                  {data.bloodGroup && <tr><td className="font-semibold py-0.5">Blood Group</td><td>:</td><td>{data.bloodGroup}</td></tr>}
                  {data.nid && <tr><td className="font-semibold py-0.5">National ID</td><td>:</td><td>{data.nid}</td></tr>}
                </tbody>
              </table>
            </div>
            {data.languages.length > 0 && (
              <div>
                <h2 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: banner }}>Languages</h2>
                {data.languages.map(l => (
                  <div key={l.id} className="flex justify-between text-[9px] py-0.5 border-b border-dashed border-gray-200">
                    <span>{l.name}</span>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i <= l.level ? accent : '#e5e7eb' }} />
                    ))}</div>
                  </div>
                ))}
              </div>
            )}
            {data.references.length > 0 && (
              <div>
                <h2 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: banner }}>References</h2>
                <div className="space-y-2">
                  {data.references.map(ref => (
                    <div key={ref.id} className="text-[9px] border-l-2 pl-2" style={{ borderColor: accent }}>
                      <p className="font-bold">{ref.name}</p>
                      <p className="text-gray-600">{ref.designation}, {ref.organization}</p>
                      <p className="text-gray-500">{ref.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-auto pt-2 border-t border-gray-200">
          <SignatureBlock data={data} textColor={banner} borderColor={banner} compact />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LAYOUT 5: BD Compact (Dense, single-page, more content)
   Left: objective + skills + languages
   Right: education + experience + personal details
───────────────────────────────────────────────────────────── */
const BDCompactLayout: React.FC<TemplateProps & { accentColor: string; headerBg: string }> = ({ data, theme, accentColor, headerBg }) => {
  const header = theme?.primary ?? headerBg;
  const accent = theme?.accent  ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white font-sans text-[9.5px] text-gray-900">
      <div className="px-8 py-3 flex items-center justify-between" style={{ backgroundColor: header }}>
        <div className="flex items-center gap-3">
          {data.photo && (
            <div className="w-14 h-16 border border-white/40 overflow-hidden shrink-0">
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="text-white">
            <h1 className="text-lg font-black uppercase">{data.name || 'YOUR NAME'}</h1>
            {data.jobTitle && <p className="text-[10px] opacity-80">{data.jobTitle}</p>}
          </div>
        </div>
        <div className="text-white text-right text-[9px] opacity-80 space-y-0.5">
          {data.phone && <p>{data.phone}</p>}
          {data.email && <p>{data.email}</p>}
          {data.address && <p>{data.address}</p>}
          {data.linkedin && <p>{data.linkedin}</p>}
        </div>
      </div>
      <div className="h-0.5 w-full" style={{ backgroundColor: accent }} />
      <div className="flex-1 grid grid-cols-5 gap-0 overflow-hidden">
        {/* Left narrow column */}
        <div className="col-span-2 px-5 py-4 border-r border-gray-200 flex flex-col gap-3">
          {data.objective && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: header }}>Objective</h2>
              <p className="leading-relaxed text-gray-700 text-justify">{data.objective}</p>
            </div>
          )}
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: header }}>Skills</h2>
              <ul className="space-y-0.5">
                {data.skills.map(s => <li key={s.id} className="flex items-center gap-1"><div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accent }} />{s.name}</li>)}
              </ul>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: header }}>Languages</h2>
              {data.languages.map(l => (
                <div key={l.id} className="flex justify-between py-0.5">
                  <span>{l.name}</span><span className="text-gray-400">{l.level}/5</span>
                </div>
              ))}
            </div>
          )}
          {data.references.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: header }}>References</h2>
              <div className="space-y-2">
                {data.references.map(ref => (
                  <div key={ref.id} className="text-[8.5px]">
                    <p className="font-bold">{ref.name}</p>
                    <p className="text-gray-600">{ref.designation}</p>
                    <p className="text-gray-500">{ref.organization}</p>
                    <p className="text-gray-400">{ref.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <CustomSectionsBlock data={data} headingColor={header} borderColor={accent} compact headingSize="text-[8px] font-black uppercase tracking-widest" />
        </div>
        {/* Right main column */}
        <div className="col-span-3 px-5 py-4 flex flex-col gap-3">
          {data.education.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-1.5 border-b" style={{ color: header, borderColor: accent }}>Educational Qualification</h2>
              <table className="w-full border-collapse border border-gray-300 text-[8.5px]">
                <thead><tr className="bg-gray-100">
                  <th className="border border-gray-300 px-1 py-0.5 text-left">Exam</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-left">Institution</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">Result</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">Year</th>
                </tr></thead>
                <tbody>{data.education.map(edu => (
                  <tr key={edu.id}>
                    <td className="border border-gray-300 px-1 py-0.5">{edu.degree}</td>
                    <td className="border border-gray-300 px-1 py-0.5">{edu.institution}</td>
                    <td className="border border-gray-300 px-1 py-0.5 text-center">{edu.result}</td>
                    <td className="border border-gray-300 px-1 py-0.5 text-center">{edu.year}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
          {data.experience.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-1.5 border-b" style={{ color: header, borderColor: accent }}>Work Experience</h2>
              <div className="space-y-2">
                {data.experience.map(exp => (
                  <div key={exp.id} className="flex gap-2">
                    <div className="w-1.5 shrink-0 mt-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                    <div>
                      <p className="font-bold">{exp.title} — {exp.company}</p>
                      <p className="text-gray-500 text-[8px]">{exp.startDate} to {exp.endDate}{exp.location ? ` | ${exp.location}` : ''}</p>
                      {exp.description && <p className="text-gray-600 whitespace-pre-wrap mt-0.5">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Personal Details on RIGHT side */}
          <div>
            <h2 className="text-[8px] font-black uppercase tracking-widest mb-1 border-b" style={{ color: header, borderColor: accent }}>Personal Information</h2>
            <table className="w-full text-[8.5px]">
              <tbody>
                {data.fathersName && <tr><td className="font-semibold py-0.5 w-2/5">Father's Name</td><td className="w-4">:</td><td>{data.fathersName}</td></tr>}
                {data.mothersName && <tr><td className="font-semibold py-0.5">Mother's Name</td><td>:</td><td>{data.mothersName}</td></tr>}
                {data.dob && <tr><td className="font-semibold py-0.5">DOB</td><td>:</td><td>{data.dob}</td></tr>}
                {data.nationality && <tr><td className="font-semibold py-0.5">Nationality</td><td>:</td><td>{data.nationality}</td></tr>}
                {data.religion && <tr><td className="font-semibold py-0.5">Religion</td><td>:</td><td>{data.religion}</td></tr>}
                {data.maritalStatus && <tr><td className="font-semibold py-0.5">Marital</td><td>:</td><td>{data.maritalStatus}</td></tr>}
                {data.bloodGroup && <tr><td className="font-semibold py-0.5">Blood</td><td>:</td><td>{data.bloodGroup}</td></tr>}
                {data.nid && <tr><td className="font-semibold py-0.5">NID</td><td>:</td><td>{data.nid}</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="mt-auto pt-2 border-t border-gray-200">
            <SignatureBlock data={data} textColor={header} borderColor={header} compact />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LAYOUT 6: BD Timeline (Experience as vertical timeline)
   Left sidebar: objective + skills + languages + signature
   Right: education + experience (timeline) + personal details
───────────────────────────────────────────────────────────── */
const BDTimelineLayout: React.FC<TemplateProps & { primaryColor: string; accentColor: string }> = ({ data, theme, primaryColor, accentColor }) => {
  const primary = theme?.primary ?? primaryColor;
  const accent  = theme?.accent  ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white font-sans text-[10px] text-gray-900">
      <div className="relative px-10 pt-7 pb-5" style={{ backgroundColor: primary }}>
        <div className="flex justify-between items-start">
          <div className="text-white flex-1">
            <h1 className="text-2xl font-black uppercase tracking-wide">{data.name || 'YOUR NAME'}</h1>
            {data.jobTitle && <p className="text-sm opacity-75 mt-0.5">{data.jobTitle}</p>}
            <div className="flex flex-wrap gap-x-5 gap-y-0.5 mt-2 text-[9px] opacity-70">
              {data.phone && <span>{data.phone}</span>}
              {data.email && <span>{data.email}</span>}
              {data.address && <span>{data.address}</span>}
            </div>
          </div>
          {data.photo && (
            <div className="w-16 h-20 ml-4 border-2 border-white/30 overflow-hidden shrink-0">
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 grid grid-cols-3 gap-0 overflow-hidden">
        {/* Left sidebar */}
        <div className="col-span-1 px-5 py-4 bg-gray-50 border-r border-gray-200 flex flex-col gap-4">
          {data.objective && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-1.5" style={{ color: primary }}>Profile</h2>
              <p className="text-[9px] leading-relaxed text-gray-700 text-justify">{data.objective}</p>
            </div>
          )}
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-1.5" style={{ color: primary }}>Skills</h2>
              {data.skills.map(s => (
                <div key={s.id} className="mb-1.5">
                  <div className="flex justify-between text-[9px] mb-0.5"><span className="font-medium">{s.name}</span></div>
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.level * 20}%`, backgroundColor: accent }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-1.5" style={{ color: primary }}>Languages</h2>
              {data.languages.map(l => (
                <div key={l.id} className="flex justify-between text-[9px] py-0.5 border-b border-gray-100">
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
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-1.5" style={{ color: primary }}>References</h2>
              {data.references.map(ref => (
                <div key={ref.id} className="text-[8.5px] mb-2">
                  <p className="font-bold">{ref.name}</p>
                  <p className="text-gray-500">{ref.designation}, {ref.organization}</p>
                  <p className="text-gray-400">{ref.phone}</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-auto pt-3 border-t border-gray-200">
            <SignatureBlock data={data} textColor={primary} borderColor={primary} compact layout="stack" />
          </div>
        </div>
        {/* Right: education + timeline experience + personal details */}
        <div className="col-span-2 px-6 py-4 flex flex-col gap-4">
          {data.education.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-2 pb-1 border-b-2" style={{ color: primary, borderColor: accent }}>Educational Qualification</h2>
              <table className="w-full border-collapse border border-gray-300 text-[8.5px]">
                <thead><tr style={{ backgroundColor: primary }}>
                  <th className="border border-gray-300 px-1.5 py-1 text-white text-left">Exam/Degree</th>
                  <th className="border border-gray-300 px-1.5 py-1 text-white text-left">Institution</th>
                  <th className="border border-gray-300 px-1.5 py-1 text-white text-left">Board</th>
                  <th className="border border-gray-300 px-1.5 py-1 text-white text-center">Result</th>
                  <th className="border border-gray-300 px-1.5 py-1 text-white text-center">Year</th>
                </tr></thead>
                <tbody>{data.education.map((edu, i) => (
                  <tr key={edu.id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="border border-gray-300 px-1.5 py-1">{edu.degree}</td>
                    <td className="border border-gray-300 px-1.5 py-1">{edu.institution}</td>
                    <td className="border border-gray-300 px-1.5 py-1">{edu.board}</td>
                    <td className="border border-gray-300 px-1.5 py-1 text-center">{edu.result}</td>
                    <td className="border border-gray-300 px-1.5 py-1 text-center">{edu.year}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
          {data.experience.length > 0 && (
            <div>
              <h2 className="text-[8px] font-black uppercase tracking-widest mb-2 pb-1 border-b-2" style={{ color: primary, borderColor: accent }}>Work Experience</h2>
              <div className="relative">
                <div className="absolute left-2 top-0 bottom-0 w-0.5" style={{ backgroundColor: accent + '40' }} />
                <div className="space-y-3 pl-6">
                  {data.experience.map(exp => (
                    <div key={exp.id} className="relative">
                      <div className="absolute -left-4 top-1 w-2 h-2 rounded-full border-2 border-white" style={{ backgroundColor: accent }} />
                      <div className="flex justify-between items-baseline">
                        <p className="font-bold text-[9px]">{exp.title}</p>
                        <span className="text-[8px] text-gray-400 shrink-0 ml-1">{exp.startDate}–{exp.endDate}</span>
                      </div>
                      <p className="text-[8.5px] font-semibold" style={{ color: accent }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                      {exp.description && <p className="text-[8.5px] text-gray-600 whitespace-pre-wrap mt-0.5">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <CustomSectionsBlock data={data} headingColor={primary} borderColor={accent} compact headingSize="text-[8px] font-black uppercase tracking-widest" />
          {/* Personal Details on RIGHT side */}
          <div>
            <h2 className="text-[8px] font-black uppercase tracking-widest mb-1.5 pb-1 border-b-2" style={{ color: primary, borderColor: accent }}>Personal Information</h2>
            <div className="grid grid-cols-2 gap-x-4">
              <table className="text-[8.5px]">
                <tbody>
                  {data.fathersName && <tr><td className="font-semibold py-0.5">Father's Name</td><td className="px-1">:</td><td>{data.fathersName}</td></tr>}
                  {data.mothersName && <tr><td className="font-semibold py-0.5">Mother's Name</td><td className="px-1">:</td><td>{data.mothersName}</td></tr>}
                  {data.dob && <tr><td className="font-semibold py-0.5">Date of Birth</td><td className="px-1">:</td><td>{data.dob}</td></tr>}
                  {data.nationality && <tr><td className="font-semibold py-0.5">Nationality</td><td className="px-1">:</td><td>{data.nationality}</td></tr>}
                </tbody>
              </table>
              <table className="text-[8.5px]">
                <tbody>
                  {data.religion && <tr><td className="font-semibold py-0.5">Religion</td><td className="px-1">:</td><td>{data.religion}</td></tr>}
                  {data.maritalStatus && <tr><td className="font-semibold py-0.5">Marital Status</td><td className="px-1">:</td><td>{data.maritalStatus}</td></tr>}
                  {data.bloodGroup && <tr><td className="font-semibold py-0.5">Blood Group</td><td className="px-1">:</td><td>{data.bloodGroup}</td></tr>}
                  {data.nid && <tr><td className="font-semibold py-0.5">National ID</td><td className="px-1">:</td><td>{data.nid}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const bdExtra2Templates: TemplateDefinition[] = [
  { id: "bd-two-col-blue",    name: "BD Two-Col Blue",   category: "Bangladeshi", colorSwatch: "#1d4ed8", component: (p) => <BDTwoColumnLayout   {...p} sidebarColor="#1d4ed8" accentColor="#3b82f6" /> },
  { id: "bd-two-col-green",   name: "BD Two-Col Green",  category: "Bangladeshi", colorSwatch: "#065f46", component: (p) => <BDTwoColumnLayout   {...p} sidebarColor="#065f46" accentColor="#34d399" /> },
  { id: "bd-two-col-maroon",  name: "BD Two-Col Maroon", category: "Bangladeshi", colorSwatch: "#881337", component: (p) => <BDTwoColumnLayout   {...p} sidebarColor="#881337" accentColor="#f43f5e" /> },
  { id: "bd-two-col-purple",  name: "BD Two-Col Purple", category: "Bangladeshi", colorSwatch: "#5b21b6", component: (p) => <BDTwoColumnLayout   {...p} sidebarColor="#5b21b6" accentColor="#8b5cf6" /> },
  { id: "bd-modern-prof-blue",  name: "BD Strip Blue",    category: "Bangladeshi", colorSwatch: "#1e40af", component: (p) => <BDModernProfLayout  {...p} stripColor="#1e40af"  accentColor="#3b82f6" /> },
  { id: "bd-modern-prof-green", name: "BD Strip Green",   category: "Bangladeshi", colorSwatch: "#14532d", component: (p) => <BDModernProfLayout  {...p} stripColor="#14532d"  accentColor="#22c55e" /> },
  { id: "bd-modern-prof-red",   name: "BD Strip Red",     category: "Bangladeshi", colorSwatch: "#7f1d1d", component: (p) => <BDModernProfLayout  {...p} stripColor="#7f1d1d"  accentColor="#ef4444" /> },
  { id: "bd-gov-blue",    name: "BD Gov Blue",    category: "Bangladeshi", colorSwatch: "#1d4ed8", component: (p) => <BDGovLayout {...p} accentColor="#1d4ed8" /> },
  { id: "bd-gov-green",   name: "BD Gov Green",   category: "Bangladeshi", colorSwatch: "#166534", component: (p) => <BDGovLayout {...p} accentColor="#166534" /> },
  { id: "bd-gov-maroon",  name: "BD Gov Maroon",  category: "Bangladeshi", colorSwatch: "#9f1239", component: (p) => <BDGovLayout {...p} accentColor="#9f1239" /> },
  { id: "bd-elegant-blue",   name: "BD Elegant Blue",   category: "Bangladeshi", colorSwatch: "#1e40af", component: (p) => <BDElegantLayout {...p} bannerColor="#1e40af" accentColor="#3b82f6" /> },
  { id: "bd-elegant-teal",   name: "BD Elegant Teal",   category: "Bangladeshi", colorSwatch: "#0f766e", component: (p) => <BDElegantLayout {...p} bannerColor="#0f766e" accentColor="#2dd4bf" /> },
  { id: "bd-elegant-maroon", name: "BD Elegant Maroon", category: "Bangladeshi", colorSwatch: "#881337", component: (p) => <BDElegantLayout {...p} bannerColor="#881337" accentColor="#fb7185" /> },
  { id: "bd-compact-blue",   name: "BD Compact Blue",   category: "Bangladeshi", colorSwatch: "#1d4ed8", component: (p) => <BDCompactLayout {...p} headerBg="#1d4ed8" accentColor="#3b82f6" /> },
  { id: "bd-compact-green",  name: "BD Compact Green",  category: "Bangladeshi", colorSwatch: "#065f46", component: (p) => <BDCompactLayout {...p} headerBg="#065f46" accentColor="#34d399" /> },
  { id: "bd-compact-gray",   name: "BD Compact Gray",   category: "Bangladeshi", colorSwatch: "#374151", component: (p) => <BDCompactLayout {...p} headerBg="#374151" accentColor="#9ca3af" /> },
  { id: "bd-timeline-blue",   name: "BD Timeline Blue",   category: "Bangladeshi", colorSwatch: "#1e40af", component: (p) => <BDTimelineLayout {...p} primaryColor="#1e40af" accentColor="#3b82f6" /> },
  { id: "bd-timeline-green",  name: "BD Timeline Green",  category: "Bangladeshi", colorSwatch: "#14532d", component: (p) => <BDTimelineLayout {...p} primaryColor="#14532d" accentColor="#22c55e" /> },
  { id: "bd-timeline-purple", name: "BD Timeline Purple", category: "Bangladeshi", colorSwatch: "#5b21b6", component: (p) => <BDTimelineLayout {...p} primaryColor="#5b21b6" accentColor="#8b5cf6" /> },
];
