const { widget } = figma
const { AutoLayout, Text } = widget

import { MoveDescriptor } from './MoveDescriptor'
import { CollapsibleSection } from './CollapsibleSection'

export function CharacterMoves(props) {
  const {
    characterData,
    characterName,
    characterMovesExpanded,
    setCharacterMovesExpanded,
    getAttributeValue,
    setPendingRoll,
    handleClockMove
  } = props

  const renderContent = () => {
    const currentCharacter = characterData.characters.find(c => c.name === characterName)
    if (!currentCharacter || !currentCharacter.moves) return null

    const renderMove = (move, attribute) => (
      <AutoLayout direction="vertical" spacing={6} width="fill-parent">
        <MoveDescriptor
          move={move}
          onRollClick={() => {
            setPendingRoll({ modifier: getAttributeValue(attribute), modifierName: "+" + attribute, move: move })
          }}
        />
        {move.flaw && (
          <AutoLayout direction="horizontal" spacing={8} width="fill-parent" verticalAlignItems="center">
            <AutoLayout
                fill="#333333"
                padding={6}
                cornerRadius={4}
                onClick={() => {
                  const clockName = attribute === "Mythos" ? "mythosAttention" : "logosAttention"
                  handleClockMove(clockName, "advance", `Invoke ${attribute} Flaw`)
                }}
            >
              <Text fontSize={18} fontWeight={700} fill="#FFFFFF">⏱</Text>
            </AutoLayout>
            <Text fontSize={19} width="fill-parent">
              FLAW: {move.flaw.name} - {move.flaw.description}
            </Text>
          </AutoLayout>
        )}
      </AutoLayout>
    )

    return (
      <AutoLayout direction="horizontal" spacing={12} width="fill-parent">
        {/* Mythos Moves */}
        <AutoLayout
            direction="vertical"
            width="fill-parent"
            fill="#F5F5F5"
            stroke="#333333"
            strokeWidth={2}
            padding={16}
            cornerRadius={8}
            spacing={12}
        >
          <Text fontSize={27} fontWeight={700} width="fill-parent" horizontalAlignText="center">
            Mythos Moves
          </Text>
          <Text fontSize={22} fontWeight={700} width="fill-parent">
            Anchor Move
          </Text>
          {currentCharacter.moves.mythosMoves.anchorMove && renderMove(currentCharacter.moves.mythosMoves.anchorMove, "Mythos")}
          <Text fontSize={22} fontWeight={700} width="fill-parent">
            Additional Moves
          </Text>
          {currentCharacter.moves.mythosMoves.additionalMoves && currentCharacter.moves.mythosMoves.additionalMoves.map((move, idx) => (
            <AutoLayout key={idx} width="fill-parent">
              {renderMove(move, "Mythos")}
            </AutoLayout>
          ))}
        </AutoLayout>

        {/* Logos Moves */}
        <AutoLayout
            direction="vertical"
            width="fill-parent"
            fill="#F5F5F5"
            stroke="#333333"
            strokeWidth={2}
            padding={16}
            cornerRadius={8}
            spacing={12}
        >
          <Text fontSize={27} fontWeight={700} width="fill-parent" horizontalAlignText="center">
            Logos Moves
          </Text>
          <Text fontSize={22} fontWeight={700} width="fill-parent">
            Anchor Move
          </Text>
          {currentCharacter.moves.logosMoves.anchorMove && renderMove(currentCharacter.moves.logosMoves.anchorMove, "Logos")}
          <Text fontSize={22} fontWeight={700} width="fill-parent">
            Additional Moves
          </Text>
          {currentCharacter.moves.logosMoves.additionalMoves && currentCharacter.moves.logosMoves.additionalMoves.map((move, idx) => (
            <AutoLayout key={idx} width="fill-parent">
              {renderMove(move, "Logos")}
            </AutoLayout>
          ))}
        </AutoLayout>
      </AutoLayout>
    )
  }

  return (
    <CollapsibleSection
      title="Character Moves"
      expanded={characterMovesExpanded}
      setExpanded={setCharacterMovesExpanded}
      renderContent={renderContent}
    />
  )
}
