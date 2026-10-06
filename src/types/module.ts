export interface VocabularyItem {
  term: string;
  partOfSpeech: string;
  definition: string;
  contextSentence: string;
  collocation?: string;
}

export type QuestionType =
  | 'main_idea'
  | 'detailed_fact'
  | 'vocabulary_in_context'
  | 'inferential_logic';

export interface QuizQuestion {
  id: number;
  question: string;
  questionType: QuestionType;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  evidenceQuote: string;
}

export interface ParagraphStructure {
  role: string;
  text: string;
  cohesiveDevices: string[];
}

export interface UserReadingModule {
  title: string;
  level: string;
  reading_text: {
    introduction: string;
    body_paragraph_1: string;
    body_paragraph_2: string;
    conclusion: string;
    full_text?: string;
  };
  key_vocabulary: Array<{
    term: string;
    part_of_speech: string;
    definition: string;
    context_sentence: string;
    collocation?: string;
  }>;
  quiz: Array<{
    question_number: number;
    question: string;
    options: { A: string; B: string; C: string; D: string };
    correct_answer: 'A' | 'B' | 'C' | 'D';
    explanation: string;
    evidence_quote?: string;
  }>;
}

export interface ReadingModule {
  title: string;
  targetLevel: string;
  structureType: string;
  topic: string;
  wordCount: number;
  readingText: {
    fullText: string;
    paragraphs: ParagraphStructure[];
  };
  keyVocabulary: VocabularyItem[];
  quiz: QuizQuestion[];
  examinerNotes?: {
    academicToneSummary: string;
    targetLexicalBandFeatures: string[];
  };
}

const COMMON_COHESIVE_MARKERS = [
  'On the one hand',
  'On the other hand',
  'Consequently',
  'Furthermore',
  'In conclusion',
  'Moreover',
  'However',
  'Therefore',
  'In contrast',
  'Nevertheless',
  'As a result',
  'thereby',
  'Meanwhile',
  'To synthesize',
  'Moving forward',
  'Before long',
  'In retrospect',
  'To their astonishment',
  'Unexpectedly',
  'Inevitably',
  'As dusk fell',
  'Little did they know',
  'In the midst of',
];

export function detectCohesiveDevices(text: string): string[] {
  const found: string[] = [];
  for (const marker of COMMON_COHESIVE_MARKERS) {
    const regex = new RegExp(`\\b${marker}\\b`, 'i');
    if (regex.test(text)) {
      found.push(marker);
    }
  }
  return found;
}

export function normalizeReadingModule(raw: any): ReadingModule {
  if (!raw || typeof raw !== 'object') {
    throw new Error('El objeto JSON proporcionado no es válido.');
  }

  const title = raw.title?.trim();
  if (!title) {
    throw new Error('El JSON debe incluir un título válido ("title").');
  }

  const targetLevel = raw.level?.trim() || raw.targetLevel?.trim() || 'IELTS Band 7.0 / CEFR C1';
  const structureType = raw.structureType?.trim() || 'Argumentative Pros/Cons';
  const topic = raw.topic?.trim() || title;

  // Process Reading Text
  let fullText = '';
  let paragraphs: ParagraphStructure[] = [];

  if (raw.reading_text && typeof raw.reading_text === 'object') {
    const intro = raw.reading_text.introduction?.trim() || '';
    const b1 = raw.reading_text.body_paragraph_1?.trim() || '';
    const b2 = raw.reading_text.body_paragraph_2?.trim() || '';
    const concl = raw.reading_text.conclusion?.trim() || '';

    paragraphs = [
      {
        role: 'Introduction & Thesis',
        text: intro,
        cohesiveDevices: detectCohesiveDevices(intro),
      },
      {
        role: 'Body Paragraph 1: Supporting Arguments',
        text: b1,
        cohesiveDevices: detectCohesiveDevices(b1),
      },
      {
        role: 'Body Paragraph 2: Counterarguments & Complications',
        text: b2,
        cohesiveDevices: detectCohesiveDevices(b2),
      },
      {
        role: 'Conclusion & Synthesis',
        text: concl,
        cohesiveDevices: detectCohesiveDevices(concl),
      },
    ].filter((p) => p.text.length > 0);

    fullText = raw.reading_text.full_text?.trim() || paragraphs.map((p) => p.text).join('\n\n');
  } else if (raw.readingText && typeof raw.readingText === 'object') {
    fullText = raw.readingText.fullText?.trim() || '';
    if (Array.isArray(raw.readingText.paragraphs)) {
      paragraphs = raw.readingText.paragraphs.map((p: any, i: number) => ({
        role: p.role || `Paragraph ${i + 1}`,
        text: p.text || '',
        cohesiveDevices: Array.isArray(p.cohesiveDevices)
          ? p.cohesiveDevices
          : detectCohesiveDevices(p.text || ''),
      }));
    }
  }

  if (!fullText && paragraphs.length === 0) {
    throw new Error('El JSON debe contener texto en "reading_text" o "readingText".');
  }

  if (paragraphs.length === 0 && fullText) {
    const rawParagraphs = fullText.split(/\n\s*\n/).filter((t) => t.trim().length > 0);
    const roles = [
      'Introduction & Thesis',
      'Body Paragraph 1: Supporting Arguments',
      'Body Paragraph 2: Counterarguments & Complications',
      'Conclusion & Synthesis',
    ];
    paragraphs = rawParagraphs.map((pText, idx) => ({
      role: roles[idx] || `Paragraph ${idx + 1}`,
      text: pText.trim(),
      cohesiveDevices: detectCohesiveDevices(pText),
    }));
  }

  // Calculate word count
  const wordCount = raw.wordCount || fullText.trim().split(/\s+/).filter(Boolean).length;

  // Process Vocabulary
  const rawVocab = raw.key_vocabulary || raw.keyVocabulary || [];
  if (!Array.isArray(rawVocab) || rawVocab.length === 0) {
    throw new Error('El JSON debe incluir una lista de vocabulario en "key_vocabulary".');
  }

  const keyVocabulary: VocabularyItem[] = rawVocab.map((v: any) => ({
    term: v.term?.trim() || '',
    partOfSpeech: v.part_of_speech?.trim() || v.partOfSpeech?.trim() || 'noun',
    definition: v.definition?.trim() || '',
    contextSentence: v.context_sentence?.trim() || v.contextSentence?.trim() || '',
    collocation: v.collocation?.trim() || undefined,
  }));

  // Process Quiz
  const rawQuiz = raw.quiz || [];
  if (!Array.isArray(rawQuiz) || rawQuiz.length === 0) {
    throw new Error('El JSON debe incluir preguntas de comprensión en "quiz".');
  }

  const quiz: QuizQuestion[] = rawQuiz.map((q: any, i: number) => {
    const rawAnswer = (q.correct_answer || q.correctAnswer || 'A').toUpperCase();
    const correctAnswer: 'A' | 'B' | 'C' | 'D' = ['A', 'B', 'C', 'D'].includes(rawAnswer)
      ? (rawAnswer as 'A' | 'B' | 'C' | 'D')
      : 'A';

    return {
      id: q.question_number || q.id || i + 1,
      question: q.question?.trim() || `Pregunta ${i + 1}`,
      questionType: q.questionType || (i === 0 ? 'main_idea' : i === 1 ? 'detailed_fact' : i === 2 ? 'vocabulary_in_context' : 'inferential_logic'),
      options: {
        A: q.options?.A || 'Opción A',
        B: q.options?.B || 'Opción B',
        C: q.options?.C || 'Opción C',
        D: q.options?.D || 'Opción D',
      },
      correctAnswer,
      explanation: q.explanation?.trim() || '',
      evidenceQuote: q.evidence_quote?.trim() || q.evidenceQuote?.trim() || '',
    };
  });

  return {
    title,
    targetLevel,
    structureType,
    topic,
    wordCount,
    readingText: {
      fullText,
      paragraphs,
    },
    keyVocabulary,
    quiz,
    examinerNotes: raw.examinerNotes || {
      academicToneSummary: `Academic reading module calibrated for ${targetLevel}.`,
      targetLexicalBandFeatures: [
        'Standard 4-paragraph progression (Introduction, Supporting Body, Counterargument Body, Conclusion)',
        'Contextual academic vocabulary and reading comprehension assessment',
      ],
    },
  };
}

export function toUserReadingModule(module: ReadingModule): UserReadingModule {
  const p = module.readingText.paragraphs;
  return {
    title: module.title,
    level: module.targetLevel,
    reading_text: {
      introduction: p[0]?.text || '',
      body_paragraph_1: p[1]?.text || '',
      body_paragraph_2: p[2]?.text || '',
      conclusion: p[3]?.text || '',
      full_text: module.readingText.fullText,
    },
    key_vocabulary: module.keyVocabulary.map((v) => ({
      term: v.term,
      part_of_speech: v.partOfSpeech,
      definition: v.definition,
      context_sentence: v.contextSentence,
      ...(v.collocation ? { collocation: v.collocation } : {}),
    })),
    quiz: module.quiz.map((q, idx) => ({
      question_number: q.id || idx + 1,
      question: q.question,
      options: {
        A: q.options.A,
        B: q.options.B,
        C: q.options.C,
        D: q.options.D,
      },
      correct_answer: q.correctAnswer,
      explanation: q.explanation,
      ...(q.evidenceQuote ? { evidence_quote: q.evidenceQuote } : {}),
    })),
  };
}


export interface GenerationParams {
  topic: string;
  targetLevel: string;
  structureType: string;
  numQuestions: number;
}
