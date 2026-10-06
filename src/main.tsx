import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AudioVoiceProvider } from './context/AudioVoiceContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <AudioVoiceProvider>
      <App />
    </AudioVoiceProvider>
  </ThemeProvider>
);
