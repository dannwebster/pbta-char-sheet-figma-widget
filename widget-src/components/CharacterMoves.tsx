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
    if (!currentCharacter || !currentCharacter.moves || !currentCharacter.moves.characterMoveGroups) return null

    const renderMove = (move) => {
      // Determine if move has a valid attribute
      let onRollClick = null
      let attributeError = null

      if (move.attribute) {
        // Check if attribute exists
        try {
          const value = getAttributeValue(move.attribute)
          if (value !== undefined && value !== null) {
            // Valid attribute - provide roll callback
            onRollClick = () => {
              setPendingRoll({
                modifier: value,
                modifierName: "+" + move.attribute,
                move: move
              })
            }
          } else {
            // Attribute returned undefined/null - invalid
            attributeError = `Error: Attribute ${move.attribute} doesn't exist`
          }
        } catch (e) {
          // getAttributeValue threw an error - invalid attribute
          attributeError = `Error: Attribute ${move.attribute} doesn't exist`
        }
      }
      // If no move.attribute, both onRollClick and attributeError remain null

      return (
        <AutoLayout direction="vertical" spacing={6} width="fill-parent">
          <MoveDescriptor
            move={move}
            onRollClick={onRollClick}
            attributeError={attributeError}
          />
          {move.flaw && (
            <AutoLayout direction="horizontal" spacing={8} width="fill-parent" verticalAlignItems="center">
              <AutoLayout
                  fill="#333333"
                  padding={6}
                  cornerRadius={4}
                  onClick={() => {
                    const attribute = move.attribute || "Mythos" // fallback for flaw clock
                    const clockName = attribute === "Mythos" ? "mythosAttention" : "logosAttention"
                    handleClockMove(clockName, "advance", `Invoke ${attribute} Flaw`, `${move.flaw.name}: ${move.flaw.description}`)
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
    }

    const renderMoveGroup = (group, groupIdx) => {
      const hasAnchorMove = group.anchorMove && Object.keys(group.anchorMove).length > 0

      return (
        <AutoLayout
            key={groupIdx}
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
            {group.type}
          </Text>
          {hasAnchorMove && (
            <AutoLayout direction="vertical" spacing={12} width="fill-parent">
              <Text fontSize={22} fontWeight={700} width="fill-parent">
                Anchor Move
              </Text>
              {renderMove(group.anchorMove)}
            </AutoLayout>
          )}
          {hasAnchorMove && group.additionalMoves && group.additionalMoves.length > 0 && (
            <Text fontSize={22} fontWeight={700} width="fill-parent">
              Additional Moves
            </Text>
          )}
          {group.additionalMoves && group.additionalMoves.map((move, idx) => (
            <AutoLayout key={idx} width="fill-parent">
              {renderMove(move)}
            </AutoLayout>
          ))}
        </AutoLayout>
      )
    }

    return (
      <AutoLayout direction="horizontal" spacing={12} width="fill-parent">
        {currentCharacter.moves.characterMoveGroups.map((group, idx) => renderMoveGroup(group, idx))}
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
