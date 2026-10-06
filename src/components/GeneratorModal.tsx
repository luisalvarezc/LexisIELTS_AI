import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Layers, HelpCircle, Loader2, Check } from 'lucide-react';
import { GenerationParams, ReadingModule } from '../types/module';
import { SAMPLE_MODULES } from '../data/sampleModules';

interface GeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: GenerationParams) => Promise<void>;
  isLoading: boolean;
  onSelectSample: (sample: ReadingModule) => void;
  currentTitle: string;
}

const PRESET_TOPICS = [
  {
    topic: 'Artificial Intelligence and Algorithmic Evaluation in Higher Education',
    level: 'IELTS Band 7.5 / CEFR C1',
    structure: 'Argumentative Pros/Cons',
  },
  {
    topic: 'Urban Rewilding and Biodiversity in High-Density Metropolises',
    level: 'IELTS Band 7.0 / CEFR C1',
    structure: 'Argumentative Pros/Cons',
  },
  {
    topic: 'Neurolinguistic Reorganization in Adult Second Language Acquisition',
    level: 'IELTS Band 8.0 / CEFR C2',
    structure: 'Expository/Historical Analysis',
  },
  {
    topic: 'Deep-Sea Polymetallic Mining: Mineral Scarcity vs. Oceanic Ecosystem Integrity',
    level: 'IELTS Band 7.5 / CEFR C1',
    structure: 'Argumentative Pros/Cons',
  },
  {
    topic: 'Cognitive Biases and Algorithmic Echo Chambers in Digital News Consumption',
    level: 'IELTS Band 7.0 / CEFR C1',
    structure: 'Problem-Solution & Synthesis',
  },
];

const TARGET_LEVELS = [
  'IELTS Band 6.0 / CEFR B2',
  'IELTS Band 6.5 / CEFR B2+',
  'IELTS Band 7.0 / CEFR C1',
  'IELTS Band 7.5 / CEFR C1+',
  'IELTS Band 8.0 / CEFR C2',
  'IELTS Band 8.5–9.0 / CEFR C2 Mastery',
];

const STRUCTURE_TYPES = [
  'Argumentative Pros/Cons',
  'Problem-Solution & Synthesis',
  'Expository/Historical Analysis',
  'Cause-and-Effect Investigation',
];

const formatErrorMessage = (raw: string): string => {
  if (!raw) return 'Error inesperado al generar el módulo.';
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error?.message) {
      if (parsed.error.code === 503 || parsed.error.status === 'UNAVAILABLE') {
        return 'Los servidores de Gemini están experimentando alta demanda momentánea (Error 503). Por favor pulsa "Generate Reading Module" nuevamente para reintentar.';
      }
      return parsed.error.message;
    }
  } catch {
    // not JSON
  }
  if (raw.includes('503') || raw.includes('high demand') || raw.includes('UNAVAILABLE')) {
    return 'Los servidores de Gemini están experimentando alta demanda momentánea (Error 503). Por favor pulsa "Generate Reading Module" nuevamente para reintentar.';
  }
  return raw;
};

export const GeneratorModal: React.FC<GeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isLoading,
  onSelectSample,
  currentTitle,
}) => {
  const [topic, setTopic] = useState('');
  const [targetLevel, setTargetLevel] = useState('IELTS Band 7.0 / CEFR C1');
  const [structureType, setStructureType] = useState('Argumentative Pros/Cons');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('Por favor especifica un tema de lectura.');
      return;
    }
    setErrorMsg(null);
    try {
      await onGenerate({
        topic: topic.trim(),
        targetLevel,
        structureType,
        numQuestions,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(formatErrorMessage(err.message || ''));
    }
  };

  const handleSelectPreset = (p: { topic: string; level: string; structure: string }) => {
    setTopic(p.topic);
    setTargetLevel(p.level);
    setStructureType(p.structure);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Generate Educational Reading Module
              </h2>
              <p className="text-xs text-slate-500">
                Strict 4-paragraph academic discourse (250–350 words) with cohesive linkers & quiz.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              High-Yield Academic Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_TOPICS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    topic === preset.topic
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-medium'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {preset.topic.length > 45 ? `${preset.topic.slice(0, 45)}...` : preset.topic}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Topic Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reading Topic / Proposition <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={2}
                placeholder="e.g., The Impact of Ocean Acidification on Coral Reef Ecosystems"
                className="w-full text-sm rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Target Level & Structure Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target CEFR / IELTS Level
                </label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {TARGET_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Discourse Structure Type
                </label>
                <select
                  value={structureType}
                  onChange={(e) => setStructureType(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {STRUCTURE_TYPES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Comprehension Questions Count
                </label>
                <span className="text-xs font-bold text-indigo-700">{numQuestions} Questions</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[4, 5, 6].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setNumQuestions(count)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      numQuestions === count
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {count} Multiple-Choice
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Covers main ideas, specific factual details, contextual vocabulary, and inferential logic.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg transition-colors shadow-sm shadow-indigo-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Curating Academic Module...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Reading Module</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Instant Pre-built Switcher */}
          <div className="pt-4 border-t border-slate-200">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Or Load Curated Master Modules Instantly
            </span>
            <div className="space-y-2">
              {SAMPLE_MODULES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onSelectSample(sample);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                    currentTitle === sample.title
                      ? 'bg-slate-100 border-indigo-400'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {sample.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {sample.targetLevel} · {sample.wordCount} words · {sample.quiz.length} Questions
                    </p>
                  </div>
                  {currentTitle === sample.title ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-500">Load</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
