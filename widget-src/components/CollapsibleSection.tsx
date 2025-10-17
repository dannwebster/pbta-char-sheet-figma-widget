const { widget } = figma
const { AutoLayout, Text } = widget

export function CollapsibleSection(props) {
  const {
    title,
    expanded,
    setExpanded,
    renderContent
  } = props

  return (
    <AutoLayout
        direction="vertical"
        width={2250}
        fill="#FFFFFF"
        stroke="#333333"
        strokeWidth={2}
        padding={16}
        spacing={12}
        cornerRadius={8}
    >
      <AutoLayout
          direction="horizontal"
          width="fill-parent"
          verticalAlignItems="center"
          spacing={12}
      >
        <AutoLayout
            fill="#333333"
            padding={8}
            cornerRadius={4}
            onClick={() => setExpanded(!expanded)}
        >
          <Text fontSize={25} fontWeight={700} fill="#FFFFFF">
            {expanded ? "▼" : "▶"}
          </Text>
        </AutoLayout>
        <Text fontSize={30} fontWeight={700} width="fill-parent" horizontalAlignText="center">
          {title}
        </Text>
      </AutoLayout>

      {expanded && renderContent()}
    </AutoLayout>
  )
}
