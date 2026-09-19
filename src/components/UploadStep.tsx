'use client';

import React, { useState, useRef } from 'react';
import { Student, ValidationSummary } from '../types';
import { parseExcelFile, generateSampleExcelTemplate } from '../lib/excelParser';
import { extractAndOptimizeZip, generateSamplePhotosZip, PhotoExtractionProgress } from '../lib/zipParser';
import {
  FileSpreadsheet,
  FileArchive,
  CheckCircle2,
  AlertTriangle,
  Search,
  ArrowRight,
  ArrowLeft,
  Download,
  Image as ImageIcon,
  UserCheck,
  UserX,
  RefreshCw,
  FolderOpen,
  ExternalLink,
} from 'lucide-react';

interface UploadStepProps {
  students: Student[];
  validation: ValidationSummary | null;
  onDataLoaded: (students: Student[], validation: ValidationSummary) => void;
  onPhotosUpdated: (students: Student[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export const UploadStep: React.FC<UploadStepProps> = ({
  students,
  validation,
  onDataLoaded,
  onPhotosUpdated,
  onBack,
  onNext,
}) => {
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);
  const [isProcessingZip, setIsProcessingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState<PhotoExtractionProgress | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [photoFilter, setPhotoFilter] = useState<'all' | 'withPhoto' | 'withoutPhoto'>('all');

  const excelInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const handleOpenLocal = async (fileName: string, action: 'open' | 'reveal' | 'folder' = 'open') => {
    try {
      const res = await fetch('/api/open-local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, action }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || 'Gagal membuka file di komputer');
      }
    } catch (e) {
      console.error('Error opening local file:', e);
    }
  };

  const handleExcelChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingExcel(true);
    try {
      const { students: parsedStudents, validation: valResult } = await parseExcelFile(file);

      // If existing students already had photos, try to retain matching photos by NISN
      const photoMap = new Map<string, string>();
      students.forEach((s) => {
        if (s.fotoUrl) photoMap.set(s.nisn, s.fotoUrl);
      });

      const mergedStudents = parsedStudents.map((s) => {
        const existingFoto = photoMap.get(s.nisn);
        return {
          ...s,
          fotoUrl: existingFoto || s.fotoUrl,
          hasFoto: Boolean(existingFoto || s.fotoUrl),
        };
      });

      valResult.withPhotosCount = mergedStudents.filter((s) => s.hasFoto).length;
      valResult.withoutPhotosCount = mergedStudents.length - valResult.withPhotosCount;

      onDataLoaded(mergedStudents, valResult);
    } catch (err: any) {
      alert(`Gagal memproses Excel: ${err.message || 'Format file tidak sesuai'}`);
    } finally {
      setIsProcessingExcel(false);
      if (excelInputRef.current) excelInputRef.current.value = '';
    }
  };

  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (students.length === 0) {
      alert('Silakan upload data Excel peserta terlebih dahulu sebelum mengunggah file foto.');
      return;
    }

    setIsProcessingZip(true);
    setZipProgress({ current: 0, total: 100, message: 'Membaca file ZIP...' });

    try {
      const { photoMap, extractedCount } = await extractAndOptimizeZip(file, (p) => {
        setZipProgress(p);
      });

      // Match photos with students by NISN
      let matchedCount = 0;
      const updatedStudents = students.map((std) => {
        const photo = photoMap.get(std.nisn);
        if (photo) {
          matchedCount++;
          return { ...std, fotoUrl: photo, hasFoto: true };
        }
        return std;
      });

      onPhotosUpdated(updatedStudents);

      alert(
        `Sukses! Ditemukan ${extractedCount} foto di dalam ZIP. ${matchedCount} foto berhasil dicocokkan dengan data siswa.`
      );
    } catch (err: any) {
      alert(`Gagal memproses file ZIP: ${err.message || 'File ZIP rusak atau format tidak didukung'}`);
    } finally {
      setIsProcessingZip(false);
      setZipProgress(null);
      if (zipInputRef.current) zipInputRef.current.value = '';
    }
  };

  // Filter students for table preview
  const filteredStudents = students.filter((std) => {
    const matchesSearch =
      std.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.nisn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.kelas.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (photoFilter === 'withPhoto') return std.hasFoto;
    if (photoFilter === 'withoutPhoto') return !std.hasFoto;
    return true;
  });

  const withPhotoCount = students.filter((s) => s.hasFoto).length;
  const withoutPhotoCount = students.length - withPhotoCount;

  return (
    <div className="space-y-6">
      {/* 1. Upload Panels: Excel & ZIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Upload Data Excel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">1. Upload Data Peserta (Excel)</h3>
                  <p className="text-[11px] text-slate-500">Format .xlsx atau .xls</p>
                </div>
              </div>
              <a
                href="https://docs.google.com/spreadsheets/d/1LFqjGjOEOgkh_hm5rqPrCDmQq6QZEdGO/edit?usp=drive_link&ouid=106977714285548458206&rtpof=true&sd=true"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Buka Template Peserta Ujian di Google Spreadsheet"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                Template Excel
                <ExternalLink className="w-3 h-3 text-emerald-500" />
              </a>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Kolom wajib: <strong className="text-slate-800">Nama Peserta</strong>,{' '}
              <strong className="text-slate-800">NISN</strong>,{' '}
              <strong className="text-slate-800">Kelas</strong>, dan{' '}
              <strong className="text-slate-800">Ruangan</strong>.
            </p>

            <input
              type="file"
              ref={excelInputRef}
              accept=".xlsx,.xls"
              onChange={handleExcelChange}
              className="hidden"
            />

            <div
              onClick={() => excelInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/60 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
            >
              {isProcessingExcel ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
                  <span className="text-xs font-semibold text-emerald-800">
                    Membaca & Memvalidasi data Excel...
                  </span>
                </div>
              ) : (
                <>
                  <FileSpreadsheet className="w-10 h-10 text-emerald-600" />
                  <div className="text-xs font-bold text-slate-800">
                    Klik untuk memilih file Excel (.xlsx / .xls)
                  </div>
                  <div className="text-[11px] text-slate-500">atau seret file ke area ini</div>
                </>
              )}
            </div>
          </div>

          {students.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> {students.length} Siswa Terdaftar
              </span>
              <button
                type="button"
                onClick={() => excelInputRef.current?.click()}
                className="text-blue-600 hover:underline font-medium"
              >
                Ganti File Excel
              </button>
            </div>
          )}
        </div>

        {/* Upload ZIP Foto Siswa */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileArchive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">2. Upload Foto Siswa (ZIP)</h3>
                  <p className="text-[11px] text-slate-500">Opsional — Otomatis di-resize ke ~35KB</p>
                </div>
              </div>
              <a
                href="https://drive.google.com/file/d/11kN2dF-hYTnx8VelTyCKia0bKLkg_2-b/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Buka & Download Contoh ZIP Foto di Google Drive"
              >
                <FileArchive className="w-3.5 h-3.5 text-indigo-600" />
                Contoh ZIP
                <ExternalLink className="w-3 h-3 text-indigo-500" />
              </a>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Nama file foto di dalam ZIP harus sesuai <strong className="text-slate-800">NISN</strong>{' '}
              (misal: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">0061234501.jpg</code>).
            </p>

            <input
              type="file"
              ref={zipInputRef}
              accept=".zip"
              onChange={handleZipChange}
              className="hidden"
            />

            <div
              onClick={() => zipInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
            >
              {isProcessingZip ? (
                <div className="flex flex-col items-center gap-2 py-2 w-full px-4">
                  <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
                  <span className="text-xs font-semibold text-indigo-800 text-center">
                    {zipProgress?.message || 'Memproses foto...'}
                  </span>
                  {zipProgress && (
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-1">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round((zipProgress.current / zipProgress.total) * 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <FileArchive className="w-10 h-10 text-indigo-600" />
                  <div className="text-xs font-bold text-slate-800">
                    Klik untuk memilih arsip ZIP foto (.zip)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Sistem otomatis mengompresi gambar on-the-fly
                  </div>
                </>
              )}
            </div>
          </div>

          {students.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="text-slate-700 font-semibold">
                Status Foto: <span className="text-emerald-700">{withPhotoCount} Ada</span> /{' '}
                <span className="text-amber-700">{withoutPhotoCount} Tanpa Foto</span>
              </span>
              <button
                type="button"
                onClick={() => zipInputRef.current?.click()}
                className="text-blue-600 hover:underline font-medium"
              >
                Upload ZIP Lain
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Validation Summary Alert (if any issues) */}
      {validation && (validation.duplicateNisn.length > 0 || validation.warnings.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            Catatan Validasi Data Excel:
          </div>
          <ul className="list-disc list-inside space-y-1 text-amber-800 pl-1">
            {validation.duplicateNisn.length > 0 && (
              <li>
                Ditemukan {validation.duplicateNisn.length} NISN duplikat: (
                {validation.duplicateNisn.slice(0, 5).join(', ')}
                {validation.duplicateNisn.length > 5 ? ' ...' : ''})
              </li>
            )}
            {validation.warnings.slice(0, 3).map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. Student Preview Table */}
      {students.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Table Header & Controls */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Daftar Siswa Terdeteksi</h3>
              <span className="text-xs bg-slate-200 font-mono font-semibold text-slate-700 px-2 py-0.5 rounded-full">
                {students.length} siswa
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter by photo */}
              <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setPhotoFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    photoFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({students.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoFilter('withPhoto')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                    photoFilter === 'withPhoto'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-3 h-3" /> Ada Foto ({withPhotoCount})
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoFilter('withoutPhoto')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                    photoFilter === 'withoutPhoto'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserX className="w-3 h-3" /> Tanpa Foto ({withoutPhotoCount})
                </button>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama / NISN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-44 sm:w-56"
                />
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="overflow-x-auto max-h-[420px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">No</th>
                  <th className="py-2.5 px-3 w-14 text-center">Foto</th>
                  <th className="py-2.5 px-3">NISN</th>
                  <th className="py-2.5 px-3">Nama Lengkap Peserta</th>
                  <th className="py-2.5 px-3">Kelas</th>
                  <th className="py-2.5 px-3">Ruang Ujian</th>
                  <th className="py-2.5 px-3">No. Peserta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Tidak ada data siswa yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((std, index) => (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 text-center text-slate-400 font-mono">
                        {index + 1}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="w-8 h-10 mx-auto rounded border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center">
                          {std.fotoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={std.fotoUrl}
                              alt={std.nama}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-700">
                        {std.nisn}
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900 uppercase">
                        {std.nama}
                      </td>
                      <td className="py-2 px-3 text-slate-700 font-medium">{std.kelas}</td>
                      <td className="py-2 px-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {std.ruangan}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-500">
                        {std.nomorPeserta || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
          <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">Belum Ada Data Peserta</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Upload file Excel data siswa untuk memproses kartu ujian, atau klik tombol di bawah untuk mencoba dengan data sampel.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Pengaturan
        </button>

        <button
          type="button"
          disabled={students.length === 0}
          onClick={onNext}
          className={`px-6 py-3 font-bold text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all ${
            students.length > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:gap-3'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          Lanjut ke Pengaturan Layout
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
