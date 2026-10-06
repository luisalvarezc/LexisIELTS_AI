import React, { useState } from 'react';
import {
  X,
  FileDown,
  Printer,
  FileCheck,
  BookOpen,
  Layers,
  Target,
  Sparkles,
  CheckCircle2,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { ReadingModule } from '../types/module';
import { generateWorksheetPdf } from '../utils/pdfGenerator';
import { SAMPLE_MODULES } from '../data/sampleModules';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: ReadingModule;
  onSelectModule?: (mod: ReadingModule) => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  module,
  onSelectModule,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const isSample1 = module.title === SAMPLE_MODULES[0]?.title;
  const isSample2 = module.title === SAMPLE_MODULES[1]?.title;
  const isSample3 = module.title === SAMPLE_MODULES[2]?.title;
  const isCustomOrGenerated = !isSample1 && !isSample2 && !isSample3;

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    try {
      // Small timeout to allow UI state to update smoothly
      await new Promise((resolve) => setTimeout(resolve, 150));
      generateWorksheetPdf(module);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Error generating PDF with jsPDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    // Update document title dynamically to ensure the saved PDF has the exact module title
    const prevTitle = document.title;
    const sanitizedTitle = module.title.slice(0, 50).trim();
    document.title = `${sanitizedTitle} - IELTS ${module.targetLevel}`;
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:hidden">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 dark:from-slate-850 via-white dark:via-slate-900 to-slate-50 dark:to-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Generar y Descargar Ficha PDF
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Formato oficial de examen IELTS / CEFR con lectura, vocabulario y quiz.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Active Module Card (Clear indicator of WHICH module is being exported) */}
          <div className="bg-slate-50 dark:bg-slate-850 border-2 border-indigo-200/90 dark:border-indigo-800/80 rounded-xl p-4.5 space-y-3 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300">
                    Módulo Activo para PDF
                  </span>
                  {isCustomOrGenerated ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Generado / Personalizado
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                      📚 Módulo de Ejemplo ({isSample1 ? 'Ejemplo 1' : isSample2 ? 'Ejemplo 2' : 'Ejemplo 3'})
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {module.targetLevel}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white leading-snug">
                  {module.title}
                </h3>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 pt-1 border-t border-slate-200/80 dark:border-slate-700/80">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Tema curricular:</span>
              <span className="italic truncate">{module.topic}</span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-white dark:bg-slate-900 rounded-lg p-2 border border-slate-200 dark:border-slate-750 text-xs">
                <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Palabras</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{module.wordCount}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-lg p-2 border border-slate-200 dark:border-slate-750 text-xs">
                <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Vocabulario</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-400">{module.keyVocabulary.length} términos</span>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-lg p-2 border border-slate-200 dark:border-slate-750 text-xs">
                <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Preguntas</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">{module.quiz.length} preguntas</span>
              </div>
            </div>
          </div>

          {/* Worksheet Structure Details */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
              Contenido incluido en el PDF de 1 a 2 páginas:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Texto académico de 4 párrafos numerados</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Tabla de vocabulario con colocaciones</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                <Target className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Evaluación opción múltiple (A, B, C, D)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Clave de respuestas y citas textuales de evidencia</span>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {downloadSuccess && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                ¡PDF generado y descargado con éxito! Revisa la carpeta de Descargas o Archivos en tu dispositivo.
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Primary Option: Direct File Download */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer"
            >
              <FileDown className="w-5 h-5" />
              <span>
                {isDownloading ? 'Generando archivo PDF...' : 'Descargar Archivo PDF (.pdf)'}
              </span>
            </button>

            {/* Secondary Option: Native Print */}
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Imprimir directamente o Guardar como PDF del navegador</span>
            </button>
          </div>

          {/* Switch module option if the user wants another module */}
          {onSelectModule && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  ¿Deseas exportar otro módulo?
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">Selecciona para cambiar:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_MODULES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectModule(sample)}
                    className={`text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      module.title === sample.title
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 font-bold text-indigo-900 dark:text-indigo-200'
                        : 'bg-slate-50/60 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                      Ejemplo {idx + 1}
                    </span>
                    <span className="line-clamp-1">{sample.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
