// Game Registry - defines all available games

export interface GameConfig {
  id: string
  name: string
  path: string
}

export const AVAILABLE_GAMES: GameConfig[] = [
  {
    id: 'heroes-of-the-mist',
    name: 'Heroes of the Mist',
    path: './games/heroes-of-the-mist'
  },
  {
    id: 'monster-of-the-week',
    name: 'Monster of the Week',
    path: './games/monster-of-the-week'
  }
]

export const DEFAULT_GAME = 'heroes-of-the-mist'
