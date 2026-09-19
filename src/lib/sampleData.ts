import { SchoolSettings, Student } from '../types';

// Crisp SVG Logo 1 (Pendidikan / Tut Wuri Handayani stylized)
export const DEFAULT_LOGO_KIRI = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="46" fill="#1e40af" stroke="#f59e0b" stroke-width="4"/>
  <circle cx="50" cy="50" r="38" fill="#ffffff"/>
  <!-- Book and torch symbol -->
  <path d="M50 22 L55 35 L68 35 L58 43 L62 56 L50 48 L38 56 L42 43 L32 35 L45 35 Z" fill="#f59e0b"/>
  <path d="M30 68 Q50 60 70 68 L70 73 Q50 65 30 73 Z" fill="#1e40af"/>
  <path d="M32 75 Q50 67 68 75 L68 78 Q50 70 32 78 Z" fill="#1e40af"/>
  <text x="50" y="86" font-family="sans-serif" font-size="8" font-weight="bold" text-anchor="middle" fill="#1e40af">TUT WURI</text>
</svg>
`)}`;

// Crisp SVG Logo 2 (School Emblem)
export const DEFAULT_LOGO_KANAN = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <polygon points="50,5 92,26 92,74 50,95 8,74 8,26" fill="#047857" stroke="#fbbf24" stroke-width="3"/>
  <polygon points="50,12 85,29 85,71 50,88 15,71 15,29" fill="#ffffff"/>
  <circle cx="50" cy="48" r="22" fill="#047857"/>
  <path d="M42 40 L50 32 L58 40 L58 54 L50 62 L42 54 Z" fill="#fbbf24"/>
  <circle cx="50" cy="46" r="4" fill="#ffffff"/>
  <text x="50" y="78" font-family="sans-serif" font-size="7" font-weight="bold" text-anchor="middle" fill="#047857">SMAN 1</text>
</svg>
`)}`;

// Crisp SVG Signature Kepsek
export const DEFAULT_TTD_KEPSEK = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80">
  <path d="M20,55 Q40,15 55,45 T85,30 Q110,60 130,25 T160,50 Q175,35 185,55" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
  <path d="M35,60 Q70,55 170,58" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="120" cy="35" r="3" fill="#0f172a"/>
</svg>
`)}`;

// Crisp SVG Signature Panitia
export const DEFAULT_TTD_PANITIA = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80">
  <path d="M30,50 Q60,20 75,55 T115,25 Q135,65 155,35 T175,50" fill="none" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round"/>
  <path d="M45,58 L165,58" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>
</svg>
`)}`;

// Realistic Indonesian School Official Circular Stamp (Purple/Violet Ink)
export const DEFAULT_STEMPEL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <!-- Outer double ring -->
  <circle cx="80" cy="80" r="74" fill="none" stroke="#4338ca" stroke-width="3.5" opacity="0.85"/>
  <circle cx="80" cy="80" r="67" fill="none" stroke="#4338ca" stroke-width="1.8" opacity="0.85"/>
  <circle cx="80" cy="80" r="46" fill="none" stroke="#4338ca" stroke-width="1.8" opacity="0.85"/>
  
  <!-- Curved text top & bottom using textPath or rot texts -->
  <path id="curveTop" d="M 22,80 A 58,58 0 0,1 138,80" fill="none"/>
  <path id="curveBottom" d="M 138,80 A 58,58 0 0,1 22,80" fill="none"/>
  
  <text fill="#4338ca" font-family="sans-serif" font-size="10" font-weight="900" letter-spacing="1.5" opacity="0.88">
    <textPath href="#curveTop" startOffset="50%" text-anchor="middle">
      DINAS PENDIDIKAN
    </textPath>
  </text>
  
  <text fill="#4338ca" font-family="sans-serif" font-size="9" font-weight="900" letter-spacing="1.2" opacity="0.88">
    <textPath href="#curveBottom" startOffset="50%" text-anchor="middle">
      SMPN 13 PPU
    </textPath>
  </text>

  <!-- Stars on sides -->
  <polygon points="18,80 20,83 23,83 21,85 22,88 19,86 16,88 17,85 15,83 18,83" fill="#4338ca" opacity="0.85"/>
  <polygon points="142,80 144,83 147,83 145,85 146,88 143,86 140,88 141,85 139,83 142,83" fill="#4338ca" opacity="0.85"/>

  <!-- Center emblem & text -->
  <line x1="38" y1="67" x2="122" y2="67" stroke="#4338ca" stroke-width="1.5" opacity="0.85"/>
  <line x1="38" y1="93" x2="122" y2="93" stroke="#4338ca" stroke-width="1.5" opacity="0.85"/>
  <text x="80" y="83" font-family="sans-serif" font-size="11" font-weight="900" fill="#4338ca" text-anchor="middle" letter-spacing="1" opacity="0.9">
    RESMI
  </text>
</svg>
`)}`;

export const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  namaSekolah: 'SMP NEGERI 13 PENAJAM PASER UTARA',
  subHeader: 'KARTU PESERTA PENILAIAN AKHIR SEMESTER (PAS) GANJIL\nTAHUN AJARAN 2026/2027',
  alamatSekolah: 'Jl. Penajam Paser Utara, Kalimantan Timur | NPSN: 30402061',
  logoKiri: DEFAULT_LOGO_KIRI,
  logoKanan: DEFAULT_LOGO_KANAN,
  namaKepsek: 'Dr. H. Bambang Hartono, M.Pd.',
  nipKepsek: '19750812 199903 1 004',
  jabatanKepsek: 'Kepala Sekolah',
  ttdKepsek: DEFAULT_TTD_KEPSEK,
  stempel: DEFAULT_STEMPEL,
  stempelScale: 100,
  stempelPositionX: 92,
  stempelPositionY: 50,
  stempelLayerOrder: 'above',
  ttdScale: 100,
  enableTtdPanitia: true,
  namaPanitia: 'Siti Rahmawati, S.Pd.',
  nipPanitia: '19830415 200801 2 007',
  jabatanPanitia: 'Ketua Panitia Ujian',
  ttdPanitia: DEFAULT_TTD_PANITIA,
  ttdPanitiaScale: 100,
  tanggalKartu: 'Penajam, 19 September 2026',
};

// Generates an inline SVG dataUrl avatar for dummy students
function generateAvatarSvg(name: string, bg: string): string {
  const initial = name.split(' ').map((n) => n[0]).slice(0, 2).join('');
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 160" width="120" height="160">
    <rect width="120" height="160" fill="${bg}"/>
    <circle cx="60" cy="55" r="28" fill="#ffffff" opacity="0.9"/>
    <path d="M15 145 C20 95 100 95 105 145 Z" fill="#ffffff" opacity="0.9"/>
    <text x="60" y="64" font-family="sans-serif" font-size="20" font-weight="bold" fill="${bg}" text-anchor="middle">${initial}</text>
  </svg>
  `)}`;
}

export const SAMPLE_STUDENTS: Student[] = [
  {
    id: 's-1',
    nisn: '0061234501',
    nama: 'ACHMAD FADILLAH',
    kelas: 'XII MIPA 1',
    ruangan: 'Ruang 01',
    nomorPeserta: '26-01-001',
    hasFoto: true,
    fotoUrl: generateAvatarSvg('Achmad Fadillah', '#1d4ed8'),
  },
  {
    id: 's-2',
    nisn: '0061234502',
    nama: 'BEATRIX CITRA LESTARI',
    kelas: 'XII MIPA 1',
    ruangan: 'Ruang 01',
    nomorPeserta: '26-01-002',
    hasFoto: true,
    fotoUrl: generateAvatarSvg('Beatrix Citra', '#be185d'),
  },
  {
    id: 's-3',
    nisn: '0061234503',
    nama: 'CANDRA GUNAWAN',
    kelas: 'XII MIPA 1',
    ruangan: 'Ruang 01',
    nomorPeserta: '26-01-003',
    hasFoto: true,
    fotoUrl: generateAvatarSvg('Candra Gunawan', '#047857'),
  },
  {
    id: 's-4',
    nisn: '0061234504',
    nama: 'DWI ANGGRAENI PUTRI',
    kelas: 'XII MIPA 1',
    ruangan: 'Ruang 02',
    nomorPeserta: '26-01-004',
    hasFoto: true,
    fotoUrl: generateAvatarSvg('Dwi Anggraeni', '#6d28d9'),
  },
  {
    id: 's-5',
    nisn: '0061234505',
    nama: 'EKO PRASETYO WIBOWO',
    kelas: 'XII MIPA 2',
    ruangan: 'Ruang 02',
    nomorPeserta: '26-01-005',
    hasFoto: true,
    fotoUrl: generateAvatarSvg('Eko Prasetyo', '#b45309'),
  },
  {
    id: 's-6',
    nisn: '0061234506',
    nama: 'FARAH SALSABILA',
    kelas: 'XII MIPA 2',
    ruangan: 'Ruang 02',
    nomorPeserta: '26-01-006',
    hasFoto: true,
    fotoUrl: generateAvatarSvg('Farah Salsabila', '#0e7490'),
  },
  {
    id: 's-7',
    nisn: '0061234507',
    nama: 'GILANG RAMADHAN',
    kelas: 'XII IPS 1',
    ruangan: 'Ruang 03',
    nomorPeserta: '26-01-007',
    hasFoto: true,
    fotoUrl: generateAvatarSvg('Gilang Ramadhan', '#4338ca'),
  },
  {
    id: 's-8',
    nisn: '0061234508',
    nama: 'HANIFA NUR AZIZAH',
    kelas: 'XII IPS 1',
    ruangan: 'Ruang 03',
    nomorPeserta: '26-01-008',
    hasFoto: true,
    fotoUrl: generateAvatarSvg('Hanifa Nur', '#e11d48'),
  },
  {
    id: 's-9',
    nisn: '0061234509',
    nama: 'ILHAM MAULANA IBRAHIM',
    kelas: 'XII IPS 1',
    ruangan: 'Ruang 03',
    nomorPeserta: '26-01-009',
    hasFoto: false, // Intentionally no photo to demonstrate placeholder fallback
  },
  {
    id: 's-10',
    nisn: '0061234510',
    nama: 'JESSICA AMANDA TANDI',
    kelas: 'XII IPS 2',
    ruangan: 'Ruang 04',
    nomorPeserta: '26-01-010',
    hasFoto: true,
    fotoUrl: generateAvatarSvg('Jessica Amanda', '#059669'),
  },
  {
    id: 's-11',
    nisn: '0061234511',
    nama: 'KHAIRUL ANWAR',
    kelas: 'XII IPS 2',
    ruangan: 'Ruang 04',
    nomorPeserta: '26-01-011',
    hasFoto: true,
    fotoUrl: generateAvatarSvg('Khairul Anwar', '#374151'),
  },
  {
    id: 's-12',
    nisn: '0061234512',
    nama: 'LUTFIANA DEWI',
    kelas: 'XII IPS 2',
    ruangan: 'Ruang 04',
    nomorPeserta: '26-01-012',
    hasFoto: true,
    fotoUrl: generateAvatarSvg('Lutfiana Dewi', '#9333ea'),
  },
];
