import { SelectorDialog } from './SelectorDialog'

interface Character {
  name: string
  subtitle?: string
}

interface CharacterSelectorProps {
  availableCharacters: Character[]
  selectedCharacter: string
  onSelect: (characterName: string) => void
  onCancel: () => void
  onConfirm: () => void
}

export function CharacterSelector(props: CharacterSelectorProps) {
  const { availableCharacters, selectedCharacter, onSelect, onCancel, onConfirm } = props

  const items = availableCharacters.map(character => ({
    id: character.name,
    label: character.subtitle ? `${character.name} (${character.subtitle})` : character.name
  }))

  return (
    <SelectorDialog
      title="Select Character"
      items={items}
      selectedId={selectedCharacter}
      onSelect={onSelect}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
