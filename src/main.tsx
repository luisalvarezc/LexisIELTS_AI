import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AudioVoiceProvider } from './context/AudioVoiceContext.tsx';

createRoot(document.getElementById('root')!).render(
  <AudioVoiceProvider>
    <App />
  </AudioVoiceProvider>
);
