export function Docx_Paragraph(text: string[]): string {

  let joinedText = text.join("");

  return (
    `<w:p>${joinedText}</w:p>`
  );
}