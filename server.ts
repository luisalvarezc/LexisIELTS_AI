import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { generateReadingModule, synthesizeSpeech } from './server/geminiService.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/synthesize-speech', async (req, res) => {
  try {
    const { text, voiceName, gender } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'Text is required for speech synthesis' });
      return;
    }

    const audioResult = await synthesizeSpeech({
      text: text.trim(),
      voiceName,
      gender,
    });

    res.json(audioResult);
  } catch (error: any) {
    console.error('Speech synthesis failed:', error);
    res.status(500).json({
      error: error?.message || 'An error occurred during speech synthesis.',
    });
  }
});

app.post('/api/generate-module', async (req, res) => {
  try {
    const { topic, targetLevel, structureType, numQuestions } = req.body;
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      res.status(400).json({ error: 'Topic is required and cannot be empty' });
      return;
    }

    const moduleData = await generateReadingModule({
      topic: topic.trim(),
      targetLevel: targetLevel || 'IELTS Band 7.0 / CEFR C1',
      structureType: structureType || 'Argumentative Pros/Cons',
      numQuestions: Number(numQuestions) || 5,
    });

    res.json(moduleData);
  } catch (error: any) {
    console.error('Module generation failed:', error);
    res.status(500).json({
      error: error?.message || 'An error occurred while generating the reading module.',
    });
  }
});

// Serve frontend build in production
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
