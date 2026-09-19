const fs = require('fs');
const zlib = require('zlib');
const JSZip = require('jszip');

// Function to generate a simple solid-color PNG buffer
function createSolidPng(width, height, r, g, b) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bit per channel
  ihdrData.writeUInt8(2, 9); // Color type 2 (RGB)
  ihdrData.writeUInt8(0, 10); // Compression
  ihdrData.writeUInt8(0, 11); // Filter
  ihdrData.writeUInt8(0, 12); // Interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data with filter byte (0) before each row
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressedData);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

// Standard CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

async function run() {
  const zip = new JSZip();

  // 8 students matching the sample Excel template
  const students = [
    { nisn: '0061234501', r: 37, g: 99, b: 235 },   // Blue
    { nisn: '0061234502', r: 219, g: 39, b: 119 }, // Pink
    { nisn: '0061234503', r: 5, g: 150, b: 105 },   // Emerald
    { nisn: '0061234504', r: 124, g: 58, b: 237 },  // Purple
    { nisn: '0061234505', r: 217, g: 119, b: 6 },   // Amber
    { nisn: '0061234506', r: 8, g: 145, b: 178 },   // Cyan
    { nisn: '0061234507', r: 79, g: 70, b: 229 },   // Indigo
    { nisn: '0061234508', r: 225, g: 29, b: 72 },   // Rose
  ];

  for (const s of students) {
    const pngBuf = createSolidPng(150, 200, s.r, s.g, s.b);
    zip.file(`${s.nisn}.png`, pngBuf);
  }

  const zipContent = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

  // Save in root workspace
  fs.writeFileSync('Contoh_Foto_Siswa.zip', zipContent);

  // Save in public/ folder for direct HTTP download
  if (!fs.existsSync('public')) fs.mkdirSync('public');
  fs.writeFileSync('public/Contoh_Foto_Siswa.zip', zipContent);

  console.log('Contoh_Foto_Siswa.zip created successfully in root and public/!');
}

run();
