import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeStyleBlock } from '../components/theme-style-block';
import { Popup } from './popup';
import './styles.css';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <StrictMode>
      <ThemeStyleBlock />
      <Popup />
    </StrictMode>,
  );
}
