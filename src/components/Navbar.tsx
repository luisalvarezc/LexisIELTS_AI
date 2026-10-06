import React from 'react';
import { BookOpen, Sparkles, Printer, Code2, GraduationCap, Upload, Layers, Target } from 'lucide-react';

interface NavbarProps {
  activeTab: 'passage' | 'vocab' | 'quiz' | 'json';
  setActiveTab: (tab: 'passage' | 'vocab' | 'quiz' | 'json') => void;
  onOpenGenerator: () => void;
  onOpenImport: () => void;
  onPrint: () => void;
  targetLevel: string;
  vocabCount?: number;
  quizCount?: number;
  viewMode?: 'tabs' | 'continuous';
  setViewMode?: (mode: 'tabs' | 'continuous') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenGenerator,
  onOpenImport,
  onPrint,
  targetLevel,
  vocabCount = 5,
  quizCount = 5,
  viewMode = 'tabs',
  setViewMode,
}) => {
  const handleMobileTabClick = (tab: 'passage' | 'vocab' | 'quiz' | 'json') => {
    setActiveTab(tab);
    if (viewMode === 'continuous') {
      const el = document.getElementById(`section-${tab}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 block leading-tight">
              LexisIELTS
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1">
              Curriculum Studio
            </span>
          </div>
        </div>

        {/* Zone 2: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('passage')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'passage'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Reading Passage
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'vocab'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Key Vocabulary</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-full font-bold">
              {vocabCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'quiz'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Comprehension Quiz</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full font-bold">
              {quizCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'json'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Clean JSON
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenImport}
            title="Importar módulo desde archivo o texto JSON"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xs:inline">Importar</span>
          </button>
          <button
            onClick={onPrint}
            title="Print clean educational worksheet"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Worksheet</span>
          </button>
          <button
            onClick={onOpenGenerator}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generar</span>
          </button>
        </div>
      </div>

      {/* Mobile Top Navigation Bar with Explicit Academic Names */}
      <div className="md:hidden flex items-center justify-between gap-1 px-3 py-2 bg-slate-100 border-t border-slate-200/80 overflow-x-auto">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => handleMobileTabClick('passage')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
              activeTab === 'passage'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reading Passage</span>
          </button>
          <button
            onClick={() => handleMobileTabClick('vocab')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
              activeTab === 'vocab'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Key Vocabulary</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-full font-bold">
              {vocabCount}
            </span>
          </button>
          <button
            onClick={() => handleMobileTabClick('quiz')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
              activeTab === 'quiz'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Comprehension Quiz</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full font-bold">
              {quizCount}
            </span>
          </button>
          <button
            onClick={() => handleMobileTabClick('json')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
              activeTab === 'json'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>
    </header>
  );
};
