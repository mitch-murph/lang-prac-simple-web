import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  enabledCharacterIds: string[];
  /** Persisted — distinguishes "first visit" from "user chose Disable All" */
  initialized: boolean;
  toggleCharacter: (id: string) => void;
  enableAll: (allIds: string[]) => void;
  disableAll: () => void;
  /** Called once at app startup. Only sets defaults when not yet initialized. */
  initDefaults: (allIds: string[]) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      enabledCharacterIds: [],
      initialized: false,

      toggleCharacter: (id) =>
        set((state) => {
          const enabled = new Set(state.enabledCharacterIds);
          if (enabled.has(id)) {
            enabled.delete(id);
          } else {
            enabled.add(id);
          }
          return { enabledCharacterIds: [...enabled] };
        }),

      enableAll: (allIds) => set({ enabledCharacterIds: [...allIds] }),
      disableAll: () => set({ enabledCharacterIds: [] }),

      initDefaults: (allIds) => {
        // Only populate defaults on first ever visit.
        // If initialized=true, the user's persisted selection is respected
        // (including an intentional Disable All).
        if (!get().initialized) {
          set({ enabledCharacterIds: [...allIds], initialized: true });
        }
      },
    }),
    {
      name: 'learn-khmer-settings',
    }
  )
);

/** Returns a stable Set for O(1) lookups — only a new reference when ids change */
export function useEnabledSet(): Set<string> {
  const ids = useSettingsStore((s) => s.enabledCharacterIds);
  return useMemo(() => new Set(ids), [ids]);
}
