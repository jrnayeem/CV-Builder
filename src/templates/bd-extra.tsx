import { TemplateDefinition, TemplateProps } from "./types";
import { CustomSectionsBlock } from "./custom-sections-block";

const BDColoredHeaderLayout: React.FC<TemplateProps & { headerColor: string; accentColor: string }> = ({ data, theme, headerColor, accentColor }) => {
  const primary = theme?.primary ?? headerColor;
  const accent = theme?.accent ?? accentColor;
  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-white text-left font-sans text-gray-900">
      <div className="w-full text-white px-10 py-6 flex justify-between items-center" style={{ backgroundColor: primary }}>
        <div className="flex-1">
          <h1 className="text-2xl font-bold uppercase mb-1">{data.name || 'YOUR NAME'}</h1>
          {data.jobTitle && <p className="text-sm opacity-90 mb-3">{data.jobTitle}</p>}
          <div className="text-xs opacity-80 space-y-0.5">
            {data.phone && <p>Phone: {data.phone}</p>}
            {data.email && <p>Email: {data.email}</p>}
            {data.address && <p>Address: {data.address}</p>}
          </div>
        </div>
        {data.photo && (
          <div className="w-[3.5cm] h-[4.5cm] border-2 border-white/40 p-0.5 shrink-0 ml-4">
            <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      <div className="px-10 py-5 flex-1 flex flex-col gap-4 overflow-hidden">
        {data.objective && (
          <div>
            <h2 className="text-xs font-bold uppercase py-0.5 mb-2 border-b" style={{ color: accent, borderBottomColor: accent }}>Career Objective</h2>
            <p className="text-xs text-justify leading-relaxed">{data.objective}</p>
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase py-0.5 mb-2 border-b" style={{ color: accent, borderBottomColor: accent }}>Educational Qualification</h2>
            <table className="w-full text-xs border-collapse border border-gray-300">
              <thead><tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1 text-left">Exam / Degree</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Institution</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Board/University</th>
                <th className="border border-gray-300 px-2 py-1 text-center">Result</th>
                <th className="border border-gray-300 px-2 py-1 text-center">Year</th>
              </tr></thead>
              <tbody>{data.education.map(edu => (
                <tr key={edu.id}>
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
        {data.experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase py-0.5 mb-2 border-b" style={{ color: accent, borderBottomColor: accent }}>Experience</h2>
            <div className="space-y-2">{data.experience.map(exp => (
              <div key={exp.id} className="text-xs">
                <p className="font-bold">{exp.title} — {exp.company}</p>
                <p>Duration: {exp.startDate} to {exp.endDate}</p>
                {exp.description && <p className="whitespace-pre-wrap mt-0.5">{exp.description}</p>}
              </div>
            ))}</div>
          </div>
        )}
        <CustomSectionsBlock data={data} headingColor={accent} borderColor={accent} compact headingSize="text-xs font-bold uppercase" />
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-xs font-bold uppercase py-0.5 mb-2 border-b" style={{ color: accent, borderBottomColor: accent }}>Personal Details</h2>
            <table className="w-full text-xs">
              <tbody>
                <tr><td className="font-semibold py-0.5 w-2/5">Father's Name</td><td className="w-4">:</td><td>{data.fathersName}</td></tr>
                <tr><td className="font-semibold py-0.5">Mother's Name</td><td>:</td><td>{data.mothersName}</td></tr>
                <tr><td className="font-semibold py-0.5">Date of Birth</td><td>:</td><td>{data.dob}</td></tr>
                <tr><td className="font-semibold py-0.5">Nationality</td><td>:</td><td>{data.nationality}</td></tr>
                <tr><td className="font-semibold py-0.5">Religion</td><td>:</td><td>{data.religion}</td></tr>
                <tr><td className="font-semibold py-0.5">Marital Status</td><td>:</td><td>{data.maritalStatus}</td></tr>
                <tr><td className="font-semibold py-0.5">Blood Group</td><td>:</td><td>{data.bloodGroup}</td></tr>
              </tbody>
            </table>
          </div>
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase py-0.5 mb-2 border-b" style={{ color: accent, borderBottomColor: accent }}>Skills</h2>
              <ul className="text-xs space-y-0.5">{data.skills.map(s => <li key={s.id}>• {s.name}</li>)}</ul>
            </div>
          )}
        </div>
        {data.references.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase py-0.5 mb-2 border-b" style={{ color: accent, borderBottomColor: accent }}>References</h2>
            <div className="grid grid-cols-2 gap-4 text-xs">{data.references.map(ref => (
              <div key={ref.id}>
                <p className="font-bold">{ref.name}</p>
                <p>{ref.designation}, {ref.organization}</p>
                <p>Phone: {ref.phone}</p>
              </div>
            ))}</div>
          </div>
        )}
        <div className="mt-auto pt-4 flex justify-between text-xs font-bold">
          <div>Date: _________________</div>
          <div className="text-center"><div className="border-b border-black w-40 mb-1"></div>Signature</div>
        </div>
      </div>
    </div>
  );
};

export const bdExtraTemplates: TemplateDefinition[] = [
  { id: "bd-modern-blue", name: "BD Modern Blue", category: "Bangladeshi", colorSwatch: "#1d4ed8", component: (p) => <BDColoredHeaderLayout {...p} headerColor="#1d4ed8" accentColor="#1d4ed8" /> },
  { id: "bd-modern-green", name: "BD Modern Green", category: "Bangladeshi", colorSwatch: "#065f46", component: (p) => <BDColoredHeaderLayout {...p} headerColor="#065f46" accentColor="#065f46" /> },
  { id: "bd-modern-red", name: "BD Modern Red", category: "Bangladeshi", colorSwatch: "#991b1b", component: (p) => <BDColoredHeaderLayout {...p} headerColor="#991b1b" accentColor="#991b1b" /> },
  { id: "bd-modern-purple", name: "BD Modern Purple", category: "Bangladeshi", colorSwatch: "#6d28d9", component: (p) => <BDColoredHeaderLayout {...p} headerColor="#6d28d9" accentColor="#6d28d9" /> },
  { id: "bd-modern-teal", name: "BD Modern Teal", category: "Bangladeshi", colorSwatch: "#0f766e", component: (p) => <BDColoredHeaderLayout {...p} headerColor="#0f766e" accentColor="#0f766e" /> },
];
