'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Share2,
  Maximize2,
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
  const [canShareFile, setCanShareFile] = useState(false);

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

  // Auto-fit zoom level based on screen width on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        // A4 sheet width is ~794px in px (210mm)
        const fitted = Math.max(0.35, Math.min(0.55, (screenWidth - 48) / 800));
        setZoomLevel(Number(fitted.toFixed(2)));
      }
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        setCanShareFile(true);
      }
    }
  }, []);

  const handleFitScreen = () => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        const fitted = Math.max(0.35, Math.min(0.55, (screenWidth - 48) / 800));
        setZoomLevel(Number(fitted.toFixed(2)));
      } else {
        setZoomLevel(0.75);
      }
    }
  };

  const handleDownloadPdf = async (triggerShare = false) => {
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

      const result = await generateCardsPdf(sheetElements, layout.paperSize, fileName, (p) => {
        setPdfProgress(p);
      });

      // If user requested share and navigator.share is available
      if (triggerShare && typeof navigator !== 'undefined' && navigator.share && result?.blob) {
        try {
          const file = new File([result.blob], result.fileName, { type: 'application/pdf' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `Kartu Ujian - ${settings.namaSekolah}`,
              text: `Dokumen Kartu Ujian ${students.length} Siswa (${layout.paperSize})`,
              files: [file],
            });
          }
        } catch (shareErr) {
          console.log('Share dismissed or not supported:', shareErr);
        }
      }
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
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Control Toolbar (Sticky) */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 sticky top-16 sm:top-20 z-30">
        {/* Pagination & Zoom Controls */}
        <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-2">
          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 sm:p-1.5 border border-slate-300 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors touch-target flex items-center justify-center"
              title="Lembar Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {Array.from({ length: totalSheets }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Hal {num}
                  </option>
                ))}
              </select>
              <span className="text-slate-500 text-[11px]">/ {totalSheets}</span>
            </div>

            <button
              type="button"
              disabled={currentPage >= totalSheets}
              onClick={() => setCurrentPage((p) => Math.min(totalSheets, p + 1))}
              className="p-2 sm:p-1.5 border border-slate-300 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors touch-target flex items-center justify-center"
              title="Lembar Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Zoom controls with Fit-to-screen */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.3, Number((z - 0.05).toFixed(2))))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded cursor-pointer touch-target flex items-center justify-center"
              title="Perkecil Tampilan"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleFitScreen}
              className="font-mono text-[11px] px-1.5 text-blue-700 hover:underline min-w-10 text-center font-bold cursor-pointer"
              title="Klik untuk Sesuaikan ke Layar"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.2, Number((z + 0.05).toFixed(2))))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded cursor-pointer touch-target flex items-center justify-center"
              title="Perbesar Tampilan"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleFitScreen}
              className="p-1.5 text-slate-500 hover:text-blue-600 rounded cursor-pointer hidden xs:flex items-center"
              title="Pas Layar"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Photo Toggle in Toolbar */}
          {onUpdateLayout && (
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs hidden sm:flex">
              <button
                type="button"
                onClick={() => onUpdateLayout({ enablePhoto: true })}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  layout.enablePhoto !== false
                    ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilkan bingkai/slot foto peserta"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Foto</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateLayout({ enablePhoto: false })}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
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

        {/* Action Buttons: Print & Download / Share PDF (Desktop header view) */}
        <div className="hidden md:flex items-center gap-2.5 justify-end">
          {/* Native Print button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            title="Cetak langsung menggunakan dialog print browser (Ctrl + P)"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            <span>Cetak Langsung</span>
          </button>

          {/* Share PDF button on mobile/supporting browsers */}
          {canShareFile && (
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={() => handleDownloadPdf(true)}
              className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 border border-indigo-200 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              title="Bagikan PDF ke WhatsApp, Drive, atau aplikasi lain"
            >
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span>Bagikan</span>
            </button>
          )}

          {/* Download PDF button */}
          <button
            type="button"
            disabled={isGeneratingPdf}
            onClick={() => handleDownloadPdf(false)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isGeneratingPdf ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Membuat PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Visual Screen Preview of Current Sheet */}
      <div className="no-print bg-slate-200/80 rounded-2xl p-2 sm:p-6 overflow-x-auto overflow-y-hidden flex justify-center items-start min-h-[520px] sm:min-h-[600px] border border-slate-300/80 shadow-inner">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            marginBottom: `calc((1 - ${zoomLevel}) * -500px)`,
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

      {/* 5. Navigation & Action Buttons (Sticky on mobile, inline on desktop) */}
      <div className="fixed sm:static bottom-0 left-0 right-0 p-3 sm:p-0 bg-white/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t sm:border-t-0 border-slate-200 z-30 safe-bottom">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-3.5 sm:px-5 py-3 sm:py-2.5 border border-slate-300 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors touch-target flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Kembali</span>
          </button>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            {/* Mobile Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="md:hidden p-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 flex items-center justify-center cursor-pointer transition-colors touch-target"
              title="Cetak Langsung"
            >
              <Printer className="w-4 h-4 text-slate-700" />
            </button>

            {/* Mobile Share Button */}
            {canShareFile && (
              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={() => handleDownloadPdf(true)}
                className="md:hidden p-3 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer transition-colors touch-target"
                title="Bagikan File PDF"
              >
                <Share2 className="w-4 h-4 text-indigo-600" />
              </button>
            )}

            {/* Download PDF button (Main Action) */}
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={() => handleDownloadPdf(false)}
              className="flex-1 sm:flex-initial px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg sm:shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all touch-target"
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
      </div>
    </div>
  );
};
