import React from 'react';
import { BookOpen, Layers, Target, Code2, ScrollText, LayoutGrid } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'passage' | 'vocab' | 'quiz' | 'json';
  setActiveTab: (tab: 'passage' | 'vocab' | 'quiz' | 'json') => void;
  viewMode: 'tabs' | 'continuous';
  setViewMode: (mode: 'tabs' | 'continuous') => void;
  vocabCount: number;
  quizCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  vocabCount,
  quizCount,
}) => {
  const handleTabClick = (tab: 'passage' | 'vocab' | 'quiz' | 'json') => {
    setActiveTab(tab);
    if (viewMode === 'continuous') {
      const el = document.getElementById(`section-${tab}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Navegación Móvil de Secciones"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.4)] px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] transition-colors print:hidden"
    >
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        {/* Tab 1: Reading Passage */}
        <button
          onClick={() => handleTabClick('passage')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-all ${
            viewMode === 'tabs' && activeTab === 'passage'
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-95'
          }`}
        >
          <div className="relative">
            <BookOpen className="w-5 h-5" />
            {viewMode === 'tabs' && activeTab === 'passage' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 line-clamp-1">Reading</span>
        </button>

        {/* Tab 2: Key Vocabulary */}
        <button
          onClick={() => handleTabClick('vocab')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-all relative ${
            viewMode === 'tabs' && activeTab === 'vocab'
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-95'
          }`}
        >
          <div className="relative">
            <Layers className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-2 px-1 py-0.2 min-w-4 text-[9px] font-bold bg-indigo-600 dark:bg-indigo-500 text-white rounded-full text-center leading-tight shadow-xs">
              {vocabCount}
            </span>
            {viewMode === 'tabs' && activeTab === 'vocab' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 line-clamp-1">Vocabulary</span>
        </button>

        {/* Tab 3: Comprehension Quiz */}
        <button
          onClick={() => handleTabClick('quiz')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-all relative ${
            viewMode === 'tabs' && activeTab === 'quiz'
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-95'
          }`}
        >
          <div className="relative">
            <Target className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-2 px-1 py-0.2 min-w-4 text-[9px] font-bold bg-amber-500 text-white rounded-full text-center leading-tight shadow-xs">
              {quizCount}
            </span>
            {viewMode === 'tabs' && activeTab === 'quiz' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 line-clamp-1">Quiz</span>
        </button>

        {/* Tab 4: Clean JSON / Options */}
        <button
          onClick={() => handleTabClick('json')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-all ${
            viewMode === 'tabs' && activeTab === 'json'
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-95'
          }`}
        >
          <div className="relative">
            <Code2 className="w-5 h-5" />
            {viewMode === 'tabs' && activeTab === 'json' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 line-clamp-1">JSON</span>
        </button>
      </div>
    </nav>
  );
};
