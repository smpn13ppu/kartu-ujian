'use client';

import React, { useState, useRef } from 'react';
import { Student, SchoolSettings, LayoutSettings } from '../types';
import { PrintSheet } from './PrintSheet';
import { generateCardsPdf, PdfGenerationProgress } from '../lib/pdfGenerator';
import {
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  FileCheck,
  Image as ImageIcon,
  ImageOff,
} from 'lucide-react';

interface PreviewStepProps {
  students: Student[];
  settings: SchoolSettings;
  layout: LayoutSettings;
  onUpdateLayout?: (updated: Partial<LayoutSettings>) => void;
  onBack: () => void;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  students,
  settings,
  layout,
  onUpdateLayout,
  onBack,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState<number>(0.75);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<PdfGenerationProgress | null>(null);

  // Hidden container holding all sheets for multi-page PDF generation and native printing
  const allSheetsContainerRef = useRef<HTMLDivElement>(null);

  // Split students into chunks per sheet
  const pageSize = layout.cardsPerPage;
  const totalSheets = Math.ceil(students.length / pageSize);

  const sheetsData: Student[][] = [];
  for (let i = 0; i < totalSheets; i++) {
    sheetsData.push(students.slice(i * pageSize, (i + 1) * pageSize));
  }

  const currentSheetStudents = sheetsData[currentPage - 1] || [];

  const handleDownloadPdf = async () => {
    if (!allSheetsContainerRef.current) return;

    setIsGeneratingPdf(true);
    setPdfProgress({
      currentSheet: 1,
      totalSheets,
      progressPercent: 0,
      statusText: 'Menyiapkan lembar dokumen...',
    });

    try {
      // Find all sheet elements in the full container
      const sheetElements = Array.from(
        allSheetsContainerRef.current.querySelectorAll<HTMLElement>('.paper-sheet')
      );

      const cleanSchoolName = settings.namaSekolah
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 20);
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `kartu_ujian_${cleanSchoolName}_${layout.paperSize}_${dateStr}.pdf`;

      await generateCardsPdf(sheetElements, layout.paperSize, fileName, (p) => {
        setPdfProgress(p);
      });
    } catch (err: any) {
      alert(`Gagal membuat PDF: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Control Toolbar (Sticky) */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-20 z-30">
        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Lembar Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <span>Lembar</span>
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {Array.from({ length: totalSheets }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span className="text-slate-500">dari {totalSheets}</span>
          </div>

          <button
            type="button"
            disabled={currentPage >= totalSheets}
            onClick={() => setCurrentPage((p) => Math.min(totalSheets, p + 1))}
            className="p-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Lembar Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5 text-xs hidden sm:flex">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
              className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
              title="Perkecil Tampilan"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1.5 text-slate-600 min-w-10 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.2, Number((z + 0.1).toFixed(2))))}
              className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
              title="Perbesar Tampilan"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Photo Toggle in Toolbar */}
          {onUpdateLayout && (
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => onUpdateLayout({ enablePhoto: true })}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  layout.enablePhoto !== false
                    ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilkan bingkai/slot foto peserta"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Dengan Foto</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateLayout({ enablePhoto: false })}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  layout.enablePhoto === false
                    ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Hapus bingkai foto (tampilan full lebar)"
              >
                <ImageOff className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Tanpa Foto</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons: Print & Download PDF */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Native Print button */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            title="Cetak langsung menggunakan dialog print browser (Ctrl + P)"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            <span>Cetak Langsung</span>
          </button>

          {/* Download PDF button */}
          <button
            type="button"
            disabled={isGeneratingPdf}
            onClick={handleDownloadPdf}
            className="flex-1 md:flex-initial px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isGeneratingPdf ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Membuat PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh File PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Visual Screen Preview of Current Sheet */}
      <div className="no-print bg-slate-200/80 rounded-2xl p-4 sm:p-8 overflow-auto flex justify-center items-start min-h-[600px] border border-slate-300/80 shadow-inner">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
        >
          <PrintSheet
            students={currentSheetStudents}
            settings={settings}
            layout={layout}
            pageNumber={currentPage}
            totalPages={totalSheets}
          />
        </div>
      </div>

      {/* 3. Offscreen Full Container (For generating high-res PDF & Native Printing) */}
      {/* On screen, this is hidden from view; on @media print, it is shown as the full multi-page document! */}
      <div
        ref={allSheetsContainerRef}
        className="print-only hidden print:block"
        style={{
          position: isGeneratingPdf ? 'absolute' : undefined,
          left: isGeneratingPdf ? '-9999px' : undefined,
          top: isGeneratingPdf ? '0' : undefined,
          display: isGeneratingPdf ? 'block' : undefined,
        }}
      >
        {sheetsData.map((pageStudents, pageIdx) => (
          <div
            key={`sheet-${pageIdx}`}
            className="sheet-page-wrapper"
            style={{
              width: '210mm',
              height: layout.paperSize === 'A4' ? '296mm' : '328mm',
              maxHeight: layout.paperSize === 'A4' ? '296mm' : '328mm',
              overflow: 'hidden',
              boxSizing: 'border-box',
              margin: '0 auto',
            }}
          >
            <PrintSheet
              students={pageStudents}
              settings={settings}
              layout={layout}
              pageNumber={pageIdx + 1}
              totalPages={totalSheets}
            />
          </div>
        ))}
      </div>

      {/* 4. PDF Generation Modal Overlay */}
      {isGeneratingPdf && pdfProgress && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Membuat Dokumen PDF</h3>
                <p className="text-xs text-slate-500">
                  Merender {totalSheets} lembar ({students.length} kartu peserta)
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{pdfProgress.statusText}</span>
                <span className="font-mono text-blue-600">{pdfProgress.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${pdfProgress.progressPercent}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic text-center">
              Mohon tunggu, proses dilakukan secara lokal di browser Anda untuk menjaga privasi.
            </p>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="no-print flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Pengaturan Layout
        </button>

        <div className="text-xs text-slate-500 font-medium">
          Total: <strong className="text-slate-800">{students.length}</strong> kartu dalam{' '}
          <strong className="text-slate-800">{totalSheets}</strong> lembar ({layout.paperSize})
        </div>
      </div>
    </div>
  );
};
