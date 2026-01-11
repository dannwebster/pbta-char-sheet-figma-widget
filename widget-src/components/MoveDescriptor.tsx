const { widget } = figma
const { AutoLayout, Frame, Text } = widget

import { Grid } from '../Grid'

export function MoveDescriptor(props) {
  const {
    move,
    onRollClick,
    attributeError
  } = props

  return (
    <AutoLayout direction="vertical" spacing={6} width="fill-parent">
      <AutoLayout direction="horizontal" spacing={8} width="fill-parent" verticalAlignItems="center">
        <Text fontSize={22} fontWeight={700} width="fill-parent">
          {move.name}
        </Text>
        {onRollClick && (
          <AutoLayout
              fill="#333333"
              padding={6}
              cornerRadius={4}
              onClick={onRollClick}
              tooltip="Roll dice"
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
        )}
        {attributeError && (
          <AutoLayout
              fill="#FF5555"
              padding={6}
              cornerRadius={4}
              tooltip={attributeError}
          >
            <Text fontSize={18} fontWeight={700} fill="#FFFFFF">⚠</Text>
          </AutoLayout>
        )}
      </AutoLayout>
      <Text fontSize={19} width="fill-parent">
        {move.description}
      </Text>
      {move.outcomes && Object.entries(move.outcomes).map(([key, value]) => (
        <Text key={key} fontSize={19} width="fill-parent">
          • On {key}: {value}
        </Text>
      ))}
      {move.arrays && move.arrays.length > 0 && move.arrays.map((array, arrayIdx) => (
        <AutoLayout key={arrayIdx} direction="vertical" spacing={3} width="fill-parent">
          <Text fontSize={20} fontWeight={600} width="fill-parent">
            {array.title}:
          </Text>
          {array.values && array.values.map((value, valueIdx) => (
            <Text key={valueIdx} fontSize={19} width="fill-parent">
              • {value}
            </Text>
          ))}
        </AutoLayout>
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
    </AutoLayout>
  )
}
