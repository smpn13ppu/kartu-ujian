'use client';

import React from 'react';
import { Sparkles, RefreshCw, Printer, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { generateSampleExcelTemplate } from '../lib/excelParser';
import { generateSamplePhotosZip } from '../lib/zipParser';

interface HeaderProps {
  onLoadSampleData: () => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoadSampleData, onResetAll }) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
              Generator Kartu Ujian
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                Otomatis
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Buat ratusan kartu ujian sekolah siap cetak A4 & F4 dalam hitungan menit
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Load Sample Demo Data */}
          <button
            type="button"
            onClick={onLoadSampleData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
            title="Muat data contoh lengkap untuk ujicoba kilat"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">Gunakan</span> Data Sampel
          </button>

          {/* Direct Google Sheets Template Link */}
          <a
            href="https://docs.google.com/spreadsheets/d/1LFqjGjOEOgkh_hm5rqPrCDmQq6QZEdGO/edit?usp=drive_link&ouid=106977714285548458206&rtpof=true&sd=true"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Buka Template Excel di Google Sheets"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden lg:inline">Template Excel</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* Reset button */}
          <button
            type="button"
            onClick={onResetAll}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Reset semua data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
