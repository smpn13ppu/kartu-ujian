import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('file');

  if (!fileName) {
    return new NextResponse('Parameter "file" wajib diisi', { status: 400 });
  }

  // Prevent directory traversal
  const safeName = path.basename(fileName);
  const filePath = path.join(process.cwd(), safeName);

  if (!fs.existsSync(filePath)) {
    return new NextResponse(`File ${safeName} tidak ditemukan di folder project: ${process.cwd()}`, {
      status: 404,
    });
  }

  const fileBuffer = fs.readFileSync(filePath);
  
  let contentType = 'application/octet-stream';
  if (safeName.endsWith('.xlsx')) {
    contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  } else if (safeName.endsWith('.zip')) {
    contentType = 'application/zip';
  } else if (safeName.endsWith('.pdf')) {
    contentType = 'application/pdf';
  } else if (safeName.endsWith('.csv')) {
    contentType = 'text/csv; charset=utf-8';
  }

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${safeName}"`,
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
