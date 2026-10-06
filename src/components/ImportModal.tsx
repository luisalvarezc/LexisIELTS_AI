import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Sparkles, Copy } from 'lucide-react';
import { ReadingModule, normalizeReadingModule } from '../types/module';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (module: ReadingModule) => void;
}

const TEMPLATE_EXAMPLE = {
  title: 'Urban Rewilding Initiatives in Metropolitan Corridors',
  level: 'IELTS Band 7.0 / CEFR C1',
  reading_text: {
    introduction:
      'In an era characterized by accelerating climate volatility, municipal urban planners are increasingly adopting "urban rewilding" as a regenerative design paradigm. Unlike manicured municipal parks, rewilding deliberately reintroduces native flora and fauna into metropolitan corridors to reconstruct autonomous ecological processes.',
    body_paragraph_1:
      'On the one hand, the measurable socio-environmental dividends of urban rewilding are well documented by urban ecologists. Restoring canopy coverage and native wetlands substantially reduces metropolitan surface temperatures by up to four degrees Celsius. Furthermore, continuous exposure to structurally diverse greenery diminishes stress among urban dwellers.',
    body_paragraph_2:
      'On the other hand, the spontaneous, uncontrolled ethos of rewilding frequently collides with traditional municipal imperatives and public safety concerns. Skeptics point out that unchecked shrubbery can harbor vector-borne pathogens, posing public health hazards. Furthermore, commercial developers contend that unkempt wilderness corridors depress surrounding real estate valuations.',
    conclusion:
      'In conclusion, while urban rewilding inevitably disrupts conventional civic aesthetics and demands novel risk-mitigation protocols, its ecological indispensability is undeniable. Urban administrations must therefore forge hybrid municipal designs that balance uninhibited biodiversity with structured public safety zones.',
    full_text:
      'In an era characterized by accelerating climate volatility, municipal urban planners are increasingly adopting "urban rewilding" as a regenerative design paradigm. Unlike manicured municipal parks, rewilding deliberately reintroduces native flora and fauna into metropolitan corridors to reconstruct autonomous ecological processes.\n\nOn the one hand, the measurable socio-environmental dividends of urban rewilding are well documented by urban ecologists. Restoring canopy coverage and native wetlands substantially reduces metropolitan surface temperatures by up to four degrees Celsius. Furthermore, continuous exposure to structurally diverse greenery diminishes stress among urban dwellers.\n\nOn the other hand, the spontaneous, uncontrolled ethos of rewilding frequently collides with traditional municipal imperatives and public safety concerns. Skeptics point out that unchecked shrubbery can harbor vector-borne pathogens, posing public health hazards. Furthermore, commercial developers contend that unkempt wilderness corridors depress surrounding real estate valuations.\n\nIn conclusion, while urban rewilding inevitably disrupts conventional civic aesthetics and demands novel risk-mitigation protocols, its ecological indispensability is undeniable. Urban administrations must therefore forge hybrid municipal designs that balance uninhibited biodiversity with structured public safety zones.',
  },
  key_vocabulary: [
    {
      term: 'regenerative',
      part_of_speech: 'adjective',
      definition: 'Relating to or causing the renewal or restoration of an ecosystem.',
      context_sentence: '...adopting urban rewilding as a regenerative design paradigm.',
    },
    {
      term: 'dividends',
      part_of_speech: 'noun (plural figurative)',
      definition: 'A desirable result or benefit of an action or policy.',
      context_sentence: 'On the one hand, the measurable socio-environmental dividends...',
    },
    {
      term: 'indispensability',
      part_of_speech: 'noun',
      definition: 'The quality of being absolutely necessary or essential.',
      context_sentence: '...its ecological indispensability is undeniable.',
    },
  ],
  quiz: [
    {
      question_number: 1,
      question: 'What is the main objective of urban rewilding as described in the text?',
      options: {
        A: 'To eliminate all human presence in cities.',
        B: 'To reconstruct autonomous ecological processes by reintroducing native species.',
        C: 'To increase the manicuring and mowing of commercial public parks.',
        D: 'To completely replace concrete buildings with farmland.',
      },
      correct_answer: 'B',
      explanation: 'Paragraph 1 explains that rewilding reconstructs autonomous ecological processes using native flora and fauna.',
    },
    {
      question_number: 2,
      question: 'Why do some developers and citizens criticize unmanaged rewilded corridors?',
      options: {
        A: 'They fear vector-borne pathogens and depressed property valuations.',
        B: 'They believe trees absorb too much oxygen during daylight hours.',
        C: 'They want roads widened for higher vehicular speed limits.',
        D: 'They argue native plants fail to cool metropolitan temperatures.',
      },
      correct_answer: 'A',
      explanation: 'Paragraph 3 notes concerns about vector-borne pathogens and lowered commercial real estate valuations.',
    },
  ],
};

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleValidateAndImport = (rawText: string) => {
    setErrorMessage(null);
    if (!rawText.trim()) {
      setErrorMessage('Por favor ingresa o carga un contenido JSON.');
      return;
    }

    try {
      const parsed = JSON.parse(rawText);
      const normalized = normalizeReadingModule(parsed);
      onImport(normalized);
      onClose();
    } catch (err: any) {
      setErrorMessage(
        err.message || 'El texto no tiene un formato JSON válido o la estructura no coincide con el esquema requerido.'
      );
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setErrorMessage('Por favor selecciona un archivo con extensión .json');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
      handleValidateAndImport(content);
    };
    reader.onerror = () => {
      setErrorMessage('Error al leer el archivo seleccionado.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleLoadTemplate = () => {
    const formatted = JSON.stringify(TEMPLATE_EXAMPLE, null, 2);
    setJsonInput(formatted);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Importar Módulo desde JSON
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compatible con el tipado ReadingModule (snake_case o camelCase).
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
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-850/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
            }`}
          >
            <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Arrastra y suelta tu archivo <span className="font-mono text-indigo-700 dark:text-indigo-300">.json</span> aquí
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">o selecciona un archivo desde tu equipo</p>

            <label className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/60 shadow-2xs transition-colors">
              <span>Examinar archivo</span>
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          {/* Paste JSON */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                O pega el código JSON directamente:
              </label>
              <button
                type="button"
                onClick={handleLoadTemplate}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Cargar plantilla de ejemplo
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setErrorMessage(null);
              }}
              rows={9}
              placeholder={`{\n  "title": "Urban Rewilding",\n  "level": "IELTS Band 7.0 / CEFR C1",\n  "reading_text": { "introduction": "...", "body_paragraph_1": "...", ... },\n  "key_vocabulary": [ { "term": "...", ... } ],\n  "quiz": [ { "question_number": 1, ... } ]\n}`}
              className="w-full text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 p-3 bg-slate-950 text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent leading-relaxed"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => handleValidateAndImport(jsonInput)}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm shadow-indigo-200 dark:shadow-none cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Validar e Importar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
