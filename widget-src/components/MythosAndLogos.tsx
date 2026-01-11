const { widget } = figma
const { AutoLayout, Frame, Text, Input } = widget

import { Grid } from '../Grid'

export function MythosAndLogos(props) {
  const {
    mythosName,
    setMythosName,
    mythosConcept,
    setMythosConcept,
    mythosQuestion,
    setMythosQuestion,
    mythosAttention,
    setMythosAttention,
    mythosFade,
    setMythosFade,
    mythosValue,
    setMythosValue,
    logosName,
    setLogosName,
    logosConcept,
    setLogosConcept,
    logosStatement,
    setLogosStatement,
    logosAttention,
    setLogosAttention,
    logosCrack,
    setLogosCrack,
    logosValue,
    setLogosValue,
    selectedArchetype,
    setSelectedArchetype,
    setPendingRoll,
    STANDARD_OUTCOMES
  } = props

  // Archetype selection
  const archetypes = {
    "Avatar": { mythos: 4, logos: 0 },
    "Legendary": { mythos: 3, logos: 1 },
    "Borderliner": { mythos: 2, logos: 2 },
    "Touched": { mythos: 1, logos: 3 },
    "Sleeper": { mythos: 0, logos: 4 }
  }

  return (
    <AutoLayout direction="vertical" spacing={8} width="fill-parent">
      {/* Archetype Selection Table */}
      <AutoLayout direction="vertical" spacing={8} padding={16} width="fill-parent" fill="#FFFFFF">
        <AutoLayout direction="horizontal" spacing={8} width="fill-parent">
          <Text fontSize={16} fontWeight={700} width={100}></Text>
          {Object.keys(archetypes).map(archetype => (
            <AutoLayout
                key={archetype}
                fill={selectedArchetype === archetype ? "#333333" : "#E6E6E6"}
                padding={8}
                cornerRadius={4}
                width="fill-parent"
                horizontalAlignItems="center"
                onClick={() => {
                  setSelectedArchetype(archetype)
                  setMythosValue(archetypes[archetype].mythos)
                  setLogosValue(archetypes[archetype].logos)
                }}
            >
              <Text fontSize={16} fontWeight={600} fill={selectedArchetype === archetype ? "#FFFFFF" : "#333333"}>{archetype}</Text>
            </AutoLayout>
          ))}
        </AutoLayout>
        <AutoLayout direction="horizontal" spacing={8} width="fill-parent">
          <Text fontSize={16} fontWeight={700} width={100}>Mythos</Text>
          {Object.keys(archetypes).map(archetype => (
            <AutoLayout
                key={archetype}
                padding={8}
                width="fill-parent"
                horizontalAlignItems="center"
            >
              <Text fontSize={16}>+{archetypes[archetype].mythos}</Text>
            </AutoLayout>
          ))}
        </AutoLayout>
        <AutoLayout direction="horizontal" spacing={8} width="fill-parent">
          <Text fontSize={16} fontWeight={700} width={100}>Logos</Text>
          {Object.keys(archetypes).map(archetype => (
            <AutoLayout
                key={archetype}
                padding={8}
                width="fill-parent"
                horizontalAlignItems="center"
            >
              <Text fontSize={16}>+{archetypes[archetype].logos}</Text>
            </AutoLayout>
          ))}
        </AutoLayout>
      </AutoLayout>

      {/* Mythos and Logos Fields */}
      <AutoLayout direction="horizontal" spacing={16} padding={16} width="fill-parent" fill="#FFFFFF">
      <AutoLayout direction="vertical" spacing={8} width="fill-parent">
        <AutoLayout
            onClick={() => {
              const mythosRoll = {
                name: "+Mythos",
                description: null,
                ...STANDARD_OUTCOMES
              }
              setPendingRoll({ modifier: mythosValue, modifierName: "+Mythos", move: mythosRoll })
            }}
            fill="#333333"
            padding={8}
            cornerRadius={4}
            horizontalAlignItems="start"
            spacing={6}
            width={188}
        >
          <Frame width={27} height={27} fill="#FFFFFF" cornerRadius={4}>
            <AutoLayout
                horizontalAlignItems="center"
                verticalAlignItems="center"
                width={27}
                height={27}
                padding={6}
            >
              <Grid sides={6} size={4.5} fill="#333333" spacing={3} />
            </AutoLayout>
          </Frame>
          <Text fontSize={24} fontWeight={700} fill="#FFFFFF">+Mythos</Text>
        </AutoLayout>
        <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
          <Text fontSize={16} width={100}>Name:</Text>
          <Input
              value={mythosName}
              onTextEditEnd={(e) => setMythosName(e.characters)}
              fontSize={16}
              placeholder="Mythos Name"
              width="fill-parent"
          />
        </AutoLayout>
        <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
          <Text fontSize={16} width={100}>Concept:</Text>
          <Input
              value={mythosConcept}
              onTextEditEnd={(e) => setMythosConcept(e.characters)}
              fontSize={16}
              placeholder="Mythos Concept"
              width="fill-parent"
          />
        </AutoLayout>
        <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
          <Text fontSize={16} width={100}>Question:</Text>
          <Input
              value={mythosQuestion}
              onTextEditEnd={(e) => setMythosQuestion(e.characters)}
              fontSize={16}
              placeholder="Mythos Question"
              width="fill-parent"
          />
        </AutoLayout>
        <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
          <Text fontSize={16} width={100}>Attention:</Text>
          <AutoLayout spacing={8} direction="horizontal">
            {[0, 1, 2, 3, 4].map((idx) => (
              <AutoLayout
                  key={idx}
                  width={18}
                  height={18}
                  fill={mythosAttention[idx] ? "#333333" : "#FFFFFF"}
                  stroke="#333333"
                  strokeWidth={2}
                  cornerRadius={4}
                  horizontalAlignItems="center"
                  verticalAlignItems="center"
                  onClick={() => {
                    const newAttention = [...mythosAttention]
                    newAttention[idx] = !newAttention[idx]
                    setMythosAttention(newAttention)
                  }}
              >
                {mythosAttention[idx] && <Text fontSize={12} fill="#FFFFFF">✓</Text>}
              </AutoLayout>
            ))}
          </AutoLayout>
        </AutoLayout>
        <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
          <Text fontSize={16} width={100}>Fade:</Text>
          <AutoLayout spacing={8} direction="horizontal">
            {[0, 1, 2].map((idx) => (
              <AutoLayout
                  key={idx}
                  width={18}
                  height={18}
                  fill={mythosFade[idx] ? "#333333" : "#FFFFFF"}
                  stroke="#333333"
                  strokeWidth={2}
                  cornerRadius={4}
                  horizontalAlignItems="center"
                  verticalAlignItems="center"
                  onClick={() => {
                    const newFade = [...mythosFade]
                    newFade[idx] = !newFade[idx]
                    setMythosFade(newFade)
                  }}
              >
                {mythosFade[idx] && <Text fontSize={12} fill="#FFFFFF">✓</Text>}
              </AutoLayout>
            ))}
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={8} width="fill-parent">
        <AutoLayout
            onClick={() => {
              const logosRoll = {
                name: "+Logos",
                description: null,
                ...STANDARD_OUTCOMES
              }
              setPendingRoll({ modifier: logosValue, modifierName: "+Logos", move: logosRoll })
            }}
            fill="#333333"
            padding={8}
            cornerRadius={4}
            horizontalAlignItems="start"
            spacing={6}
            width={188}
        >
          <Frame width={27} height={27} fill="#FFFFFF" cornerRadius={4}>
            <AutoLayout
                horizontalAlignItems="center"
                verticalAlignItems="center"
                width={27}
                height={27}
                padding={6}
            >
              <Grid sides={6} size={4.5} fill="#333333" spacing={3} />
            </AutoLayout>
          </Frame>
          <Text fontSize={24} fontWeight={700} fill="#FFFFFF">+Logos</Text>
        </AutoLayout>
        <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
          <Text fontSize={16} width={100}>Name:</Text>
          <Input
              value={logosName}
              onTextEditEnd={(e) => setLogosName(e.characters)}
              fontSize={16}
              placeholder="Logos Name"
              width="fill-parent"
          />
        </AutoLayout>
        <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
          <Text fontSize={16} width={100}>Concept:</Text>
          <Input
              value={logosConcept}
              onTextEditEnd={(e) => setLogosConcept(e.characters)}
              fontSize={16}
              placeholder="Logos Concept"
              width="fill-parent"
          />
        </AutoLayout>
        <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
          <Text fontSize={16} width={100}>Statement:</Text>
          <Input
              value={logosStatement}
              onTextEditEnd={(e) => setLogosStatement(e.characters)}
              fontSize={16}
              placeholder="Logos Statement"
              width="fill-parent"
          />
        </AutoLayout>
        <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
          <Text fontSize={16} width={100}>Attention:</Text>
          <AutoLayout spacing={8} direction="horizontal">
            {[0, 1, 2, 3, 4].map((idx) => (
              <AutoLayout
                  key={idx}
                  width={18}
                  height={18}
                  fill={logosAttention[idx] ? "#333333" : "#FFFFFF"}
                  stroke="#333333"
                  strokeWidth={2}
                  cornerRadius={4}
                  horizontalAlignItems="center"
                  verticalAlignItems="center"
                  onClick={() => {
                    const newAttention = [...logosAttention]
                    newAttention[idx] = !newAttention[idx]
                    setLogosAttention(newAttention)
                  }}
              >
                {logosAttention[idx] && <Text fontSize={12} fill="#FFFFFF">✓</Text>}
              </AutoLayout>
            ))}
          </AutoLayout>
        </AutoLayout>
        <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
          <Text fontSize={16} width={100}>Crack:</Text>
          <AutoLayout spacing={8} direction="horizontal">
            {[0, 1, 2].map((idx) => (
              <AutoLayout
                  key={idx}
                  width={18}
                  height={18}
                  fill={logosCrack[idx] ? "#333333" : "#FFFFFF"}
                  stroke="#333333"
                  strokeWidth={2}
                  cornerRadius={4}
                  horizontalAlignItems="center"
                  verticalAlignItems="center"
                  onClick={() => {
                    const newCrack = [...logosCrack]
                    newCrack[idx] = !newCrack[idx]
                    setLogosCrack(newCrack)
                  }}
              >
                {logosCrack[idx] && <Text fontSize={12} fill="#FFFFFF">✓</Text>}
              </AutoLayout>
            ))}
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  )
}
