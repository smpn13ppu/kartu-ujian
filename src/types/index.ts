export interface Student {
  id: string;
  nisn: string;
  nama: string;
  kelas: string;
  ruangan: string;
  nomorPeserta?: string;
  fotoUrl?: string; // Data URL or object URL
  hasFoto: boolean;
}

export interface SchoolSettings {
  namaSekolah: string;
  subHeader: string; // e.g. "PENILAIAN AKHIR SEMESTER (PAS) TAHUN AJARAN 2026/2027"
  alamatSekolah?: string;
  logoKiri?: string; // Data URL
  logoKanan?: string; // Data URL
  namaKepsek: string;
  nipKepsek?: string;
  jabatanKepsek: string;
  ttdKepsek?: string; // Data URL
  stempel?: string; // Data URL of school stamp
  stempelScale?: number; // Size percentage (default 100%)
  stempelPositionX?: number; // Percentage offset (default ~92)
  stempelPositionY?: number; // Percentage offset (default ~50)
  stempelLayerOrder?: 'above' | 'below'; // 'above' (menimpa TTD) or 'below' (di belakang TTD)
  ttdScale?: number; // Size percentage of signature (default 100%)
  enableTtdPanitia: boolean;
  namaPanitia?: string;
  nipPanitia?: string;
  jabatanPanitia?: string;
  ttdPanitia?: string; // Data URL
  ttdPanitiaScale?: number; // Size percentage of panitia signature (default 100%)
  tanggalKartu?: string; // e.g. "Cendekia, 19 September 2026" or "19 September 2026"
}

export type PaperSize = 'A4' | 'F4';
export type CardsPerPage = 6 | 8;
export type ColorTheme = 'blue' | 'green' | 'red' | 'dark';

export interface LayoutSettings {
  paperSize: PaperSize;
  cardsPerPage: CardsPerPage;
  showCuttingGuide: boolean;
  colorTheme: ColorTheme;
  enablePhoto: boolean; // true = with photo slot/frame, false = full width layout without photo
}

export interface ValidationSummary {
  totalRows: number;
  validStudents: number;
  duplicateNisn: string[];
  missingRequiredFields: number;
  withPhotosCount: number;
  withoutPhotosCount: number;
  warnings: string[];
}
