import { CVData } from "@/lib/cv-data";

interface PersonalDetailsBlockProps {
  data: CVData;
  headingColor?: string;
  textColor?: string;
  borderColor?: string;
  compact?: boolean;
  headingClass?: string;
}

export const PersonalDetailsBlock = ({
  data,
  headingColor = "#374151",
  textColor = "#374151",
  borderColor = "#e5e7eb",
  compact = false,
  headingClass = "",
}: PersonalDetailsBlockProps) => {
  const details = [
    { label: "Father's Name", value: data.fathersName },
    { label: "Mother's Name", value: data.mothersName },
    { label: "Date of Birth", value: data.dob },
    { label: "Nationality", value: data.nationality },
    { label: "Religion", value: data.religion },
    { label: "Marital Status", value: data.maritalStatus },
    { label: "Blood Group", value: data.bloodGroup },
    { label: "National ID", value: data.nid },
  ].filter((d) => d.value && d.value.trim());

  if (details.length === 0) return null;

  return (
    <div>
      <h2
        className={`font-bold uppercase tracking-wider border-b pb-1 mb-3 ${compact ? "text-xs" : "text-sm"} ${headingClass}`}
        style={{ color: headingColor, borderColor }}
      >
        Personal Details
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {details.map((d) => (
          <div key={d.label} className="flex flex-col">
            <span
              className={`${compact ? "text-[8px]" : "text-[9px]"} uppercase font-bold opacity-50`}
              style={{ color: textColor }}
            >
              {d.label}
            </span>
            <span
              className={`${compact ? "text-[10px]" : "text-xs"} font-medium`}
              style={{ color: textColor }}
            >
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
