export function Docx_Paragraph(text: string[]): string {

  let joinedText = text.join("").slice(0, -1); // Remove last "\n"

  return (

    `<w:p>\n` +
    `${joinedText}\n` + "    " +
    `</w:p>\n`

  );
}