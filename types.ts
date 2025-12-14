export interface Kana {
  char: string;
  romaji: string;
  category: 'monograph' | 'diacritic' | 'digraph';
  row: string;
}

export enum AppMode {
  LEARN = 'LEARN',
  QUIZ = 'QUIZ',
  BUILDER = 'BUILDER',
  MEMORIZE = 'MEMORIZE',
}

export enum AppLanguage {
  ENG = 'English',
  UZB = 'Oʻzbek',
  RUS = 'Русский',
  DEU = 'Deutsch',
  JPN = '日本語'
}

export enum FontStyle {
  SANS = 'jp-font',
  HAND = 'jp-handwritten',
  SERIF = 'jp-serif',
}

export interface ExampleSentence {
  japanese: string;
  romaji: string;
  translation: string;
}

export interface WordAnalysis {
  isValid: boolean;
  reading: string;
  meaning: string;
  breakdown: string;
  examples: ExampleSentence[];
}

export interface QuizQuestion {
  kana: Kana;
  options: string[];
}

export interface VocabWord {
  id: string;
  japanese: string;
  romaji: string;
  meaning: string;
}

export interface VocabTopic {
  id: string;
  title: Record<AppLanguage, string>;
  words: VocabWord[];
  isCustom?: boolean;
}
