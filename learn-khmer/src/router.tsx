import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeView from './views/HomeView';
import AlphabetView from './views/AlphabetView';
import SoundToCharView from './views/SoundToCharView';
import CharToSoundView from './views/CharToSoundView';
import HandwritingView from './views/HandwritingView';
import MatchView from './views/MatchView';
import FlashcardsView from './views/FlashcardsView';
import SettingsView from './views/SettingsView';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomeView />} />
    <Route path="/alphabet" element={<AlphabetView />} />
    <Route path="/quiz/sound-to-char" element={<SoundToCharView />} />
    <Route path="/quiz/char-to-sound" element={<CharToSoundView />} />
    <Route path="/quiz/handwriting" element={<HandwritingView />} />
    <Route path="/quiz/match" element={<MatchView />} />
    <Route path="/quiz/flashcards" element={<FlashcardsView />} />
    <Route path="/settings" element={<SettingsView />} />
  </Routes>
);

export default AppRoutes;
