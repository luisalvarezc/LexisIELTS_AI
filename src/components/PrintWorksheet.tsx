import React from 'react';
import { ReadingModule } from '../types/module';

interface PrintWorksheetProps {
  module: ReadingModule;
}

export const PrintWorksheet: React.FC<PrintWorksheetProps> = ({ module }) => {
  return (
    <div className="hidden print:block font-serif text-black p-4 space-y-6 max-w-4xl mx-auto">
      {/* Worksheet Header */}
      <div className="border-b-2 border-black pb-4">
        <div className="flex justify-between items-start text-xs font-sans uppercase tracking-wider mb-2">
          <span>Official IELTS & CEFR Reading Practice Module</span>
          <span>Target Level: {module.targetLevel}</span>
        </div>
        <h1 className="text-xl font-bold leading-tight">{module.title}</h1>
        <div className="flex justify-between items-center text-xs font-sans mt-3 text-gray-700">
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
      <div className="text-xs italic bg-gray-100 p-2.5 rounded border border-gray-300 font-sans">
        <strong>Instructions to Candidates:</strong> Read the four paragraphs below carefully. Answer the comprehension questions that follow by circling the single correct letter (A, B, C, or D). Recommended reading time: 15–20 minutes.
      </div>

      {/* Reading Passage */}
      <div className="space-y-4 text-sm leading-relaxed text-justify">
        <h2 className="text-xs font-sans font-bold uppercase tracking-wider border-b border-gray-300 pb-1">
          Reading Passage
        </h2>
        {module.readingText.paragraphs.map((p, idx) => (
          <p key={idx} className="indent-6">
            <sup className="font-sans font-bold mr-1">[{idx + 1}]</sup>
            {p.text}
          </p>
        ))}
      </div>

      {/* Vocabulary Table */}
      <div className="pt-4 space-y-2">
        <h2 className="text-xs font-sans font-bold uppercase tracking-wider border-b border-gray-300 pb-1">
          Key Academic Vocabulary
        </h2>
        <table className="w-full text-xs text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 font-sans">
              <th className="border border-gray-300 p-1.5 w-1/4">Term & POS</th>
              <th className="border border-gray-300 p-1.5 w-1/3">Definition</th>
              <th className="border border-gray-300 p-1.5">Context / Collocation</th>
            </tr>
          </thead>
          <tbody>
            {module.keyVocabulary.map((v, i) => (
              <tr key={i}>
                <td className="border border-gray-300 p-1.5 font-bold">
                  {v.term} <span className="font-normal italic">({v.partOfSpeech})</span>
                </td>
                <td className="border border-gray-300 p-1.5">{v.definition}</td>
                <td className="border border-gray-300 p-1.5 italic">
                  "{v.contextSentence}" {v.collocation ? `[${v.collocation}]` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Questions */}
      <div className="pt-6 space-y-4 break-before-page">
        <h2 className="text-xs font-sans font-bold uppercase tracking-wider border-b border-gray-300 pb-1">
          Comprehension Examination (Questions 1–{module.quiz.length})
        </h2>
        <div className="space-y-4">
          {module.quiz.map((q, idx) => (
            <div key={q.id} className="text-xs space-y-1.5 break-inside-avoid">
              <p className="font-bold">
                {idx + 1}. {q.question}
              </p>
              <div className="grid grid-cols-2 gap-1.5 pl-4">
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

      {/* Answer Key Footer */}
      <div className="pt-6 border-t-2 border-dashed border-gray-400 text-xs font-sans break-inside-avoid">
        <h3 className="font-bold uppercase tracking-wider mb-2">Teacher & Examiner Answer Key</h3>
        <div className="space-y-1 text-[11px] text-gray-800">
          {module.quiz.map((q, idx) => (
            <div key={q.id}>
              <strong>Q{idx + 1}: [{q.correctAnswer}]</strong> — {q.explanation} (Evidence: <em>"{q.evidenceQuote}"</em>)
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
