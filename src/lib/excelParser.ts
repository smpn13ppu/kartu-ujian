import * as XLSX from 'xlsx';
import { Student, ValidationSummary } from '../types';

export interface ParseExcelResult {
  students: Student[];
  validation: ValidationSummary;
}

export async function parseExcelFile(file: File): Promise<ParseExcelResult> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });

  // Read first sheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to JSON
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

  if (!rawRows || rawRows.length === 0) {
    throw new Error('File Excel kosong atau tidak memiliki data.');
  }

  const students: Student[] = [];
  const nisnSet = new Set<string>();
  const duplicateNisn: string[] = [];
  let missingRequiredFields = 0;
  const warnings: string[] = [];

  // Helper to normalize column names
  const findKey = (row: Record<string, any>, candidates: string[]): string => {
    const keys = Object.keys(row);
    for (const key of keys) {
      const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      for (const candidate of candidates) {
        if (cleanKey === candidate.replace(/[^a-z0-9]/g, '')) {
          return String(row[key] || '').trim();
        }
      }
    }
    return '';
  };

  rawRows.forEach((row, index) => {
    // Check if entire row is empty
    const values = Object.values(row).map((v) => String(v).trim());
    if (values.every((v) => v === '')) {
      return; // Skip empty row
    }

    const nama = findKey(row, ['nama peserta', 'nama siswa', 'nama', 'namalengkap', 'name']);
    const rawNisn = findKey(row, ['nisn', 'nomor induk siswa nasional', 'nis', 'noinduk', 'id']);
    const kelas = findKey(row, ['kelas', 'rombel', 'tingkat', 'class']);
    const ruangan = findKey(row, ['ruangan', 'ruang', 'ruangujian', 'room', 'lab']);
    const nomorPeserta = findKey(row, ['nomor peserta', 'nopeserta', 'no ujian', 'nomorujian']);

    // Ensure NISN is clean string without floating decimal (like 12345.0)
    let nisn = rawNisn;
    if (nisn.endsWith('.0')) {
      nisn = nisn.slice(0, -2);
    }

    // Required fields check: Nama and NISN are mandatory
    if (!nama || !nisn) {
      missingRequiredFields++;
      warnings.push(`Baris ${index + 2}: Nama atau NISN kosong.`);
      return;
    }

    // Duplicate NISN check
    if (nisnSet.has(nisn)) {
      if (!duplicateNisn.includes(nisn)) {
        duplicateNisn.push(nisn);
      }
      warnings.push(`Baris ${index + 2}: NISN ${nisn} (${nama}) duplikat.`);
    } else {
      nisnSet.add(nisn);
    }

    students.push({
      id: `std-${index + 1}-${nisn}`,
      nisn,
      nama,
      kelas: kelas || '-',
      ruangan: ruangan || '-',
      nomorPeserta: nomorPeserta || nisn,
      hasFoto: false,
    });
  });

  if (students.length === 0) {
    throw new Error('Tidak ada data siswa valid ditemukan dalam file Excel.');
  }

  const validation: ValidationSummary = {
    totalRows: rawRows.length,
    validStudents: students.length,
    duplicateNisn,
    missingRequiredFields,
    withPhotosCount: 0,
    withoutPhotosCount: students.length,
    warnings,
  };

  return { students, validation };
}

/**
 * Creates and downloads a sample Excel template for the user to try
 */
export function generateSampleExcelTemplate(): void {
  const sampleData = [
    {
      'Nama Peserta': 'ACHMAD FADILLAH',
      'NISN': '0061234501',
      'Kelas': 'XII MIPA 1',
      'Ruangan': 'Ruang 01',
      'Nomor Peserta': '26-01-001',
    },
    {
      'Nama Peserta': 'BEATRIX CITRA LESTARI',
      'NISN': '0061234502',
      'Kelas': 'XII MIPA 1',
      'Ruangan': 'Ruang 01',
      'Nomor Peserta': '26-01-002',
    },
    {
      'Nama Peserta': 'CANDRA GUNAWAN',
      'NISN': '0061234503',
      'Kelas': 'XII MIPA 1',
      'Ruangan': 'Ruang 01',
      'Nomor Peserta': '26-01-003',
    },
    {
      'Nama Peserta': 'DWI ANGGRAENI PUTRI',
      'NISN': '0061234504',
      'Kelas': 'XII MIPA 1',
      'Ruangan': 'Ruang 02',
      'Nomor Peserta': '26-01-004',
    },
    {
      'Nama Peserta': 'EKO PRASETYO',
      'NISN': '0061234505',
      'Kelas': 'XII MIPA 2',
      'Ruangan': 'Ruang 02',
      'Nomor Peserta': '26-01-005',
    },
    {
      'Nama Peserta': 'FARAH SALSABILA',
      'NISN': '0061234506',
      'Kelas': 'XII MIPA 2',
      'Ruangan': 'Ruang 02',
      'Nomor Peserta': '26-01-006',
    },
    {
      'Nama Peserta': 'GILANG RAMADHAN',
      'NISN': '0061234507',
      'Kelas': 'XII IPS 1',
      'Ruangan': 'Ruang 03',
      'Nomor Peserta': '26-01-007',
    },
    {
      'Nama Peserta': 'HANIFA NUR AZIZAH',
      'NISN': '0061234508',
      'Kelas': 'XII IPS 1',
      'Ruangan': 'Ruang 03',
      'Nomor Peserta': '26-01-008',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Peserta');

  // Convert to ArrayBuffer & Blob for guaranteed browser download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Template_Peserta_Ujian.xlsx');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}
