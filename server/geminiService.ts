import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { GenerationParams, ReadingModule } from '../src/types/module';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateReadingModule(params: GenerationParams): Promise<ReadingModule> {
  const { topic, targetLevel, structureType, numQuestions } = params;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno del servidor.');
  }

  const isStoryMode =
    structureType.toLowerCase().includes('narrative') ||
    structureType.toLowerCase().includes('cuento') ||
    structureType.toLowerCase().includes('story') ||
    structureType.toLowerCase().includes('libre') ||
    structureType.toLowerCase().includes('free') ||
    structureType.toLowerCase().includes('anecdote') ||
    structureType.toLowerCase().includes('crónica');

  const prompt = isStoryMode
    ? `Generate an engaging, high-quality creative story, tale, or narrative educational reading module (Tema Libre / Cuento) matching these exact parameters:
- Topic / Story Theme: "${topic}" (If provided in Spanish or any other language, formulate the story in evocative, natural British/International English calibrated strictly to the requested level).
- Target Level: ${targetLevel} (CEFR / IELTS)
- Structure Type: ${structureType} (Creative narrative / story designed as an enjoyable study break while actively practicing high-level vocabulary and comprehension).
- Number of Quiz Questions: ${numQuestions}

Strict requirements for this Creative Narrative / Story module:
1. Title: Captivating, literary, and clear in English.
2. Target Level & Band: Explicitly state the target level (e.g. "${targetLevel}"). The English must strictly adhere to this level through rich, nuanced vocabulary, evocative descriptions, varied syntax (inversions, participle phrases, conditional clauses), and literary finesse suitable for this Band.
3. Reading Text:
   - Word count: Strictly between 250 and 350 words (NEVER exceed 350 words).
   - Organization: A 4-paragraph flowing narrative structure with clear story progression:
     * Paragraph 1 (role: "Setting the Scene & Exposition"): Introduces the atmosphere, protagonist, and historical or fantastical context.
     * Paragraph 2 (role: "Narrative Ascent & Journey"): Develops the narrative conflict, journey, or curious discovery.
     * Paragraph 3 (role: "Climax & Turning Point"): The emotional peak, unexpected twist, or revelation.
     * Paragraph 4 (role: "Resolution & Reflection"): The outcome, lasting impression, or philosophical takeaway.
   - Cohesion: Explicit use of narrative discourse markers and transition phrases (e.g., "Meanwhile", "To their astonishment", "Before long", "Consequently", "In retrospect", "As dusk fell", "Nevertheless").
   - Vocabulary: Formal, expressive, and descriptive collocations suitable for the requested Band.
4. Key Vocabulary Table: 4 to 6 critical terms from the story with term, partOfSpeech, English definition, contextual usage sentence, and common collocation.
5. Reading Comprehension Quiz:
   - Exactly ${numQuestions} multiple-choice questions focusing on narrative plot, character motivations, contextual vocabulary, and inferential logic.
   - 4 options per question (A, B, C, D) with exactly one unambiguous correct answer.
   - An answer key with brief explanation and the exact evidence quote from the story.
6. Examiner Notes: Brief summary of narrative tone, literary devices, and target band lexical features.

Return clean, valid JSON matching the schema.`
    : `Generate a complete, rigorous, high-yield educational reading module matching these exact parameters:
- Topic / Proposition: "${topic}" (If provided in Spanish or any other language, formulate the academic module in formal British/International Academic English corresponding to the topic).
- Target Level: ${targetLevel} (CEFR / IELTS)
- Structure Type: ${structureType}
- Number of Quiz Questions: ${numQuestions}

Strict requirements:
1. Title: Engaging, academic, and clear in English.
2. Target Level & Band: Explicitly state the target level (e.g. "${targetLevel}").
3. Reading Text:
   - Word count: Strictly between 250 and 350 words (ideal 1-page reading; NEVER exceed 350 words).
   - Organization: A strict 4-paragraph argumentative or informative structure (Introduction with thesis, Body Paragraph 1 supporting arguments/contributions, Body Paragraph 2 counterarguments/challenges, Conclusion and synthesis).
   - Cohesion: Mandatory, explicit use of high-band linking devices (e.g., "Consequently", "On the one hand", "On the other hand", "Furthermore", "In conclusion", "Thereby").
   - Vocabulary: Formal, precise collocations suitable for the requested Band.
4. Key Vocabulary Table: 4 to 6 critical academic terms with term, partOfSpeech, English definition, contextual usage sentence, and common academic collocation.
5. Reading Comprehension Quiz:
   - Exactly ${numQuestions} multiple-choice questions focusing on main ideas, detailed facts, vocabulary in context, and inferential logic.
   - 4 options per question (A, B, C, D) with exactly one unambiguous correct answer.
   - An answer key with brief explanation and the exact evidence quote from the text.
6. Examiner Notes: Brief summary of tone and target lexical features.

Return clean, valid JSON matching the schema.`;

  const config = {
    systemInstruction: `You are an expert English language examiner, literary educator, and curriculum designer specializing in IELTS and CEFR curriculum development.

Your task is to generate high-quality educational reading modules based on a user-provided topic and target CEFR/IELTS level.

You support two pedagogical modalities:
1. Academic Discourse Modules: Formal argumentative/informative analysis (Introduction with thesis, Body 1 supporting, Body 2 counterarguments, Conclusion) with formal academic collocations and discourse linkers.
2. Free Topic & Creative Narrative Modules (Tema Libre / Cuentos / Stories): Immersive short stories, historical anecdotes, or narrative tales providing an enjoyable study break while strictly upholding the requested CEFR/IELTS lexical richness, syntax variety, and comprehension rigour. Organized across 4 flowing narrative paragraphs (Setting/Exposition, Narrative Ascent/Journey, Climax/Turning Point, Resolution/Reflection).

Common rules for both modalities:
- Length: Strictly between 250 and 350 words (ideal for 1-page reading; NEVER exceed 350 words).
- Cohesion: Mandatory use of high-band linking devices and discourse markers.
- Key Vocabulary Table: 4 to 6 critical terms with part of speech, English definition, and contextual usage.
- Reading Comprehension Quiz: 4 to 6 multiple-choice questions focusing on main ideas/plot, detailed facts, vocabulary in context, and inferential logic. 4 options per question (A, B, C, D) with exactly one unambiguous correct answer, an explanation, and exact evidence quotes.

Always return valid, clean JSON matching the specified schema.`,
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Academic title of the passage' },
        targetLevel: { type: Type.STRING, description: 'Target level (e.g. IELTS Band 7.0 / CEFR C1)' },
        structureType: { type: Type.STRING, description: 'Structure type used' },
        topic: { type: Type.STRING, description: 'The underlying academic topic' },
        wordCount: { type: Type.INTEGER, description: 'Total word count of the reading text (between 250 and 350 words)' },
        readingText: {
          type: Type.OBJECT,
          properties: {
            fullText: { type: Type.STRING, description: 'Complete reading text with paragraph breaks' },
            paragraphs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING, description: 'Paragraph role (Introduction, Body 1, Body 2, Conclusion)' },
                  text: { type: Type.STRING, description: 'Text of this paragraph' },
                  cohesiveDevices: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'List of cohesive devices used in this paragraph'
                  }
                },
                required: ['role', 'text', 'cohesiveDevices']
              }
            }
          },
          required: ['fullText', 'paragraphs']
        },
        keyVocabulary: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING },
              partOfSpeech: { type: Type.STRING },
              definition: { type: Type.STRING },
              contextSentence: { type: Type.STRING },
              collocation: { type: Type.STRING }
            },
            required: ['term', 'partOfSpeech', 'definition', 'contextSentence']
          }
        },
        quiz: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              questionType: { type: Type.STRING },
              options: {
                type: Type.OBJECT,
                properties: {
                  A: { type: Type.STRING },
                  B: { type: Type.STRING },
                  C: { type: Type.STRING },
                  D: { type: Type.STRING }
                },
                required: ['A', 'B', 'C', 'D']
              },
              correctAnswer: { type: Type.STRING, description: 'A, B, C, or D' },
              explanation: { type: Type.STRING },
              evidenceQuote: { type: Type.STRING }
            },
            required: ['id', 'question', 'questionType', 'options', 'correctAnswer', 'explanation', 'evidenceQuote']
          }
        },
        examinerNotes: {
          type: Type.OBJECT,
          properties: {
            academicToneSummary: { type: Type.STRING },
            targetLexicalBandFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      },
      required: ['title', 'targetLevel', 'structureType', 'topic', 'wordCount', 'readingText', 'keyVocabulary', 'quiz']
    }
  };

  let lastError: any = null;

  // Try candidate models in cascade to protect against temporary 503 high demand spikes
  for (const modelName of CANDIDATE_MODELS) {
    // Retry up to 2 times for temporary spikes
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config,
        });

        const text = response.text;
        if (!text) {
          throw new Error('El modelo generó una respuesta vacía');
        }

        const parsed = JSON.parse(text) as ReadingModule;
        if (!parsed.wordCount || parsed.wordCount <= 0) {
          const calculatedWords = parsed.readingText.fullText.trim().split(/\s+/).length;
          parsed.wordCount = calculatedWords;
        }

        return parsed;
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const isTemporary =
          errMsg.includes('503') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('high demand') ||
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED');

        console.warn(`Attempt ${attempt} on ${modelName} encountered error:`, errMsg);

        if (isTemporary && attempt === 1) {
          // Wait 1.2s before re-attempting
          await sleep(1200);
          continue;
        }
        // If not temporary or second attempt failed, cascade to next candidate model
        break;
      }
    }
  }

  // Parse raw JSON error message if present to give a clean user-friendly explanation
  let userFriendlyMsg = 'El servicio de IA está experimentando alta demanda momentánea.';
  if (lastError?.message) {
    try {
      const parsedJsonErr = JSON.parse(lastError.message);
      if (parsedJsonErr?.error?.message) {
        userFriendlyMsg = parsedJsonErr.error.message;
      }
    } catch {
      userFriendlyMsg = lastError.message;
    }
  }

  throw new Error(
    `Los servidores de Gemini están experimentando alta demanda en este momento (Error 503). Por favor intenta de nuevo en unos segundos.`
  );
}

export interface SynthesizeSpeechParams {
  text: string;
  voiceName?: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir' | 'Charon';
  gender?: 'female' | 'male';
}

export async function synthesizeSpeech(
  params: SynthesizeSpeechParams
): Promise<{ audioBase64: string; mimeType: string }> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en el servidor.');
  }

  const { text, gender } = params;
  let voiceName = params.voiceName;

  if (!voiceName) {
    voiceName = gender === 'male' ? 'Puck' : 'Kore';
  }

  // Model: gemini-3.8-flash-lite-tts for high-fidelity natural speech
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash-lite-tts',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: text.slice(0, 3500),
            speechMetadata: {
              style: 'Clear, engaging, and articulate native academic lecturer reading an IELTS exam text at a natural, measured pace.',
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error('No se recibió audio del modelo de síntesis de voz Gemini.');
  }

  return {
    audioBase64: base64Audio,
    mimeType: 'audio/wav',
  };
}

