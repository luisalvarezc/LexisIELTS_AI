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

  const prompt = `Generate a complete, rigorous, high-yield educational reading module matching these exact parameters:
- Topic / Proposition: "${topic}" (If provided in Spanish or any other language, formulate the academic module in formal British/International Academic English corresponding to the topic).
- Target Level: ${targetLevel} (CEFR / IELTS)
- Structure Type: ${structureType}
- Number of Quiz Questions: ${numQuestions}

Strict requirements:
1. Title: Engaging, academic, and clear in English.
2. Target Level & Band: Explicitly state the target level (e.g. "${targetLevel}").
3. Reading Text:
   - Word count: Strictly between 250 and 350 words (ideal 1-page reading).
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
    systemInstruction: `You are an expert English language examiner and educational content creator specializing in IELTS and CEFR curriculum design.

Your task is to generate high-quality educational reading modules based on a user-provided topic and target CEFR/IELTS level.

Each generation must strictly follow this structure:
1. Title: Engaging, academic, and clear.
2. Target Level & Band: Explicitly stating the target level (e.g., IELTS Band 7.0 / CEFR C1).
3. Reading Text:
   - Length: Between 250 and 350 words (ideal for 1-page reading).
   - Organization: A 4-paragraph argumentative or informative structure (Introduction with thesis, Body Paragraph 1 supporting/contributions, Body Paragraph 2 counterarguments/challenges, Conclusion).
   - Cohesion: Mandatory use of high-band linking devices (e.g., "Consequently", "On the one hand", "On the other hand", "Furthermore", "In conclusion").
   - Vocabulary: Formal, precise collocations suitable for the requested Band.
4. Key Vocabulary Table: 4 to 6 critical terms with part of speech, English definition, and contextual usage.
5. Reading Comprehension Quiz:
   - 4 to 6 multiple-choice questions focusing on main ideas, detailed facts, vocabulary in context, and inferential logic.
   - 4 options per question (A, B, C, D) with exactly one unambiguous correct answer.
   - An answer key with brief explanations.

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

