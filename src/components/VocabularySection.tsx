import React, { useState, useEffect, useCallback } from 'react';
import {
  Volume2,
  BookA,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
  CheckCircle2,
  BookmarkCheck,
  HelpCircle,
  ArrowRightLeft,
  Keyboard,
  ArrowRight,
  BookOpen,
  Target,
} from 'lucide-react';
import { VocabularyItem } from '../types/module';
import { useAudioVoice, VoiceGender } from '../context/AudioVoiceContext';

interface VocabularySectionProps {
  vocabulary: VocabularyItem[];
  targetLevel: string;
  onNavigateTab?: (tab: 'passage' | 'vocab' | 'quiz' | 'json') => void;
}

export const VocabularySection: React.FC<VocabularySectionProps> = ({
  vocabulary,
  targetLevel,
  onNavigateTab,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'flashcards'>('flashcards');
  const [cards, setCards] = useState<VocabularyItem[]>(vocabulary);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyDirection, setStudyDirection] = useState<'term_first' | 'def_first'>('term_first');
  const [masteredTerms, setMasteredTerms] = useState<Set<string>>(new Set());
  const [speakingTerm, setSpeakingTerm] = useState<string | null>(null);

  // Global Audio Voice Context
  const { voiceGender, setVoiceGender, speakInstant, isPlaying, activeText } = useAudioVoice();

  // Sync cards when vocabulary changes
  useEffect(() => {
    setCards(vocabulary);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredTerms(new Set());
  }, [vocabulary]);

  const activeCard = cards[currentIndex] || cards[0];

  const handleVoiceGenderChange = (gender: VoiceGender) => {
    setVoiceGender(gender);
  };

  const speakWord = (text: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setSpeakingTerm(text);
    speakInstant(text, {
      onEnd: () => setSpeakingTerm(null),
    });
  };

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const handleToggleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const toggleMastered = (term: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMasteredTerms((prev) => {
      const updated = new Set(prev);
      if (updated.has(term)) {
        updated.delete(term);
      } else {
        updated.add(term);
      }
      return updated;
    });
  };

  // Keyboard navigation for power study (Space: flip, ArrowLeft: prev, ArrowRight: next)
  useEffect(() => {
    if (viewMode !== 'flashcards') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleNext, handlePrev]);

  const isCurrentMastered = activeCard && masteredTerms.has(activeCard.term);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{targetLevel}</span>
            <span aria-hidden="true">·</span>
            <span>{vocabulary.length} Términos Académicos</span>
            <span aria-hidden="true">·</span>
            <span>
              {masteredTerms.size} de {vocabulary.length} Dominados
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Vocabulario Académico y Flashcards
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Entrena tu retención activa alternando entre el término formal y su definición académica para consolidar el vocabulario del examen.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold border border-slate-200/80 dark:border-slate-700">
          <button
            onClick={() => setViewMode('flashcards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'flashcards'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Modo Flashcards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookA className="w-3.5 h-3.5" />
            Tabla Completa
          </button>
        </div>
      </div>

      {viewMode === 'flashcards' ? (
        /* INTERACTIVE 3D FLASHCARD DECK */
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Deck Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Tarjeta {currentIndex + 1} de {cards.length}
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <button
                onClick={() =>
                  setStudyDirection((prev) =>
                    prev === 'term_first' ? 'def_first' : 'term_first'
                  )
                }
                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                title="Cambiar orientación de estudio (Término primero o Definición primero)"
              >
                <ArrowRightLeft className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                <span>
                  {studyDirection === 'term_first' ? 'Término → Definición' : 'Definición → Término'}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Voice Gender Switcher */}
              <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-0.5 text-[11px]">
                <button
                  onClick={() => handleVoiceGenderChange('female')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                    voiceGender === 'female'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Voz Femenina Juvenil"
                >
                  👩 Femenina
                </button>
                <button
                  onClick={() => handleVoiceGenderChange('male')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                    voiceGender === 'male'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Voz Masculina Juvenil"
                >
                  👨 Masculina
                </button>
              </div>

              <button
                onClick={handleShuffle}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-[11px] cursor-pointer"
                title="Barajar tarjetas"
              >
                <Shuffle className="w-3 h-3" />
                <span>Barajar</span>
              </button>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/50 dark:border-slate-700">
                <Keyboard className="w-3 h-3" /> [Espacio]
              </span>
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={handleToggleFlip}
            style={{ perspective: '1200px' }}
            className="cursor-pointer select-none"
          >
            <div
              className="relative w-full min-h-[300px] transition-transform duration-500 ease-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* FRONT FACE (Término o Definición según modo) */}
              <div
                className="absolute inset-0 w-full h-full bg-white dark:bg-slate-900 rounded-2xl p-7 sm:p-9 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-md flex flex-col justify-between items-center text-center hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Front Header */}
                <div className="w-full flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                  <span className="font-mono italic uppercase tracking-wider text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-semibold border border-slate-200/50 dark:border-slate-700">
                    {activeCard.partOfSpeech}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => speakWord(activeCard.term, e)}
                      title="Escuchar pronunciación instantánea"
                      className={`p-2 rounded-full transition-all cursor-pointer ${
                        speakingTerm === activeCard.term
                          ? 'bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-400 scale-110 shadow-xs animate-pulse'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => toggleMastered(activeCard.term, e)}
                      title={isCurrentMastered ? 'Marcar como por repasar' : 'Marcar como dominada'}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        isCurrentMastered
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                          : 'text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Front Content */}
                <div className="my-auto py-4 space-y-3 max-w-lg">
                  {studyDirection === 'term_first' ? (
                    <>
                      <span className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight block">
                        {activeCard.term}
                      </span>
                      {activeCard.collocation && (
                        <span className="inline-block text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 px-2.5 py-0.5 rounded-full">
                          Colocación: {activeCard.collocation}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                        "{activeCard.definition}"
                      </p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                        ¿Cuál es el término académico en inglés?
                      </p>
                    </>
                  )}
                </div>

                {/* Front Footer Prompt */}
                <div className="w-full flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                    <RotateCw className="w-3.5 h-3.5" /> Clic o [Espacio] para voltear
                  </span>
                  <span>{studyDirection === 'term_first' ? 'Ver definición' : 'Ver término'}</span>
                </div>
              </div>

              {/* BACK FACE (Definición o Término según modo) */}
              <div
                className="absolute inset-0 w-full h-full bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-7 sm:p-9 border-2 border-slate-800 dark:border-slate-800 shadow-xl flex flex-col justify-between items-center text-center"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                {/* Back Header */}
                <div className="w-full flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono uppercase tracking-wider text-[11px] bg-slate-800 px-2 py-0.5 rounded text-indigo-300 font-semibold">
                    {studyDirection === 'term_first' ? 'Definición & Contexto' : 'Término Oficial'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => speakWord(activeCard.term, e)}
                      title="Escuchar pronunciación instantánea"
                      className={`p-2 rounded-full transition-all cursor-pointer ${
                        speakingTerm === activeCard.term
                          ? 'bg-indigo-950 text-indigo-300 ring-2 ring-indigo-500 scale-110 shadow-xs animate-pulse'
                          : 'hover:bg-slate-800 text-slate-300 hover:text-white active:scale-95'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => toggleMastered(activeCard.term, e)}
                      title={isCurrentMastered ? 'Desmarcar' : 'Marcar como dominada'}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        isCurrentMastered
                          ? 'text-emerald-400 bg-emerald-950/60'
                          : 'text-slate-500 hover:text-emerald-400'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Back Content */}
                <div className="my-auto py-3 space-y-3.5 max-w-lg">
                  {studyDirection === 'term_first' ? (
                    <>
                      <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                        {activeCard.definition}
                      </p>
                      {activeCard.collocation && (
                        <div className="text-xs font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-800/60 px-3 py-1 rounded-full inline-block">
                          Colocación clave: {activeCard.collocation}
                        </div>
                      )}
                      <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700/60 text-xs font-serif italic text-slate-300 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 not-italic">
                            En el texto de lectura:
                          </span>
                          <button
                            onClick={(e) => speakWord(activeCard.contextSentence, e)}
                            title="Escuchar oración completa en contexto"
                            className="inline-flex items-center gap-1 text-[11px] font-sans not-italic text-indigo-300 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-700/50 transition-colors cursor-pointer"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Escuchar oración</span>
                          </button>
                        </div>
                        "{activeCard.contextSentence}"
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight block">
                        {activeCard.term}
                      </span>
                      <span className="text-xs text-slate-400 font-mono italic">
                        ({activeCard.partOfSpeech})
                      </span>
                      {activeCard.collocation && (
                        <div className="text-xs font-semibold text-indigo-300 bg-indigo-950/50 border border-indigo-800/60 px-3 py-1 rounded-full inline-block">
                          Colocación: {activeCard.collocation}
                        </div>
                      )}
                      <p className="text-xs font-serif italic text-slate-300">
                        "{activeCard.contextSentence}"
                      </p>
                    </>
                  )}
                </div>

                {/* Back Footer */}
                <div className="w-full flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span className="flex items-center gap-1 text-indigo-300 font-semibold">
                    <RotateCw className="w-3.5 h-3.5" /> Volver al frente
                  </span>
                  <span>{activeCard.term}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flashcard Navigation & Mastery Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {/* Quick Step Indicators */}
            <div className="flex items-center gap-1.5">
              {cards.map((c, i) => {
                const isMastered = masteredTerms.has(c.term);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentIndex(i);
                    }}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      currentIndex === i
                        ? 'w-7 bg-indigo-600 dark:bg-indigo-500'
                        : isMastered
                        ? 'w-2.5 bg-emerald-500'
                        : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                    }`}
                    title={`${c.term} (${isMastered ? 'Dominada' : 'Por repasar'})`}
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => toggleMastered(activeCard.term, e)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  isCurrentMastered
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                title="Marcar si ya te sabes este término"
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    isCurrentMastered ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{isCurrentMastered ? 'Dominada' : 'Marcar Dominada'}</span>
              </button>

              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th scope="col" className="px-5 py-3.5 w-1/4">
                    Término & Categoría
                  </th>
                  <th scope="col" className="px-5 py-3.5 w-1/3">
                    Definición Académica
                  </th>
                  <th scope="col" className="px-5 py-3.5 w-1/3">
                    Uso en el Pasaje de Lectura
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Colocación
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {vocabulary.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.term}
                        </span>
                        <button
                          onClick={() => speakWord(item.term)}
                          title="Pronunciar término instantáneamente"
                          className={`p-1.5 rounded transition-all cursor-pointer ${
                            speakingTerm === item.term
                              ? 'bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-300 scale-105'
                              : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 italic mt-0.5 block">
                        ({item.partOfSpeech})
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.definition}
                    </td>
                    <td className="px-5 py-4 align-top font-serif text-slate-600 dark:text-slate-300 italic leading-relaxed">
                      <div className="flex items-start gap-1.5">
                        <button
                          onClick={() => speakWord(item.contextSentence)}
                          title="Escuchar oración completa en contexto"
                          className={`p-1 rounded transition-all shrink-0 mt-0.5 cursor-pointer ${
                            speakingTerm === item.contextSentence
                              ? 'bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-300 scale-105'
                              : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span>"{item.contextSentence}"</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      {item.collocation ? (
                        <span className="inline-block bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-[11px] font-medium px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800">
                          {item.collocation}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Next Step Section Card */}
      {onNavigateTab && (
        <div className="bg-gradient-to-r from-indigo-50 dark:from-slate-900 via-white dark:via-slate-900/90 to-amber-50/40 dark:to-indigo-950/30 rounded-2xl p-6 border-2 border-indigo-200/80 dark:border-indigo-800/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 transition-colors">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200/60 dark:border-indigo-800">
              <span>Siguiente Fase del Módulo</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ¿Listo para poner a prueba tu aprendizaje?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
              Continúa al <strong>Comprehension Quiz</strong> para responder las preguntas de opción múltiple con evidencias textuales, o regresa a releer el pasaje.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                onNavigateTab('passage');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>← Releer Reading Passage</span>
            </button>
            <button
              onClick={() => {
                onNavigateTab('quiz');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 dark:shadow-none transition-transform active:scale-95 cursor-pointer"
            >
              <Target className="w-4 h-4 text-amber-300" />
              <span>Comprehension Quiz</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
