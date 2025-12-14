# 📱 Hiragana Hero Mobile

> **The Native Mobile Experience for Hiragana Hero**  
> Learning Japanese on the go with the power of AI.

## 📖 Overview

**Hiragana Hero Mobile** is the planned native adaptation of the popular web application. Built with **React Native** and **Expo**, it brings the full power of Gemini-assisted learning to your pocket, optimized for touch interfaces and on-the-go study sessions.

## ✨ Mobile-Exclusive Features

While retaining the core logic of the web app, the mobile version introduces native-first enhancements:

- **👆 Gesture-Based Memorization:** Swipe flashcards left or right to mark your progress in Memorize Mode.
- **📳 Haptic Feedback:** Feel the success of a correct quiz answer or a successfully built word.
- **🔊 Native Audio:** Low-latency pronunciation playback using Expo AV.
- **🌑 True Dark Mode:** Optimized for OLED screens.
- **📶 Offline First:** Core study features work without internet (AI Word Builder requires connection).

## 🛠 Proposed Tech Stack

- **Core:** React Native, TypeScript
- **Framework:** Expo (Managed)
- **Routing:** Expo Router
- **Styling:** NativeWind (Tailwind CSS)
- **State/Storage:** Zustand + AsyncStorage
- **AI:** Google Gemini via Vertex AI or API Key

## 🗺️ Roadmap

1.  **Phase 1: Foundation**

    - Setup Expo project with TypeScript and NativeWind.
    - Port existing `constants.ts` (Kana data) and translation logic.
    - Implement Tab Navigation.

2.  **Phase 2: Core Modes**

    - Build **Study Mode** with Grid View and Audio.
    - Build **Quiz Mode** with timer and haptics.
    - Build **Memorize Mode** with swipe gestures.

3.  **Phase 3: The AI Builder**

    - Implement the Word Builder interface using "Tap-to-Slot" interaction.
    - Connect to Google Gemini API.
    - Format AI responses for mobile screens (Bottom Sheets/Modals).

4.  **Phase 4: Polish**
    - Add custom fonts (Google Fonts).
    - Implement Animations (Reanimated).
    - App Icon and Splash Screen design.

## 🚀 Getting Started (Planned)

Once the mobile repo is established, the setup will be:

```bash
# 1. Clone the repository
git clone https://github.com/MusayevDoniyor/hiragana-hero-mobile.git

# 2. Install dependencies
npm install

# 3. Start Expo
npx expo start
```

## 🤝 Contributing to Mobile

The mobile version tracks the web version's data structure to ensure learning consistency. We welcome contributors who specialize in React Native animations and accessible mobile design.

---

_This document serves as the hub for the mobile initiative of Hiragana Hero._
