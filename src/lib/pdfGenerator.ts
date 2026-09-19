import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PaperSize } from '../types';

export interface PdfGenerationProgress {
  currentSheet: number;
  totalSheets: number;
  progressPercent: number;
  statusText: string;
}

export async function generateCardsPdf(
  sheetElements: HTMLElement[],
  paperSize: PaperSize,
  fileName: string,
  onProgress?: (progress: PdfGenerationProgress) => void
): Promise<void> {
  const totalSheets = sheetElements.length;
  if (totalSheets === 0) {
    throw new Error('Tidak ada halaman untuk dicetak.');
  }

  // Dimensions in mm
  const widthMm = 210;
  const heightMm = paperSize === 'A4' ? 297 : 330;

  // Initialize jsPDF with custom page size for F4 or standard A4
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [widthMm, heightMm],
    compress: true,
  });

  for (let i = 0; i < totalSheets; i++) {
    const sheetEl = sheetElements[i];

    onProgress?.({
      currentSheet: i + 1,
      totalSheets,
      progressPercent: Math.round(((i) / totalSheets) * 100),
      statusText: `Merender lembar ke-${i + 1} dari ${totalSheets}...`,
    });

    // Capture sheet element to high-res canvas (scale 2 = 192 DPI approx, crisp and fast)
    const canvas = await html2canvas(sheetEl, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Convert canvas to compressed JPEG data
    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    if (i > 0) {
      pdf.addPage([widthMm, heightMm], 'portrait');
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, widthMm, heightMm, undefined, 'FAST');
  }

  onProgress?.({
    currentSheet: totalSheets,
    totalSheets,
    progressPercent: 100,
    statusText: 'Menyimpan dan mengunduh dokumen PDF...',
  });

  // Ensure fileName ends with .pdf
  const safePdfName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

  // 1. Send to server to write to project folder and get reliable download headers
  try {
    const pdfBase64 = pdf.output('datauristring');
    const response = await fetch('/api/save-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdfBase64, fileName: safePdfName }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.downloadUrl) {
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = result.fileName || safePdfName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          if (link.parentNode) link.parentNode.removeChild(link);
        }, 1000);
        return;
      }
    }
  } catch (err) {
    console.warn('Gagal menyimpan via server, beralih ke fallback blob download:', err);
  }

  // Fallback: Direct client-side blob download with explicit MIME type & appended link
  const blob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = safePdfName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (link.parentNode) link.parentNode.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }, 2000);
}
