import React, { useState } from 'react';
import { Copy, Check, Download, Upload, FileCode2 } from 'lucide-react';
import { ReadingModule, toUserReadingModule } from '../types/module';

interface JsonViewerModalProps {
  module: ReadingModule;
  onOpenImport: () => void;
}

export const JsonViewerModal: React.FC<JsonViewerModalProps> = ({ module, onOpenImport }) => {
  const [schemaFormat, setSchemaFormat] = useState<'standard' | 'extended'>('standard');
  const [copied, setCopied] = useState(false);

  // Generate payload based on format
  const exportPayload =
    schemaFormat === 'standard' ? toUserReadingModule(module) : module;
  const jsonString = JSON.stringify(exportPayload, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedTitle = module.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 35);
    a.download = `${sanitizedTitle}_${schemaFormat}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span className="text-indigo-600 font-semibold">Importar & Exportar</span>
            <span aria-hidden="true">·</span>
            <span>JSON Validado</span>
            <span aria-hidden="true">·</span>
            <span>Tipado ReadingModule</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Gestión y Exportación JSON
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Descarga o copia el módulo en formato JSON estructurado, o importa cualquier archivo JSON externo con el tipado de IELTS/CEFR.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Schema Selector */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setSchemaFormat('standard')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                schemaFormat === 'standard'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Estándar (snake_case)
            </button>
            <button
              onClick={() => setSchemaFormat('extended')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                schemaFormat === 'extended'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Extendido (+Examiner)
            </button>
          </div>

          <button
            onClick={onOpenImport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 shadow-2xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importar JSON</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copiar JSON</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar .json</span>
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 shadow-md overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3 mb-3 font-mono">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-emerald-400" />
            <span>{schemaFormat === 'standard' ? 'reading_module.json (snake_case)' : 'reading_module_extended.json'}</span>
          </div>
          <span>{module.wordCount} words · {module.quiz.length} preguntas · {module.targetLevel}</span>
        </div>
        <pre className="text-xs font-mono text-emerald-400 overflow-x-auto max-h-[600px] leading-relaxed selection:bg-emerald-900 selection:text-white">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
