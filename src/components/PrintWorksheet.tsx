import React from 'react';
import { ReadingModule } from '../types/module';

interface PrintWorksheetProps {
  module: ReadingModule;
}

export const PrintWorksheet: React.FC<PrintWorksheetProps> = ({ module }) => {
  const isStory =
    module.structureType?.toLowerCase().includes('narrative') ||
    module.structureType?.toLowerCase().includes('cuento') ||
    module.structureType?.toLowerCase().includes('story') ||
    module.structureType?.toLowerCase().includes('libre') ||
    module.structureType?.toLowerCase().includes('anecdote');

  return (
    <div className="hidden print:block font-serif text-black p-6 space-y-6 max-w-4xl mx-auto bg-white min-h-screen">
      {/* Worksheet Header */}
      <div className="border-b-2 border-black pb-4 space-y-2">
        <div className="flex justify-between items-start text-xs font-sans uppercase tracking-wider text-gray-600">
          <span>{isStory ? 'IELTS & CEFR Reading & Comprehension Worksheet (Story Break)' : 'Official IELTS & CEFR Academic Reading Worksheet'}</span>
          <span className="font-bold text-black">{module.targetLevel}</span>
        </div>

        <h1 className="text-2xl font-bold leading-tight text-black">{module.title}</h1>

        <div className="text-xs font-sans text-gray-800 flex items-center gap-2">
          <span className="font-bold uppercase tracking-wide">
            {isStory ? 'Story / Narrative Theme:' : 'Academic Curriculum Topic:'}
          </span>
          <span className="italic">{module.topic}</span>
          <span className="mx-1">·</span>
          <span>{module.structureType}</span>
        </div>

        <div className="flex justify-between items-center text-xs font-sans pt-2 text-gray-700 border-t border-gray-300">
          <div>
            <span className="font-semibold">Candidate Name:</span> ___________________________
          </div>
          <div>
            <span className="font-semibold">Date:</span> ______________
          </div>
          <div>
            <span className="font-semibold">Word Count:</span> {module.wordCount} words
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs italic bg-gray-50 p-3 rounded border border-gray-300 font-sans leading-relaxed">
        <strong>Instructions to Candidates:</strong>{' '}
        {isStory
          ? 'Read the narrative text below carefully. Then answer the comprehension examination questions by circling the single unambiguous correct letter (A, B, C, or D). Recommended test time allocation: 15–20 minutes.'
          : 'Read the four paragraphs of the academic passage below carefully. Then answer the comprehension examination questions by circling the single unambiguous correct letter (A, B, C, or D). Recommended test time allocation: 15–20 minutes.'}
      </div>

      {/* Reading Passage */}
      <div className="space-y-4 text-sm leading-relaxed text-justify">
        <div className="flex items-center justify-between border-b border-gray-300 pb-1 text-xs font-sans font-bold uppercase tracking-wider text-gray-700">
          <span>Official Reading Passage</span>
          <span>{isStory ? 'Narrative Story Format' : 'One-Page Academic Discourse'}</span>
        </div>
        {module.readingText.paragraphs.map((p, idx) => (
          <div key={idx} className="space-y-1">
            <div className="text-[10px] font-sans font-bold text-gray-500 uppercase tracking-wide">
              Paragraph {idx + 1}: {p.role}
            </div>
            <p className="indent-6 text-justify leading-relaxed">
              {p.text}
            </p>
          </div>
        ))}
      </div>

      {/* Vocabulary Table */}
      <div className="pt-4 space-y-2 break-inside-avoid">
        <h2 className="text-xs font-sans font-bold uppercase tracking-wider border-b border-gray-300 pb-1 text-gray-800">
          Key Academic Vocabulary ({module.keyVocabulary.length} Critical Terms)
        </h2>
        <table className="w-full text-xs text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 font-sans">
              <th className="border border-gray-300 p-1.5 w-1/4">Term & POS</th>
              <th className="border border-gray-300 p-1.5 w-1/3">English Definition</th>
              <th className="border border-gray-300 p-1.5">Contextual Sentence & Collocation</th>
            </tr>
          </thead>
          <tbody>
            {module.keyVocabulary.map((v, i) => (
              <tr key={i}>
                <td className="border border-gray-300 p-1.5 font-bold align-top">
                  {v.term} <span className="font-normal italic">({v.partOfSpeech})</span>
                </td>
                <td className="border border-gray-300 p-1.5 align-top">{v.definition}</td>
                <td className="border border-gray-300 p-1.5 italic align-top">
                  "{v.contextSentence}" {v.collocation ? `[${v.collocation}]` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comprehension Quiz Questions */}
      <div className="pt-6 space-y-4 break-before-page">
        <h2 className="text-xs font-sans font-bold uppercase tracking-wider border-b border-gray-300 pb-1 text-gray-800">
          Reading Comprehension Examination (Questions 1–{module.quiz.length})
        </h2>
        <div className="space-y-4">
          {module.quiz.map((q, idx) => (
            <div key={q.id} className="text-xs space-y-1.5 break-inside-avoid border-b border-gray-100 pb-3">
              <p className="font-bold text-black">
                {idx + 1}. {q.question}
              </p>
              <div className="grid grid-cols-2 gap-2 pl-3">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                  <div key={opt} className="flex items-start gap-1">
                    <span className="font-sans font-bold">[{opt}]</span>
                    <span>{q.options[opt]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Key & Examiner Notes (Separated for Proctor/Self-Evaluation) */}
      <div className="pt-6 border-t-2 border-dashed border-gray-400 text-xs font-sans break-inside-avoid space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold uppercase tracking-wider text-gray-900">
            Official Answer Key & Cited Textual Evidence
          </h3>
          <span className="text-[10px] text-gray-500 uppercase">Examiner Reference Only</span>
        </div>
        <div className="space-y-1.5 text-[11px] text-gray-800">
          {module.quiz.map((q, idx) => (
            <div key={q.id} className="leading-snug">
              <strong>Question {idx + 1}: [{q.correctAnswer}]</strong> — {q.explanation}{' '}
              {q.evidenceQuote && (
                <span className="text-gray-600 italic">(Evidence: "{q.evidenceQuote}")</span>
              )}
            </div>
          ))}
        </div>

        {module.examinerNotes && (
          <div className="pt-2 text-[10px] text-gray-500 border-t border-gray-200">
            <strong>Examiner Tone & Lexical Note:</strong> {module.examinerNotes.academicToneSummary}
          </div>
        )}
      </div>
    </div>
  );
};
