'use client';

import React, { useState, useEffect } from 'react';
import { Student, SchoolSettings, LayoutSettings, ValidationSummary } from '../types';
import { DEFAULT_SCHOOL_SETTINGS, SAMPLE_STUDENTS } from '../lib/sampleData';
import { Header } from '../components/Header';
import { StepNavigation } from '../components/StepNavigation';
import { SettingsStep } from '../components/SettingsStep';
import { UploadStep } from '../components/UploadStep';
import { LayoutStep } from '../components/LayoutStep';
import { PreviewStep } from '../components/PreviewStep';

const SETTINGS_STORAGE_KEY = 'kartu_ujian_settings_v1';
const LAYOUT_STORAGE_KEY = 'kartu_ujian_layout_v1';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_SCHOOL_SETTINGS);
  const [students, setStudents] = useState<Student[]>([]);
  const [validation, setValidation] = useState<ValidationSummary | null>(null);
  const [layout, setLayout] = useState<LayoutSettings>({
    paperSize: 'A4',
    cardsPerPage: 8,
    showCuttingGuide: true,
    colorTheme: 'blue',
    enablePhoto: true,
  });
  const [isClient, setIsClient] = useState(false);

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (savedLayout) {
        const parsed = JSON.parse(savedLayout);
        setLayout({
          ...parsed,
          enablePhoto: parsed.enablePhoto !== undefined ? parsed.enablePhoto : true,
        });
      }
    } catch (e) {
      console.warn('Gagal memuat preferensi tersimpan:', e);
    }
  }, []);

  // Save settings when changed
  const updateSettings = (updated: Partial<SchoolSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        // LocalStorage might be full if logos are large
      }
      return next;
    });
  };

  const updateLayout = (updated: Partial<LayoutSettings>) => {
    setLayout((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // 1-Click Load Sample Demo Data
  const handleLoadSampleData = () => {
    setSettings(DEFAULT_SCHOOL_SETTINGS);
    setStudents(SAMPLE_STUDENTS);
    setValidation({
      totalRows: SAMPLE_STUDENTS.length,
      validStudents: SAMPLE_STUDENTS.length,
      duplicateNisn: [],
      missingRequiredFields: 0,
      withPhotosCount: SAMPLE_STUDENTS.filter((s) => s.hasFoto).length,
      withoutPhotosCount: SAMPLE_STUDENTS.filter((s) => !s.hasFoto).length,
      warnings: [],
    });
    // Jump straight to Step 4 Preview so user gets immediate gratification
    setCurrentStep(4);
  };

  const handleResetAll = () => {
    if (confirm('Apakah Anda yakin ingin mereset semua data dan formulir?')) {
      setStudents([]);
      setValidation(null);
      setCurrentStep(1);
    }
  };

  const canNavigateToStep = (step: number): boolean => {
    if (step === 1) return true;
    if (step === 2) return Boolean(settings.namaSekolah);
    if (step === 3) return students.length > 0;
    if (step === 4) return students.length > 0;
    return false;
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Memuat aplikasi...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* App Header */}
      <Header
        onLoadSampleData={handleLoadSampleData}
        onResetAll={handleResetAll}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 sm:pb-8">
        {/* Step Indicator */}
        <StepNavigation
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          canNavigateToStep={canNavigateToStep}
        />

        {/* Dynamic Step Content */}
        <div className="step-transition">
          {currentStep === 1 && (
            <SettingsStep
              settings={settings}
              onChange={updateSettings}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <UploadStep
              students={students}
              validation={validation}
              onDataLoaded={(newStudents, newValidation) => {
                setStudents(newStudents);
                setValidation(newValidation);
              }}
              onPhotosUpdated={(updatedStudents) => {
                setStudents(updatedStudents);
              }}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <LayoutStep
              layout={layout}
              totalStudents={students.length}
              onChange={updateLayout}
              onBack={() => setCurrentStep(2)}
              onNext={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 4 && (
            <PreviewStep
              students={students}
              settings={settings}
              layout={layout}
              onUpdateLayout={updateLayout}
              onBack={() => setCurrentStep(3)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          Aplikasi Generator Kartu Ujian Otomatis &bull; Pemrosesan Data Cepat &amp; Aman di Browser
        </div>
      </footer>
    </div>
  );
}
