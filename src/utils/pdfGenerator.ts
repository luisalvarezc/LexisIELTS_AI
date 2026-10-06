import { jsPDF } from 'jspdf';
import { ReadingModule } from '../types/module';

export function generateWorksheetPdf(module: ReadingModule): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      addPageHeader();
    }
  };

  const addPageHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `LexisIELTS Academic Studio · ${module.targetLevel} · ${module.title.slice(0, 50)}${module.title.length > 50 ? '...' : ''}`,
      margin,
      10
    );
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);
  };

  // --- HEADER SECTION ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229); // Indigo
  doc.text('OFFICIAL IELTS & CEFR ACADEMIC READING WORKSHEET', margin, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(module.targetLevel, pageWidth - margin, y, { align: 'right' });
  y += 5;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(module.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 6 + 2;

  // Subtitle / Topic
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const topicText = `Academic Curriculum: ${module.topic}  |  ${module.structureType}`;
  const topicLines = doc.splitTextToSize(topicText, contentWidth);
  doc.text(topicLines, margin, y);
  y += topicLines.length * 4.5 + 2;

  // Candidate info row
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4.5;

  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Candidate Name: _________________________________', margin, y);
  doc.text('Date: ____________', margin + 105, y);
  doc.text(`Word Count: ${module.wordCount} words`, pageWidth - margin, y, { align: 'right' });
  y += 6;

  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // Instructions Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('Instructions to Candidates:', margin + 3, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Read the four paragraphs of the academic discourse below carefully. Then answer the comprehension questions by circling the single correct letter (A, B, C, or D). Recommended time: 15–20 minutes.',
    margin + 3,
    y + 8.5
  );
  y += 16;

  // --- READING PASSAGE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Academic Reading Passage', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  for (let idx = 0; idx < module.readingText.paragraphs.length; idx++) {
    const p = module.readingText.paragraphs[idx];
    const roleText = `Paragraph ${idx + 1} (${p.role}):`;
    
    checkPageBreak(20);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(99, 102, 241); // Indigo
    doc.text(roleText, margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const pLines = doc.splitTextToSize(p.text, contentWidth);

    for (const line of pLines) {
      checkPageBreak(5);
      doc.text(line, margin, y);
      y += 4.3;
    }
    y += 3;
  }

  y += 4;

  // --- KEY ACADEMIC VOCABULARY ---
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Key Academic Vocabulary (${module.keyVocabulary.length} Critical Terms)`, margin, y);
  y += 5;

  // Vocabulary Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('Term & Part of Speech', margin + 2, y + 4.2);
  doc.text('Definition & Context Sentence', margin + 55, y + 4.2);
  y += 7;

  for (const v of module.keyVocabulary) {
    checkPageBreak(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(v.term, margin + 2, y);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`(${v.partOfSpeech})`, margin + 2, y + 3.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const defLines = doc.splitTextToSize(v.definition, contentWidth - 57);
    doc.text(defLines, margin + 55, y);
    const defHeight = defLines.length * 3.8;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const ctxText = `"${v.contextSentence}"${v.collocation ? ` [Collocation: ${v.collocation}]` : ''}`;
    const ctxLines = doc.splitTextToSize(ctxText, contentWidth - 57);
    doc.text(ctxLines, margin + 55, y + defHeight + 0.5);

    const totalItemHeight = Math.max(10, defHeight + ctxLines.length * 3.5 + 3);
    y += totalItemHeight;

    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.line(margin, y - 1, pageWidth - margin, y - 1);
  }

  y += 5;

  // --- COMPREHENSION EXAMINATION QUESTIONS ---
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Reading Comprehension Examination (Questions 1–${module.quiz.length})`, margin, y);
  y += 6;

  for (let idx = 0; idx < module.quiz.length; idx++) {
    const q = module.quiz[idx];
    checkPageBreak(25);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const qLines = doc.splitTextToSize(`${idx + 1}. ${q.question}`, contentWidth);
    doc.text(qLines, margin, y);
    y += qLines.length * 4.2 + 1;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    const options = ['A', 'B', 'C', 'D'] as const;
    for (const opt of options) {
      checkPageBreak(6);
      const optText = `[${opt}] ${q.options[opt]}`;
      const optLines = doc.splitTextToSize(optText, contentWidth - 6);
      doc.text(optLines, margin + 4, y);
      y += optLines.length * 3.8 + 0.8;
    }
    y += 2.5;
  }

  // --- OFFICIAL ANSWER KEY & EVIDENCE (Examiner Reference) ---
  checkPageBreak(40);
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  // Dashed line
  doc.setLineDashPattern([2, 2], 0);
  doc.line(margin, y, pageWidth - margin, y);
  doc.setLineDashPattern([], 0);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('Official Answer Key & Cited Textual Evidence', margin, y);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('(Examiner Reference Only)', pageWidth - margin, y, { align: 'right' });
  y += 5;

  for (let idx = 0; idx < module.quiz.length; idx++) {
    const q = module.quiz[idx];
    checkPageBreak(12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(79, 70, 229);
    doc.text(`Question ${idx + 1}: [${q.correctAnswer}]`, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const explText = `— ${q.explanation}${q.evidenceQuote ? ` (Evidence: "${q.evidenceQuote}")` : ''}`;
    const explLines = doc.splitTextToSize(explText, contentWidth - 28);
    doc.text(explLines, margin + 27, y);
    y += explLines.length * 3.5 + 1.5;
  }

  if (module.examinerNotes) {
    checkPageBreak(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Examiner Tone & Lexical Summary:', margin, y);
    y += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    const noteLines = doc.splitTextToSize(module.examinerNotes.academicToneSummary, contentWidth);
    doc.text(noteLines, margin, y);
  }

  // Total pages numbering
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${totalPages} · LexisIELTS Academic Studio · Band & CEFR Curriculum`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Clean filename with actual title and target level
  const sanitizedTitle = module.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 40)
    .replace(/^_|_$/g, '');
  const sanitizedLevel = module.targetLevel
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 15)
    .replace(/^_|_$/g, '');

  const filename = `IELTS_${sanitizedLevel}_${sanitizedTitle}.pdf`;
  doc.save(filename);
}
