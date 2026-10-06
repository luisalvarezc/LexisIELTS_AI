import React, { useState } from 'react';
import {
  Volume2,
  Pause,
  Play,
  Square,
  Sparkles,
  Loader2,
  SlidersHorizontal,
  ChevronDown,
  Info,
} from 'lucide-react';
import {
  useAudioVoice,
  GEMINI_VOICES,
  GeminiVoiceName,
  AudioEngine,
} from '../context/AudioVoiceContext';
import { isIOS } from '../utils/speech';

interface AudioPlayerBarProps {
  textToRead: string;
  label?: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  textToRead,
  label = 'Lectura Académica en Voz Alta',
}) => {
  const {
    audioEngine,
    setAudioEngine,
    geminiVoice,
    setGeminiVoice,
    voiceGender,
    setVoiceGender,
    selectedVoiceURI,
    setSelectedVoiceURI,
    availableVoices,
    playbackRate,
    setPlaybackRate,
    isPlaying,
    isGeneratingAudio,
    activeText,
    currentTime,
    duration,
    seekTo,
    speak,
    pause,
    resume,
    stop,
  } = useAudioVoice();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMobileTip, setShowMobileTip] = useState(false);

  const isCurrentTextActive = activeText === textToRead;

  const handleTogglePlay = () => {
    if (isPlaying && isCurrentTextActive) {
      pause();
    } else if (!isPlaying && isCurrentTextActive && duration > 0) {
      resume();
    } else {
      if (isIOS()) {
        setShowMobileTip(true);
      }
      speak(textToRead);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seekTo(newTime);
  };

  const currentGeminiVoiceObj = GEMINI_VOICES.find((v) => v.name === geminiVoice) || GEMINI_VOICES[0];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-2xs space-y-3 overflow-hidden min-w-0 transition-colors">
      {/* Top row: Main Controls, Engine Badge and Voice Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full min-w-0">
        {/* Play / Pause / Loading button */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={handleTogglePlay}
            disabled={isGeneratingAudio}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer ${
              isGeneratingAudio
                ? 'bg-indigo-400 dark:bg-indigo-500 text-white cursor-wait'
                : isPlaying && isCurrentTextActive
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none active:scale-95'
            }`}
          >
            {isGeneratingAudio ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando voz natural...</span>
              </>
            ) : isPlaying && isCurrentTextActive ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Escuchar Pasaje</span>
              </>
            )}
          </button>

          {(isPlaying || currentTime > 0) && isCurrentTextActive && (
            <button
              onClick={stop}
              title="Detener audio y reiniciar"
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          {/* Sound waves animation indicator */}
          {isPlaying && isCurrentTextActive && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-lg text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
              <span className="flex gap-0.5 items-end h-3">
                <span className="w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms] h-2"></span>
                <span className="w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms] h-3"></span>
                <span className="w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms] h-2.5"></span>
              </span>
              <span className="text-[11px] ml-1">Reproduciendo</span>
            </div>
          )}
        </div>

        {/* Right side: Voice selectors and quality switcher */}
        <div className="flex flex-wrap items-center gap-2 text-xs min-w-0">
          {audioEngine === 'gemini_ai' ? (
            /* Gemini Natural AI Voice Persona Selector */
            <div className="flex flex-wrap items-center gap-1 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 p-0.5 rounded-lg shadow-2xs max-w-full min-w-0">
              <div className="px-1.5 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">Voz IA:</span>
              </div>
              <div className="flex flex-wrap items-center gap-0.5 min-w-0">
                {GEMINI_VOICES.map((gv) => (
                  <button
                    key={gv.name}
                    onClick={() => {
                      setGeminiVoice(gv.name);
                      if (isPlaying && isCurrentTextActive) {
                        stop();
                        speak(textToRead);
                      }
                    }}
                    title={`${gv.displayName} — ${gv.description}`}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
                      geminiVoice === gv.name
                        ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {gv.gender === 'female' ? '👩' : '👨'} {gv.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Browser SpeechSynthesis voice selector fallback */
            <div className="flex items-center p-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xs font-medium shrink-0">
              <button
                onClick={() => setVoiceGender('female')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-colors ${
                  voiceGender === 'female'
                    ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>👩 Femenina</span>
              </button>
              <button
                onClick={() => setVoiceGender('male')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-colors ${
                  voiceGender === 'male'
                    ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>👨 Masculina</span>
              </button>
            </div>
          )}

          {/* Speed Selector */}
          <div className="flex items-center p-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xs shrink-0">
            {[0.85, 1.0, 1.15].map((rate) => (
              <button
                key={rate}
                onClick={() => setPlaybackRate(rate)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  playbackRate === rate
                    ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Toggle Engine Dropdown Settings */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            title="Opciones de motor de voz"
            className="p-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar & Scrubber (when Gemini AI audio is loaded) */}
      {duration > 0 && isCurrentTextActive && (
        <div className="pt-1 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold px-0.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="relative w-full flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Footer information banner */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/70 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          {audioEngine === 'gemini_ai' ? (
            <span>
              <strong>Voz de Estudio Humana Activa:</strong> {currentGeminiVoiceObj.displayName} — {currentGeminiVoiceObj.description}.
            </span>
          ) : (
            <span>
              <strong>Voz del Navegador:</strong> Síntesis local del sistema operativo ({voiceGender === 'female' ? 'Femenina' : 'Masculina'}).
            </span>
          )}
        </div>

        {/* Engine switcher link */}
        <button
          onClick={() => {
            const nextEngine = audioEngine === 'gemini_ai' ? 'browser' : 'gemini_ai';
            setAudioEngine(nextEngine);
            if (isPlaying) stop();
          }}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold hover:underline cursor-pointer"
        >
          {audioEngine === 'gemini_ai' ? 'Cambiar a voz local del navegador' : '✨ Activar Voz de Estudio Humana (Gemini AI)'}
        </button>
      </div>

      {/* Advanced Settings Drawer */}
      {showAdvanced && (
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-2 mt-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-100">Motor de Reproducción de Audio:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAudioEngine('gemini_ai')}
                className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                  audioEngine === 'gemini_ai'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                ✨ Gemini 3.8 Studio TTS (Humana HD)
              </button>
              <button
                onClick={() => setAudioEngine('browser')}
                className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                  audioEngine === 'browser'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Voz del Navegador (Offline)
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            La <strong>Voz de Estudio Humana</strong> usa el modelo de audio neural <em>gemini-3.8-flash-lite-tts</em> para entonación nativa, pausas naturales entre párrafos y cadencia de examinador IELTS, eliminando cualquier sonido robótico.
          </p>
        </div>
      )}

      {/* Mobile Silent Switch Reminder for iOS */}
      {showMobileTip && isPlaying && (
        <div className="text-[11px] text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-lg p-2.5 flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <span>
            🔊 <strong>Tip para iPhone:</strong> Si no escuchas sonido, verifica que el interruptor lateral de silencio de tu iPhone esté desactivado y sube el volumen.
          </span>
          <button
            onClick={() => setShowMobileTip(false)}
            className="text-amber-800 dark:text-amber-300 hover:text-amber-950 font-bold px-1.5 py-0.5 text-xs"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
