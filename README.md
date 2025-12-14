# 🇯🇵 Hiragana Hero

![Hiragana Hero Banner](https://placehold.co/1200x400/ef4444/ffffff?text=Hiragana+Hero)

> **An interactive Japanese Hiragana learning companion powered by AI.**  
> Master the basics, quiz yourself, and build words with intelligent feedback.

## 📖 About The Project

**Hiragana Hero** is a modern, gamified web application designed to help users learn Japanese Hiragana effectively. Built with React and TypeScript, it offers a seamless learning experience through multiple interactive modes.

What sets Hiragana Hero apart is its integration with **Google's Gemini AI**, providing intelligent feedback and context-aware assistance in the "Word Builder" mode, making the learning process not just about memorization, but about understanding and application.

## ✨ Key Features

- **📚 Study Mode:** A comprehensive interactive chart of all Hiragana characters (Gojūon, Dakuon, Handakuon, Yōon). Track your progress and mark characters as "learned".
- **🧠 Memorize Mode:** Flashcard-style practice to reinforce your memory of characters you are struggling with.
- **🎮 Quiz Mode:** Test your knowledge with timed quizzes. Challenge yourself to identify characters correctly under pressure.
- **🧩 Word Builder (AI Powered):** Construct words using Hiragana tiles. The AI validates your words, provides translations, and offers usage examples, acting as a smart tutor.
- **🎨 Customizable Experience:**
  - **Multiple Fonts:** Switch between Gothic, Handwritten, and Mincho styles to recognize characters in different forms.
  - **Language Support:** Interface available in English and other languages.
- **💾 Progress Persistence:** Your learning progress is automatically saved to your local storage, so you can pick up right where you left off.

## 🛠️ Technology Stack

- **Frontend:** [React](https://reactjs.org/) (v18), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Integration:** [Google Generative AI SDK](https://www.npmjs.com/package/@google/genai) (Gemini)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** or **pnpm**

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/kaizo/hiragana-hero.git
    cd hiragana-hero
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory (or `.env.local`) and add your Google Gemini API key:

    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

5.  **Open your browser**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

## 🕹️ Usage

- **Navigation:** Use the bottom tab bar (or top nav on desktop) to switch between Learn, Memorize, Quiz, and Builder modes.
- **Learning:** In Study mode, click cards to flip them and see the Romaji. Click the checkmark to mark them as learned.
- **Quiz:** Select the number of questions and try to get a high score!
- **Word Builder:** Drag and drop characters into the slots to form a word, then ask the AI to check it.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `package.json` for more information.

## 👤 Author

**Kaizo**

- GitHub: [@kaizo](https://github.com/kaizo)

---

<p align="center">
  Made with ❤️ and TypeScript
</p>
