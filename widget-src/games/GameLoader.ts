// Game Loader - Static imports of all game data
// To add a new game:
// 1. Create a folder under widget-src/games/your-game-name/
// 2. Add moves.json, CharacterLoader.ts, and characters/ folder
// 3. Import the game data below
// 4. Add an entry to the GAMES object

import type { GameData } from '../lib/GameDefinition'

// Import all game data
import heroesMovesData from './heroes-of-the-mist/moves.json'
import { characterModules as heroesCharacters } from './heroes-of-the-mist/CharacterLoader'

import monsterMovesData from './monster-of-the-week/moves.json'
import { characterModules as monsterCharacters } from './monster-of-the-week/CharacterLoader'

import invisibleMovesData from './invisible-orders/moves.json'
import { characterModules as invisibleCharacters } from './invisible-orders/CharacterLoader'

// All available games (static list)
export const GAMES: Record<string, GameData> = {
  'heroes-of-the-mist': {
    id: 'heroes-of-the-mist',
    name: 'Heroes of the Mist',
    moves: heroesMovesData,
    characters: Object.values(heroesCharacters).flatMap(module => module.characters),
    isDefault: true
  },
  'monster-of-the-week': {
    id: 'monster-of-the-week',
    name: 'Monster of the Week',
    moves: monsterMovesData,
    characters: Object.values(monsterCharacters).flatMap(module => module.characters),
  },
  'invisible-orders': {
    id: 'invisible-orders',
    name: 'Invisible Orders',
    moves: invisibleMovesData,
    characters: Object.values(invisibleCharacters).flatMap(module => module.characters),
  }
}
