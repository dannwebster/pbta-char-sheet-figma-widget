const { widget } = figma
const { AutoLayout, Text } = widget

import { Clock } from './Clock'

interface ClockEntry {
  icon: string
  name: string
  modifier: string
}

interface ClockDefinition {
  title: string
  clockId: string
  entries: ClockEntry[]
}

interface ClocksProps {
  clockDefinitions: ClockDefinition[]
  clocks: Record<string, { state: boolean[], setter: (state: boolean[]) => void, size: number }>
}

export function Clocks(props: ClocksProps) {
  const { clockDefinitions, clocks } = props

  return (
    <>
      <Text fontSize={36} fontWeight={700}>Clocks</Text>
      <AutoLayout direction="horizontal" spacing={16} width="fill-parent">
        {clockDefinitions.map((clockDef) => {
          const clockData = clocks[clockDef.clockId]
          if (!clockData) {
            return null
          }
          return (
            <Clock
              key={clockDef.clockId}
              clockDefinition={clockDef}
              clockState={clockData.state}
              setClockState={clockData.setter}
            />
          )
        })}
      </AutoLayout>
    </>
  )
}
