export function Docx_Document(paragraphs: string[]): string {
  let joinedParagraphs = paragraphs.join("");
  return (
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>${joinedParagraphs}</w:body>
  </w:document>`
  );
}