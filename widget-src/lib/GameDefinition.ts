// Game type definitions and helper functions

export interface GameData {
  id: string
  name: string
  moves: any
  characters: any[]
  charts?: any[]
  iconSvg?: string
  isDefault?: boolean
}

// Get game data by ID
export function getGameData(games: Record<string, GameData>, gameId: string): GameData {
  const data = games[gameId]
  if (!data) {
    throw new Error(`Game data not found for: ${gameId}`)
  }
  return data
}

// Get list of available games
export function getAvailableGames(games: Record<string, GameData>): GameData[] {
  return Object.values(games)
}

// Get the default game
export function getDefaultGame(games: Record<string, GameData>): GameData {
  const defaultGame = Object.values(games).find(game => game.isDefault)
  if (!defaultGame) {
    throw new Error('No default game found')
  }
  return defaultGame
}
