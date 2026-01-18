const { widget } = figma
const { AutoLayout, Text } = widget

import { MoveDescriptor } from './MoveDescriptor'
import { CollapsibleSection } from './CollapsibleSection'

export function BasicMoves(props) {
  const {
    movesData,
    basicMovesExpanded,
    setBasicMovesExpanded,
    attributeValues,
    setPendingRoll,
    setPendingMultiAttributeMove,
    handleClockMove,
    setSelectedTooltipMove
  } = props

  const renderContent = () => (
        <AutoLayout direction="vertical" spacing={12} width="fill-parent">
          {/* Attribute Moves - dynamically create rows of 3 */}
          {[0, 1].map(rowIdx => (
            <AutoLayout key={rowIdx} direction="horizontal" spacing={12} width="fill-parent">
              {Object.keys(movesData.AttributeMoves).slice(rowIdx * 3, (rowIdx + 1) * 3).map(attribute => (
                <AutoLayout
                    key={attribute}
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
                    {attribute} Moves
                  </Text>
                  {movesData.AttributeMoves[attribute].map((move, idx) => (
                    <MoveDescriptor
                      key={idx}
                      move={move}
                      onRollClick={() => {
                        setPendingRoll({ modifier: attributeValues[attribute], modifierName: "+" + attribute, move: move })
                      }}
                    />
                  ))}
                </AutoLayout>
              ))}
            </AutoLayout>
          ))}

          {/* Third row: Global Moves, Mythos/Logos Moves, Clock Moves */}
          <AutoLayout direction="horizontal" spacing={12} width="fill-parent">
            {/* Global Moves - only render if section exists */}
            {movesData.MultiAttributeMoves?.find(section => section.Name === "Global Moves") && (
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
                  Global Moves
                </Text>
                {movesData.MultiAttributeMoves.find(section => section.Name === "Global Moves")?.Moves?.map((move, idx) => {
                  const section = movesData.MultiAttributeMoves.find(s => s.Name === "Global Moves")
                  return (
                    <MoveDescriptor
                      key={idx}
                      move={move}
                      onRollClick={() => {
                        setPendingMultiAttributeMove({ move: move, attributes: section.Attributes })
                      }}
                    />
                  )
                })}
              </AutoLayout>
            )}

            {/* Mythos/Logos Moves - only render if section exists */}
            {movesData.MultiAttributeMoves?.find(section => section.Name === "Mythos/Logos Moves") && (
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
                  Mythos/Logos Moves
                </Text>
                {movesData.MultiAttributeMoves.find(section => section.Name === "Mythos/Logos Moves")?.Moves?.map((move, idx) => {
                  const section = movesData.MultiAttributeMoves.find(s => s.Name === "Mythos/Logos Moves")
                  return (
                    <MoveDescriptor
                      key={idx}
                      move={move}
                      onRollClick={() => {
                        setPendingMultiAttributeMove({ move: move, attributes: section.Attributes })
                      }}
                    />
                  )
                })}
              </AutoLayout>
            )}

            {/* Clock Moves */}
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
                Clock Moves
              </Text>
              {movesData.ClockMoves.map((clockMove, idx) => (
                <AutoLayout key={idx} direction="vertical" spacing={4} width="fill-parent">
                  <Text fontSize={18} fontWeight={600} fill="#666666">{clockMove.name}</Text>
                  {clockMove.description && (
                    <Text fontSize={16} fill="#666666">{clockMove.description}</Text>
                  )}
                  {clockMove.advance.map((advanceMove, advIdx) => (
                    <AutoLayout key={`advance-${advIdx}`} direction="vertical" spacing={4} width="fill-parent">
                      <AutoLayout direction="horizontal" spacing={8} width="fill-parent" verticalAlignItems="center" onPointerEnter={() => setSelectedTooltipMove(advanceMove)}>
                        <AutoLayout
                            fill="#333333"
                            padding={6}
                            cornerRadius={4}
                            onClick={() => {
                              handleClockMove(clockMove.clock, "advance", advanceMove.name, advanceMove.description)
                            }}
                        >
                          <Text fontSize={18} fontWeight={700} fill="#FFFFFF">⏱</Text>
                        </AutoLayout>
                        <Text fontSize={22} fontWeight={700} width="fill-parent">
                          → {advanceMove.name}
                        </Text>
                      </AutoLayout>
                      {advanceMove.description && (
                        <Text fontSize={16} fill="#666666" width="fill-parent">
                          {advanceMove.description}
                        </Text>
                      )}
                    </AutoLayout>
                  ))}
                  {clockMove.rollback.map((rollbackMove, rbIdx) => (
                    <AutoLayout key={`rollback-${rbIdx}`} direction="vertical" spacing={4} width="fill-parent">
                      <AutoLayout direction="horizontal" spacing={8} width="fill-parent" verticalAlignItems="center" onPointerEnter={() => setSelectedTooltipMove(rollbackMove)}>
                        <AutoLayout
                            fill="#333333"
                            padding={6}
                            cornerRadius={4}
                            onClick={() => {
                              handleClockMove(clockMove.clock, "rollback", rollbackMove.name, rollbackMove.description)
                            }}
                        >
                          <Text fontSize={18} fontWeight={700} fill="#FFFFFF">⏱</Text>
                        </AutoLayout>
                        <Text fontSize={22} fontWeight={700} width="fill-parent">
                          ← {rollbackMove.name}
                        </Text>
                      </AutoLayout>
                      {rollbackMove.description && (
                        <Text fontSize={16} fill="#666666" width="fill-parent">
                          {rollbackMove.description}
                        </Text>
                      )}
                    </AutoLayout>
                  ))}
                </AutoLayout>
              ))}
            </AutoLayout>
          </AutoLayout>

          {/* Fourth row: Contact Moves - only render if ContactMove exists */}
          {movesData.ContactMove && (
            <AutoLayout direction="horizontal" spacing={12} width="fill-parent">
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
                  Contact Moves
                </Text>
                <MoveDescriptor
                  move={movesData.ContactMove}
                  onRollClick={() => {
                    setPendingRoll({ modifier: 0, modifierName: "+Rating", move: movesData.ContactMove })
                  }}
                />
              </AutoLayout>
            </AutoLayout>
          )}
        </AutoLayout>
  )

  return (
    <CollapsibleSection
      title="Basic Moves"
      expanded={basicMovesExpanded}
      setExpanded={setBasicMovesExpanded}
      renderContent={renderContent}
    />
  )
}
