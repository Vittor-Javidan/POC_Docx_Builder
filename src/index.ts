import { Docx_Text } from "./WordComponents/Text";
import { Docx_Paragraph } from "./WordComponents/Paragraph";
import { Docx_Image } from "./WordComponents/Image";
import { ContentRelationship } from "./Services/ContentRelationship";
import { Docx_Document } from "./WordComponents/Document";
import { Zip } from "./Services/Zip";

ContentRelationship.createContentTypesFile();
ContentRelationship.createRelationshipFolder();
ContentRelationship.WordFolder(
  ["io.jpeg", "io2.jpeg"],
  Docx_Document([
    Docx_Paragraph([
      Docx_Text({ bold: true, text: "bold text" }),
      Docx_Text({ italic: true, text: "italic text" }),
      Docx_Text({ text: "underlined text" }),
      Docx_Text({ text: "normal text" }),
      Docx_Text({ bold: true, italic: true, text: "bold & italic text" }),
      Docx_Text({ bold: true, text: `bold & "underlined" text` }),
      Docx_Text({ italic: true,  text:  `U+0000–U+001F` }),
      Docx_Text({ bold: true, italic: true, text: `U+D800–U+DFFF` }),
      Docx_Text({ text: "U+FFFE" }),
      Docx_Text({ text: "normal text" }),
    ]),
    Docx_Image("io.jpeg", { width: 3, height: 2 }),
    Docx_Image("io2.jpeg", { width: 3, height: 2 }),
  ])
)
Zip.createDocx();
