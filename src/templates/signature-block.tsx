import { CVData } from "@/lib/cv-data";

interface SignatureBlockProps {
  data: CVData;
  textColor?: string;
  borderColor?: string;
  compact?: boolean;
  layout?: "row" | "stack";
}

export const SignatureBlock = ({
  data,
  textColor = "#111827",
  borderColor = "#111827",
  compact = false,
  layout = "row",
}: SignatureBlockProps) => {
  const fontSize = compact ? "text-[9px]" : "text-xs";
  const lineWidth = compact ? "w-28" : "w-36";
  const sigImgHeight = compact ? "h-8" : "h-10";

  if (layout === "stack") {
    return (
      <div className="flex flex-col items-start gap-2" style={{ color: textColor }}>
        <div className="flex flex-col items-center">
          {data.signature ? (
            <img src={data.signature} alt="Signature" className={`${sigImgHeight} w-auto object-contain mb-0.5`} />
          ) : (
            <div className={`${lineWidth} border-b mb-0.5`} style={{ borderColor }} />
          )}
          <span className={`${fontSize} font-semibold`}>Signature</span>
        </div>
        <div className="flex flex-col items-center">
          <span className={`${fontSize} font-medium`} style={{ color: textColor }}>
            {data.signatureDate || "_______________"}
          </span>
          <span className={`${fontSize} font-semibold`}>Date</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-between items-end ${fontSize}`} style={{ color: textColor }}>
      <div className="flex flex-col items-center">
        {data.signature ? (
          <img src={data.signature} alt="Signature" className={`${sigImgHeight} w-auto object-contain mb-0.5`} />
        ) : (
          <div className={`${lineWidth} border-b mb-0.5`} style={{ borderColor }} />
        )}
        <span className="font-semibold">Signature</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-medium">
          {data.signatureDate || "_______________"}
        </span>
        <span className="font-semibold">Date</span>
      </div>
    </div>
  );
};
