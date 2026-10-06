import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { GeneratorModal } from './components/GeneratorModal';
import { ImportModal } from './components/ImportModal';
import { ReadingPassage } from './components/ReadingPassage';
import { VocabularySection } from './components/VocabularySection';
import { QuizSection } from './components/QuizSection';
import { JsonViewerModal } from './components/JsonViewerModal';
import { PrintWorksheet } from './components/PrintWorksheet';
import { PdfExportModal } from './components/PdfExportModal';
import { SAMPLE_MODULES } from './data/sampleModules';
import { GenerationParams, ReadingModule } from './types/module';
import { Sparkles, Layers, BookOpen, CheckCircle, AlertCircle, Upload, Target, Code2, Smartphone, FileDown } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'lexis_ielts_active_module';

export default function App() {
  const [currentModule, setCurrentModule] = useState<ReadingModule>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return SAMPLE_MODULES[0];
  });

  const [activeTab, setActiveTab] = useState<'passage' | 'vocab' | 'quiz' | 'json'>('passage');
  const [viewMode, setViewMode] = useState<'tabs' | 'continuous'>('tabs');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string; showPdfAction?: boolean } | null>(null);

  // Save to LocalStorage and sync document title whenever currentModule changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentModule));
    } catch (e) {
      console.warn('Could not cache module in localStorage', e);
    }
    // Update document title so browser print & save-as-PDF suggests the exact module title
    if (currentModule?.title) {
      document.title = `${currentModule.title} · ${currentModule.targetLevel} · LexisIELTS`;
    }
  }, [currentModule]);

  const handleImportModule = (moduleData: ReadingModule) => {
    setCurrentModule(moduleData);
    setActiveTab('passage');
    setStatusMessage({
      type: 'success',
      text: `Módulo "${moduleData.title}" importado con éxito (${moduleData.wordCount} palabras, ${moduleData.targetLevel}).`,
    });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleGenerate = async (params: GenerationParams) => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const response = await fetch('/api/generate-module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}: Failed to generate module`);
      }

      const generatedModule: ReadingModule = await response.json();
      setCurrentModule(generatedModule);
      setActiveTab('passage');
      setStatusMessage({
        type: 'success',
        text: `Módulo generado con éxito: "${generatedModule.title}" (${generatedModule.wordCount} palabras, ${generatedModule.targetLevel}).`,
        showPdfAction: true,
      });
      setTimeout(() => setStatusMessage(null), 8000);
    } catch (err: any) {
      console.error('Generation error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error al generar el módulo. Revisa la conexión o intenta con un ejemplo.',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    setIsPdfModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100 pb-16 md:pb-0 w-full max-w-full overflow-x-hidden text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar Contract (3 zones) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
        onPrint={handlePrint}
        targetLevel={currentModule.targetLevel}
        vocabCount={currentModule.keyVocabulary?.length || 0}
        quizCount={currentModule.quiz?.length || 0}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 md:pb-8 print:hidden overflow-x-hidden min-w-0">
        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-all ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              {statusMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
              {statusMessage.showPdfAction && (
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-700 dark:bg-emerald-600 text-white hover:bg-emerald-800 dark:hover:bg-emerald-500 transition-colors shadow-2xs ml-1 cursor-pointer"
                >
                  <FileDown className="w-3 h-3" />
                  <span>Descargar Ficha en PDF</span>
                </button>
              )}
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold self-end sm:self-auto cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Quick Curriculum Selector Strip & View Mode Switcher */}
        {(() => {
          const isSample1 = currentModule.title === SAMPLE_MODULES[0]?.title;
          const isSample2 = currentModule.title === SAMPLE_MODULES[1]?.title;
          const isSample3 = currentModule.title === SAMPLE_MODULES[2]?.title;
          const isCustomModule = !isSample1 && !isSample2 && !isSample3;

          return (
            <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">
                    Módulo:
                  </span>
                  {isCustomModule ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800 flex items-center gap-1 shrink-0">
                      <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Generado con IA
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800 shrink-0">
                      📚 {isSample1 ? 'Ejemplo 1' : isSample2 ? 'Ejemplo 2' : 'Ejemplo 3'}
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate" title={currentModule.title}>
                    {currentModule.title}
                  </span>
                </div>

                {/* View Mode Toggle: Tabs vs Continuous */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700 shrink-0">
                  <button
                    onClick={() => setViewMode('tabs')}
                    title="Ver por pestañas individuales"
                    className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
                      viewMode === 'tabs'
                        ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Pestañas
                  </button>
                  <button
                    onClick={() => setViewMode('continuous')}
                    title="Ver pasaje, vocabulario y quiz todo seguido hacia abajo"
                    className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
                      viewMode === 'continuous'
                        ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Ver Todo Continuo
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 overflow-x-auto text-xs pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 text-[11px] hidden lg:inline">Ejemplos:</span>
                {SAMPLE_MODULES.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentModule(sample);
                      setStatusMessage(null);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap ${
                      currentModule.title === sample.title
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Ejemplo {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  title="Descargar en PDF o imprimir la ficha oficial de este módulo"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors ml-1 cursor-pointer"
                >
                  <FileDown className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => setIsImportOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Upload className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  <span>Importar</span>
                </button>
                <button
                  onClick={() => setIsGeneratorOpen(true)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  + Generar
                </button>
              </div>
            </div>
          );
        })()}

        {/* Mobile Guidance Banner for iPhone users */}
        <div className="md:hidden mb-5 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5 shadow-2xs">
          <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Navegación Móvil: </span>
            {viewMode === 'tabs' ? (
              <span>
                Usa la <strong>barra inferior fija</strong> para alternar entre <strong>Reading</strong>, <strong>Vocabulary ({currentModule.keyVocabulary.length})</strong> y <strong>Quiz ({currentModule.quiz.length})</strong>, o activa <strong>"Ver Todo Continuo"</strong> arriba para leer todo en una sola página.
              </span>
            ) : (
              <span>
                Estás en <strong>Modo Continuo</strong>: desplázate libremente hacia abajo para ver la lectura, el vocabulario clave y el quiz en una sola página.
              </span>
            )}
          </div>
        </div>

        {/* Render View Mode: Continuous (All Sections) vs Tabs */}
        {viewMode === 'continuous' ? (
          <div className="space-y-12">
            {/* Section 1: Reading Passage */}
            <section id="section-passage" className="scroll-mt-24 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  1. Reading Passage
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Texto Académico Completo</span>
              </div>
              <ReadingPassage module={currentModule} onNavigateTab={setActiveTab} />
            </section>

            {/* Section 2: Key Vocabulary */}
            <section id="section-vocab" className="scroll-mt-24 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  2. Key Vocabulary ({currentModule.keyVocabulary.length} términos)
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tabla & Flashcards</span>
              </div>
              <VocabularySection
                vocabulary={currentModule.keyVocabulary}
                targetLevel={currentModule.targetLevel}
                onNavigateTab={setActiveTab}
              />
            </section>

            {/* Section 3: Comprehension Quiz */}
            <section id="section-quiz" className="scroll-mt-24 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  3. Comprehension Quiz ({currentModule.quiz.length} preguntas)
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Evaluación con Evidencias</span>
              </div>
              <QuizSection
                questions={currentModule.quiz}
                targetLevel={currentModule.targetLevel}
                onNavigateTab={setActiveTab}
              />
            </section>

            {/* Section 4: Clean JSON */}
            <section id="section-json" className="scroll-mt-24 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  4. Clean JSON
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Datos del Módulo</span>
              </div>
              <JsonViewerModal
                module={currentModule}
                onOpenImport={() => setIsImportOpen(true)}
              />
            </section>
          </div>
        ) : (
          <>
            {activeTab === 'passage' && (
              <ReadingPassage module={currentModule} onNavigateTab={setActiveTab} />
            )}
            {activeTab === 'vocab' && (
              <VocabularySection
                vocabulary={currentModule.keyVocabulary}
                targetLevel={currentModule.targetLevel}
                onNavigateTab={setActiveTab}
              />
            )}
            {activeTab === 'quiz' && (
              <QuizSection
                questions={currentModule.quiz}
                targetLevel={currentModule.targetLevel}
                onNavigateTab={setActiveTab}
              />
            )}
            {activeTab === 'json' && (
              <JsonViewerModal
                module={currentModule}
                onOpenImport={() => setIsImportOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Fixed Mobile Bottom Tab Bar (iOS Native Style) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        vocabCount={currentModule.keyVocabulary.length}
        quizCount={currentModule.quiz.length}
      />

      {/* Printable Sheet (hidden during interactive mode, visible during browser print) */}
      <PrintWorksheet module={currentModule} />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 print:hidden transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            LexisIELTS Educational Curriculum Design Studio · Importación y Exportación de Módulos JSON.
          </p>
          <div className="flex items-center gap-3">
            <span>Esquema ReadingModule</span>
            <span aria-hidden="true">·</span>
            <span>250–350 Palabras</span>
            <span aria-hidden="true">·</span>
            <span>Evaluación con Evidencias</span>
          </div>
        </div>
      </footer>

      {/* Generator Drawer/Modal */}
      <GeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        onSelectSample={(sample) => {
          setCurrentModule(sample);
          setActiveTab('passage');
        }}
        currentTitle={currentModule.title}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImportModule}
      />

      {/* PDF Export & Download Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        module={currentModule}
        onSelectModule={(mod) => {
          setCurrentModule(mod);
          setActiveTab('passage');
        }}
      />
    </div>
  );
}

