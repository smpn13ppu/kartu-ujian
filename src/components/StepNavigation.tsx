'use client';

import React from 'react';
import { Building2, Users, LayoutGrid, Eye } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  canNavigateToStep: (step: number) => boolean;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onStepChange,
  canNavigateToStep,
}) => {
  const steps = [
    { number: 1, title: 'Identitas & TTD', desc: 'Kop, Logo & Tanda Tangan', icon: Building2 },
    { number: 2, title: 'Data Peserta', desc: 'Upload Excel & Foto Siswa', icon: Users },
    { number: 3, title: 'Layout Cetak', desc: 'Ukuran Kertas & Grid', icon: LayoutGrid },
    { number: 4, title: 'Preview & Cetak', desc: 'Cek Visual & Unduh PDF', icon: Eye },
  ];

  return (
    <nav aria-label="Progress" className="no-print mb-8">
      <ol className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isAccessible = canNavigateToStep(step.number);

          return (
            <li key={step.number}>
              <button
                type="button"
                disabled={!isAccessible}
                onClick={() => onStepChange(step.number)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isActive
                    ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500/30'
                    : isCompleted
                    ? 'bg-white border-emerald-300 hover:border-emerald-400'
                    : isAccessible
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isActive
                          ? 'text-blue-700'
                          : isCompleted
                          ? 'text-emerald-700'
                          : 'text-slate-500'
                      }`}
                    >
                      Langkah {step.number}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate hidden sm:block">
                    {step.desc}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
