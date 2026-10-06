import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { unlockMobileAudio, stopSpeech, isIOS } from '../utils/speech';

export type VoiceGender = 'female' | 'male';
export type GeminiVoiceName = 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir';
export type AudioEngine = 'gemini_ai' | 'browser';

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  gender: VoiceGender;
  displayName: string;
}

export interface GeminiVoiceOption {
  name: GeminiVoiceName;
  gender: VoiceGender;
  displayName: string;
  description: string;
}

export const GEMINI_VOICES: GeminiVoiceOption[] = [
  {
    name: 'Kore',
    gender: 'female',
    displayName: 'Kore (Femenina)',
    description: 'Voz humana natural, articulación académica impecable y ritmo fluido',
  },
  {
    name: 'Puck',
    gender: 'male',
    displayName: 'Puck (Masculina)',
    description: 'Voz humana clara, elocuente y juvenil con pronunciación nativa',
  },
  {
    name: 'Zephyr',
    gender: 'female',
    displayName: 'Zephyr (Femenina Suave)',
    description: 'Tono tranquilo, dicción clara y cadencia pausada',
  },
  {
    name: 'Fenrir',
    gender: 'male',
    displayName: 'Fenrir (Masculina Resonante)',
    description: 'Voz académica profunda, formal y de gran presencia',
  },
];

interface AudioVoiceContextType {
  audioEngine: AudioEngine;
  setAudioEngine: (engine: AudioEngine) => void;
  geminiVoice: GeminiVoiceName;
  setGeminiVoice: (voice: GeminiVoiceName) => void;
  voiceGender: VoiceGender;
  setVoiceGender: (gender: VoiceGender) => void;
  selectedVoiceURI: string;
  setSelectedVoiceURI: (uri: string) => void;
  availableVoices: VoiceOption[];
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  isPlaying: boolean;
  isGeneratingAudio: boolean;
  activeText: string | null;
  currentTime: number;
  duration: number;
  seekTo: (time: number) => void;
  speak: (text: string, options?: { rate?: number; onEnd?: () => void; engine?: AudioEngine }) => Promise<boolean>;
  speakInstant: (text: string, options?: { rate?: number; onEnd?: () => void }) => boolean;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

const AudioVoiceContext = createContext<AudioVoiceContextType | undefined>(undefined);

const ENGINE_STORAGE_KEY = 'lexis_audio_engine';
const GEMINI_VOICE_STORAGE_KEY = 'lexis_gemini_voice_name';
const GENDER_STORAGE_KEY = 'lexis_global_voice_gender';
const VOICE_URI_STORAGE_KEY = 'lexis_global_voice_uri';
const RATE_STORAGE_KEY = 'lexis_global_playback_rate';

// In-memory cache for generated base64 wav audios
const audioCache = new Map<string, string>();

const FEMALE_KEYWORDS = [
  'samantha', 'victoria', 'karen', 'serena', 'moira', 'fiona', 'tessa',
  'stephanie', 'jenny', 'aria', 'zira', 'female', 'susan', 'ava', 'allison',
  'natural (female)', 'google us english'
];

const MALE_KEYWORDS = [
  'daniel', 'oliver', 'alex', 'arthur', 'gordon', 'aaron', 'guy', 'david',
  'george', 'male', 'tom', 'rishi', 'natural (male)', 'google uk english male'
];

function classifyVoiceGender(voice: SpeechSynthesisVoice): VoiceGender {
  const nameLower = voice.name.toLowerCase();
  if (FEMALE_KEYWORDS.some((k) => nameLower.includes(k))) return 'female';
  if (MALE_KEYWORDS.some((k) => nameLower.includes(k))) return 'male';
  return 'female';
}

function splitIntoSentenceChunks(text: string): string[] {
  const rawSentences = text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of rawSentences) {
    if ((currentChunk + ' ' + sentence).length < 180) {
      currentChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks.length > 0 ? chunks : [text];
}

export const AudioVoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Audio Engine: default to Gemini AI for natural human voice
  const [audioEngine, setAudioEngineState] = useState<AudioEngine>(() => {
    try {
      const saved = localStorage.getItem(ENGINE_STORAGE_KEY);
      if (saved === 'gemini_ai' || saved === 'browser') return saved;
    } catch {}
    return 'gemini_ai';
  });

  const [geminiVoice, setGeminiVoiceState] = useState<GeminiVoiceName>(() => {
    try {
      const saved = localStorage.getItem(GEMINI_VOICE_STORAGE_KEY);
      if (saved === 'Kore' || saved === 'Puck' || saved === 'Zephyr' || saved === 'Fenrir') return saved;
    } catch {}
    return 'Kore';
  });

  const [voiceGender, setVoiceGenderState] = useState<VoiceGender>(() => {
    try {
      const saved = localStorage.getItem(GENDER_STORAGE_KEY);
      if (saved === 'female' || saved === 'male') return saved;
    } catch {}
    return 'female';
  });

  const [selectedVoiceURI, setSelectedVoiceURIState] = useState<string>(() => {
    try {
      return localStorage.getItem(VOICE_URI_STORAGE_KEY) || '';
    } catch {}
    return '';
  });

  const [playbackRate, setPlaybackRateState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(RATE_STORAGE_KEY);
      if (saved) return parseFloat(saved) || 1.0;
    } catch {}
    return 1.0;
  });

  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [activeText, setActiveText] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // HTML5 Audio element for Gemini AI synthesized audio
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const isSpeakingActiveRef = useRef(false);
  const onEndCallbackRef = useRef<(() => void) | undefined>(undefined);

  // Initialize or get audio element
  useEffect(() => {
    if (!audioElementRef.current) {
      const audio = new Audio();
      audio.preload = 'auto';

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.onloadedmetadata = () => {
        if (!isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setActiveText(null);
        setCurrentTime(0);
        onEndCallbackRef.current?.();
      };

      audio.onerror = (e) => {
        console.warn('Audio playback error:', e);
        setIsPlaying(false);
        setIsGeneratingAudio(false);
        setActiveText(null);
      };

      audioElementRef.current = audio;
    }

    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
      }
    };
  }, []);

  // Sync playback rate with audio element
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Load browser fallback voices
  const loadVoices = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    const sysVoices = window.speechSynthesis.getVoices();
    if (!sysVoices || sysVoices.length === 0) return;

    const enVoices = sysVoices.filter((v) => v.lang.startsWith('en'));
    const pool = enVoices.length > 0 ? enVoices : sysVoices;

    const classified: VoiceOption[] = pool.map((v) => {
      const gender = classifyVoiceGender(v);
      const cleanName = v.name.replace(/Google\s+|Microsoft\s+|Apple\s+/gi, '').trim();
      return {
        voice: v,
        gender,
        displayName: `${cleanName} (${v.lang})`,
      };
    });

    setAvailableVoices(classified);

    setSelectedVoiceURIState((currentUri) => {
      if (currentUri && classified.some((cv) => cv.voice.voiceURI === currentUri)) {
        return currentUri;
      }
      const matchGender = classified.find((cv) => cv.gender === voiceGender);
      const chosen = matchGender || classified[0];
      return chosen ? chosen.voice.voiceURI : '';
    });
  }, [voiceGender]);

  useEffect(() => {
    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [loadVoices]);

  const setAudioEngine = (engine: AudioEngine) => {
    setAudioEngineState(engine);
    try {
      localStorage.setItem(ENGINE_STORAGE_KEY, engine);
    } catch {}
  };

  const setGeminiVoice = (voice: GeminiVoiceName) => {
    setGeminiVoiceState(voice);
    const voiceObj = GEMINI_VOICES.find((v) => v.name === voice);
    if (voiceObj) {
      setVoiceGenderState(voiceObj.gender);
    }
    try {
      localStorage.setItem(GEMINI_VOICE_STORAGE_KEY, voice);
    } catch {}
  };

  const setVoiceGender = (gender: VoiceGender) => {
    setVoiceGenderState(gender);
    try {
      localStorage.setItem(GENDER_STORAGE_KEY, gender);
    } catch {}

    // Also sync Gemini voice to default for this gender
    if (gender === 'male' && (geminiVoice === 'Kore' || geminiVoice === 'Zephyr')) {
      setGeminiVoice('Puck');
    } else if (gender === 'female' && (geminiVoice === 'Puck' || geminiVoice === 'Fenrir')) {
      setGeminiVoice('Kore');
    }

    const match = availableVoices.find((v) => v.gender === gender);
    if (match) {
      setSelectedVoiceURIState(match.voice.voiceURI);
      try {
        localStorage.setItem(VOICE_URI_STORAGE_KEY, match.voice.voiceURI);
      } catch {}
    }
  };

  const setSelectedVoiceURI = (uri: string) => {
    setSelectedVoiceURIState(uri);
    try {
      localStorage.setItem(VOICE_URI_STORAGE_KEY, uri);
    } catch {}

    const matchedVoice = availableVoices.find((v) => v.voice.voiceURI === uri);
    if (matchedVoice) {
      setVoiceGenderState(matchedVoice.gender);
      try {
        localStorage.setItem(GENDER_STORAGE_KEY, matchedVoice.gender);
      } catch {}
    }
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    try {
      localStorage.setItem(RATE_STORAGE_KEY, rate.toString());
    } catch {}
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = rate;
    }
  };

  const pause = useCallback(() => {
    if (audioElementRef.current && !audioElementRef.current.paused) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (audioElementRef.current && audioElementRef.current.src && audioElementRef.current.paused) {
      audioElementRef.current.play();
      setIsPlaying(true);
    } else if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  }, []);

  const stop = useCallback(() => {
    isSpeakingActiveRef.current = false;
    setIsPlaying(false);
    setIsGeneratingAudio(false);
    setActiveText(null);
    setCurrentTime(0);

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    stopSpeech();
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioElementRef.current && !isNaN(time)) {
      audioElementRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Instant local speech synthesis for vocabulary terms and single words (0ms latency)
  const speakInstant = useCallback(
    (text: string, options?: { rate?: number; onEnd?: () => void }): boolean => {
      unlockMobileAudio();
      stop();

      if (!('speechSynthesis' in window)) return false;

      const rate = options?.rate ?? playbackRate;
      onEndCallbackRef.current = options?.onEnd;

      let targetVoice: SpeechSynthesisVoice | null = null;
      if (selectedVoiceURI) {
        const found = availableVoices.find((v) => v.voice.voiceURI === selectedVoiceURI);
        if (found) targetVoice = found.voice;
      }
      if (!targetVoice) {
        const matchGender = availableVoices.find((v) => v.gender === voiceGender);
        targetVoice = matchGender?.voice || availableVoices[0]?.voice || null;
      }

      const youthPitch = voiceGender === 'female' ? 1.12 : 1.06;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetVoice?.lang || 'en-GB';
      utterance.rate = rate;
      utterance.pitch = youthPitch;
      if (targetVoice) utterance.voice = targetVoice;

      utterance.onstart = () => {
        setIsPlaying(true);
        setActiveText(text);
      };
      utterance.onend = () => {
        setIsPlaying(false);
        setActiveText(null);
        onEndCallbackRef.current?.();
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        setActiveText(null);
        onEndCallbackRef.current?.();
      };

      // Execute immediately within user click gesture stack
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
      return true;
    },
    [availableVoices, selectedVoiceURI, voiceGender, playbackRate, stop]
  );

  // Speak method supporting both Gemini Studio AI (High Fidelity) and Browser Fallback
  const speak = useCallback(
    async (text: string, options?: { rate?: number; onEnd?: () => void; engine?: AudioEngine }): Promise<boolean> => {
      unlockMobileAudio();
      stop();

      const rate = options?.rate ?? playbackRate;
      const chosenEngine = options?.engine ?? audioEngine;
      onEndCallbackRef.current = options?.onEnd;

      // 1. Try Gemini 3.8 Flash Lite TTS Studio Voice
      if (chosenEngine === 'gemini_ai') {
        const cacheKey = `${geminiVoice}_${text.trim()}`;
        setActiveText(text);
        setIsGeneratingAudio(true);

        try {
          let audioSrc = audioCache.get(cacheKey);

          if (!audioSrc) {
            const res = await fetch('/api/synthesize-speech', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: text.trim(),
                voiceName: geminiVoice,
                gender: voiceGender,
              }),
            });

            if (!res.ok) {
              throw new Error(`Speech synthesis HTTP ${res.status}`);
            }

            const data = await res.json();
            if (!data.audioBase64) {
              throw new Error('No audio returned');
            }

            audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
            audioCache.set(cacheKey, audioSrc);
          }

          if (audioElementRef.current) {
            audioElementRef.current.src = audioSrc;
            audioElementRef.current.playbackRate = rate;
            setIsGeneratingAudio(false);
            setIsPlaying(true);
            await audioElementRef.current.play();
            return true;
          }
        } catch (err) {
          console.warn('Gemini TTS failed or unavailable, falling back to browser synthesis:', err);
          setIsGeneratingAudio(false);
          // Fall through to browser speech synthesis fallback below
        }
      }

      // 2. Browser SpeechSynthesis Fallback
      if (!('speechSynthesis' in window)) return false;

      let targetVoice: SpeechSynthesisVoice | null = null;
      if (selectedVoiceURI) {
        const found = availableVoices.find((v) => v.voice.voiceURI === selectedVoiceURI);
        if (found) targetVoice = found.voice;
      }
      if (!targetVoice) {
        const matchGender = availableVoices.find((v) => v.gender === voiceGender);
        targetVoice = matchGender?.voice || availableVoices[0]?.voice || null;
      }

      const youthPitch = voiceGender === 'female' ? 1.12 : 1.06;

      // Short words
      if (text.length < 120) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetVoice?.lang || 'en-GB';
        utterance.rate = rate;
        utterance.pitch = youthPitch;
        if (targetVoice) utterance.voice = targetVoice;

        utterance.onstart = () => {
          setIsPlaying(true);
          setActiveText(text);
        };
        utterance.onend = () => {
          setIsPlaying(false);
          setActiveText(null);
          onEndCallbackRef.current?.();
        };
        utterance.onerror = () => {
          setIsPlaying(false);
          setActiveText(null);
          onEndCallbackRef.current?.();
        };

        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);
        return true;
      }

      // Longer paragraphs
      const chunks = splitIntoSentenceChunks(text);
      isSpeakingActiveRef.current = true;
      setIsPlaying(true);
      setActiveText(text);
      let currentChunkIndex = 0;

      const speakNextChunk = () => {
        if (!isSpeakingActiveRef.current || currentChunkIndex >= chunks.length) {
          isSpeakingActiveRef.current = false;
          setIsPlaying(false);
          setActiveText(null);
          onEndCallbackRef.current?.();
          return;
        }

        const chunkText = chunks[currentChunkIndex];
        currentChunkIndex++;

        const utterance = new SpeechSynthesisUtterance(chunkText);
        utterance.lang = targetVoice?.lang || 'en-GB';
        utterance.rate = rate;
        utterance.pitch = youthPitch;
        if (targetVoice) utterance.voice = targetVoice;

        utterance.onend = () => {
          if (isSpeakingActiveRef.current) {
            speakNextChunk();
          }
        };

        utterance.onerror = () => {
          if (isSpeakingActiveRef.current) {
            speakNextChunk();
          }
        };

        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);
      };

      setTimeout(() => {
        window.speechSynthesis.resume();
        speakNextChunk();
      }, 15);

      return true;
    },
    [geminiVoice, voiceGender, availableVoices, selectedVoiceURI, playbackRate, audioEngine, stop]
  );

  return (
    <AudioVoiceContext.Provider
      value={{
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
        speakInstant,
        pause,
        resume,
        stop,
      }}
    >
      {children}
    </AudioVoiceContext.Provider>
  );
};

export function useAudioVoice(): AudioVoiceContextType {
  const context = useContext(AudioVoiceContext);
  if (!context) {
    throw new Error('useAudioVoice must be used within an AudioVoiceProvider');
  }
  return context;
}
