const { widget } = figma
const { AutoLayout, Text } = widget

interface ClockEntry {
  icon?: string
  name?: string
  modifier: string
}

interface ClockDefinition {
  title: string
  clockId: string
  shape?: "circle" | "square"
  entries: ClockEntry[]
}

interface ClockProps {
  clockDefinition: ClockDefinition
  clockState: boolean[]
  setClockState: (state: boolean[]) => void
  onCheckboxChange?: (index: number, newState: boolean[]) => void
}

export function Clock(props: ClockProps) {
  const { clockDefinition, clockState, setClockState, onCheckboxChange } = props
  const shape = clockDefinition.shape || "circle"
  const cornerRadius = shape === "circle" ? 15 : 4

  return (
    <AutoLayout direction="vertical" spacing={8} width="fill-parent">
      <Text fontSize={30} fontWeight={700}>{clockDefinition.title}</Text>
      {clockDefinition.entries.map((entry, idx) => (
        <AutoLayout key={idx} spacing={8} verticalAlignItems="center" width="fill-parent">
          <AutoLayout
              width={30}
              height={30}
              fill={clockState[idx] ? "#333333" : "#FFFFFF"}
              stroke="#333333"
              strokeWidth={2}
              cornerRadius={cornerRadius}
              horizontalAlignItems="center"
              verticalAlignItems="center"
              onClick={() => {
                const newChecked = [...clockState]
                newChecked[idx] = !newChecked[idx]
                setClockState(newChecked)
                if (onCheckboxChange) {
                  onCheckboxChange(idx, newChecked)
                }
              }}
          >
            {entry.icon && <Text fontSize={18} fill={clockState[idx] ? "#FFFFFF" : "#333333"}>{entry.icon}</Text>}
          </AutoLayout>
          <Text fontSize={21} width={30}>{entry.modifier || null}</Text>
          {entry.name && <Text fontSize={21} width={120}>{entry.name}</Text>}
        </AutoLayout>
      ))}
    </AutoLayout>
  )
}
