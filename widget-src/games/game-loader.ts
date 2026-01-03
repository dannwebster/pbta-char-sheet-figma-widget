// Game Loader - imports all game data and provides access based on game ID

import { AVAILABLE_GAMES } from './game-registry'

// Import all game data
import heroesMovesData from './heroes-of-the-mist/moves.json'
import { characterModules as heroesCharacters } from './heroes-of-the-mist/character-loader'

import monsterMovesData from './monster-of-the-week/moves.json'
import { characterModules as monsterCharacters } from './monster-of-the-week/character-loader'

// Type definitions
export interface GameData {
  moves: any
  characters: any[]
}

// Game data registry
const GAME_DATA: Record<string, GameData> = {
  'heroes-of-the-mist': {
    moves: heroesMovesData,
    characters: Object.values(heroesCharacters).flatMap(module => module.characters)
  },
  'monster-of-the-week': {
    moves: monsterMovesData,
    characters: Object.values(monsterCharacters).flatMap(module => module.characters)
  }
}

// Get game data by ID
export function getGameData(gameId: string): GameData {
  const data = GAME_DATA[gameId]
  if (!data) {
    throw new Error(`Game data not found for: ${gameId}`)
  }
  return data
}

// Get list of available games
export function getAvailableGames() {
  return AVAILABLE_GAMES
}
