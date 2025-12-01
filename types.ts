import React from 'react';

export interface PlayerData {
  name: string;
  group: string;
  listNumber: string;
}

export interface Riddle {
  id: number;
  question: string;
  answerKeywords: string[]; // List of valid answers (to allow variations)
  hint?: string;
}

export type GamePhase = 
  | 'intro'       // The macabre opening
  | 'register'    // Data collection
  | 'playing'     // Active chat/riddle solving
  | 'finished';   // Final database view

export interface ChatMessage {
  id: string;
  sender: 'entity' | 'user';
  text: string | React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'system';
  isRiddle?: boolean; // If true, this message will vanish when the next riddle starts
}

export interface GameState {
  phase: GamePhase;
  player: PlayerData;
  currentRiddleIndex: number;
  errors: number;
  startTime: number | null;
  endTime: number | null;
  messages: ChatMessage[];
  isProcessing: boolean; // Blocks input while entity is "thinking"
}