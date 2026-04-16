# lang-prac-khmer — Project Plan

## Overview

A focused Khmer language learning web app. Supports alphabet study, three quiz modes, handwriting practice, and future phrase lessons. Character selection is configurable via a persistent settings menu.

**Repo name:** `lang-prac-khmer`  
**Primary URL:** `https://username.github.io/learn-khmer` (GitHub Pages)  
**Secondary URL:** S3 static website (staging / backup)

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 19 + TypeScript + Vite | Same as lang-prac-simple-web, no ramp-up |
| UI | MUI v7 | Same as current, consistent look |
| Routing | React Router v6 | Needed for real URL-based navigation |
| State / Settings | Zustand | Lightweight, first-class localStorage persistence |
| Deployment | GitHub Actions → GitHub Pages + S3 | Dual target from day one |

---

## Project Structure

```
lang-prac-khmer/
├── public/
│   data/
│     khmer-alphabet/
│       content.csv          # copy from lang-prac-simple-web
│       *.mp3                # copy audio files from lang-prac-simple-web
│     khmer-phrases/
│       lesson-01/
│         content.csv        # English, Khmer, (optional audio filename)
│       lesson-02/
│         content.csv
│   404.html                 # SPA redirect trick for GitHub Pages
├── src/
│   data/
│     characters.ts          # static Khmer character definitions
│     phrases.ts             # phrase CSV loader (grouped by lesson)
│   store/
│     settingsStore.ts       # Zustand: enabled character IDs, persisted to localStorage
│   hooks/
│     useQuiz.ts             # generic quiz engine hook
│     useAudio.ts            # audio playback hook
│   components/
│     AudioButton.tsx        # reusable play/pause button
│     HandwritingPad.tsx     # canvas drawing component
│     AlphabetGrid.tsx       # grid of character cards
│     CharacterCard.tsx      # single character tile (used in alphabet + settings)
│     NavBar.tsx             # top navigation
│   views/
│     HomeView.tsx           # landing / mode select
│     AlphabetView.tsx       # browse all characters, play audio
│     SoundToCharView.tsx    # quiz: hear audio → pick character
│     CharToSoundView.tsx    # quiz: see character → play/identify audio
│     HandwritingView.tsx    # quiz: hear audio → draw on canvas
│     PhrasesView.tsx        # list of phrase lessons
│     PhraseQuizView.tsx     # quiz for a specific phrase lesson (future)
│     SettingsView.tsx       # toggle which characters appear in quizzes
│   router.tsx
│   App.tsx
│   main.tsx
│   index.css
├── cloudformation/
│   s3-bucket.yml            # new S3 bucket stack (same pattern as lang-prac-simple-web)
├── .github/
│   workflows/
│     deploy-pages.yml       # push to main → build → deploy to GitHub Pages
│     deploy-s3.yml          # push to main → build → sync to S3
│     deploy-infra.yml       # manual trigger → apply CloudFormation stack
├── vite.config.ts
├── package.json
├── tsconfig.json
└── .gitignore
```

---

## Routing

```
/                        HomeView — pick a mode
/alphabet                AlphabetView — browse characters, play audio
/quiz/sound-to-char      SoundToCharView
/quiz/char-to-sound      CharToSoundView
/quiz/handwriting        HandwritingView
/phrases                 PhrasesView — lesson list
/phrases/:lessonId       PhraseQuizView (future)
/settings                SettingsView — character toggles
```

---

## Core: Quiz Engine (`useQuiz` hook)

Replaces the `BaseQuiz` render-prop component from the current app with a clean hook.

```ts
// src/hooks/useQuiz.ts
interface UseQuizOptions {
  items: QuizItem[];       // filtered by settings store
  numOptions?: number;     // default 4
}

interface UseQuizReturn {
  currentItem: QuizItem;
  options: QuizItem[];
  selectedOption: QuizItem | null;
  score: number;
  total: number;
  handleAnswer: (item: QuizItem) => void;
  next: () => void;
}
```

- Items are shuffled on init
- Works identically for alphabet quizzes and phrase quizzes — just pass different item arrays
- Score tracked per session

---

## Settings & Character Filtering (`settingsStore`)

```ts
// src/store/settingsStore.ts (Zustand)
interface SettingsStore {
  enabledCharacterIds: Set<string>;
  toggleCharacter: (id: string) => void;
  enableAll: () => void;
  disableAll: () => void;
}
```

- Persisted to `localStorage` via Zustand's `persist` middleware
- All quiz views derive their `items` array by filtering `characters` through `enabledCharacterIds`
- Settings view uses `AlphabetGrid` with checkboxes/toggles on each `CharacterCard`
- Default: all characters enabled

---

## Data Model

### Characters (`src/data/characters.ts`)

```ts
interface KhmerCharacter {
  id: string;           // e.g. 'ក'
  character: string;    // e.g. 'ក'
  audioPath: string;    // e.g. 'data/khmer-alphabet/ក.mp3'
  romanization?: string; // optional display hint
}
```

Loaded statically from `content.csv` at build time (or fetched at runtime, same as current).

### Phrases (`src/data/phrases.ts`)

```ts
interface KhmerPhrase {
  id: string;
  english: string;
  khmer: string;
  audioPath?: string;   // optional, add later when files exist
  lessonId: string;     // e.g. 'lesson-01'
}
```

CSV format: `English,Khmer` (audio column optional, same pattern as Vietnamese in current app).

---

## GitHub Actions Workflows

### `deploy-pages.yml` — GitHub Pages (primary)

```yaml
on:
  push:
    branches: [main]

steps:
  - checkout
  - npm ci
  - npm run build:pages   # sets VITE_BASE=/learn-khmer/
  - deploy to gh-pages branch via peaceiris/actions-gh-pages
```

- Vite `base` is set via env var: `base: process.env.VITE_BASE ?? '/'`
- The built `dist/` is pushed to the `gh-pages` branch
- GitHub Pages serves from that branch

### `deploy-s3.yml` — S3 (secondary/staging)

```yaml
on:
  push:
    branches: [main]

steps:
  - checkout
  - npm ci
  - npm run build        # base: '/'
  - aws s3 sync dist/ s3://${{ secrets.S3_BUCKET_NAME }} --delete
```

Secrets needed (same values as lang-prac-simple-web):
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET_NAME` (new bucket, e.g. `lang-prac-khmer`)

### `deploy-infra.yml` — CloudFormation (manual)

```yaml
on:
  workflow_dispatch:   # manual trigger only

steps:
  - aws cloudformation deploy
      --template-file cloudformation/s3-bucket.yml
      --stack-name lang-prac-khmer-stack
```

Run once to create the S3 bucket before first deploy.

---

## GitHub Pages: SPA Deep-Link Fix

React Router deep links (e.g. `/learn-khmer/quiz/handwriting`) return 404 on GH Pages because there's no server to redirect to `index.html`. Fix:

1. `public/404.html` — redirects to `/?p=<encoded-path>`
2. Small inline script in `index.html` — reads `?p=` and restores the path before React Router boots

This is a well-established pattern and requires no extra dependencies.

---

## Build Scripts (`package.json`)

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "build:pages": "tsc -b && vite build --base=/learn-khmer/",
  "preview": "vite preview"
}
```

---

## Audio Files

Copy from `lang-prac-simple-web/public/data/khmer-alphabet/*.mp3` into `lang-prac-khmer/public/data/khmer-alphabet/`. No changes needed — same filenames, same paths.

---

## Phase Plan

### Phase 1 — Foundation
- [ ] Scaffold project (Vite + React + TS + MUI + React Router + Zustand)
- [ ] Copy audio files and characters CSV
- [ ] `characters.ts` data file
- [ ] `settingsStore.ts` with localStorage persistence
- [ ] Routing + NavBar
- [ ] HomeView

### Phase 2 — Core Features
- [ ] `useQuiz` hook
- [ ] `useAudio` hook
- [ ] AlphabetView (browse + play)
- [ ] SoundToCharView (quiz)
- [ ] CharToSoundView (quiz)
- [ ] HandwritingView (canvas quiz, auto-play, shuffle)

### Phase 3 — Settings
- [ ] SettingsView with character toggles
- [ ] Filter integration into all quiz views

### Phase 4 — Deployment
- [ ] CloudFormation S3 bucket
- [ ] `deploy-infra.yml`
- [ ] `deploy-s3.yml`
- [ ] `deploy-pages.yml` + GH Pages SPA fix
- [ ] Configure GitHub repo: enable Pages from `gh-pages` branch

### Phase 5 — Phrases (future)
- [ ] Phrase CSV files + data loader
- [ ] PhrasesView (lesson list)
- [ ] PhraseQuizView (reuse `useQuiz` hook with phrase items)
