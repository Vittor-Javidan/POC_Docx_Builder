import { join } from "path";
import { mkdirSync, readFileSync, writeFileSync } from "fs";

export class ContentRelationship {

  static baseDirectory: string = "./docx_output";
  static imageDirectory: string = "./Images";

  static createContentTypesFile() {
    writeFileSync(join(this.baseDirectory, "[Content_Types].xml"), (
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
        <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
        <Default Extension="xml" ContentType="application/xml"/>
        <Default Extension="jpeg" ContentType="image/jpeg"/>
        <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
      </Types>`
    ));
  }

  static createRelationshipFolder() {

    mkdirSync(join(this.baseDirectory, "_rels"), { recursive: true });

    writeFileSync(join(this.baseDirectory, "_rels/.rels"), (
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
        <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
      </Relationships>`
    ));  
  }

  static WordFolder(imageFiles:string[], documentContent: string) {

    mkdirSync(join(this.baseDirectory, "word"), { recursive: true });
    mkdirSync(join(this.baseDirectory, "word/_rels"), { recursive: true });
    mkdirSync(join(this.baseDirectory, "word/media"), { recursive: true });

    const imageRelationships = imageFiles.map((fileName) => {
      return `<Relationship Id="rId${fileName.slice(0, -5)}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${fileName}"/>`
    })
    const relationshipFileContent = (
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      ${imageRelationships.join("")}
      </Relationships>`
    )

    writeFileSync(join(this.baseDirectory, "word/_rels/document.xml.rels"), relationshipFileContent);
    writeFileSync(join(this.baseDirectory, "word/document.xml"), documentContent);
    imageFiles.forEach((fileName) => {
      writeFileSync(join(this.baseDirectory, "word/media", fileName), readFileSync(join(this.imageDirectory, fileName)));
    })
  }
}