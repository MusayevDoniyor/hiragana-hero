# Mobile App Development Prompt for Hiragana Hero

**Role:** Expert React Native Developer
**Task:** Port the existing "Hiragana Hero" web application (React + Vite + Tailwind) to a high-quality mobile application using **React Native (Expo)**.

## 📱 Project Overview

"Hiragana Hero" is an interactive Japanese learning app powered by Google's Gemini AI. The goal is to create a native iOS/Android experience that retains the "wow" factor of the web version while optimizing for touch interactions and mobile performance.

## 🛠 Tech Stack Requirements

- **Framework:** React Native with [Expo](https://expo.dev/) (Managed Workflow)
- **Language:** TypeScript
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for RN)
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Icons:** Lucide React Native or Expo Vector Icons
- **Storage:** `react-native-async-storage` (for persistence)
- **AI:** Google Generative AI SDK (Gemini)
- **Audio:** `expo-av` (for pronunciation sounds)

## 🌟 Core Features to Port

### 1. Navigation Structure

- Implement a **Tab-based navigation** (bottom bar) for the main modes:
  - **Learn:** Character chart (Main Home).
  - **Memorize:** Flashcards.
  - **Quiz:** Testing knowledge.
  - **Builder:** AI Word Builder.
- **Header:** Custom header with "Hiragana Hero" branding, Font Style selector, and Language selector (Settings).

### 2. Learn Mode (Home)

- Display the Hiragana chart (Gojūon, Dakuon, etc.) in a scrollable, responsive grid.
- **Interaction:** Tapping a character card flips it (animation) to show Romaji and plays the pronunciation audio.
- **Feature:** Long-press or button to mark as "Learned" (persisted in storage).

### 3. Memorize Mode (Flashcards)

- Show a stack of cards for characters marked as "not learned" (or all).
- **Mobile enhancement:** Implement **Swipe gestures** (Left for "Still Learning", Right for "Got it!") using `react-native-reanimated` or similar for a premium feel.

### 4. Quiz Mode

- Timed gamified experience.
- Display a character/romaji and 4 multiple-choice options.
- Haptic feedback (using `expo-haptics`) on correct/incorrect answers.
- Progress bar and high score tracking with Async Storage.

### 5. Word Builder (AI Powered)

- **Challenge:** Drag-and-drop on mobile can be tricky.
  - _Solution:_ Use a "Tap to Select" interaction model or `react-native-drax` if a drag experience is strictly required. Tap a character from the keyboard/grid to add it to the "Word Slots".
- **Action:** "Check Word" button sends the constructed string to Google Gemini API.
- **Output:** Display AI feedback (Translation, Correctness, Nuances) in a clean, scrollable modal or bottom sheet.

## 🎨 Design Guidelines

- **Premium Aesthetic:** Use the existing color palette (Red/White/Slate).
- **Dark Mode:** Support system dark mode using NativeWind.
- **Animations:** Use `react-native-reanimated` for smooth card flips, modal entries, and button presses. The app should feel "alive".
- **Typography:** Custom Japanese fonts (if possible via Expo Google Fonts) to match the web version (Gothic, Handwritten, Mincho options).

## 📂 Project Structure

```
/app          # Expo Router pages
/components   # Reusable UI components
/hooks        # Custom hooks (useAudio, useGemini, useStorage)
/constants    # Data (Kana charts, translations)
/services     # API and Logic
/assets       # Fonts, Images, Sounds
```

## 🚀 Deliverables

1.  Complete source code for the Expo project.
2.  Instructions on how to run on iOS/Android simulators.
3.  A comprehensive README specific to the mobile build.

_Generate the initial project setup, key components, and the main navigation structure._
