import { TemplateDefinition, TemplateProps } from "./types";
import { CustomSectionsBlock } from "./custom-sections-block";

/* ─────────────────────────────────────────────────────────────
   LAYOUT 1: BD Two-Column Sidebar
   Left sidebar: photo + contact + skills + languages
   Right: main CV content
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
          <div className="mt-auto">
            <h2 className="font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2 text-[9px]">Personal</h2>
            <div className="space-y-0.5 opacity-90">
              {data.fathersName && <p>Father: {data.fathersName}</p>}
              {data.dob && <p>DOB: {data.dob}</p>}
              {data.nationality && <p>Nationality: {data.nationality}</p>}
              {data.religion && <p>Religion: {data.religion}</p>}
              {data.bloodGroup && <p>Blood: {data.bloodGroup}</p>}
            </div>
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
        <div className="mt-auto pt-3 flex justify-between text-[9px] font-bold border-t">
          <span>Date: _______________</span>
          <div className="text-center"><div className="border-b border-black w-32 mb-0.5"></div>Signature</div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LAYOUT 2: BD Modern Professional (Accent Strip)
   Bold left accent strip, boxed section headings
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
        <div className="mt-auto pt-2 flex justify-between text-[9px] font-bold border-t border-gray-200">
          <span>Date: _______________</span>
          <div className="text-center"><div className="border-b border-black w-32 mb-0.5"></div>Signature</div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LAYOUT 3: BD Government / Formal (Traditional single-column)
   All headings underlined, signature at bottom right
───────────────────────────────────────────────────────────── */
const BDGovLayout: React.FC<TemplateProps & { accentColor: string }> = ({ data, theme, accentColor }) => {
  const accent = theme?.accent ?? theme?.primary ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white font-sans text-[10.5px] text-gray-900 px-14 pt-8 pb-6 gap-3">
      {/* Title */}
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
      <div className="mt-auto pt-3 flex justify-between items-end text-[9px] font-bold">
        <div>Date: _________________</div>
        <div className="text-center"><div className="border-b border-black w-36 mb-1" /><span>Signature of Applicant</span></div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LAYOUT 4: BD Elegant (Top banner + bordered sections)
───────────────────────────────────────────────────────────── */
const BDElegantLayout: React.FC<TemplateProps & { bannerColor: string; accentColor: string }> = ({ data, theme, bannerColor, accentColor }) => {
  const banner = theme?.primary ?? bannerColor;
  const accent = theme?.accent  ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white font-sans text-[10.5px] text-gray-900">
      {/* Top banner */}
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
      {/* Accent stripe */}
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
        <div className="mt-auto flex justify-between text-[9px] font-bold pt-2 border-t border-gray-200">
          <span>Date: _______________</span>
          <div className="text-center"><div className="border-b border-black w-32 mb-0.5" />Signature</div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LAYOUT 5: BD Compact (Dense, single-page, more content)
───────────────────────────────────────────────────────────── */
const BDCompactLayout: React.FC<TemplateProps & { accentColor: string; headerBg: string }> = ({ data, theme, accentColor, headerBg }) => {
  const header = theme?.primary ?? headerBg;
  const accent = theme?.accent  ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white font-sans text-[9.5px] text-gray-900">
      {/* Compact header */}
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
          <div>
            <h2 className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: header }}>Personal Info</h2>
            <table className="w-full text-[8.5px]">
              <tbody>
                {data.fathersName && <tr><td className="font-semibold py-0.5">Father's</td><td>:</td><td>{data.fathersName}</td></tr>}
                {data.mothersName && <tr><td className="font-semibold py-0.5">Mother's</td><td>:</td><td>{data.mothersName}</td></tr>}
                {data.dob && <tr><td className="font-semibold py-0.5">DOB</td><td>:</td><td>{data.dob}</td></tr>}
                {data.nationality && <tr><td className="font-semibold py-0.5">Nationality</td><td>:</td><td>{data.nationality}</td></tr>}
                {data.religion && <tr><td className="font-semibold py-0.5">Religion</td><td>:</td><td>{data.religion}</td></tr>}
                {data.maritalStatus && <tr><td className="font-semibold py-0.5">Marital</td><td>:</td><td>{data.maritalStatus}</td></tr>}
                {data.bloodGroup && <tr><td className="font-semibold py-0.5">Blood</td><td>:</td><td>{data.bloodGroup}</td></tr>}
                {data.nid && <tr><td className="font-semibold py-0.5">NID</td><td>:</td><td>{data.nid}</td></tr>}
              </tbody>
            </table>
          </div>
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
          <CustomSectionsBlock data={data} headingColor={header} borderColor={accent} compact headingSize="text-[8px] font-black uppercase tracking-widest" />
          <div className="mt-auto flex justify-between text-[8.5px] font-bold pt-2 border-t border-gray-200">
            <span>Date: _______________</span>
            <div className="text-center"><div className="border-b border-black w-28 mb-0.5" />Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LAYOUT 6: BD Timeline (Experience as vertical timeline)
───────────────────────────────────────────────────────────── */
const BDTimelineLayout: React.FC<TemplateProps & { primaryColor: string; accentColor: string }> = ({ data, theme, primaryColor, accentColor }) => {
  const primary = theme?.primary ?? primaryColor;
  const accent  = theme?.accent  ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white font-sans text-[10px] text-gray-900">
      {/* Header with diagonal slice effect using padding */}
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
          <div>
            <h2 className="text-[8px] font-black uppercase tracking-widest mb-1.5" style={{ color: primary }}>Personal</h2>
            <table className="w-full text-[8.5px]">
              <tbody>
                {data.fathersName && <tr><td className="font-semibold py-0.5">Father's</td><td>: {data.fathersName}</td></tr>}
                {data.mothersName && <tr><td className="font-semibold py-0.5">Mother's</td><td>: {data.mothersName}</td></tr>}
                {data.dob && <tr><td className="font-semibold py-0.5">DOB</td><td>: {data.dob}</td></tr>}
                {data.nationality && <tr><td className="font-semibold py-0.5">Nationality</td><td>: {data.nationality}</td></tr>}
                {data.religion && <tr><td className="font-semibold py-0.5">Religion</td><td>: {data.religion}</td></tr>}
                {data.maritalStatus && <tr><td className="font-semibold py-0.5">Marital</td><td>: {data.maritalStatus}</td></tr>}
                {data.bloodGroup && <tr><td className="font-semibold py-0.5">Blood</td><td>: {data.bloodGroup}</td></tr>}
                {data.nid && <tr><td className="font-semibold py-0.5">NID</td><td>: {data.nid}</td></tr>}
              </tbody>
            </table>
          </div>
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
        </div>
        {/* Right: education + timeline experience */}
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
                {/* Timeline line */}
                <div className="absolute left-2 top-0 bottom-0 w-0.5" style={{ backgroundColor: accent + '40' }} />
                <div className="space-y-3 pl-6">
                  {data.experience.map(exp => (
                    <div key={exp.id} className="relative">
                      <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full border-2 bg-white" style={{ borderColor: accent }} />
                      <p className="font-bold text-[10px]">{exp.title}</p>
                      <p className="font-semibold text-[9px]" style={{ color: accent }}>{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
                      <p className="text-gray-400 text-[8px]">{exp.startDate} – {exp.endDate}</p>
                      {exp.description && <p className="text-gray-600 text-[8.5px] mt-0.5 whitespace-pre-wrap">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <CustomSectionsBlock data={data} headingColor={primary} borderColor={accent} compact headingSize="text-[8px] font-black uppercase tracking-widest" />
          <div className="mt-auto pt-2 flex justify-between text-[8.5px] font-bold border-t border-gray-200">
            <span>Date: _______________</span>
            <div className="text-center"><div className="border-b border-black w-32 mb-0.5" />Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LAYOUT 7: BD Clean Minimal (No sidebar, clean boxes)
───────────────────────────────────────────────────────────── */
const BDCleanLayout: React.FC<TemplateProps & { accentColor: string }> = ({ data, theme, accentColor }) => {
  const accent = theme?.accent ?? theme?.primary ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white font-sans text-[10px] text-gray-900 px-12 py-7 gap-3">
      <div className="flex justify-between items-start pb-3 border-b-4" style={{ borderColor: accent }}>
        <div className="flex-1">
          <h1 className="text-3xl font-black uppercase" style={{ color: accent }}>{data.name || 'YOUR NAME'}</h1>
          {data.jobTitle && <p className="text-gray-500 mt-0.5">{data.jobTitle}</p>}
          <div className="flex flex-wrap gap-x-5 mt-1.5 text-[9px] text-gray-500">
            {data.phone && <span>{data.phone}</span>}
            {data.email && <span>{data.email}</span>}
            {data.address && <span>{data.address}</span>}
            {data.linkedin && <span>{data.linkedin}</span>}
          </div>
        </div>
        {data.photo && (
          <div className="w-16 h-20 ml-5 border border-gray-200 overflow-hidden shrink-0">
            <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      {data.objective && (
        <div className="bg-gray-50 border-l-4 pl-3 py-1.5 rounded-r" style={{ borderColor: accent }}>
          <p className="text-[9.5px] leading-relaxed text-gray-700 text-justify">{data.objective}</p>
        </div>
      )}
      {data.education.length > 0 && (
        <div>
          <h2 className="text-[9px] font-black uppercase tracking-widest mb-1.5 pb-0.5 border-b-2" style={{ color: accent, borderColor: accent }}>Education</h2>
          <table className="w-full border-collapse text-[9px]">
            <thead><tr className="bg-gray-100">
              <th className="border border-gray-200 px-2 py-1 text-left">Exam / Degree</th>
              <th className="border border-gray-200 px-2 py-1 text-left">Institution</th>
              <th className="border border-gray-200 px-2 py-1 text-left">Board</th>
              <th className="border border-gray-200 px-2 py-1 text-center">Result</th>
              <th className="border border-gray-200 px-2 py-1 text-center">Year</th>
            </tr></thead>
            <tbody>{data.education.map(edu => (
              <tr key={edu.id}>
                <td className="border border-gray-200 px-2 py-1">{edu.degree}</td>
                <td className="border border-gray-200 px-2 py-1">{edu.institution}</td>
                <td className="border border-gray-200 px-2 py-1">{edu.board}</td>
                <td className="border border-gray-200 px-2 py-1 text-center">{edu.result}</td>
                <td className="border border-gray-200 px-2 py-1 text-center">{edu.year}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-3">
          {data.experience.length > 0 && (
            <div>
              <h2 className="text-[9px] font-black uppercase tracking-widest mb-1.5 pb-0.5 border-b-2" style={{ color: accent, borderColor: accent }}>Experience</h2>
              <div className="space-y-2">
                {data.experience.map(exp => (
                  <div key={exp.id} className="text-[9px]">
                    <p className="font-bold">{exp.title}</p>
                    <p className="text-gray-600">{exp.company} · {exp.startDate}–{exp.endDate}</p>
                    {exp.description && <p className="text-gray-500 mt-0.5 whitespace-pre-wrap">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-[9px] font-black uppercase tracking-widest mb-1.5 pb-0.5 border-b-2" style={{ color: accent, borderColor: accent }}>Skills</h2>
              <div className="flex flex-wrap gap-1">
                {data.skills.map(s => (
                  <span key={s.id} className="text-[8.5px] px-2 py-0.5 border rounded" style={{ borderColor: accent + '60', color: accent }}>{s.name}</span>
                ))}
              </div>
            </div>
          )}
          <CustomSectionsBlock data={data} headingColor={accent} borderColor={accent} compact headingSize="text-[9px] font-black uppercase tracking-widest" />
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-[9px] font-black uppercase tracking-widest mb-1.5 pb-0.5 border-b-2" style={{ color: accent, borderColor: accent }}>Personal Information</h2>
            <table className="w-full text-[8.5px]">
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
              <h2 className="text-[9px] font-black uppercase tracking-widest mb-1.5 pb-0.5 border-b-2" style={{ color: accent, borderColor: accent }}>Languages</h2>
              {data.languages.map(l => (
                <div key={l.id} className="flex justify-between items-center py-0.5 border-b border-gray-100">
                  <span className="text-[9px] font-medium">{l.name}</span>
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(i => (
                    <div key={i} className="w-2 h-2 rounded-sm" style={{ backgroundColor: i <= l.level ? accent : '#e5e7eb' }} />
                  ))}</div>
                </div>
              ))}
            </div>
          )}
          {data.references.length > 0 && (
            <div>
              <h2 className="text-[9px] font-black uppercase tracking-widest mb-1.5 pb-0.5 border-b-2" style={{ color: accent, borderColor: accent }}>References</h2>
              <div className="space-y-2">
                {data.references.map(ref => (
                  <div key={ref.id} className="text-[8.5px]">
                    <p className="font-bold">{ref.name}</p>
                    <p className="text-gray-500">{ref.designation}, {ref.organization}</p>
                    <p className="text-gray-400">{ref.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-auto flex justify-between text-[8.5px] font-bold pt-2 border-t border-gray-200">
        <span>Date: _______________</span>
        <div className="text-center"><div className="border-b border-black w-32 mb-0.5" />Signature</div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ALL EXPORT DEFINITIONS — 52 new templates
───────────────────────────────────────────────────────────── */
export const bdExtra2Templates: TemplateDefinition[] = [
  /* BD Two-Column Sidebar — 8 variants */
  { id: "bd-two-col-navy",    name: "BD Two-Col Navy",    category: "Bangladeshi", colorSwatch: "#1e3a8a", component: (p) => <BDTwoColumnLayout {...p} sidebarColor="#1e3a8a" accentColor="#3b82f6" /> },
  { id: "bd-two-col-green",   name: "BD Two-Col Green",   category: "Bangladeshi", colorSwatch: "#14532d", component: (p) => <BDTwoColumnLayout {...p} sidebarColor="#14532d" accentColor="#22c55e" /> },
  { id: "bd-two-col-maroon",  name: "BD Two-Col Maroon",  category: "Bangladeshi", colorSwatch: "#881337", component: (p) => <BDTwoColumnLayout {...p} sidebarColor="#881337" accentColor="#f43f5e" /> },
  { id: "bd-two-col-purple",  name: "BD Two-Col Purple",  category: "Bangladeshi", colorSwatch: "#4c1d95", component: (p) => <BDTwoColumnLayout {...p} sidebarColor="#4c1d95" accentColor="#8b5cf6" /> },
  { id: "bd-two-col-teal",    name: "BD Two-Col Teal",    category: "Bangladeshi", colorSwatch: "#134e4a", component: (p) => <BDTwoColumnLayout {...p} sidebarColor="#134e4a" accentColor="#14b8a6" /> },
  { id: "bd-two-col-slate",   name: "BD Two-Col Slate",   category: "Bangladeshi", colorSwatch: "#1e293b", component: (p) => <BDTwoColumnLayout {...p} sidebarColor="#1e293b" accentColor="#64748b" /> },
  { id: "bd-two-col-indigo",  name: "BD Two-Col Indigo",  category: "Bangladeshi", colorSwatch: "#312e81", component: (p) => <BDTwoColumnLayout {...p} sidebarColor="#312e81" accentColor="#6366f1" /> },
  { id: "bd-two-col-brown",   name: "BD Two-Col Brown",   category: "Bangladeshi", colorSwatch: "#78350f", component: (p) => <BDTwoColumnLayout {...p} sidebarColor="#78350f" accentColor="#d97706" /> },

  /* BD Modern Professional — 8 variants */
  { id: "bd-modern-prof-blue",    name: "BD Modern Prof Blue",    category: "Bangladeshi", colorSwatch: "#1d4ed8", component: (p) => <BDModernProfLayout {...p} stripColor="#1d4ed8" accentColor="#60a5fa" /> },
  { id: "bd-modern-prof-green",   name: "BD Modern Prof Green",   category: "Bangladeshi", colorSwatch: "#166534", component: (p) => <BDModernProfLayout {...p} stripColor="#166534" accentColor="#4ade80" /> },
  { id: "bd-modern-prof-red",     name: "BD Modern Prof Red",     category: "Bangladeshi", colorSwatch: "#991b1b", component: (p) => <BDModernProfLayout {...p} stripColor="#991b1b" accentColor="#f87171" /> },
  { id: "bd-modern-prof-purple",  name: "BD Modern Prof Purple",  category: "Bangladeshi", colorSwatch: "#6d28d9", component: (p) => <BDModernProfLayout {...p} stripColor="#6d28d9" accentColor="#a78bfa" /> },
  { id: "bd-modern-prof-teal",    name: "BD Modern Prof Teal",    category: "Bangladeshi", colorSwatch: "#0f766e", component: (p) => <BDModernProfLayout {...p} stripColor="#0f766e" accentColor="#2dd4bf" /> },
  { id: "bd-modern-prof-slate",   name: "BD Modern Prof Slate",   category: "Bangladeshi", colorSwatch: "#334155", component: (p) => <BDModernProfLayout {...p} stripColor="#334155" accentColor="#94a3b8" /> },
  { id: "bd-modern-prof-amber",   name: "BD Modern Prof Amber",   category: "Bangladeshi", colorSwatch: "#92400e", component: (p) => <BDModernProfLayout {...p} stripColor="#92400e" accentColor="#fbbf24" /> },
  { id: "bd-modern-prof-rose",    name: "BD Modern Prof Rose",    category: "Bangladeshi", colorSwatch: "#9f1239", component: (p) => <BDModernProfLayout {...p} stripColor="#9f1239" accentColor="#fb7185" /> },

  /* BD Government Formal — 7 variants */
  { id: "bd-gov-blue",    name: "BD Gov Blue",    category: "Bangladeshi", colorSwatch: "#1e40af", component: (p) => <BDGovLayout {...p} accentColor="#1e40af" /> },
  { id: "bd-gov-green",   name: "BD Gov Green",   category: "Bangladeshi", colorSwatch: "#15803d", component: (p) => <BDGovLayout {...p} accentColor="#15803d" /> },
  { id: "bd-gov-black",   name: "BD Gov Black",   category: "Bangladeshi", colorSwatch: "#111827", component: (p) => <BDGovLayout {...p} accentColor="#111827" /> },
  { id: "bd-gov-maroon",  name: "BD Gov Maroon",  category: "Bangladeshi", colorSwatch: "#7f1d1d", component: (p) => <BDGovLayout {...p} accentColor="#7f1d1d" /> },
  { id: "bd-gov-teal",    name: "BD Gov Teal",    category: "Bangladeshi", colorSwatch: "#0f766e", component: (p) => <BDGovLayout {...p} accentColor="#0f766e" /> },
  { id: "bd-gov-purple",  name: "BD Gov Purple",  category: "Bangladeshi", colorSwatch: "#581c87", component: (p) => <BDGovLayout {...p} accentColor="#581c87" /> },
  { id: "bd-gov-brown",   name: "BD Gov Brown",   category: "Bangladeshi", colorSwatch: "#713f12", component: (p) => <BDGovLayout {...p} accentColor="#713f12" /> },

  /* BD Elegant — 7 variants */
  { id: "bd-elegant-navy",    name: "BD Elegant Navy",    category: "Bangladeshi", colorSwatch: "#1e3a8a", component: (p) => <BDElegantLayout {...p} bannerColor="#1e3a8a" accentColor="#3b82f6" /> },
  { id: "bd-elegant-emerald", name: "BD Elegant Emerald", category: "Bangladeshi", colorSwatch: "#065f46", component: (p) => <BDElegantLayout {...p} bannerColor="#065f46" accentColor="#10b981" /> },
  { id: "bd-elegant-crimson", name: "BD Elegant Crimson", category: "Bangladeshi", colorSwatch: "#9f1239", component: (p) => <BDElegantLayout {...p} bannerColor="#9f1239" accentColor="#f43f5e" /> },
  { id: "bd-elegant-violet",  name: "BD Elegant Violet",  category: "Bangladeshi", colorSwatch: "#5b21b6", component: (p) => <BDElegantLayout {...p} bannerColor="#5b21b6" accentColor="#8b5cf6" /> },
  { id: "bd-elegant-charcoal",name: "BD Elegant Charcoal",category: "Bangladeshi", colorSwatch: "#1f2937", component: (p) => <BDElegantLayout {...p} bannerColor="#1f2937" accentColor="#6b7280" /> },
  { id: "bd-elegant-teal",    name: "BD Elegant Teal",    category: "Bangladeshi", colorSwatch: "#0e7490", component: (p) => <BDElegantLayout {...p} bannerColor="#0e7490" accentColor="#22d3ee" /> },
  { id: "bd-elegant-amber",   name: "BD Elegant Amber",   category: "Bangladeshi", colorSwatch: "#b45309", component: (p) => <BDElegantLayout {...p} bannerColor="#b45309" accentColor="#f59e0b" /> },

  /* BD Compact — 7 variants */
  { id: "bd-compact-navy",    name: "BD Compact Navy",    category: "Bangladeshi", colorSwatch: "#1e3a8a", component: (p) => <BDCompactLayout {...p} headerBg="#1e3a8a" accentColor="#3b82f6" /> },
  { id: "bd-compact-green",   name: "BD Compact Green",   category: "Bangladeshi", colorSwatch: "#14532d", component: (p) => <BDCompactLayout {...p} headerBg="#14532d" accentColor="#22c55e" /> },
  { id: "bd-compact-red",     name: "BD Compact Red",     category: "Bangladeshi", colorSwatch: "#991b1b", component: (p) => <BDCompactLayout {...p} headerBg="#991b1b" accentColor="#f87171" /> },
  { id: "bd-compact-purple",  name: "BD Compact Purple",  category: "Bangladeshi", colorSwatch: "#581c87", component: (p) => <BDCompactLayout {...p} headerBg="#581c87" accentColor="#a78bfa" /> },
  { id: "bd-compact-teal",    name: "BD Compact Teal",    category: "Bangladeshi", colorSwatch: "#0f766e", component: (p) => <BDCompactLayout {...p} headerBg="#0f766e" accentColor="#2dd4bf" /> },
  { id: "bd-compact-slate",   name: "BD Compact Slate",   category: "Bangladeshi", colorSwatch: "#334155", component: (p) => <BDCompactLayout {...p} headerBg="#334155" accentColor="#94a3b8" /> },
  { id: "bd-compact-rose",    name: "BD Compact Rose",    category: "Bangladeshi", colorSwatch: "#be123c", component: (p) => <BDCompactLayout {...p} headerBg="#be123c" accentColor="#fb7185" /> },

  /* BD Timeline — 7 variants */
  { id: "bd-timeline-blue",    name: "BD Timeline Blue",    category: "Bangladeshi", colorSwatch: "#1e40af", component: (p) => <BDTimelineLayout {...p} primaryColor="#1e40af" accentColor="#60a5fa" /> },
  { id: "bd-timeline-green",   name: "BD Timeline Green",   category: "Bangladeshi", colorSwatch: "#166534", component: (p) => <BDTimelineLayout {...p} primaryColor="#166534" accentColor="#4ade80" /> },
  { id: "bd-timeline-red",     name: "BD Timeline Red",     category: "Bangladeshi", colorSwatch: "#991b1b", component: (p) => <BDTimelineLayout {...p} primaryColor="#991b1b" accentColor="#f87171" /> },
  { id: "bd-timeline-purple",  name: "BD Timeline Purple",  category: "Bangladeshi", colorSwatch: "#6d28d9", component: (p) => <BDTimelineLayout {...p} primaryColor="#6d28d9" accentColor="#a78bfa" /> },
  { id: "bd-timeline-teal",    name: "BD Timeline Teal",    category: "Bangladeshi", colorSwatch: "#0e7490", component: (p) => <BDTimelineLayout {...p} primaryColor="#0e7490" accentColor="#22d3ee" /> },
  { id: "bd-timeline-slate",   name: "BD Timeline Slate",   category: "Bangladeshi", colorSwatch: "#1e293b", component: (p) => <BDTimelineLayout {...p} primaryColor="#1e293b" accentColor="#94a3b8" /> },
  { id: "bd-timeline-amber",   name: "BD Timeline Amber",   category: "Bangladeshi", colorSwatch: "#92400e", component: (p) => <BDTimelineLayout {...p} primaryColor="#92400e" accentColor="#fbbf24" /> },

  /* BD Clean Minimal — 8 variants */
  { id: "bd-clean-blue",    name: "BD Clean Blue",    category: "Bangladeshi", colorSwatch: "#1d4ed8", component: (p) => <BDCleanLayout {...p} accentColor="#1d4ed8" /> },
  { id: "bd-clean-green",   name: "BD Clean Green",   category: "Bangladeshi", colorSwatch: "#15803d", component: (p) => <BDCleanLayout {...p} accentColor="#15803d" /> },
  { id: "bd-clean-red",     name: "BD Clean Red",     category: "Bangladeshi", colorSwatch: "#b91c1c", component: (p) => <BDCleanLayout {...p} accentColor="#b91c1c" /> },
  { id: "bd-clean-purple",  name: "BD Clean Purple",  category: "Bangladeshi", colorSwatch: "#7c3aed", component: (p) => <BDCleanLayout {...p} accentColor="#7c3aed" /> },
  { id: "bd-clean-teal",    name: "BD Clean Teal",    category: "Bangladeshi", colorSwatch: "#0f766e", component: (p) => <BDCleanLayout {...p} accentColor="#0f766e" /> },
  { id: "bd-clean-slate",   name: "BD Clean Slate",   category: "Bangladeshi", colorSwatch: "#475569", component: (p) => <BDCleanLayout {...p} accentColor="#475569" /> },
  { id: "bd-clean-amber",   name: "BD Clean Amber",   category: "Bangladeshi", colorSwatch: "#d97706", component: (p) => <BDCleanLayout {...p} accentColor="#d97706" /> },
  { id: "bd-clean-rose",    name: "BD Clean Rose",    category: "Bangladeshi", colorSwatch: "#e11d48", component: (p) => <BDCleanLayout {...p} accentColor="#e11d48" /> },
];
