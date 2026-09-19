import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { pdfBase64, fileName = 'Kartu_Peserta_Ujian.pdf' } = data;

    if (!pdfBase64) {
      return NextResponse.json({ success: false, message: 'Data PDF kosong' }, { status: 400 });
    }

    const safeName = path.basename(fileName).endsWith('.pdf')
      ? path.basename(fileName)
      : `${path.basename(fileName)}.pdf`;

    // Extract base64 buffer (everything after the comma in data URI)
    const commaIndex = pdfBase64.indexOf(',');
    const base64Data = commaIndex !== -1 ? pdfBase64.slice(commaIndex + 1) : pdfBase64;
    const buffer = Buffer.from(base64Data, 'base64');

    // Save directly to project root folder
    const rootFilePath = path.join(process.cwd(), safeName);
    fs.writeFileSync(rootFilePath, buffer);

    // Also save to public folder for direct access
    const publicDir = path.join(process.cwd(), 'public');
    if (fs.existsSync(publicDir)) {
      fs.writeFileSync(path.join(publicDir, safeName), buffer);
    }

    return NextResponse.json({
      success: true,
      message: 'PDF berhasil disimpan',
      fileName: safeName,
      downloadUrl: `/api/download?file=${encodeURIComponent(safeName)}`,
      savedPath: rootFilePath,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Gagal menyimpan PDF';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
