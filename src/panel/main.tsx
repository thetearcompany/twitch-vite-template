import React from 'react';
import ReactDOM from 'react-dom/client';
import Indicator  from '@/EmotionOverlay';
import '@/styles/globals.css';

// Przykładowe dane do testów
const testMessages = [
  "Cześć wszystkim! 😊",
  "Świetny stream! 😃",
  "Co za niespodzianka! 😲",
  "Ale super! 😄",
  "Nie podoba mi się to 😡",
  "Smutne to... 😢",
  "Wow! 😯",
  "Kappa Kappa Kappa",
  "PogChamp",
  "LUL",
  ":)",
  ":(",
  "👿",
  "😭",
  "😃"
];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="p-4">
      <Indicator chatData={testMessages} />
    </div>
  </React.StrictMode>
); 