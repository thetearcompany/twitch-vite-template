import React from 'react';
import ReactDOM from 'react-dom/client';
import Indicator  from '@/Indicator';
import '@/styles/index.css';

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
      <h1 className="text-2xl font-bold mb-4">Emoscan - Panel Testowy</h1>
      <Indicator chatData={testMessages} />
    </div>
  </React.StrictMode>
); 