'use strict';

import React from 'react';
import { Student, SchoolSettings, LayoutSettings } from '../types';
import { CardDesign } from './CardDesign';

interface PrintSheetProps {
  students: Student[];
  settings: SchoolSettings;
  layout: LayoutSettings;
  pageNumber: number;
  totalPages: number;
}

export const PrintSheet: React.FC<PrintSheetProps> = ({
  students,
  settings,
  layout,
  pageNumber,
  totalPages,
}) => {
  const { paperSize, cardsPerPage, showCuttingGuide } = layout;

  // Aspect ratio & dimensions (scaled accurately to mm)
  // A4: 210 x 297 mm -> 296mm avoids subpixel browser round-up overflow
  // F4: 210 x 330 mm -> 328mm avoids subpixel browser round-up overflow
  const isA4 = paperSize === 'A4';
  const widthMm = 210;
  const heightMm = isA4 ? 296 : 328;

  // Slots calculation (fill remaining slots if students length < cardsPerPage)
  const totalSlots = cardsPerPage;
  const slots: (Student | null)[] = [...students];
  while (slots.length < totalSlots) {
    slots.push(null);
  }

  // Grid styling
  const gridRowsClass = cardsPerPage === 6 ? 'grid-rows-3' : 'grid-rows-4';

  return (
    <div
      className="paper-sheet mx-auto p-[5mm] bg-white relative transition-all box-border"
      style={{
        width: `${widthMm}mm`,
        height: `${heightMm}mm`,
        maxWidth: `${widthMm}mm`,
        maxHeight: `${heightMm}mm`,
        overflow: 'hidden',
      }}
    >
      {/* 2-column grid */}
      <div
        className={`w-full h-full grid grid-cols-2 ${gridRowsClass} gap-[3.5mm] relative box-border`}
      >
        {slots.map((student, idx) => (
          <div
            key={student ? student.id : `empty-slot-${idx}`}
            className={`relative p-[0.5mm] flex items-center justify-center box-border overflow-hidden ${
              showCuttingGuide
                ? 'border border-dashed border-slate-300'
                : 'border border-transparent'
            }`}
          >
            {student ? (
              <CardDesign student={student} settings={settings} layout={layout} />
            ) : (
              <div className="w-full h-full border border-dashed border-slate-200 rounded flex items-center justify-center text-slate-300 text-xs font-mono">
                [Slot Kosong]
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Screen view watermark / footer info */}
      <div className="no-print absolute bottom-1 right-4 text-[9px] text-slate-400 font-mono">
        Hal {pageNumber} dari {totalPages} ({paperSize} • {cardsPerPage} Kartu/Lembar)
      </div>
    </div>
  );
};
