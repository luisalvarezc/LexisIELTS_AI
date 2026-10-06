// Utility for robust SpeechSynthesis on Mobile (iOS Safari / Android Chrome) and Desktop
// with Female/Male voice selection and youthful pitch calibration.

let audioContext: AudioContext | null = null;
let isSpeakingActive = false;

export type VoiceGender = 'female' | 'male';

const VOICE_PREF_KEY = 'lexis_voice_gender';

export function getStoredVoiceGender(): VoiceGender {
  try {
    const saved = localStorage.getItem(VOICE_PREF_KEY);
    if (saved === 'female' || saved === 'male') {
      return saved;
    }
  } catch {
    // Ignore
  }
  return 'female'; // Default to friendly female voice
}

export function setStoredVoiceGender(gender: VoiceGender): void {
  try {
    localStorage.setItem(VOICE_PREF_KEY, gender);
  } catch {
    // Ignore
  }
}

/**
 * Mobile browsers require an explicit audio context unlock on user interaction
 * and may mute SpeechSynthesis if the phone's silent switch is active without WebAudio session activation.
 */
export function unlockMobileAudio(): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      if (!audioContext) {
        audioContext = new AudioCtx();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      // Play a tiny 1-sample silent buffer to activate the hardware audio pipeline
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
    }
  } catch {
    // Ignore
  }

  if ('speechSynthesis' in window) {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }
}

/**
 * Intelligent voice selector for English (IELTS British/American)
 * calibrated for clear, fresh, and youthful academic timbre.
 */
export function findBestVoice(gender: VoiceGender): { voice: SpeechSynthesisVoice | null; pitch: number } {
  if (!('speechSynthesis' in window)) {
    return { voice: null, pitch: 1.0 };
  }

  const voices = window.speechSynthesis.getVoices();
  const enVoices = voices.filter((v) => v.lang.startsWith('en'));

  const femaleKeywords = [
    'samantha',
    'victoria',
    'karen',
    'serena',
    'moira',
    'fiona',
    'tessa',
    'stephanie',
    'jenny',
    'aria',
    'zira',
    'female',
    'susan',
    'ava',
    'allison',
  ];

  const maleKeywords = [
    'daniel',
    'oliver',
    'alex',
    'arthur',
    'gordon',
    'aaron',
    'guy',
    'david',
    'george',
    'male',
    'tom',
    'rishi',
  ];

  const targetKeywords = gender === 'female' ? femaleKeywords : maleKeywords;

  // 1. Try finding an English voice matching gender keywords (preference for GB / US)
  let bestVoice = enVoices.find((v) => {
    const nameLower = v.name.toLowerCase();
    return targetKeywords.some((k) => nameLower.includes(k));
  });

  // 2. Fallback to any en-GB or en-US voice
  if (!bestVoice) {
    bestVoice =
      enVoices.find((v) => v.lang === 'en-GB') ||
      enVoices.find((v) => v.lang.startsWith('en-US')) ||
      enVoices[0] ||
      null;
  }

  // Calibration for youthful & dynamic tone:
  // Slightly elevated pitch (+8% for female, +5% for male) creates an energetic, youthful clarity
  // rather than a deep, sluggish, or flat robotic drone.
  const youthPitch = gender === 'female' ? 1.12 : 1.06;

  return { voice: bestVoice, pitch: youthPitch };
}

/**
 * Split long text into natural sentence chunks to prevent iOS Safari
 * from arbitrarily stopping speech after 15 seconds.
 */
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

export function stopSpeech(): void {
  isSpeakingActive = false;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export interface SpeakOptions {
  rate?: number;
  gender?: VoiceGender;
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export function speakText(text: string, options: SpeakOptions = {}): boolean {
  if (!('speechSynthesis' in window)) {
    return false;
  }

  unlockMobileAudio();
  stopSpeech();

  const gender = options.gender || getStoredVoiceGender();
  const rate = options.rate ?? 1.0;
  const lang = options.lang ?? 'en-GB';

  const { voice, pitch } = findBestVoice(gender);

  // Single words or short flashcard phrases
  if (text.length < 120) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      options.onStart?.();
    };
    utterance.onend = () => {
      options.onEnd?.();
    };
    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      options.onError?.(e);
      options.onEnd?.();
    };

    setTimeout(() => {
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    }, 15);

    return true;
  }

  // Long passages: chunk sentences to prevent mobile Safari 15s freeze
  const chunks = splitIntoSentenceChunks(text);
  isSpeakingActive = true;
  let currentChunkIndex = 0;

  const speakNextChunk = () => {
    if (!isSpeakingActive || currentChunkIndex >= chunks.length) {
      isSpeakingActive = false;
      options.onEnd?.();
      return;
    }

    const chunkText = chunks[currentChunkIndex];
    currentChunkIndex++;

    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      if (isSpeakingActive) {
        speakNextChunk();
      }
    };

    utterance.onerror = (e) => {
      console.warn('Chunk speech error:', e);
      if (isSpeakingActive) {
        speakNextChunk();
      }
    };

    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  };

  options.onStart?.();

  setTimeout(() => {
    window.speechSynthesis.resume();
    speakNextChunk();
  }, 15);

  return true;
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}
