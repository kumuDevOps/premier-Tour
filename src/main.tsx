import { sanitizeLocalDatabase } from "./utils/cleanupStorage";
sanitizeLocalDatabase();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Dynamically import Leaflet CSS to avoid global side-effect build issues
if (typeof window !== 'undefined') {
  import('leaflet/dist/leaflet.css').catch(() => {
    console.warn('Leaflet CSS could not be loaded statically');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
