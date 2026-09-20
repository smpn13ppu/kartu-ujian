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

  const currentStepData = steps.find((s) => s.number === currentStep) || steps[0];

  return (
    <nav aria-label="Progress" className="no-print mb-6 sm:mb-8">
      {/* Mobile Stepper Header (< 640px) */}
      <div className="block sm:hidden bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs shadow-blue-500/30">
              {currentStep}
            </span>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block leading-none">
                Langkah {currentStep} dari {steps.length}
              </span>
              <span className="text-sm font-bold text-slate-900 truncate block mt-0.5">
                {currentStepData.title}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
            {Math.round((currentStep / steps.length) * 100)}%
          </span>
        </div>

        {/* Continuous Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3.5">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Indicator Pills */}
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isAccessible = canNavigateToStep(step.number);

            return (
              <button
                key={step.number}
                type="button"
                disabled={!isAccessible}
                onClick={() => onStepChange(step.number)}
                className={`py-2 px-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all touch-target cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/80 border-blue-500 text-blue-700 ring-2 ring-blue-500/20 shadow-xs font-bold'
                    : isCompleted
                    ? 'bg-emerald-50/50 border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-medium'
                    : isAccessible
                    ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 font-medium'
                    : 'bg-slate-50 border-slate-200/60 text-slate-300 opacity-50 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] leading-tight truncate w-full text-center">
                  {step.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop / Tablet Grid (>= 640px) */}
      <ol className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                  <div className="text-[11px] text-slate-500 truncate">
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
