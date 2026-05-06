import { TemplateDefinition, TemplateProps } from "./types";
import { CustomSectionsBlock } from "./custom-sections-block";

const BDProfessionalLayout: React.FC<TemplateProps & { accentColor: string }> = ({ data, accentColor }) => (
  <div className="w-[210mm] h-[297mm] flex flex-col bg-white text-left font-sans text-gray-900 border-4 border-white">
    <div className="flex justify-between items-start px-12 pt-12 pb-6 border-b-2" style={{ borderColor: accentColor }}>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-black uppercase mb-1">{data.name || 'YOUR NAME'}</h1>
        {data.jobTitle && <p className="text-sm font-semibold mb-4 text-gray-700">{data.jobTitle}</p>}
        <div className="text-xs space-y-1">
          <p><span className="font-bold">Address:</span> {data.address}</p>
          <p><span className="font-bold">Phone:</span> {data.phone}</p>
          <p><span className="font-bold">Email:</span> {data.email}</p>
          {data.linkedin && <p><span className="font-bold">LinkedIn:</span> {data.linkedin}</p>}
        </div>
      </div>
      {data.photo && (
        <div className="w-[4.5cm] h-[5.5cm] border border-gray-300 p-1 shrink-0 ml-4">
          <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
    <div className="px-12 py-6 flex-1 flex flex-col gap-5">
      {data.objective && (
        <div className="w-full">
          <h2 className="text-sm font-bold uppercase py-1 mb-2 border-b" style={{ backgroundColor: accentColor + '20', color: accentColor, borderBottomColor: accentColor }}>Career Objective</h2>
          <p className="text-xs text-justify leading-relaxed">{data.objective}</p>
        </div>
      )}
      {data.education.length > 0 && (
        <div className="w-full">
          <h2 className="text-sm font-bold uppercase py-1 mb-2 border-b" style={{ backgroundColor: accentColor + '20', color: accentColor, borderBottomColor: accentColor }}>Educational Qualification</h2>
          <table className="w-full text-xs border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1 text-left">Exam / Degree</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Institution</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Board/University</th>
                <th className="border border-gray-300 px-2 py-1 text-center">Result</th>
                <th className="border border-gray-300 px-2 py-1 text-center">Passing Year</th>
              </tr>
            </thead>
            <tbody>
              {data.education.map(edu => (
                <tr key={edu.id}>
                  <td className="border border-gray-300 px-2 py-1">{edu.degree}</td>
                  <td className="border border-gray-300 px-2 py-1">{edu.institution}</td>
                  <td className="border border-gray-300 px-2 py-1">{edu.board}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">{edu.result}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">{edu.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data.experience.length > 0 && (
        <div className="w-full">
          <h2 className="text-sm font-bold uppercase py-1 mb-2 border-b" style={{ backgroundColor: accentColor + '20', color: accentColor, borderBottomColor: accentColor }}>Experience</h2>
          <div className="space-y-3">
            {data.experience.map(exp => (
              <div key={exp.id} className="text-xs">
                <p className="font-bold">{exp.title}</p>
                <p>Organization: {exp.company}</p>
                <p>Duration: {exp.startDate} to {exp.endDate}</p>
                <p className="mt-1 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <CustomSectionsBlock data={data} headingColor={accentColor} borderColor={accentColor} compact headingSize="text-sm font-bold uppercase" />
      <div className="w-full">
        <h2 className="text-sm font-bold uppercase py-1 mb-2 border-b" style={{ backgroundColor: accentColor + '20', color: accentColor, borderBottomColor: accentColor }}>Personal Details</h2>
        <table className="w-full text-xs">
          <tbody>
            <tr><td className="w-1/4 font-semibold py-0.5">Father's Name</td><td className="w-4">:</td><td>{data.fathersName}</td></tr>
            <tr><td className="w-1/4 font-semibold py-0.5">Mother's Name</td><td className="w-4">:</td><td>{data.mothersName}</td></tr>
            <tr><td className="w-1/4 font-semibold py-0.5">Date of Birth</td><td className="w-4">:</td><td>{data.dob}</td></tr>
            <tr><td className="w-1/4 font-semibold py-0.5">Nationality</td><td className="w-4">:</td><td>{data.nationality}</td></tr>
            <tr><td className="w-1/4 font-semibold py-0.5">Religion</td><td className="w-4">:</td><td>{data.religion}</td></tr>
            <tr><td className="w-1/4 font-semibold py-0.5">Marital Status</td><td className="w-4">:</td><td>{data.maritalStatus}</td></tr>
            <tr><td className="w-1/4 font-semibold py-0.5">Blood Group</td><td className="w-4">:</td><td>{data.bloodGroup}</td></tr>
            <tr><td className="w-1/4 font-semibold py-0.5">National ID</td><td className="w-4">:</td><td>{data.nid}</td></tr>
          </tbody>
        </table>
      </div>
      {data.references.length > 0 && (
        <div className="w-full">
          <h2 className="text-sm font-bold uppercase py-1 mb-2 border-b" style={{ backgroundColor: accentColor + '20', color: accentColor, borderBottomColor: accentColor }}>References</h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            {data.references.map(ref => (
              <div key={ref.id}>
                <p className="font-bold">{ref.name}</p>
                <p>{ref.designation}</p>
                <p>{ref.organization}</p>
                <p>Phone: {ref.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="w-full mt-auto pt-8 flex justify-between items-end text-xs font-bold">
        <div>Date: _________________</div>
        <div className="text-center">
          <div className="border-b border-black w-40 mb-1"></div>
          Signature
        </div>
      </div>
    </div>
  </div>
);

export const bdTemplates: TemplateDefinition[] = [
  { id: "bd-professional", name: "BD Professional", category: "Bangladeshi", colorSwatch: "#2563eb", component: (props) => <BDProfessionalLayout {...props} accentColor="#2563eb" /> },
  { id: "bd-government", name: "BD Government", category: "Bangladeshi", colorSwatch: "#166534", component: (props) => <BDProfessionalLayout {...props} accentColor="#166534" /> },
  { id: "bd-corporate", name: "BD Corporate", category: "Bangladeshi", colorSwatch: "#374151", component: (props) => <BDProfessionalLayout {...props} accentColor="#374151" /> },
  { id: "bd-academic", name: "BD Academic", category: "Bangladeshi", colorSwatch: "#7c3aed", component: (props) => <BDProfessionalLayout {...props} accentColor="#7c3aed" /> },
  { id: "bd-ngo", name: "BD NGO", category: "Bangladeshi", colorSwatch: "#059669", component: (props) => <BDProfessionalLayout {...props} accentColor="#059669" /> },
  { id: "bd-bank", name: "BD Bank", category: "Bangladeshi", colorSwatch: "#b91c1c", component: (props) => <BDProfessionalLayout {...props} accentColor="#b91c1c" /> },
  { id: "bd-tech", name: "BD Tech", category: "Bangladeshi", colorSwatch: "#0284c7", component: (props) => <BDProfessionalLayout {...props} accentColor="#0284c7" /> }
];
