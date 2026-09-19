'use client';

import React from 'react';
import { LayoutSettings, PaperSize, CardsPerPage, ColorTheme } from '../types';
import { LayoutGrid, FileText, Scissors, Palette, ArrowRight, ArrowLeft, Image as ImageIcon, ImageOff } from 'lucide-react';

interface LayoutStepProps {
  layout: LayoutSettings;
  totalStudents: number;
  onChange: (updated: Partial<LayoutSettings>) => void;
  onBack: () => void;
  onNext: () => void;
}

export const LayoutStep: React.FC<LayoutStepProps> = ({
  layout,
  totalStudents,
  onChange,
  onBack,
  onNext,
}) => {
  const totalSheetsNeeded = Math.ceil(totalStudents / layout.cardsPerPage);

  const themeOptions: { id: ColorTheme; label: string; previewColor: string; desc: string }[] = [
    { id: 'blue', label: 'Biru Formal', previewColor: 'bg-blue-700', desc: 'Standar Umum & SMA/SMP' },
    { id: 'green', label: 'Hijau Madrasah', previewColor: 'bg-emerald-700', desc: 'Kemenag, MI, MTs, MA' },
    { id: 'red', label: 'Merah Maroon', previewColor: 'bg-rose-700', desc: 'SMK / Vokasi / Lembaga' },
    { id: 'dark', label: 'Hitam Netral', previewColor: 'bg-slate-800', desc: 'Monokrom & Formal Elegan' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Pengaturan Utama: Kertas & Jumlah Kartu */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Pengaturan Kertas & Tata Letak Cetak</h2>
            <p className="text-xs text-slate-500">
              Sesuaikan ukuran kertas, efisiensi kartu per lembar, serta format foto peserta.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pilihan Ukuran Kertas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              1. Ukuran Kertas Cetak
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onChange({ paperSize: 'A4' })}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  layout.paperSize === 'A4'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-sm font-bold text-slate-900">A4 Standar</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">210 × 297 mm</div>
                <div className="text-[11px] text-slate-600 mt-2">
                  Ukuran kertas printer paling umum dan universal.
                </div>
              </button>

              <button
                type="button"
                onClick={() => onChange({ paperSize: 'F4' })}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  layout.paperSize === 'F4'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-sm font-bold text-slate-900">F4 / Folio</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">210 × 330 mm</div>
                <div className="text-[11px] text-slate-600 mt-2">
                  Kertas lebih panjang, ruang kartu lebih leluasa.
                </div>
              </button>
            </div>
          </div>

          {/* Pilihan Jumlah Kartu per Lembar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4 text-indigo-600" />
              2. Jumlah Kartu per Lembar
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onChange({ cardsPerPage: 6 })}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  layout.cardsPerPage === 6
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-slate-900">6 Kartu</div>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded">
                    2 × 3
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-2">
                  Kartu lebih besar, tulisan sangat jelas dan mudah dibaca.
                </div>
              </button>

              <button
                type="button"
                onClick={() => onChange({ cardsPerPage: 8 })}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  layout.cardsPerPage === 8
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-slate-900">8 Kartu</div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    Hemat (2 × 4)
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-2">
                  Paling hemat kertas, sangat disarankan untuk ±400 siswa.
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Format Foto Peserta (Dengan Foto vs Tanpa Foto) */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            3. Format Tampilan Foto Peserta
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChange({ enablePhoto: true })}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                layout.enablePhoto !== false
                  ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Dengan Bingkai Foto</span>
                  {layout.enablePhoto !== false && (
                    <span className="text-[10px] bg-emerald-600 text-white font-semibold px-2 py-0.5 rounded">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Menampilkan slot foto 3×4. Jika siswa belum memiliki foto, bingkai foto tetap ada untuk ditempel foto fisik manual.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onChange({ enablePhoto: false })}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                layout.enablePhoto === false
                  ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ImageOff className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Tanpa Foto (Full Lebar)</span>
                  {layout.enablePhoto === false && (
                    <span className="text-[10px] bg-emerald-600 text-white font-semibold px-2 py-0.5 rounded">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Menghilangkan bingkai foto sepenuhnya. Data siswa tampil lebih lebar, rapi, bersih, dan mudah dibaca.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 3. Opsi Tambahan: Garis Potong & Warna Tema */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Garis Potong Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Garis Potong (Cutting Guide)</div>
                <div className="text-[11px] text-slate-500">
                  Garis putus-putus halus di antara kartu untuk panduan gunting
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={layout.showCuttingGuide}
                onChange={(e) => onChange({ showCuttingGuide: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Pilihan Warna Tema Kartu */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-600" />
              Aksen Warna Kartu
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {themeOptions.map((thm) => (
                <button
                  key={thm.id}
                  type="button"
                  onClick={() => onChange({ colorTheme: thm.id })}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    layout.colorTheme === thm.id
                      ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${thm.previewColor} shadow-xs`} />
                  <span className="text-[10.5px] font-bold text-slate-800 text-center truncate w-full">
                    {thm.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Ringkasan Kebutuhan Kertas */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">
          Estimasi Kebutuhan Kertas Cetak
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <div className="text-[11px] text-blue-200">Total Siswa</div>
            <div className="text-xl font-bold mt-0.5">{totalStudents} peserta</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <div className="text-[11px] text-blue-200">Kapasitas per Lembar</div>
            <div className="text-xl font-bold mt-0.5">{layout.cardsPerPage} kartu</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <div className="text-[11px] text-blue-200">Kertas Dibutuhkan</div>
            <div className="text-xl font-black text-amber-300 mt-0.5">
              {totalSheetsNeeded} lembar
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <div className="text-[11px] text-blue-200">Ukuran Kertas</div>
            <div className="text-xl font-bold mt-0.5">{layout.paperSize}</div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Data Peserta
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all hover:gap-3"
        >
          Lanjut ke Preview Lembar Cetak
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
