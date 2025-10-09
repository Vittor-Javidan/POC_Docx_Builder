import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { Docx_Text } from "./WordComponents/Text";
import { Docx_Paragraph } from "./WordComponents/Paragraph";

const baseDir = "./docx_output";

// Helper to create folders if not exist
function makeDir(path: string) {
  mkdirSync(path, { recursive: true });
}

// --- Step 1: Create folders ---
makeDir(join(baseDir, "_rels"));
makeDir(join(baseDir, "word/_rels"));

// --- Step 2: Create [Content_Types].xml ---
const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>
`;

writeFileSync(join(baseDir, "[Content_Types].xml"), contentTypes);

// --- Step 3: Create _rels/.rels ---
const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
`;

writeFileSync(join(baseDir, "_rels/.rels"), rels);

// --- Step 4: Create word/document.xml ---
const textArray: string[] = [
  Docx_Text({ bold: true, text: "bold text" }),
  Docx_Text({ italic: true, text: "italic text" }),
  Docx_Text({ text: "underlined text" }),
  Docx_Text({ text: "normal text" }),
  Docx_Text({ bold: true, italic: true, text: "bold & italic text" }),
  Docx_Text({ bold: true, text: `bold & "underlined" text` }),
  Docx_Text({ italic: true,  text:  `U+0000–U+001F` }),
  Docx_Text({ bold: true, italic: true, text: `U+D800–U+DFFF` }),
  Docx_Text({ text: "U+FFFE" }),
]
const documentXml = (
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
`<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">\n` +
`  <w:body>\n` +
`    ${Docx_Paragraph(textArray)}` +
`  </w:body>\n` +
`</w:document>
`);

writeFileSync(join(baseDir, "word/document.xml"), documentXml);

// --- Step 5: Create word/_rels/document.xml.rels ---
const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>
`;

writeFileSync(join(baseDir, "word/_rels/document.xml.rels"), docRels);

console.log("✅ DOCX folder structure created in:", baseDir);
