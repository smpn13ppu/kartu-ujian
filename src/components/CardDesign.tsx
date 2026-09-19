'use strict';

import React from 'react';
import { Student, SchoolSettings, LayoutSettings } from '../types';

interface CardDesignProps {
  student: Student;
  settings: SchoolSettings;
  layout: LayoutSettings;
}

export const CardDesign: React.FC<CardDesignProps> = ({ student, settings, layout }) => {
  const { colorTheme, cardsPerPage } = layout;

  // Theme colors
  const themeStyles = {
    blue: {
      border: 'border-blue-700',
      headerBg: 'bg-blue-800 text-white',
      accentText: 'text-blue-900',
      divider: 'border-blue-700',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    green: {
      border: 'border-emerald-700',
      headerBg: 'bg-emerald-800 text-white',
      accentText: 'text-emerald-900',
      divider: 'border-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    red: {
      border: 'border-rose-700',
      headerBg: 'bg-rose-800 text-white',
      accentText: 'text-rose-900',
      divider: 'border-rose-700',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    dark: {
      border: 'border-slate-800',
      headerBg: 'bg-slate-900 text-white',
      accentText: 'text-slate-900',
      divider: 'border-slate-800',
      badge: 'bg-slate-100 text-slate-800 border-slate-300',
    },
  }[colorTheme || 'blue'];

  // Card size tuning: 8 cards (2x4) vs 6 cards (2x3)
  const isCompact = cardsPerPage === 8;

  const showPhoto = layout.enablePhoto !== false;

  return (
    <div
      className={`relative w-full h-full bg-white border ${themeStyles.border} rounded-md overflow-hidden flex flex-col justify-between shadow-xs print:shadow-none box-border select-none`}
      style={{
        // Ensure exact print reproduction
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
      }}
    >
      {/* 1. Header (Kop Kartu Ujian) */}
      <div className="px-2 py-1.5 border-b border-slate-200 flex items-center justify-between gap-1.5 bg-slate-50/70">
        {/* Logo Kiri */}
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
          {settings.logoKiri ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logoKiri}
              alt="Logo Kiri"
              className="max-h-9 max-w-9 object-contain"
            />
          ) : (
            <div className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[8px] text-slate-400">
              Logo 1
            </div>
          )}
        </div>

        {/* Teks Identitas Sekolah */}
        <div className="flex-1 text-center min-w-0 px-1">
          <h2 className="text-[11px] sm:text-[12px] font-black tracking-wide uppercase text-slate-900 leading-tight truncate">
            {settings.namaSekolah || 'NAMA SEKOLAH'}
          </h2>
          <p className="text-[8.5px] font-bold text-slate-700 leading-tight uppercase line-clamp-2">
            {settings.subHeader || 'KARTU PESERTA UJIAN'}
          </p>
          {settings.alamatSekolah && (
            <p className="text-[6.5px] text-slate-500 leading-tight truncate mt-0.5">
              {settings.alamatSekolah}
            </p>
          )}
        </div>

        {/* Logo Kanan */}
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
          {settings.logoKanan ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logoKanan}
              alt="Logo Kanan"
              className="max-h-9 max-w-9 object-contain"
            />
          ) : (
            <div className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[8px] text-slate-400">
              Logo 2
            </div>
          )}
        </div>
      </div>

      {/* Decorative Accent Bar */}
      <div className={`h-[2.5px] w-full ${themeStyles.headerBg}`} />

      {/* 2. Body: Kondisional Dengan Foto ATAU Layout Khusus Tanpa Foto */}
      {showPhoto ? (
        /* Layout DENGAN Foto (Bingkai foto tetap ada meskipun siswa belum punya foto) */
        <div className={`flex-1 px-2.5 ${isCompact ? 'py-1' : 'py-2'} flex items-center gap-2.5`}>
          {/* Pas Foto Siswa (3:4 ratio) */}
          <div className="flex flex-col items-center justify-center flex-shrink-0">
            <div
              className={`relative rounded border border-slate-300 bg-slate-100 overflow-hidden flex items-center justify-center ${
                isCompact ? 'w-[68px] h-[90px]' : 'w-[78px] h-[104px]'
              }`}
            >
              {student.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={student.fotoUrl}
                  alt={student.nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-1">
                  <svg
                    className={`${isCompact ? 'w-7 h-7' : 'w-8 h-8'} text-slate-300`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span className="text-[6.5px] uppercase font-semibold text-slate-400 mt-1">
                    Pas Foto
                  </span>
                  <span className="text-[6px] text-slate-400">3 x 4</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabel Informasi Data Siswa */}
          <div className="flex-1 min-w-0 text-[9px] leading-snug">
            <table className="w-full text-left border-collapse">
              <tbody>
                {student.nomorPeserta && (
                  <tr className="border-b border-slate-100">
                    <td className="py-0.5 text-slate-500 font-medium w-[70px]">No. Peserta</td>
                    <td className="py-0.5 text-slate-400 w-2">:</td>
                    <td className="py-0.5 font-mono font-bold text-slate-800 truncate">
                      {student.nomorPeserta}
                    </td>
                  </tr>
                )}
                <tr className="border-b border-slate-100">
                  <td className="py-0.5 text-slate-500 font-medium w-[70px]">NISN</td>
                  <td className="py-0.5 text-slate-400 w-2">:</td>
                  <td className="py-0.5 font-mono font-bold text-slate-800 truncate">
                    {student.nisn}
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-0.5 text-slate-500 font-medium align-top">Nama</td>
                  <td className="py-0.5 text-slate-400 align-top">:</td>
                  <td className="py-0.5 font-bold text-slate-900 leading-tight uppercase">
                    {student.nama}
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-0.5 text-slate-500 font-medium">Kelas</td>
                  <td className="py-0.5 text-slate-400">:</td>
                  <td className="py-0.5 font-semibold text-slate-800 truncate">
                    {student.kelas}
                  </td>
                </tr>
                <tr>
                  <td className="py-0.5 text-slate-500 font-medium">Ruang Ujian</td>
                  <td className="py-0.5 text-slate-400">:</td>
                  <td className="py-0.5 font-semibold text-slate-800">
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[8px] font-bold ${themeStyles.badge}`}>
                      {student.ruangan}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Layout KHUSUS TANPA FOTO (Bingkai foto dihilangkan sepenuhnya, data siswa melebar penuh) */
        <div className={`flex-1 px-4 ${isCompact ? 'py-1.5' : 'py-2.5'} flex flex-col justify-center`}>
          <table className="w-full text-left border-collapse text-[9.5px]">
            <tbody>
              {student.nomorPeserta && (
                <tr className="border-b border-slate-100">
                  <td className="py-0.5 text-slate-500 font-medium w-[85px]">No. Peserta</td>
                  <td className="py-0.5 text-slate-400 w-2.5">:</td>
                  <td className="py-0.5 font-mono font-bold text-slate-800 truncate">
                    {student.nomorPeserta}
                  </td>
                </tr>
              )}
              <tr className="border-b border-slate-100">
                <td className="py-0.5 text-slate-500 font-medium w-[85px]">NISN</td>
                <td className="py-0.5 text-slate-400 w-2.5">:</td>
                <td className="py-0.5 font-mono font-bold text-slate-800 truncate">
                  {student.nisn}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-0.5 text-slate-500 font-medium align-top">Nama Peserta</td>
                <td className="py-0.5 text-slate-400 align-top">:</td>
                <td className="py-0.5 font-bold text-slate-900 leading-tight uppercase text-[10px]">
                  {student.nama}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-0.5 text-slate-500 font-medium">Kelas</td>
                <td className="py-0.5 text-slate-400">:</td>
                <td className="py-0.5 font-semibold text-slate-800 truncate">
                  {student.kelas}
                </td>
              </tr>
              <tr>
                <td className="py-0.5 text-slate-500 font-medium">Ruang Ujian</td>
                <td className="py-0.5 text-slate-400">:</td>
                <td className="py-0.5 font-semibold text-slate-800">
                  <span className={`inline-block px-2 py-0.5 rounded text-[8.5px] font-bold ${themeStyles.badge}`}>
                    {student.ruangan}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Footer (Tanda Tangan & Pengesahan) */}
      <div className={`px-3 ${isCompact ? 'py-1' : 'py-1.5'} border-t border-slate-200 bg-slate-50/50 flex items-end justify-between text-[7.5px]`}>
        {/* TTD Ketua Panitia (jika aktif) */}
        {settings.enableTtdPanitia ? (
          <div className="flex flex-col items-center text-center w-[45%]">
            {/* Tanggal di atas Ketua Panitia */}
            <span className="text-[7px] text-slate-600 font-medium leading-tight mb-0.5 truncate max-w-full">
              {settings.tanggalKartu || '19 September 2026'}
            </span>
            <span className="text-slate-600 font-medium leading-tight">
              {settings.jabatanPanitia || 'Ketua Panitia Ujian'},
            </span>
            <div className={`${isCompact ? 'h-6' : 'h-8'} flex items-center justify-center my-0.5`}>
              {settings.ttdPanitia ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.ttdPanitia}
                  alt="TTD Panitia"
                  style={{
                    transform: `scale(${(settings.ttdPanitiaScale ?? settings.ttdScale ?? 100) / 100})`,
                    transformOrigin: 'center center',
                  }}
                  className="max-h-full max-w-[100px] object-contain transition-transform duration-150"
                />
              ) : (
                <div className="w-16 border-b border-dashed border-slate-300 h-4" />
              )}
            </div>
            <span className="font-bold text-slate-900 underline truncate max-w-full">
              {settings.namaPanitia || 'Nama Panitia'}
            </span>
            {settings.nipPanitia && (
              <span className="text-[6.5px] text-slate-500 truncate max-w-full">
                NIP. {settings.nipPanitia}
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col text-left w-[45%]">
            <span className="text-[7px] text-slate-600 font-medium mb-1">
              {settings.tanggalKartu || '19 September 2026'}
            </span>
            <span className="text-[6.5px] text-slate-400 italic">
              *Harap dibawa selama ujian berlangsung
            </span>
          </div>
        )}

        {/* TTD Kepala Sekolah (Wajib) */}
        <div className="flex flex-col items-center text-center w-[48%] ml-auto">
          {/* "Mengetahui," di atas Kepala Sekolah */}
          <span className="text-[7px] text-slate-600 font-medium leading-tight mb-0.5">
            Mengetahui,
          </span>
          <span className="text-slate-600 font-medium leading-tight">
            {settings.jabatanKepsek || 'Kepala Sekolah'},
          </span>
          <div className={`relative ${isCompact ? 'h-6' : 'h-8'} w-full flex items-center justify-center my-0.5`}>
            {/* TTD Kepsek */}
            {settings.ttdKepsek ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.ttdKepsek}
                alt="TTD Kepsek"
                style={{
                  transform: `scale(${(settings.ttdScale ?? 100) / 100})`,
                  transformOrigin: 'center center',
                }}
                className={`max-h-full max-w-[100px] object-contain ${
                  settings.stempelLayerOrder === 'below' ? 'z-10' : 'z-0'
                } transition-transform duration-150`}
              />
            ) : (
              <div className="w-16 border-b border-dashed border-slate-300 h-4" />
            )}

            {/* Stempel Sekolah (Ditempatkan di sebelah kiri tumpang tindih dengan awal tanda tangan) */}
            {settings.stempel && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.stempel}
                alt="Stempel Sekolah"
                style={{
                  transform: `translate(-${settings.stempelPositionX ?? 92}%, -${settings.stempelPositionY ?? 50}%) scale(${(settings.stempelScale ?? 100) / 100}) rotate(-3deg)`,
                }}
                className={`absolute left-1/2 top-1/2 ${
                  isCompact ? 'max-h-[38px] max-w-[38px]' : 'max-h-[46px] max-w-[46px]'
                } object-contain pointer-events-none opacity-85 mix-blend-multiply ${
                  settings.stempelLayerOrder === 'below' ? 'z-0' : 'z-10'
                } transition-transform duration-150`}
              />
            )}
          </div>
          <span className="font-bold text-slate-900 underline truncate max-w-full">
            {settings.namaKepsek || 'Nama Kepala Sekolah'}
          </span>
          {settings.nipKepsek && (
            <span className="text-[6.5px] text-slate-500 truncate max-w-full">
              NIP. {settings.nipKepsek}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
