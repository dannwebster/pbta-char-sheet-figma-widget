const { widget } = figma
const { AutoLayout, Text } = widget

interface SelectorItem {
  id: string
  label: string
}

interface SelectorDialogProps {
  title: string
  items: SelectorItem[]
  selectedId: string
  onSelect: (id: string) => void
  onCancel: () => void
  onConfirm: () => void
}

export function SelectorDialog(props: SelectorDialogProps) {
  const { title, items, selectedId, onSelect, onCancel, onConfirm } = props

  // Calculate dynamic height based on number of items
  // Title: ~40px, Each item: ~32px (20px text + 12px spacing), Buttons: ~50px, Padding: 48px (24px top + 24px bottom)
  const itemHeight = 32
  const baseHeight = 40 + 50 + 48 + 24 // title + buttons + padding + extra spacing
  const calculatedHeight = baseHeight + (items.length * itemHeight)
  const maxHeight = 600 // Maximum height to prevent overflow
  const dialogHeight = Math.min(calculatedHeight, maxHeight)

  const layoutProps = {
    positioning: "absolute" as const,
    x: 300,
    y: 200,
    width: 450,
    height: dialogHeight,
    fill: "#FFFFFF",
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
        <Text fontSize={24} fontWeight={700}>{title}</Text>
      </AutoLayout>

      {/* Radio buttons centered in remaining space */}
      <AutoLayout width="fill-parent" height="fill-parent" horizontalAlignItems="center" verticalAlignItems="center" padding={{left: 12, right: 12, top: 12, bottom: 12}}>
        <AutoLayout direction="vertical" spacing={12} width="fill-parent">
          {items.map((item) => (
            <AutoLayout
              key={item.id}
              spacing={12}
              verticalAlignItems="center"
              width="fill-parent"
              onClick={() => onSelect(item.id)}
            >
              <AutoLayout
                width={20}
                height={20}
                fill={selectedId === item.id ? "#333333" : "#FFFFFF"}
                stroke="#333333"
                strokeWidth={2}
                cornerRadius={10}
                horizontalAlignItems="center"
                verticalAlignItems="center"
              >
                {selectedId === item.id && (
                  <AutoLayout
                    width={10}
                    height={10}
                    fill="#FFFFFF"
                    cornerRadius={5}
                  />
                )}
              </AutoLayout>
              <Text fontSize={20} width="fill-parent">{item.label}</Text>
            </AutoLayout>
          ))}
        </AutoLayout>
      </AutoLayout>

      {/* Buttons at bottom */}
      <AutoLayout width="fill-parent" horizontalAlignItems="center">
        <AutoLayout direction="horizontal" spacing={12}>
          <AutoLayout
            fill="#333333"
            padding={12}
            cornerRadius={4}
            onClick={onCancel}
            horizontalAlignItems="center"
          >
            <Text fontSize={18} fontWeight={600} fill="#FFFFFF">Cancel</Text>
          </AutoLayout>
          <AutoLayout
            fill="#4CAF50"
            padding={12}
            cornerRadius={4}
            onClick={onConfirm}
            horizontalAlignItems="center"
          >
            <Text fontSize={18} fontWeight={600} fill="#FFFFFF">OK</Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  )
}
