const { widget } = figma
const { AutoLayout, Frame, Text } = widget

import { Grid } from '../Grid'
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
        <AutoLayout direction="horizontal" spacing={8} width="fill-parent" verticalAlignItems="center">
          <Text fontSize={22} fontWeight={700} width="fill-parent">
            {move.name}
          </Text>
          <AutoLayout
              fill="#333333"
              padding={6}
              cornerRadius={4}
              onClick={() => {
                setPendingRoll({ modifier: getAttributeValue(attribute), modifierName: "+" + attribute, move: move })
              }}
          >
            <Frame width={18} height={18} fill="#FFFFFF" cornerRadius={3}>
              <AutoLayout
                  horizontalAlignItems="center"
                  verticalAlignItems="center"
                  width={18}
                  height={18}
                  padding={4}
              >
                <Grid sides={6} size={3} fill="#333333" spacing={2} />
              </AutoLayout>
            </Frame>
          </AutoLayout>
        </AutoLayout>
        <Text fontSize={19} width="fill-parent">
          {move.description}
        </Text>
        {move.outcomes && Object.entries(move.outcomes).map(([key, value]) => (
          <Text key={key} fontSize={19} width="fill-parent">
            • On {key}: {value}
          </Text>
        ))}
        {move.hold && move.hold.length > 0 && (
          <AutoLayout direction="vertical" spacing={3} width="fill-parent">
            {move.hold.map((option, optIdx) => (
              <Text key={optIdx} fontSize={19} width="fill-parent">
                • {option}
              </Text>
            ))}
          </AutoLayout>
        )}
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
