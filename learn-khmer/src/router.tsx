import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeView from './views/HomeView';
import AlphabetView from './views/AlphabetView';
import SoundToCharView from './views/SoundToCharView';
import CharToSoundView from './views/CharToSoundView';
import HandwritingView from './views/HandwritingView';
import SettingsView from './views/SettingsView';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomeView />} />
    <Route path="/alphabet" element={<AlphabetView />} />
    <Route path="/quiz/sound-to-char" element={<SoundToCharView />} />
    <Route path="/quiz/char-to-sound" element={<CharToSoundView />} />
    <Route path="/quiz/handwriting" element={<HandwritingView />} />
    <Route path="/settings" element={<SettingsView />} />
  </Routes>
);

export default AppRoutes;
