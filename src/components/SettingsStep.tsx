'use client';

import React, { useRef } from 'react';
import { SchoolSettings } from '../types';
import { fileToDataUrl } from '../lib/imageOptimizer';
import { Building2, Upload, Trash2, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface SettingsStepProps {
  settings: SchoolSettings;
  onChange: (updated: Partial<SchoolSettings>) => void;
  onNext: () => void;
}

export const SettingsStep: React.FC<SettingsStepProps> = ({ settings, onChange, onNext }) => {
  const logoKiriInputRef = useRef<HTMLInputElement>(null);
  const logoKananInputRef = useRef<HTMLInputElement>(null);
  const ttdKepsekInputRef = useRef<HTMLInputElement>(null);
  const stempelInputRef = useRef<HTMLInputElement>(null);
  const ttdPanitiaInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SchoolSettings
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await fileToDataUrl(file);
      onChange({ [field]: dataUrl });
    } catch (err) {
      alert('Gagal membaca gambar. Pastikan format file PNG atau JPG.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Card: Kop & Identitas Sekolah */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Identitas Sekolah & Kop Kartu</h2>
            <p className="text-xs text-slate-500">
              Informasi ini akan tercantum di bagian atas (header) setiap kartu ujian.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Sekolah / Madrasah <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={settings.namaSekolah}
              onChange={(e) => onChange({ namaSekolah: e.target.value })}
              placeholder="Contoh: SMA NEGERI 1 NUSANTARA"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all font-semibold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Judul Ujian & Tahun Pelajaran <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={settings.subHeader}
              onChange={(e) => onChange({ subHeader: e.target.value })}
              placeholder="Contoh: KARTU PESERTA PENILAIAN AKHIR SEMESTER (PAS) GANJIL&#10;TAHUN AJARAN 2026/2027"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Alamat Sekolah / Website / No. Telp (Opsional)
            </label>
            <input
              type="text"
              value={settings.alamatSekolah || ''}
              onChange={(e) => onChange({ alamatSekolah: e.target.value })}
              placeholder="Contoh: Jl. Pendidikan No. 45, Kota Cendekia | Telp: (021) 7890123"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Logo 1 & Logo 2 Upload Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100">
          {/* Logo Kiri */}
          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {settings.logoKiri ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logoKiri}
                  alt="Logo Kiri"
                  className="max-h-14 max-w-14 object-contain"
                />
              ) : (
                <span className="text-[10px] text-slate-400 font-medium text-center">
                  Belum ada Logo
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-800">Logo 1 (Kiri)</h4>
              <p className="text-[11px] text-slate-500 mb-2">Logo Pemda / Dinas / Tut Wuri</p>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={logoKiriInputRef}
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={(e) => handleFileUpload(e, 'logoKiri')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoKiriInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 cursor-pointer flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  Unggah
                </button>
                {settings.logoKiri && (
                  <button
                    type="button"
                    onClick={() => onChange({ logoKiri: undefined })}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                    title="Hapus Logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Logo Kanan */}
          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {settings.logoKanan ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logoKanan}
                  alt="Logo Kanan"
                  className="max-h-14 max-w-14 object-contain"
                />
              ) : (
                <span className="text-[10px] text-slate-400 font-medium text-center">
                  Belum ada Logo
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-800">Logo 2 (Kanan)</h4>
              <p className="text-[11px] text-slate-500 mb-2">Logo Resmi Sekolah / Madrasah</p>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={logoKananInputRef}
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={(e) => handleFileUpload(e, 'logoKanan')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoKananInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 cursor-pointer flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  Unggah
                </button>
                {settings.logoKanan && (
                  <button
                    type="button"
                    onClick={() => onChange({ logoKanan: undefined })}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                    title="Hapus Logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Card: Legalitas & Tanda Tangan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Pejabat & Tanda Tangan Pengesahan</h2>
            <p className="text-xs text-slate-500">
              Titimangsa tanggal, tanda tangan digital, dan stempel resmi pengesahan kartu ujian.
            </p>
          </div>
        </div>

        {/* Tanggal / Titimangsa Kartu */}
        <div className="mb-5 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Titimangsa / Tanggal Kartu (Ditempatkan di atas TTD Panitia)
          </label>
          <input
            type="text"
            value={settings.tanggalKartu || ''}
            onChange={(e) => onChange({ tanggalKartu: e.target.value })}
            placeholder="Contoh: Cendekia, 19 September 2026 atau 19 September 2026"
            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Format bebas, misal: <em>Jakarta, 20 Oktober 2026</em> atau <em>19 September 2026</em>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kepala Sekolah (Wajib) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                1. Kepala Sekolah <span className="text-rose-500">*</span>
              </span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Wajib (Mengetahui)
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Nama Lengkap & Gelar</label>
              <input
                type="text"
                value={settings.namaKepsek}
                onChange={(e) => onChange({ namaKepsek: e.target.value })}
                placeholder="Dr. H. Bambang Hartono, M.Pd."
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">NIP (Opsional)</label>
                <input
                  type="text"
                  value={settings.nipKepsek || ''}
                  onChange={(e) => onChange({ nipKepsek: e.target.value })}
                  placeholder="19750812 199903 1 004"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Label Jabatan</label>
                <input
                  type="text"
                  value={settings.jabatanKepsek}
                  onChange={(e) => onChange({ jabatanKepsek: e.target.value })}
                  placeholder="Kepala Sekolah"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Upload TTD Kepsek */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Scan Tanda Tangan (PNG Transparan disarankan)
              </label>
              <div className="flex items-center gap-3">
                <div className="w-24 h-12 rounded border border-slate-300 bg-white flex items-center justify-center overflow-hidden">
                  {settings.ttdKepsek ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={settings.ttdKepsek} alt="TTD Kepsek" className="max-h-10 max-w-20 object-contain" />
                  ) : (
                    <span className="text-[9px] text-slate-400">Belum ada</span>
                  )}
                </div>
                <input
                  type="file"
                  ref={ttdKepsekInputRef}
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={(e) => handleFileUpload(e, 'ttdKepsek')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => ttdKepsekInputRef.current?.click()}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md cursor-pointer flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  Upload TTD
                </button>
                {settings.ttdKepsek && (
                  <button
                    type="button"
                    onClick={() => onChange({ ttdKepsek: undefined })}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                    title="Hapus TTD"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Slider Ukuran Tanda Tangan */}
              {settings.ttdKepsek && (
                <div className="mt-2.5 p-2 bg-slate-100/70 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-[10.5px] font-semibold text-slate-700">
                    <span>Ukuran Tanda Tangan:</span>
                    <span className="font-mono text-indigo-700 font-bold">{settings.ttdScale ?? 100}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="150"
                    step="5"
                    value={settings.ttdScale ?? 100}
                    onChange={(e) => onChange({ ttdScale: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Kecil (60%)</span>
                    <button
                      type="button"
                      onClick={() => onChange({ ttdScale: 100 })}
                      className="font-bold text-indigo-700 underline cursor-pointer"
                    >
                      Normal (100%)
                    </button>
                    <span>Besar (150%)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Stempel Sekolah */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Stempel Resmi Sekolah (Ditempatkan di atas TTD Kepsek)
                </label>
                <span className="text-[9.5px] text-indigo-700 bg-indigo-50 font-medium px-1.5 py-0.5 rounded">
                  PNG Transparan
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full border border-slate-300 bg-white flex items-center justify-center overflow-hidden p-1 shadow-xs">
                  {settings.stempel ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={settings.stempel} alt="Stempel Sekolah" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-[8px] text-slate-400 text-center">Belum ada</span>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    ref={stempelInputRef}
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={(e) => handleFileUpload(e, 'stempel')}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => stempelInputRef.current?.click()}
                      className="px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md cursor-pointer flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      Upload Stempel
                    </button>
                    {settings.stempel && (
                      <button
                        type="button"
                        onClick={() => onChange({ stempel: undefined })}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                        title="Hapus Stempel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Pengaturan Lapisan & Posisi Stempel */}
                  {settings.stempel && (
                    <div className="mt-2.5 p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-2.5 shadow-xs">
                      {/* Pilihan: Stempel di Atas atau di Bawah TTD */}
                      <div>
                        <span className="block text-[10.5px] font-bold text-slate-700 mb-1">
                          Urutan Lapisan Stempel & TTD:
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => onChange({ stempelLayerOrder: 'above' })}
                            className={`px-2 py-1.5 text-[10px] font-semibold rounded-md border text-center cursor-pointer transition-colors ${
                              (settings.stempelLayerOrder ?? 'above') === 'above'
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500/20'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            Stempel di Atas TTD (Menimpa)
                          </button>
                          <button
                            type="button"
                            onClick={() => onChange({ stempelLayerOrder: 'below' })}
                            className={`px-2 py-1.5 text-[10px] font-semibold rounded-md border text-center cursor-pointer transition-colors ${
                              settings.stempelLayerOrder === 'below'
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500/20'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            Stempel di Bawah TTD
                          </button>
                        </div>
                      </div>

                      {/* Slider Ukuran Diameter Stempel */}
                      <div className="pt-1.5 border-t border-slate-100 space-y-1">
                        <div className="flex justify-between text-[10.5px] font-semibold text-slate-700">
                          <span>Ukuran Diameter Stempel:</span>
                          <span className="font-mono text-indigo-700 font-bold">
                            {settings.stempelScale ?? 100}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="60"
                          max="160"
                          step="5"
                          value={settings.stempelScale ?? 100}
                          onChange={(e) => onChange({ stempelScale: Number(e.target.value) })}
                          className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                        />
                        <div className="flex justify-between text-[9px] text-slate-500">
                          <span>Kecil (60%)</span>
                          <button
                            type="button"
                            onClick={() => onChange({ stempelScale: 100 })}
                            className="font-bold text-indigo-700 underline cursor-pointer"
                          >
                            Normal (100%)
                          </button>
                          <span>Besar (160%)</span>
                        </div>
                      </div>

                      {/* Slider Geser Posisi Horizontal */}
                      <div className="pt-1.5 border-t border-slate-100 space-y-1">
                        <div className="flex justify-between text-[10.5px] font-semibold text-slate-700">
                          <span>Geser Horizontal (Kiri/Kanan):</span>
                          <span className="font-mono text-indigo-700 font-bold">
                            {settings.stempelPositionX ?? 92}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="125"
                          step="2"
                          value={settings.stempelPositionX ?? 92}
                          onChange={(e) => onChange({ stempelPositionX: Number(e.target.value) })}
                          className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                        />
                        <div className="flex justify-between text-[9px] text-slate-500">
                          <button
                            type="button"
                            onClick={() => onChange({ stempelPositionX: 65 })}
                            className="hover:text-indigo-600 underline cursor-pointer"
                          >
                            Tengah
                          </button>
                          <button
                            type="button"
                            onClick={() => onChange({ stempelPositionX: 92 })}
                            className="font-bold text-indigo-700 underline cursor-pointer"
                          >
                            Standar Kiri (92%)
                          </button>
                          <button
                            type="button"
                            onClick={() => onChange({ stempelPositionX: 110 })}
                            className="hover:text-indigo-600 underline cursor-pointer"
                          >
                            Lebih Kiri (110%)
                          </button>
                        </div>
                      </div>

                      {/* Slider Geser Posisi Vertikal (Naik/Turun) */}
                      <div className="pt-1.5 border-t border-slate-100 space-y-1">
                        <div className="flex justify-between text-[10.5px] font-semibold text-slate-700">
                          <span>Geser Vertikal (Naik/Turun):</span>
                          <span className="font-mono text-indigo-700 font-bold">
                            {settings.stempelPositionY ?? 50}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="70"
                          step="2"
                          value={settings.stempelPositionY ?? 50}
                          onChange={(e) => onChange({ stempelPositionY: Number(e.target.value) })}
                          className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-400 mt-1">
                    Stempel otomatis diposisikan menumpuk secara natural di sisi kiri tanda tangan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ketua Panitia (Opsional) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                2. Ketua Panitia Ujian
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableTtdPanitia}
                  onChange={(e) => onChange({ enableTtdPanitia: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-2 text-xs font-semibold text-slate-600">
                  {settings.enableTtdPanitia ? 'Aktif' : 'Nonaktif'}
                </span>
              </label>
            </div>

            {settings.enableTtdPanitia ? (
              <>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={settings.namaPanitia || ''}
                    onChange={(e) => onChange({ namaPanitia: e.target.value })}
                    placeholder="Siti Rahmawati, S.Pd."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">NIP (Opsional)</label>
                    <input
                      type="text"
                      value={settings.nipPanitia || ''}
                      onChange={(e) => onChange({ nipPanitia: e.target.value })}
                      placeholder="19830415 200801 2 007"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Label Jabatan</label>
                    <input
                      type="text"
                      value={settings.jabatanPanitia || 'Ketua Panitia Ujian'}
                      onChange={(e) => onChange({ jabatanPanitia: e.target.value })}
                      placeholder="Ketua Panitia Ujian"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Scan Tanda Tangan (Opsional)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-12 rounded border border-slate-300 bg-white flex items-center justify-center overflow-hidden">
                      {settings.ttdPanitia ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={settings.ttdPanitia} alt="TTD Panitia" className="max-h-10 max-w-20 object-contain" />
                      ) : (
                        <span className="text-[9px] text-slate-400">Belum ada</span>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={ttdPanitiaInputRef}
                      accept="image/png,image/jpeg,image/svg+xml"
                      onChange={(e) => handleFileUpload(e, 'ttdPanitia')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => ttdPanitiaInputRef.current?.click()}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md cursor-pointer flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      Upload TTD
                    </button>
                    {settings.ttdPanitia && (
                      <button
                        type="button"
                        onClick={() => onChange({ ttdPanitia: undefined })}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                        title="Hapus TTD Panitia"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Slider Ukuran TTD Panitia */}
                  {settings.ttdPanitia && (
                    <div className="mt-2.5 p-2 bg-slate-100/70 rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between text-[10.5px] font-semibold text-slate-700">
                        <span>Ukuran Tanda Tangan Panitia:</span>
                        <span className="font-mono text-indigo-700 font-bold">
                          {settings.ttdPanitiaScale ?? 100}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="150"
                        step="5"
                        value={settings.ttdPanitiaScale ?? 100}
                        onChange={(e) => onChange({ ttdPanitiaScale: Number(e.target.value) })}
                        className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>Kecil (60%)</span>
                        <button
                          type="button"
                          onClick={() => onChange({ ttdPanitiaScale: 100 })}
                          className="font-bold text-indigo-700 underline cursor-pointer"
                        >
                          Normal (100%)
                        </button>
                        <span>Besar (150%)</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                Tanda tangan panitia dinonaktifkan. Hanya tanda tangan Kepala Sekolah yang akan ditampilkan di kartu.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action navigation */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all hover:gap-3"
        >
          Lanjut ke Upload Data Peserta
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
