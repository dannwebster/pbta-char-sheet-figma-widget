const { widget } = figma
const { AutoLayout, Frame, Text } = widget

import { Grid } from '../Grid'

export function MoveHistory(props) {
  const { moveHistory, setMoveHistory, historyPage, setHistoryPage } = props

  return (
    <AutoLayout
        direction="vertical"
        width={600}
        fill="#F5F5F5"
        stroke="#333333"
        strokeWidth={2}
        cornerRadius={8}
        padding={16}
        spacing={16}
    >
      <AutoLayout width="fill-parent" spacing={12} verticalAlignItems="center">
        <Text fontSize={25} fontWeight={700}>Move History</Text>
        {moveHistory.length > 0 && (
          <AutoLayout
              fill="#FF5555"
              padding={8}
              cornerRadius={4}
              onClick={() => {
                setMoveHistory([])
                setHistoryPage(0)
              }}
          >
            <Text fontSize={17.5} fontWeight={600} fill="#FFFFFF">Clear All</Text>
          </AutoLayout>
        )}
      </AutoLayout>
      {moveHistory.length === 0 ? (
        <Text fontSize={20}>Roll a move to see outcomes</Text>
      ) : (
        <>
          <AutoLayout direction="vertical" spacing={12} width="fill-parent">
            {moveHistory.slice(historyPage * 5, (historyPage * 5) + 5).map((entry, idx) => {
              if (entry.type === "clock") {
                // Clock move - simple display
                return (
                  <AutoLayout
                      key={idx}
                      direction="vertical"
                      fill="#FFFFFF"
                      padding={12}
                      cornerRadius={4}
                      width="fill-parent"
                      spacing={8}
                  >
                    <Text fontSize={22.5} fontWeight={700} width="fill-parent">{entry.move.name}</Text>
                    <Text fontSize={17.5} width="fill-parent">{entry.move.description}</Text>
                  </AutoLayout>
                )
              }

              // Regular move with dice roll
              let outcomeText = ""
              let holdOptions = entry.move.hold || []
              if (entry.move.outcomes?.["13+"] && entry.total >= 13) {
                outcomeText = `13+: ${entry.move.outcomes["13+"]}`
              } else if (entry.total >= 10) {
                outcomeText = `10+: ${entry.move.outcomes?.["10+"]}`
              } else if (entry.total >= 7) {
                outcomeText = `7-9: ${entry.move.outcomes?.["7-9"]}`
              } else if (entry.move.outcomes?.["6-"]) {
                outcomeText = `6-: ${entry.move.outcomes["6-"]}`
              } else {
                outcomeText = "fake outcome"
              }

              return (
                <AutoLayout
                    key={idx}
                    direction="vertical"
                    fill="#FFFFFF"
                    padding={12}
                    cornerRadius={4}
                    width="fill-parent"
                    spacing={8}
                >
                   <AutoLayout spacing={8} verticalAlignItems="center" width="fill-parent">
                     <Frame width={20} height={20} fill="#333333" cornerRadius={2}>
                       <AutoLayout horizontalAlignItems="center" verticalAlignItems="center" width={20} height={20} padding={2}>
                         <Grid sides={entry.dice[0]} size={3} fill="#FFFFFF" spacing={2} />
                       </AutoLayout>
                     </Frame>
                     <Frame width={20} height={20} fill="#333333" cornerRadius={2}>
                       <AutoLayout horizontalAlignItems="center" verticalAlignItems="center" width={20} height={20} padding={2}>
                         <Grid sides={entry.dice[1]} size={3} fill="#FFFFFF" spacing={2} />
                       </AutoLayout>
                     </Frame>
                     <Text fontSize={22.5} fontWeight={700} width="fill-parent">{entry.move.name}</Text>
                   </AutoLayout>
                   {entry.subtitle && (
                     <Text fontSize={18} fontWeight={600} fill="#666666" width="fill-parent">{entry.subtitle}</Text>
                   )}
                   {entry.rollText && (
                     <AutoLayout spacing={4} verticalAlignItems="center" width="fill-parent" wrap={true}>
                       <Text fontSize={20} fontWeight={600}>Roll:</Text>
                       <AutoLayout fill="#FF0000" padding={4} cornerRadius={4}>
                         <Text fontSize={20} fontWeight={700} fill="#FFFFFF">{entry.total}</Text>
                       </AutoLayout>
                       <Text fontSize={20} fontWeight={600}>=</Text>
                       <AutoLayout fill="#00AA00" padding={4} cornerRadius={4}>
                         <Text fontSize={20} fontWeight={700} fill="#FFFFFF">({entry.dice[0]} + {entry.dice[1]})</Text>
                       </AutoLayout>
                       {entry.modifierName && (
                         <AutoLayout fill="#0066FF" padding={4} cornerRadius={4}>
                           <Text fontSize={20} fontWeight={700} fill="#FFFFFF">{entry.modifier >= 0 ? '+' : ''}{entry.modifier} ({entry.modifierName})</Text>
                         </AutoLayout>
                       )}
                       {entry.forward !== 0 && (
                         <Text fontSize={20} fontWeight={700} fill="#00AA00">{entry.forward >= 0 ? '+' : ''}{entry.forward} (Forward)</Text>
                       )}
                       {entry.ongoing !== 0 && (
                         <Text fontSize={20} fontWeight={700} fill="#0066FF">{entry.ongoing >= 0 ? '+' : ''}{entry.ongoing} (Ongoing)</Text>
                       )}
                       {entry.harm != null && entry.harm !== 0 && (
                         <Text fontSize={20} fontWeight={700} fill="#FF0000">{entry.harm >= 0 ? '+' : ''}{entry.harm} (Harm)</Text>
                       )}
                       {entry.stress != null && entry.stress !== 0 && (
                         <Text fontSize={20} fontWeight={700} fill="#9933FF">{entry.stress >= 0 ? '+' : ''}{entry.stress} (Stress)</Text>
                       )}
                     </AutoLayout>
                   )}
                   <Text fontSize={17.5} width="fill-parent">{entry.move.description}</Text>
                   {outcomeText && (
                     <Text fontSize={17.5} fontWeight={600} width="fill-parent">{outcomeText}</Text>
                   )}
                   {holdOptions.length > 0 && (
                     <AutoLayout direction="vertical" spacing={4} width="fill-parent">
                       {holdOptions.map((option, optIdx) => (
                         <Text key={optIdx} fontSize={17.5} width="fill-parent">• {option}</Text>
                       ))}
                     </AutoLayout>
                   )}
                 </AutoLayout>
              )
            })}
          </AutoLayout>
          {moveHistory.length > 5 && (
            <AutoLayout spacing={12} horizontalAlignItems="center" width="fill-parent">
              <AutoLayout
                  fill={historyPage > 0 ? "#333333" : "#CCCCCC"}
                  padding={8}
                  cornerRadius={4}
                  onClick={() => historyPage > 0 && setHistoryPage(historyPage - 1)}
              >
                <Text fontSize={17.5} fontWeight={600} fill="#FFFFFF">← Previous</Text>
              </AutoLayout>
              <Text fontSize={17.5}>Page {historyPage + 1} of {Math.ceil(moveHistory.length / 5)}</Text>
              <AutoLayout
                  fill={historyPage < Math.ceil(moveHistory.length / 5) - 1 ? "#333333" : "#CCCCCC"}
                  padding={8}
                  cornerRadius={4}
                  onClick={() => historyPage < Math.ceil(moveHistory.length / 5) - 1 && setHistoryPage(historyPage + 1)}
              >
                <Text fontSize={17.5} fontWeight={600} fill="#FFFFFF">Next →</Text>
              </AutoLayout>
            </AutoLayout>
          )}
        </>
      )}
    </AutoLayout>
  )
}
