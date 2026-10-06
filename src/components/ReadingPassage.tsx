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
} from 'lucide-react';
import { ReadingModule } from '../types/module';
import { AudioPlayerBar } from './AudioPlayerBar';
import { useAudioVoice } from '../context/AudioVoiceContext';

interface ReadingPassageProps {
  module: ReadingModule;
  onNavigateTab?: (tab: 'passage' | 'vocab' | 'quiz' | 'json') => void;
}

export const ReadingPassage: React.FC<ReadingPassageProps> = ({ module, onNavigateTab }) => {
  const [highlightCohesive, setHighlightCohesive] = useState(true);
  const [showStructureRoles, setShowStructureRoles] = useState(true);
  const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl'>('lg');
  const { stop } = useAudioVoice();

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
                className="bg-amber-100 text-amber-950 font-medium px-1 py-0.5 rounded cursor-help border-b border-amber-300"
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
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-2xs max-w-full overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
          <span className="text-indigo-600 font-semibold">{module.targetLevel}</span>
          <span aria-hidden="true">·</span>
          <span>{module.structureType}</span>
          <span aria-hidden="true">·</span>
          <span
            className={
              isWordCountCompliant
                ? 'text-emerald-700 font-semibold'
                : 'text-amber-700 font-semibold'
            }
          >
            {module.wordCount} words {isWordCountCompliant ? '(Optimal 250–350)' : ''}
          </span>
          <span aria-hidden="true">·</span>
          <span>~{Math.max(1, Math.round(module.wordCount / 130))} min read</span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-slate-900 tracking-tight leading-snug break-words">
          {module.title}
        </h1>

        <p className="mt-2 text-xs text-slate-600 max-w-3xl break-words">
          <span className="font-semibold text-slate-700">Curriculum Topic:</span> {module.topic}
        </p>

        {/* Dedicated Audio Player Bar with Global Voice Selector */}
        <div className="mt-5 w-full max-w-full">
          <AudioPlayerBar textToRead={module.readingText.fullText} />
        </div>

        {/* Reading Text Display Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Cohesive Marker Highlight Toggle */}
            <button
              onClick={() => setHighlightCohesive(!highlightCohesive)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                highlightCohesive
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Cohesive Devices</span>
              {highlightCohesive && (
                <span className="text-[10px] bg-amber-200/70 text-amber-900 font-bold px-1.5 py-0.2 rounded-full">
                  On
                </span>
              )}
            </button>

            {/* Paragraph Structure Annotations */}
            <button
              onClick={() => setShowStructureRoles(!showStructureRoles)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                showStructureRoles
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Structure Roles</span>
            </button>
          </div>

          {/* Font Size Adjuster */}
          <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-slate-600">
            <span className="text-[10px] font-semibold uppercase text-slate-400 px-1.5">Size</span>
            {(['base', 'lg', 'xl'] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => setFontSize(sz)}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  fontSize === sz ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                {sz === 'base' ? 'A' : sz === 'lg' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4-Paragraph Reading Text Display */}
      <div className="bg-white rounded-xl p-4 sm:p-8 md:p-10 border border-slate-200 shadow-sm space-y-6 max-w-full overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs text-slate-400 font-serif italic flex-wrap gap-2">
          <span>Official Academic Reading Passage (One-Page Format)</span>
          <span>IELTS Exam Simulation</span>
        </div>

        <article className="space-y-6 max-w-full overflow-hidden">
          {module.readingText.paragraphs.map((p, idx) => (
            <div
              key={idx}
              className={`relative transition-all rounded-lg p-2 ${
                showStructureRoles ? 'hover:bg-slate-50/80' : ''
              }`}
            >
              {showStructureRoles && (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 text-xs text-indigo-700 font-semibold font-sans tracking-wide">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold">{p.role}</span>
                  {p.cohesiveDevices && p.cohesiveDevices.length > 0 && highlightCohesive && (
                    <span className="text-[11px] text-slate-400 font-normal sm:ml-auto w-full sm:w-auto break-words">
                      Linkers: {p.cohesiveDevices.join(', ')}
                    </span>
                  )}
                </div>
              )}
              <p
                className={`font-serif text-slate-800 antialiased break-words leading-relaxed text-left sm:text-justify hyphens-auto ${fontSizeClasses[fontSize]}`}
              >
                {renderHighlightedText(p.text, p.cohesiveDevices)}
              </p>
            </div>
          ))}
        </article>

        {highlightCohesive && (
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300 shrink-0"></span>
            <span>
              Highlighted phrases indicate high-band cohesive discourse markers ensuring logical continuity.
            </span>
          </div>
        )}
      </div>

      {/* Examiner Notes & Pedagogical Breakdown */}
      {module.examinerNotes && (
        <div className="bg-slate-100/80 rounded-xl p-4 sm:p-5 border border-slate-200 text-xs text-slate-700 space-y-2 max-w-full overflow-hidden">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Examiner Curriculum Analysis</span>
          </div>
          <p className="text-slate-600 leading-relaxed break-words">
            {module.examinerNotes.academicToneSummary}
          </p>
          {module.examinerNotes.targetLexicalBandFeatures && (
            <ul className="list-disc list-inside space-y-1 text-slate-600 pt-1 break-words">
              {module.examinerNotes.targetLexicalBandFeatures.map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Next Step Section Card (High-visibility for iPhone and mobile users) */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50/40 rounded-2xl p-4 sm:p-6 border-2 border-indigo-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 max-w-full overflow-hidden">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">
            <span>Siguiente Fase del Módulo</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            ¿Completaste la lectura del pasaje?
          </h3>
          <p className="text-xs text-slate-600 max-w-xl">
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
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-transform active:scale-95 cursor-pointer"
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
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Target className="w-4 h-4 text-amber-600" />
              <span>Ir al Quiz ({module.quiz.length})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
