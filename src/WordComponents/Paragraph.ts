export function Docx_Paragraph(text: string[]): string {

  let joinedText = text.join(""); // Remove last "\n"

  return (
    `<w:p>${joinedText}</w:p>`
  );
}