import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, action = 'open' } = body;

    const projectDir = process.cwd();
    const safeName = fileName ? path.basename(fileName) : '';
    const targetPath = safeName ? path.join(projectDir, safeName) : projectDir;

    if (safeName && !fs.existsSync(targetPath)) {
      return NextResponse.json(
        { success: false, message: `File ${safeName} tidak ditemukan di ${projectDir}` },
        { status: 404 }
      );
    }

    if (process.platform === 'win32') {
      if (action === 'reveal') {
        // Highlight in Windows Explorer
        exec(`explorer.exe /select,"${targetPath}"`);
      } else if (action === 'folder') {
        // Open folder in Windows Explorer
        exec(`explorer.exe "${projectDir}"`);
      } else {
        // Open file directly with default program (e.g. Microsoft Excel)
        exec(`start "" "${targetPath}"`);
      }
    } else {
      exec(`open "${targetPath}"`);
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil membuka ${safeName || projectDir}`,
      path: targetPath,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
