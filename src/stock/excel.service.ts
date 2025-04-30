import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as unzipper from 'unzipper';
import * as path from 'path';
import * as fs from 'fs';
import * as mime from 'mime-types';

@Injectable()
export class ExcelService {
  private readonly uploadDir = process.env.UPLOAD_LOCATION;

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async extractAllData(fileBuffer: Buffer): Promise<any[]> {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: '',
    });

    const normalizeKeys = (row: Record<string, any>) => {
      const normalized = {};
      for (const key of Object.keys(row)) {
        normalized[key.trim().toLowerCase()] = row[key];
      }
      return normalized;
    };

    // Extract and save image files
    const zip = await unzipper.Open.buffer(fileBuffer);
    const mediaFiles = zip.files.filter((file) =>
      file.path.startsWith('xl/media/'),
    );

    const enrichedRows: any[] = [];

    for (let i = 0; i < rawRows.length; i++) {
      const cleanRow = normalizeKeys(rawRows[i]);
      const imageFile = mediaFiles[i];
      let imageFileName = null;

      const refNameRaw = cleanRow['ref/name']?.toString().trim();
      const safeRef =
        refNameRaw?.replace(/[^\w\-]/g, '-') || `unnamed-${i + 1}`;

      if (imageFile) {
        const buffer = await imageFile.buffer();
        const ext = path.extname(imageFile.path).toLowerCase() || '.jpg';
        imageFileName = `${safeRef}${ext}`;
        const fullPath = path.join(this.uploadDir, imageFileName);
        fs.writeFileSync(fullPath, buffer);
      }

      enrichedRows.push({
        ...cleanRow,
        image: imageFileName,
      });
    }

    return enrichedRows;
  }
}
