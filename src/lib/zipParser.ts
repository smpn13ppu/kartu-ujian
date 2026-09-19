import JSZip from 'jszip';
import { optimizePhoto } from './imageOptimizer';

export interface PhotoExtractionProgress {
  current: number;
  total: number;
  message: string;
}

export interface ZipExtractionResult {
  photoMap: Map<string, string>; // NISN -> optimized base64 dataUrl
  extractedCount: number;
  unmatchedFiles: string[];
}

export async function extractAndOptimizeZip(
  file: File,
  onProgress?: (progress: PhotoExtractionProgress) => void
): Promise<ZipExtractionResult> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);
  const photoMap = new Map<string, string>();
  const unmatchedFiles: string[] = [];

  // Filter image files inside zip
  const imageEntries: { name: string; entry: JSZip.JSZipObject }[] = [];
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  loadedZip.forEach((relativePath, entry) => {
    if (entry.dir) return;
    // Skip Mac OS metadata files like __MACOSX/._filename.jpg
    if (relativePath.includes('__MACOSX') || relativePath.startsWith('.')) return;

    const lower = relativePath.toLowerCase();
    if (validExtensions.some((ext) => lower.endsWith(ext))) {
      imageEntries.push({ name: relativePath, entry });
    }
  });

  const total = imageEntries.length;
  if (total === 0) {
    return { photoMap, extractedCount: 0, unmatchedFiles: [] };
  }

  for (let i = 0; i < total; i++) {
    const { name, entry } = imageEntries[i];
    const filenameWithExt = name.split('/').pop() || name;
    // Extract base name without extension as NISN candidate (e.g. "0061234501.jpg" -> "0061234501")
    const nisn = filenameWithExt.substring(0, filenameWithExt.lastIndexOf('.')).trim();

    onProgress?.({
      current: i + 1,
      total,
      message: `Mengompresi foto ${i + 1}/${total}: ${filenameWithExt}`,
    });

    try {
      const blob = await entry.async('blob');
      // Resize & compress on the fly to ~30-50KB
      const optimizedDataUrl = await optimizePhoto(blob, 360, 480, 0.85);
      photoMap.set(nisn, optimizedDataUrl);
    } catch (err) {
      console.warn(`Gagal mengoptimasi foto: ${name}`, err);
      unmatchedFiles.push(name);
    }
  }

  return {
    photoMap,
    extractedCount: photoMap.size,
    unmatchedFiles,
  };
}

/**
 * Creates and downloads a sample ZIP file containing dummy photos for test NISNs
 */
export async function generateSamplePhotosZip(): Promise<void> {
  const zip = new JSZip();

  // Create simple colorful avatar canvases for sample students
  const sampleStudents = [
    { nisn: '0061234501', name: 'Achmad F.', bg: '#2563eb' },
    { nisn: '0061234502', name: 'Beatrix C.', bg: '#db2777' },
    { nisn: '0061234503', name: 'Candra G.', bg: '#059669' },
    { nisn: '0061234504', name: 'Dwi A.', bg: '#7c3aed' },
    { nisn: '0061234505', name: 'Eko P.', bg: '#d97706' },
    { nisn: '0061234506', name: 'Farah S.', bg: '#0891b2' },
    { nisn: '0061234507', name: 'Gilang R.', bg: '#4f46e5' },
    { nisn: '0061234508', name: 'Hanifa N.', bg: '#e11d48' },
  ];

  for (const item of sampleStudents) {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Solid background
      ctx.fillStyle = item.bg;
      ctx.fillRect(0, 0, 300, 400);

      // Student silhouette
      ctx.fillStyle = '#ffffff';
      // Head
      ctx.beginPath();
      ctx.arc(150, 150, 60, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.beginPath();
      ctx.ellipse(150, 320, 100, 80, 0, 0, Math.PI, true);
      ctx.fill();

      // Name & NISN text
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.name, 150, 240);
      ctx.font = '16px monospace';
      ctx.fillText(item.nisn, 150, 265);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const base64Data = dataUrl.split(',')[1];
      zip.file(`${item.nisn}.jpg`, base64Data, { base64: true });
    }
  }

  const content = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
  });

  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Contoh_Foto_Siswa.zip');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}
