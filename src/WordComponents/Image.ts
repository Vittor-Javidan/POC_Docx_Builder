let documentImageCounter = 0;

export function Docx_Image(fileName:string, imageProportion: { width: number, height: number }): string {

  const fileId = "rId" + fileName.slice(0, -5);
  const proportion = imageProportion.width / imageProportion.height;
  const cx = 5391150;
  const cy = cx / proportion;
  documentImageCounter++;

  return `
    <w:p>
      <w:r>
        <w:rPr>
          <w:noProof/>
        </w:rPr>
        <w:drawing>
          <wp:inline>
            <wp:extent cx="${cx}" cy="${cy}"/>
            <wp:docPr id="${documentImageCounter}" name="Picture ${documentImageCounter}"/>
            <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
              <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                  <pic:nvPicPr>
                    <pic:cNvPr id="${documentImageCounter - 1}" name="${documentImageCounter - 1}"/>
                    <pic:cNvPicPr/>
                  </pic:nvPicPr>
                  <pic:blipFill>
                    <a:blip r:embed="${fileId}"/>
                    <a:stretch>
                      <a:fillRect/>
                    </a:stretch>
                  </pic:blipFill>
                  <pic:spPr>
                    <a:xfrm>
                      <a:off x="0" y="0"/>
                      <a:ext cx="${cx}" cy="${cy}"/>
                    </a:xfrm>
                    <a:prstGeom prst="rect">
                      <a:avLst/>
                    </a:prstGeom>
                  </pic:spPr>
                </pic:pic>
              </a:graphicData>
            </a:graphic>
          </wp:inline>
        </w:drawing>
      </w:r>
    </w:p>
  `;
}