import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  BookOpen,
  ArrowRight,
  Quote,
  Target,
  Sparkles,
  Check,
  Eye,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import { QuizQuestion } from '../types/module';

interface QuizSectionProps {
  questions: QuizQuestion[];
  targetLevel: string;
  onNavigateTab?: (tab: 'passage' | 'vocab' | 'quiz' | 'json') => void;
}

const QUESTION_TYPE_LABELS: Record<string, string> = {
  main_idea: 'Idea Principal',
  detailed_fact: 'Detalle Específico',
  vocabulary_in_context: 'Vocabulario en Contexto',
  inferential_logic: 'Lógica e Inferencia',
};

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  targetLevel,
  onNavigateTab,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  const handleSelectOption = (questionId: number, optionKey: 'A' | 'B' | 'C' | 'D') => {
    // In exam mode, prevent change only after submission
    if (mode === 'exam' && isExamSubmitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsExamSubmitted(false);
  };

  const total = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  // Real-time calculation of correct and incorrect answers
  const correctCount = questions.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.correctAnswer ? 1 : 0);
  }, 0);

  const incorrectCount = questions.reduce((acc, q) => {
    const ans = selectedAnswers[q.id];
    return acc + (ans !== undefined && ans !== q.correctAnswer ? 1 : 0);
  }, 0);

  const accuracyRate = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const progressPercentage = Math.round((answeredCount / total) * 100);

  const getEstimatedBand = (correct: number, totalQuestions: number) => {
    const ratio = correct / totalQuestions;
    if (ratio === 1.0) return 'IELTS 8.5–9.0 (Experto / C2)';
    if (ratio >= 0.8) return 'IELTS 7.5–8.0 (Muy Bueno / C1+)';
    if (ratio >= 0.6) return 'IELTS 6.5–7.0 (Competente / C1)';
    if (ratio >= 0.4) return 'IELTS 5.5–6.0 (Aceptable / B2)';
    return 'IELTS ≤ 5.0 (En progreso / B1)';
  };

  const isRevealedForQuestion = (questionId: number) => {
    if (mode === 'practice') {
      return selectedAnswers[questionId] !== undefined;
    }
    return isExamSubmitted;
  };

  return (
    <div className="space-y-6">
      {/* Quiz Top Bar with Title and Mode Switcher */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span className="text-indigo-600 font-semibold">{targetLevel}</span>
            <span aria-hidden="true">·</span>
            <span>{questions.length} Preguntas de Opción Múltiple</span>
            <span aria-hidden="true">·</span>
            <span>Formato Académico IELTS</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Cuestionario de Comprensión Lectora
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Responde las preguntas para evaluar comprensión global, detalles específicos y deducciones inferenciales.
          </p>
        </div>

        {/* Mode Selector and Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setMode('practice')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mode === 'practice'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Modo Práctica (En Vivo)
            </button>
            <button
              onClick={() => setMode('exam')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mode === 'exam'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Modo Examen
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reiniciar respuestas"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* RASTREADOR DE PUNTUACIÓN EN TIEMPO REAL (Score Tracker Bar) */}
      <div className="sticky top-18 z-30 bg-white/95 backdrop-blur rounded-xl p-5 border-2 border-indigo-200/90 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Main Counter Indicator */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rastreador de Puntuación
                </span>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  En tiempo real
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  {correctCount}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  de {total} correctas acumuladas
                </span>
                {answeredCount > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md ml-1 border border-emerald-200">
                    {accuracyRate}% de precisión
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics & Projection */}
          <div className="flex items-center gap-5">
            <div className="hidden sm:block text-right border-r border-slate-200 pr-5">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Proyección de Banda
              </span>
              <span className="text-xs font-bold text-indigo-900">
                {getEstimatedBand(correctCount, total)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{correctCount} Acertadas</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 rounded-lg border border-rose-200 text-rose-800 text-xs font-semibold">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>{incorrectCount} Falladas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar & Question Step Indicators */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>
              Progreso del Cuestionario: {answeredCount} de {total} respondidas ({progressPercentage}%)
            </span>
            <span>
              {total - answeredCount === 0
                ? '¡Todas las preguntas respondidas!'
                : `${total - answeredCount} pendiente${total - answeredCount === 1 ? '' : 's'}`}
            </span>
          </div>

          {/* Linear Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(correctCount / total) * 100}%` }}
              title={`${correctCount} Correctas`}
            />
            <div
              className="bg-rose-500 h-full transition-all duration-300"
              style={{ width: `${(incorrectCount / total) * 100}%` }}
              title={`${incorrectCount} Incorrectas`}
            />
          </div>

          {/* Interactive Question Navigation Dots */}
          <div className="flex items-center gap-2 mt-3 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Preguntas:</span>
            {questions.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const isAnswered = userAns !== undefined;
              const isCorrect = userAns === q.correctAnswer;
              const showResult = isRevealedForQuestion(q.id);

              let badgeStyle = 'bg-slate-100 border-slate-200 text-slate-600';
              if (isAnswered) {
                if (showResult) {
                  badgeStyle = isCorrect
                    ? 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-2xs'
                    : 'bg-rose-600 border-rose-600 text-white font-bold shadow-2xs';
                } else {
                  badgeStyle = 'bg-indigo-600 border-indigo-600 text-white font-bold';
                }
              }

              return (
                <a
                  key={q.id}
                  href={`#question-${q.id}`}
                  className={`w-7 h-7 rounded-lg border text-xs flex items-center justify-center transition-all ${badgeStyle} hover:scale-105`}
                  title={`Pregunta ${idx + 1}: ${
                    !isAnswered
                      ? 'Sin responder'
                      : showResult
                      ? isCorrect
                        ? 'Correcta'
                        : 'Incorrecta'
                      : 'Respondida'
                  }`}
                >
                  {idx + 1}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mode Guidance Note */}
      <div className="bg-slate-100/70 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            {mode === 'practice'
              ? 'Estás en Modo Práctica: al marcar cada opción el rastreador suma tus aciertos al instante y te muestra la justificación oficial.'
              : 'Estás en Modo Examen: marca todas las opciones y pulsa "Evaluar Examen" para registrar la calificación final.'}
          </span>
        </div>
        {mode === 'exam' && !isExamSubmitted && (
          <button
            onClick={() => setIsExamSubmitted(true)}
            disabled={answeredCount === 0}
            className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-colors shadow-2xs"
          >
            Evaluar Examen ({answeredCount}/{total})
          </button>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-5">
        {questions.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isAnswered = userChoice !== undefined;
          const isCorrect = userChoice === q.correctAnswer;
          const showResult = isRevealedForQuestion(q.id);
          const typeLabel = QUESTION_TYPE_LABELS[q.questionType] || q.questionType;

          return (
            <div
              key={q.id}
              id={`question-${q.id}`}
              className={`bg-white rounded-xl p-6 border transition-all shadow-2xs ${
                showResult && isAnswered
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-rose-300 bg-rose-50/20'
                  : isAnswered
                  ? 'border-indigo-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-800 text-xs font-bold font-mono">
                    {idx + 1}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {typeLabel}
                  </span>
                </div>

                {/* Question Status Badge */}
                {showResult && isAnswered ? (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      isCorrect ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> +1 Punto (Correcta)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" /> Incorrecta (Respuesta: {q.correctAnswer})
                      </>
                    )}
                  </span>
                ) : isAnswered ? (
                  <span className="text-xs font-semibold text-indigo-700">
                    Respuesta marcada: [{userChoice}]
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Sin responder</span>
                )}
              </div>

              {/* Question Stem */}
              <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-4">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                  const optText = q.options[optKey];
                  const isSelected = userChoice === optKey;
                  const isRightAnswer = q.correctAnswer === optKey;

                  let optionStyle =
                    'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50';

                  if (showResult && isAnswered) {
                    if (isRightAnswer) {
                      optionStyle =
                        'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-400';
                    } else if (isSelected && !isRightAnswer) {
                      optionStyle =
                        'border-rose-400 bg-rose-50 text-rose-950 font-medium line-through';
                    } else {
                      optionStyle = 'border-slate-200 bg-slate-50 text-slate-400';
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium shadow-2xs';
                  }

                  return (
                    <button
                      key={optKey}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optKey)}
                      className={`w-full text-left p-3 rounded-lg border text-xs flex items-start gap-3 transition-colors ${optionStyle}`}
                    >
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[11px] font-bold shrink-0 ${
                          showResult && isAnswered && isRightAnswer
                            ? 'bg-emerald-600 text-white'
                            : isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {optKey}
                      </span>
                      <span className="leading-relaxed pt-0.5">{optText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Evidence Quote */}
              {showResult && isAnswered && (
                <div className="mt-4 pt-4 border-t border-slate-200/70 space-y-2.5 text-xs animate-in fade-in duration-150">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-1">
                      Justificación Pedagógica:
                    </span>
                    {q.explanation}
                  </div>

                  {q.evidenceQuote && (
                    <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-amber-950 leading-relaxed">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                        <Quote className="w-3.5 h-3.5 text-amber-700" />
                        <span>Evidencia Textual en el Pasaje:</span>
                      </div>
                      <p className="font-serif italic text-amber-900">
                        "{q.evidenceQuote}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Card back to Reading Passage or Key Vocabulary */}
      {onNavigateTab && (
        <div className="bg-gradient-to-r from-amber-50/50 via-white to-indigo-50/50 rounded-2xl p-6 border-2 border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold">
              <span>Navegación del Módulo</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              ¿Deseas repasar el material?
            </h3>
            <p className="text-xs text-slate-600 max-w-xl">
              Puedes regresar a verificar los términos en las Flashcards o releer los párrafos del pasaje académico.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                onNavigateTab('vocab');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>← Repasar Key Vocabulary</span>
            </button>
            <button
              onClick={() => {
                onNavigateTab('passage');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-transform active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>← Releer Reading Passage</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
