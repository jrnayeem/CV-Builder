export interface CustomSectionItem {
  id: string;
  heading: string;
  subheading?: string;
  date?: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface CVData {
  photo: string | null;
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
  objective: string;
  education: Array<{ id: string; degree: string; institution: string; board: string; result: string; year: string }>;
  experience: Array<{ id: string; title: string; company: string; location: string; startDate: string; endDate: string; description: string }>;
  skills: Array<{ id: string; name: string; level: number }>;
  languages: Array<{ id: string; name: string; level: number }>;
  hobbies: string[];
  references: Array<{ id: string; name: string; designation: string; organization: string; phone: string }>;
  fathersName: string;
  mothersName: string;
  dob: string;
  nationality: string;
  religion: string;
  nid: string;
  maritalStatus: string;
  bloodGroup: string;
  hiddenFields: string[];
  customSections: CustomSection[];
  signature: string | null;
  signatureDate: string;
}

export const sampleCVData: CVData = {
  photo: null,
  name: "",
  jobTitle: "",
  email: "",
  phone: "",
  address: "",
  linkedin: "",
  website: "",
  objective: "",
  education: [
    { id: "1", degree: "", institution: "", board: "", result: "", year: "" },
  ],
  experience: [
    { id: "1", title: "", company: "", location: "", startDate: "", endDate: "", description: "" }
  ],
  skills: [
    { id: "1", name: "", level: 3 },
  ],
  languages: [
    { id: "1", name: "", level: 3 },
  ],
  hobbies: [],
  references: [
    { id: "1", name: "", designation: "", organization: "", phone: "" },
  ],
  fathersName: "",
  mothersName: "",
  dob: "",
  nationality: "",
  religion: "",
  nid: "",
  maritalStatus: "",
  bloodGroup: "",
  hiddenFields: [],
  customSections: [],
  signature: null,
  signatureDate: "",
};

export const previewCVData: CVData = {
  photo: null,
  name: "Alex Johnson",
  jobTitle: "Senior Marketing Manager",
  email: "alex@example.com",
  phone: "+1 555-0100",
  address: "New York, NY 10001",
  linkedin: "linkedin.com/in/alexj",
  website: "alexjohnson.com",
  objective: "Dynamic marketing professional with 8+ years of experience driving brand growth and customer engagement through data-driven campaigns and creative strategy.",
  education: [
    { id: "1", degree: "MBA Marketing", institution: "Columbia University", board: "Columbia University", result: "GPA 3.9", year: "2018" },
    { id: "2", degree: "BSc Business", institution: "NYU Stern", board: "NYU", result: "GPA 3.7", year: "2015" },
  ],
  experience: [
    { id: "1", title: "Senior Marketing Manager", company: "TechCorp Inc.", location: "New York, NY", startDate: "Jan 2020", endDate: "Present", description: "- Led a team of 12 marketers across digital and traditional channels.\n- Increased brand awareness by 40% through targeted campaigns.\n- Managed $2M annual marketing budget." },
    { id: "2", title: "Marketing Specialist", company: "BrandAgency", location: "New York, NY", startDate: "Mar 2017", endDate: "Dec 2019", description: "- Developed and executed digital marketing strategies.\n- Grew social media following by 200K in 18 months." }
  ],
  skills: [
    { id: "1", name: "Digital Marketing", level: 5 },
    { id: "2", name: "SEO / SEM", level: 4 },
    { id: "3", name: "Data Analysis", level: 4 },
    { id: "4", name: "Content Strategy", level: 5 },
  ],
  languages: [
    { id: "1", name: "English", level: 5 },
    { id: "2", name: "Spanish", level: 3 },
  ],
  hobbies: ["Photography", "Travel", "Yoga"],
  references: [
    { id: "1", name: "Dr. Sarah Mitchell", designation: "VP Marketing", organization: "TechCorp Inc.", phone: "+1 555-0200" },
    { id: "2", name: "James Wilson", designation: "CEO", organization: "BrandAgency", phone: "+1 555-0300" }
  ],
  fathersName: "Robert Johnson",
  mothersName: "Linda Johnson",
  dob: "12 May 1990",
  nationality: "American",
  religion: "Christian",
  nid: "987654321",
  maritalStatus: "Married",
  bloodGroup: "A+",
  hiddenFields: [],
  customSections: [
    {
      id: "cs1",
      title: "Certifications",
      items: [
        { id: "csi1", heading: "Google Analytics Certified", subheading: "Google", date: "2022", description: "Advanced certification in web analytics and data-driven marketing." },
        { id: "csi2", heading: "HubSpot Content Marketing", subheading: "HubSpot Academy", date: "2021", description: "" },
      ]
    }
  ],
  signature: null,
  signatureDate: "",
};

export function applyHiddenFields(data: CVData): CVData {
  const hidden = new Set(data.hiddenFields || []);
  if (hidden.size === 0) return data;

  const filteredCustomSections = (data.customSections || []).filter(
    (s) => !hidden.has(`customSection_${s.id}`)
  );

  return {
    ...data,
    photo: hidden.has("photo") ? null : data.photo,
    jobTitle: hidden.has("jobTitle") ? "" : data.jobTitle,
    linkedin: hidden.has("linkedin") ? "" : data.linkedin,
    website: hidden.has("website") ? "" : data.website,
    objective: hidden.has("objective") ? "" : data.objective,
    skills: hidden.has("skills") ? [] : data.skills,
    languages: hidden.has("languages") ? [] : data.languages,
    hobbies: hidden.has("hobbies") ? [] : data.hobbies,
    references: hidden.has("references") ? [] : data.references,
    fathersName: hidden.has("fathersName") ? "" : data.fathersName,
    mothersName: hidden.has("mothersName") ? "" : data.mothersName,
    dob: hidden.has("dob") ? "" : data.dob,
    nationality: hidden.has("nationality") ? "" : data.nationality,
    religion: hidden.has("religion") ? "" : data.religion,
    nid: hidden.has("nid") ? "" : data.nid,
    maritalStatus: hidden.has("maritalStatus") ? "" : data.maritalStatus,
    bloodGroup: hidden.has("bloodGroup") ? "" : data.bloodGroup,
    customSections: filteredCustomSections,
  };
}
