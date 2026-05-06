import { CVData } from "@/lib/cv-data";

interface CustomSectionsBlockProps {
  data: CVData;
  headingColor?: string;
  borderColor?: string;
  compact?: boolean;
  headingSize?: string;
}

export const CustomSectionsBlock = ({
  data,
  headingColor = "#374151",
  borderColor = "#e5e7eb",
  compact = false,
  headingSize,
}: CustomSectionsBlockProps) => {
  const sections = data.customSections || [];
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => {
        if (!section.title || section.items.length === 0) return null;
        return (
          <div key={section.id}>
            <h2
              className={`font-bold uppercase tracking-wide border-b-2 pb-1 mb-3 ${headingSize || (compact ? "text-sm" : "text-xl")}`}
              style={{ color: headingColor, borderColor }}
            >
              {section.title}
            </h2>
            <div className={`space-y-${compact ? "2" : "3"}`}>
              {section.items.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className={`font-semibold ${compact ? "text-xs" : "text-sm"}`}>{item.heading}</h3>
                    {item.date && (
                      <span className={`${compact ? "text-[10px]" : "text-xs"} text-gray-500`}>{item.date}</span>
                    )}
                  </div>
                  {item.subheading && (
                    <p className={`${compact ? "text-[10px]" : "text-xs"} text-gray-600 italic`}>{item.subheading}</p>
                  )}
                  {item.description && (
                    <p className={`${compact ? "text-[10px]" : "text-xs"} text-gray-600 mt-0.5 whitespace-pre-wrap`}>{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};
