import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  BookOpen,
  Info,
  Type as TypeIcon,
  CheckCircle2,
  ArrowRight,
  Target,
  Sun,
  Moon,
} from 'lucide-react';
import { ReadingModule } from '../types/module';
import { AudioPlayerBar } from './AudioPlayerBar';
import { useAudioVoice } from '../context/AudioVoiceContext';
import { useTheme } from '../context/ThemeContext';

interface ReadingPassageProps {
  module: ReadingModule;
  onNavigateTab?: (tab: 'passage' | 'vocab' | 'quiz' | 'json') => void;
}

export const ReadingPassage: React.FC<ReadingPassageProps> = ({ module, onNavigateTab }) => {
  const [highlightCohesive, setHighlightCohesive] = useState(true);
  const [showStructureRoles, setShowStructureRoles] = useState(true);
  const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl'>('lg');
  const { stop } = useAudioVoice();
  const { isDark, toggleTheme } = useTheme();

  // Stop audio on unmount or module change
  useEffect(() => {
    stop();
  }, [module, stop]);

  // Helper to highlight cohesive devices in text
  const renderHighlightedText = (text: string, cohesiveDevices: string[]) => {
    if (!highlightCohesive || !cohesiveDevices || cohesiveDevices.length === 0) {
      return <span>{text}</span>;
    }

    // Sort devices by length descending so longer phrases match first
    const sortedDevices = [...cohesiveDevices].sort((a, b) => b.length - a.length);
    const escaped = sortedDevices.map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');

    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => {
          const match = sortedDevices.find(
            (d) => d.toLowerCase() === part.toLowerCase()
          );
          if (match) {
            return (
              <mark
                key={i}
                className="bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 font-medium px-1 py-0.5 rounded cursor-help border-b border-amber-300 dark:border-amber-700"
                title={`Cohesive Discourse Marker: "${match}"`}
              >
                {part}
              </mark>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  const fontSizeClasses = {
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose',
  };

  const isWordCountCompliant = module.wordCount >= 250 && module.wordCount <= 350;

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Passage Header & Metadata */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs max-w-full overflow-hidden transition-colors">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{module.targetLevel}</span>
          <span aria-hidden="true">·</span>
          <span>{module.structureType}</span>
          <span aria-hidden="true">·</span>
          <span
            className={
              isWordCountCompliant
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'text-amber-700 dark:text-amber-400 font-semibold'
            }
          >
            {module.wordCount} words {isWordCountCompliant ? '(Optimal 250–350)' : ''}
          </span>
          <span aria-hidden="true">·</span>
          <span>~{Math.max(1, Math.round(module.wordCount / 130))} min read</span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-snug break-words">
          {module.title}
        </h1>

        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 max-w-3xl break-words">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Curriculum Topic:</span> {module.topic}
        </p>

        {/* Dedicated Audio Player Bar with Global Voice Selector */}
        <div className="mt-5 w-full max-w-full">
          <AudioPlayerBar textToRead={module.readingText.fullText} />
        </div>

        {/* Reading Text Display Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Cohesive Marker Highlight Toggle */}
            <button
              onClick={() => setHighlightCohesive(!highlightCohesive)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                highlightCohesive
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Cohesive Devices</span>
              {highlightCohesive && (
                <span className="text-[10px] bg-amber-200/70 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-bold px-1.5 py-0.2 rounded-full">
                  On
                </span>
              )}
            </button>

            {/* Paragraph Structure Annotations */}
            <button
              onClick={() => setShowStructureRoles(!showStructureRoles)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                showStructureRoles
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Structure Roles</span>
            </button>
          </div>

          {/* Reading Display Settings: Font Size and Night Reading Mode */}
          <div className="flex items-center gap-2">
            {/* Night Reading Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Modo claro (Día)' : 'Modo oscuro (Lectura nocturna)'}
              title={isDark ? 'Cambiar a modo diurno' : 'Activar modo oscuro para lectura nocturna'}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                isDark
                  ? 'bg-indigo-950/70 border-indigo-800 text-indigo-300 hover:bg-indigo-900/80'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Lectura Nocturna</span>
                </>
              )}
            </button>

            {/* Font Size Adjuster */}
            <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
              <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-400 px-1.5">Size</span>
              {(['base', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                    fontSize === sz
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                      : 'hover:text-slate-900 dark:hover:text-white text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {sz === 'base' ? 'A' : sz === 'lg' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4-Paragraph Reading Text Display */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-full overflow-hidden transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 text-xs text-slate-400 dark:text-slate-500 font-serif italic flex-wrap gap-2">
          <span>Official Academic Reading Passage (One-Page Format)</span>
          <span>IELTS Exam Simulation</span>
        </div>

        <article className="space-y-6 max-w-full overflow-hidden">
          {module.readingText.paragraphs.map((p, idx) => (
            <div
              key={idx}
              className={`relative transition-all rounded-lg p-2 ${
                showStructureRoles ? 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50' : ''
              }`}
            >
              {showStructureRoles && (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 text-xs text-indigo-700 dark:text-indigo-400 font-semibold font-sans tracking-wide">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-[11px] font-bold shrink-0 border border-indigo-200/60 dark:border-indigo-800">
                    {idx + 1}
                  </span>
                  <span className="font-bold">{p.role}</span>
                  {p.cohesiveDevices && p.cohesiveDevices.length > 0 && highlightCohesive && (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal sm:ml-auto w-full sm:w-auto break-words">
                      Linkers: {p.cohesiveDevices.join(', ')}
                    </span>
                  )}
                </div>
              )}
              <p
                className={`font-serif text-slate-800 dark:text-slate-200 antialiased break-words leading-relaxed text-left sm:text-justify hyphens-auto ${fontSizeClasses[fontSize]}`}
              >
                {renderHighlightedText(p.text, p.cohesiveDevices)}
              </p>
            </div>
          ))}
        </article>

        {highlightCohesive && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
            <span>
              Highlighted phrases indicate high-band cohesive discourse markers ensuring logical continuity.
            </span>
          </div>
        )}
      </div>

      {/* Examiner Notes & Pedagogical Breakdown */}
      {module.examinerNotes && (
        <div className="bg-slate-100/80 dark:bg-slate-850/60 dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2 max-w-full overflow-hidden transition-colors">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Examiner Curriculum Analysis</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed break-words">
            {module.examinerNotes.academicToneSummary}
          </p>
          {module.examinerNotes.targetLexicalBandFeatures && (
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 pt-1 break-words">
              {module.examinerNotes.targetLexicalBandFeatures.map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Next Step Section Card (High-visibility for iPhone and mobile users) */}
      <div className="bg-gradient-to-r from-indigo-50 dark:from-slate-900 via-white dark:via-slate-900/90 to-indigo-50/40 dark:to-indigo-950/30 rounded-2xl p-4 sm:p-6 border-2 border-indigo-200/80 dark:border-indigo-800/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 max-w-full overflow-hidden transition-colors">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200/60 dark:border-indigo-800">
            <span>Siguiente Fase del Módulo</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            ¿Completaste la lectura del pasaje?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
            Avanza a la sección de <strong>Key Vocabulary</strong> con tarjetas interactivas (flashcards) o evalúa tu comprensión con el <strong>Comprehension Quiz</strong>.
          </p>
        </div>

        {onNavigateTab && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                onNavigateTab('vocab');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 dark:shadow-none transition-transform active:scale-95 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Ver Key Vocabulary ({module.keyVocabulary.length})</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => {
                onNavigateTab('quiz');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Ir al Quiz ({module.quiz.length})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
