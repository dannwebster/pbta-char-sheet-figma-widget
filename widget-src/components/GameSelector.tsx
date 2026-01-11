import { SelectorDialog } from './SelectorDialog'

interface Game {
  id: string
  name: string
}

interface GameSelectorProps {
  availableGames: Game[]
  selectedGame: string
  onSelect: (gameId: string) => void
  onCancel: () => void
  onConfirm: () => void
}

export function GameSelector(props: GameSelectorProps) {
  const { availableGames, selectedGame, onSelect, onCancel, onConfirm } = props

  const items = availableGames.map(game => ({
    id: game.id,
    label: game.name
  }))

  return (
    <SelectorDialog
      title="Select Game"
      items={items}
      selectedId={selectedGame}
      onSelect={onSelect}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
