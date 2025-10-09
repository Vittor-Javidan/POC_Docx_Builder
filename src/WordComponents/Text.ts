type TextProps = {
  bold?: boolean;
  italic?: boolean;
  text: string;
}

export function Docx_Text(props: TextProps): string {

  const bold = props.bold ? "<w:b/>" : "";
  const italic = props.italic ? "<w:i/>" : "";

  const sanitizedInvalidXMLChars = sanitizeInvalidXMLChars(props.text);
  const parsedText = escapeSpecialXMLChars(sanitizedInvalidXMLChars);

  return (

    ""                                + "      " +
    "<w:r>\n"                         + "      " +
    `  <w:rPr>\n`                     + "      " +
    `    ${bold}${italic}\n`          + "      " +
    `  </w:rPr>\n`                    + "      " +
    `  <w:t xml:space="preserve">\n`  + "      " +
    `    ${parsedText}\n`             + "      " +
    "  </w:t>\n"                      + "      " +
    "</w:r>\n"

  );
}

function escapeSpecialXMLChars(text: string): string {
  return text.replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  }[char]));
}


function sanitizeInvalidXMLChars(text: string): string {
  return text.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uD800-\uDFFF\uFFFE\uFFFF]/g,
    ''
  );
}