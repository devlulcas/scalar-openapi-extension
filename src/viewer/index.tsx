import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeStyleBlock } from '../components/theme-style-block';
import './styles.css';
import { Viewer } from './viewer';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <StrictMode>
      <ThemeStyleBlock />
      <Viewer />
    </StrictMode>,
  );
}
