import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join } from "path";

export class Zip {

  static ROOT_DIR = "docx_output";

  static LOCAL_FILE_HEADER_SIG = 0x04034b50;
  static CENTRAL_DIR_SIG = 0x02014b50;
  static END_OF_CENTRAL_DIR_SIG = 0x06054b50;

  static u16 = (v: number) => { const b = Buffer.alloc(2); b.writeUInt16LE(v); return b; };
  static u32 = (v: number) => { const b = Buffer.alloc(4); b.writeUInt32LE(v); return b; };

  static createDocx(outputFilename: string = "docx_output.docx") {
    /** Little-endian writers */
    const zipBuffer = this.buildZip(this.ROOT_DIR);
    writeFileSync(outputFilename, zipBuffer);
    console.log(`✅ Created ${outputFilename} with all docx files (no compression).`);
  }

  private static crc32(buf: Buffer): number {
    // Attach a 'table' property to the function using type assertion
    let table = (this.crc32 as any).table as Uint32Array | undefined;
    if (!table) {
      table = (this.crc32 as any).table = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) {
          c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c >>> 0;
      }
    }
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  /* ------------------------------------------------------------------ */
  /* --------------------- Recursively list files ---------------------- */
  /* ------------------------------------------------------------------ */
  private static listFilesRecursive(baseDir: string, relPrefix = "") {
    const items = readdirSync(baseDir);
    let files: string[] = [];
    for (const item of items) {
      const abs = join(baseDir, item);
      const rel = join(relPrefix, item).replace(/\\/g, "/");
      const stat = statSync(abs);
      if (stat.isDirectory()) {
        files = files.concat(this.listFilesRecursive(abs, rel));
      } else {
        files.push(rel);
      }
    }
    return files;
  }

  /* ------------------------------------------------------------------ */
  /* ---------------------- Build the ZIP buffer ---------------------- */
  /* ------------------------------------------------------------------ */
  private static buildZip(rootDir: string) {
    // Automatically collect files:
    const entries = [
      "[Content_Types].xml",
      ...this.listFilesRecursive(join(rootDir, "_rels"), "_rels"),
      ...this.listFilesRecursive(join(rootDir, "word"), "word"),
    ];

    const fileParts = [];
    const centralDirectory = [];
    let offset = 0;

    for (const relPath of entries) {
      const absPath = join(rootDir, relPath);
      const data = readFileSync(absPath);
      const fileNameBuf = Buffer.from(relPath);
      const crc = this.crc32(data);
      const size = data.length;

      // Local file header
      const localHeader = Buffer.concat([
        this.u32(this.LOCAL_FILE_HEADER_SIG),
        this.u16(20), // version
        this.u16(0),  // flags
        this.u16(0),  // compression = store
        this.u16(0), this.u16(0), // mod time/date
        this.u32(crc),
        this.u32(size),
        this.u32(size),
        this.u16(fileNameBuf.length),
        this.u16(0),
        fileNameBuf,
        data,
      ]);

      fileParts.push(localHeader);

      // Central directory entry
      const centralHeader = Buffer.concat([
        this.u32(this.CENTRAL_DIR_SIG),
        this.u16(0x0314), // version made by
        this.u16(20),     // version to extract
        this.u16(0),
        this.u16(0),
        this.u16(0),
        this.u16(0),
        this.u32(crc),
        this.u32(size),
        this.u32(size),
        this.u16(fileNameBuf.length),
        this.u16(0),
        this.u16(0),
        this.u16(0),
        this.u16(0),
        this.u32(0),
        this.u32(offset),
        fileNameBuf,
      ]);

      centralDirectory.push(centralHeader);
      offset += localHeader.length;
    }

    const centralDirBuf = Buffer.concat(centralDirectory);
    const centralDirOffset = offset;
    const centralDirSize = centralDirBuf.length;

    const endOfCentralDir = Buffer.concat([
      this.u32(this.END_OF_CENTRAL_DIR_SIG),
      this.u16(0),
      this.u16(0),
      this.u16(entries.length),
      this.u16(entries.length),
      this.u32(centralDirSize),
      this.u32(centralDirOffset),
      this.u16(0),
    ]);

    return Buffer.concat([...fileParts, centralDirBuf, endOfCentralDir]);
  }
}