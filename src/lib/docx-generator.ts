import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  convertInchesToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { CVData } from "./cv-data";

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "1e3a8a" },
    },
    run: { color: "1e3a8a", bold: true },
  });
}

function label(text: string): TextRun {
  return new TextRun({ text, bold: true, size: 20 });
}

function value(text: string, opts: { italic?: boolean; color?: string } = {}): TextRun {
  return new TextRun({ text, size: 20, italic: opts.italic, color: opts.color });
}

export async function downloadDocx(data: CVData, filename = "CV"): Promise<void> {
  const children: (Paragraph | Table)[] = [];

  children.push(
    new Paragraph({
      children: [new TextRun({ text: data.name || "Your Name", bold: true, size: 52, color: "1e3a8a" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: data.jobTitle || "", size: 28, color: "475569", italic: true })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    })
  );

  const contactParts = [data.phone, data.email, data.address, data.linkedin, data.website].filter(Boolean);
  if (contactParts.length) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts.join("  |  "), size: 18, color: "64748b" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: "1e3a8a" } },
      })
    );
  }

  if (data.objective) {
    children.push(
      sectionHeading("Career Objective"),
      new Paragraph({ children: [value(data.objective)], spacing: { after: 160 }, alignment: AlignmentType.JUSTIFIED })
    );
  }

  if (data.experience.length > 0) {
    children.push(sectionHeading("Work Experience"));
    for (const exp of data.experience) {
      children.push(
        new Paragraph({
          children: [
            label(exp.title || ""),
            new TextRun({ text: `   ${exp.company}${exp.location ? ", " + exp.location : ""}`, size: 20, color: "475569" }),
          ],
          spacing: { before: 120, after: 40 },
        }),
        new Paragraph({ children: [value(`${exp.startDate} – ${exp.endDate}`, { italic: true, color: "94a3b8" })], spacing: { after: 60 } }),
        ...(exp.description
          ? exp.description.split("\n").map((line) =>
              new Paragraph({
                children: [value(line.replace(/^- /, ""))],
                bullet: line.startsWith("- ") ? { level: 0 } : undefined,
                spacing: { after: 40 },
                indent: line.startsWith("- ") ? { left: convertInchesToTwip(0.25) } : undefined,
              })
            )
          : [])
      );
    }
  }

  if (data.education.length > 0) {
    children.push(sectionHeading("Educational Qualification"));
    const headerRow = new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [label("Exam / Degree")] })], shading: { type: ShadingType.CLEAR, fill: "dbeafe" } }),
        new TableCell({ children: [new Paragraph({ children: [label("Institution")] })], shading: { type: ShadingType.CLEAR, fill: "dbeafe" } }),
        new TableCell({ children: [new Paragraph({ children: [label("Board/University")] })], shading: { type: ShadingType.CLEAR, fill: "dbeafe" } }),
        new TableCell({ children: [new Paragraph({ children: [label("Result")] })], shading: { type: ShadingType.CLEAR, fill: "dbeafe" } }),
        new TableCell({ children: [new Paragraph({ children: [label("Year")] })], shading: { type: ShadingType.CLEAR, fill: "dbeafe" } }),
      ],
      tableHeader: true,
    });
    const dataRows = data.education.map(
      (edu) => new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [value(edu.degree)] })] }),
          new TableCell({ children: [new Paragraph({ children: [value(edu.institution)] })] }),
          new TableCell({ children: [new Paragraph({ children: [value(edu.board)] })] }),
          new TableCell({ children: [new Paragraph({ children: [value(edu.result)] })] }),
          new TableCell({ children: [new Paragraph({ children: [value(edu.year)] })] }),
        ],
      })
    );
    children.push(
      new Table({ rows: [headerRow, ...dataRows], width: { size: 100, type: WidthType.PERCENTAGE } }),
      new Paragraph({ text: "", spacing: { after: 160 } })
    );
  }

  if (data.skills.length > 0) {
    children.push(sectionHeading("Skills"));
    const skillRows: TableRow[] = [];
    for (let i = 0; i < data.skills.length; i += 2) {
      const cells: TableCell[] = [];
      for (let j = i; j < Math.min(i + 2, data.skills.length); j++) {
        const s = data.skills[j];
        const bars = "█".repeat(s.level) + "░".repeat(5 - s.level);
        cells.push(new TableCell({
          children: [new Paragraph({ children: [value(`${s.name}  `), new TextRun({ text: bars, color: "1e3a8a", size: 18 })] })],
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
        }));
      }
      if (cells.length === 1) {
        cells.push(new TableCell({ children: [new Paragraph({ text: "" })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }));
      }
      skillRows.push(new TableRow({ children: cells }));
    }
    children.push(new Table({ rows: skillRows, width: { size: 100, type: WidthType.PERCENTAGE } }), new Paragraph({ text: "", spacing: { after: 80 } }));
  }

  if (data.languages.length > 0) {
    children.push(sectionHeading("Languages"));
    children.push(new Paragraph({
      children: data.languages.flatMap((l, i) => [
        label(`${l.name}: `),
        value("●".repeat(l.level) + "○".repeat(5 - l.level)),
        ...(i < data.languages.length - 1 ? [new TextRun({ text: "     " })] : []),
      ]),
      spacing: { after: 160 },
    }));
  }

  // Custom Sections
  if (data.customSections && data.customSections.length > 0) {
    for (const section of data.customSections) {
      if (!section.title || section.items.length === 0) continue;
      children.push(sectionHeading(section.title));
      for (const item of section.items) {
        children.push(
          new Paragraph({
            children: [
              label(item.heading || ""),
              ...(item.date ? [new TextRun({ text: `   ${item.date}`, size: 20, color: "94a3b8", italic: true })] : []),
            ],
            spacing: { before: 80, after: 20 },
          })
        );
        if (item.subheading) {
          children.push(new Paragraph({ children: [value(item.subheading, { italic: true, color: "475569" })], spacing: { after: 20 } }));
        }
        if (item.description) {
          children.push(new Paragraph({ children: [value(item.description)], spacing: { after: 60 } }));
        }
      }
    }
  }

  const personalFields = [
    ["Father's Name", data.fathersName],
    ["Mother's Name", data.mothersName],
    ["Date of Birth", data.dob],
    ["Nationality", data.nationality],
    ["Religion", data.religion],
    ["Marital Status", data.maritalStatus],
    ["Blood Group", data.bloodGroup],
    ["National ID", data.nid],
  ].filter(([, v]) => v);

  if (personalFields.length > 0) {
    children.push(sectionHeading("Personal Details"));
    const pdRows = personalFields.map(([k, v_]) =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [label(k + ":")] })],
            width: { size: 30, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          }),
          new TableCell({
            children: [new Paragraph({ children: [value(v_!)] })],
            width: { size: 70, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          }),
        ],
      })
    );
    children.push(new Table({ rows: pdRows, width: { size: 100, type: WidthType.PERCENTAGE } }), new Paragraph({ text: "", spacing: { after: 80 } }));
  }

  if (data.hobbies && data.hobbies.filter(Boolean).length > 0) {
    children.push(
      sectionHeading("Hobbies & Interests"),
      new Paragraph({ children: [value(data.hobbies.filter(Boolean).join(", "))], spacing: { after: 160 } })
    );
  }

  if (data.references.length > 0) {
    children.push(sectionHeading("References"));
    const refCells = data.references.map((ref) =>
      new TableCell({
        children: [
          new Paragraph({ children: [label(ref.name)] }),
          new Paragraph({ children: [value(ref.designation, { italic: true })] }),
          new Paragraph({ children: [value(ref.organization)] }),
          new Paragraph({ children: [value("Phone: " + ref.phone, { color: "475569" })] }),
        ],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: "e2e8f0" },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
      })
    );
    while (refCells.length < 2) {
      refCells.push(new TableCell({ children: [new Paragraph({ text: "" })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }));
    }
    const refRows: TableRow[] = [];
    for (let i = 0; i < refCells.length; i += 2) {
      refRows.push(new TableRow({ children: [refCells[i], refCells[i + 1] || new TableCell({ children: [new Paragraph({ text: "" })] })] }));
    }
    children.push(new Table({ rows: refRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
  }

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}
