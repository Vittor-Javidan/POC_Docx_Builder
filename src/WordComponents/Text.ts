type TextProps = {
  text: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
}

export function Docx_Text(props: TextProps): string {

  const FONT_SIZE_CONVERSION = 2;

  const bold = props.bold ? "<w:b/>" : "";
  const italic = props.italic ? "<w:i/>" : "";
  const fontSize = props.fontSize ? `<w:sz w:val="${props.fontSize * FONT_SIZE_CONVERSION}"/>` : "";
  const color = props.color ? `<w:color w:val="${props.color}"/>` : "";
  const styles = (props.bold || props.italic || props.fontSize || props.color) ? `<w:rPr>${bold}${italic}${fontSize}${color}</w:rPr>` : "";

  const sanitizedInvalidXMLChars = sanitizeInvalidXMLChars(props.text);
  const parsedText = escapeSpecialXMLChars(sanitizedInvalidXMLChars);
  const textElement = `<w:t xml:space="preserve">${parsedText}</w:t>`;

  return (
    `<w:r>${styles}${textElement}</w:r>`
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