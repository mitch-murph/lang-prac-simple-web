import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadCharacters } from '../data/characters';
import type { KhmerCharacter } from '../data/characters';
import { useSettingsStore } from '../store/settingsStore';

interface CharactersContextValue {
  characters: KhmerCharacter[];
  loading: boolean;
}

const CharactersContext = createContext<CharactersContextValue>({
  characters: [],
  loading: true,
});

export const CharactersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [characters, setCharacters] = useState<KhmerCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  // Get initDefaults from store OUTSIDE the effect so the effect dep array is empty
  const initDefaults = useSettingsStore.getState().initDefaults;

  useEffect(() => {
    loadCharacters().then((chars) => {
      // Initialize enabled characters BEFORE setting React state so
      // the store is ready by the time any quiz view renders
      initDefaults(chars.map((c) => c.id));
      setCharacters(chars);
      setLoading(false);
    });
  }, []); // empty - load once on mount, no Zustand subscription in deps

  return (
    <CharactersContext.Provider value={{ characters, loading }}>
      {children}
    </CharactersContext.Provider>
  );
};

export function useCharacters(): CharactersContextValue {
  return useContext(CharactersContext);
}
