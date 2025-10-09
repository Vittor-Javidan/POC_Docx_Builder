import { join } from "path";
import { createReadStream, createWriteStream, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";

export class Docx {

  static baseDirectory: string = "./docx_output";

  static createContentTypesFile() {

    // Write [Content_Types].xml file
    writeFileSync(join(this.baseDirectory, "[Content_Types].xml"), (
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
      `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
        `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
        `<Default Extension="xml" ContentType="application/xml"/>` +
        `<Default Extension="jpg" ContentType="image/jpeg"/>` +
        `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>` +
      `</Types>`
    ));
  }

  static createRelationshipFolder() {

    // Create necessary directories
    mkdirSync(join(this.baseDirectory, "_rels"), { recursive: true });

    // Write the .rels file
    writeFileSync(join(this.baseDirectory, "_rels/.rels"), (
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
        `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
        `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>` +
      `</Relationships>`
    ));  
  }

  /**
   * @WARNING If you use inside the document an image that don't exist in the imagesFilePath folder, the docx will become corrupted.
   * @WARNING This folder will copy all .jpg files from the imagesFilePath folder to the docx media folder.
  */
  static CreateWordFolder(o: {
    imagesFilePath:string,
    document: string
  }) {

    const { imagesFilePath, document } = o;

    // Create necessary directories
    mkdirSync(join(this.baseDirectory, "word"), { recursive: true });
    mkdirSync(join(this.baseDirectory, "word/_rels"), { recursive: true });
    mkdirSync(join(this.baseDirectory, "word/media"), { recursive: true });

    // Dynamically read image files from the specified directory
    const imageFiles = readdirSync(imagesFilePath).filter(file => /\.jpg$/i.test(file));
    const imageRelationships = imageFiles.map((fileName) => {
      return `<Relationship Id="rId${fileName.slice(0, -4)}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${fileName}"/>`
    })

    // Create document.xml.rels with dynamic image relationships
    const relationshipFileContent = (
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
      `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
        imageRelationships.join("") +
      `</Relationships>`
    )

    // Write the relationship file and document.xml
    writeFileSync(join(this.baseDirectory, "word/_rels/document.xml.rels"), relationshipFileContent);
    writeFileSync(join(this.baseDirectory, "word/document.xml"), document);
  
    // Copy image files to the media folder
    imageFiles.forEach((fileName) => {
      writeFileSync(join(this.baseDirectory, "word/media", fileName), readFileSync(join(imagesFilePath, fileName)));
    })
  }
}