const { widget } = figma
const { AutoLayout, Text } = widget

interface DialogButton {
  label: string
  onClick: () => void
  backgroundColor?: string
  textColor?: string
}

interface DialogProps {
  title: string
  message?: string
  buttons: DialogButton[]
  backgroundColor?: string
  x?: number
  y?: number
}

export function Dialog(props: DialogProps) {
  const {
    title,
    message,
    buttons,
    backgroundColor = "#FFFFFF",
    x = 300,
    y = 200
  } = props

  const layoutProps = {
    positioning: "absolute" as const,
    x,
    y,
    width: 450,
    height: 300,
    fill: backgroundColor,
    stroke: "#333333",
    strokeWidth: 3,
    cornerRadius: 8,
    padding: 24,
    direction: "vertical" as const,
    spacing: 0,
    effect: [
      {
        type: 'drop-shadow' as const,
        color: { r: 0, g: 0, b: 0, a: 0.5 },
        offset: { x: 0, y: 4 },
        blur: 20,
        spread: 0,
      },
    ]
  }

  return (
    <AutoLayout {...layoutProps}>
      {/* Title at top */}
      <AutoLayout width="fill-parent" horizontalAlignItems="center">
        <Text fontSize={title.includes("!") ? 32 : 24} fontWeight={700}>{title}</Text>
      </AutoLayout>

      {/* Message centered in remaining space */}
      <AutoLayout width="fill-parent" height="fill-parent" horizontalAlignItems="center" verticalAlignItems="center" padding={{left: 12, right: 12, top: 0, bottom: 0}}>
        {message && <Text fontSize={20} width="fill-parent" horizontalAlignText="center">{message}</Text>}
      </AutoLayout>

      {/* Buttons at bottom */}
      <AutoLayout width="fill-parent" horizontalAlignItems="center">
        <AutoLayout direction="horizontal" spacing={12}>
          {buttons.map((button, idx) => (
            <AutoLayout
                key={idx}
                fill={button.backgroundColor || "#333333"}
                padding={12}
                cornerRadius={4}
                onClick={button.onClick}
                horizontalAlignItems="center"
            >
              <Text fontSize={18} fontWeight={600} fill={button.textColor || "#FFFFFF"}>
                {button.label}
              </Text>
            </AutoLayout>
          ))}
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  )
}
