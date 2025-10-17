const { widget } = figma
const { AutoLayout, Frame, Text } = widget

import { Grid } from '../Grid'

export function MoveDescriptor(props) {
  const {
    move,
    onRollClick
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
    </AutoLayout>
  )
}
