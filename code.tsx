const { widget } = figma
const { Rectangle, AutoLayout, Frame, Text, useSyncedState, usePropertyMenu, useEffect, Ellipse, Input } = widget

const attributes = ["Muscle", "Finesse", "Grit", "Moxie", "Smarts", "Coin"]

function Dot(props) {
  let visible = props.visible
  let size = props.size || 24
  let fill = props.fill || "#333333"
  return (
      <Ellipse
          opacity={visible ? 1 : 0}
          width={size}
          height={size}
          fill={fill}
      ></Ellipse>
  )
}

function Grid(props) {
  let sides = props.sides
  let dotSize = props.size || 24
  let dotFill = props.fill || "#333333"
  let dotSpacing = props.spacing || 12
  let attrs = {
    direction: "vertical" as const,
    spacing: dotSpacing,
    width: "fill-parent" as const
  }
  switch(sides) {
    case 1:
      return <Dot visible={true} size={dotSize} fill={dotFill} />
    case 2:
    case 3:
      return <AutoLayout {...attrs}>
        <AutoLayout horizontalAlignItems="start" width="fill-parent"><Dot visible={true} size={dotSize} fill={dotFill} /></AutoLayout>
        <AutoLayout horizontalAlignItems="center" width="fill-parent"><Dot visible={sides == 2 ? false : true} size={dotSize} fill={dotFill} /></AutoLayout>
        <AutoLayout horizontalAlignItems="end" width="fill-parent"><Dot visible={true} size={dotSize} fill={dotFill} /></AutoLayout>
      </AutoLayout>
    case 4:
    case 5:
      return <AutoLayout {...attrs}>
        <AutoLayout spacing="auto" width="fill-parent"><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /></AutoLayout>
        <AutoLayout horizontalAlignItems="center" width="fill-parent"><Dot visible={sides == 4 ? false : true} size={dotSize} fill={dotFill} /></AutoLayout>
        <AutoLayout spacing="auto" width="fill-parent"><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /></AutoLayout>
      </AutoLayout>
    case 6:
      return <AutoLayout {...attrs}>
        <AutoLayout spacing="auto" width="fill-parent"><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /></AutoLayout>
        <AutoLayout horizontalAlignItems="center" width="fill-parent"><Dot visible={false} size={dotSize} fill={dotFill} /></AutoLayout>
        <AutoLayout spacing="auto" width="fill-parent"><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /></AutoLayout>
      </AutoLayout>
    default:
      return <Dot visible={true} size={dotSize} fill={dotFill} />
  }
}

function lildice() {
  const [initialized, setInitialized] = useSyncedState("initialized", false)
  const [sides1, setSides1] = useSyncedState("side1", null)
  const [sides2, setSides2] = useSyncedState("side2", null)
  const [modifier, setModifier] = useSyncedState("modifier", 0)
  const [modifierName, setModifierName] = useSyncedState("modifierName", "")
  const [forward, setForward] = useSyncedState("forward", 0)
  const [ongoing, setOngoing] = useSyncedState("ongoing", 0)
  const [characterName, setCharacterName] = useSyncedState("characterName", "Character Name")

  // Snapshot of modifiers used in the last roll
  const [rolledForward, setRolledForward] = useSyncedState("rolledForward", 0)
  const [rolledOngoing, setRolledOngoing] = useSyncedState("rolledOngoing", 0)
  const [rolledModifier, setRolledModifier] = useSyncedState("rolledModifier", 0)

  // Initialize attribute values as an object
  const initialAttributeValues = {}
  attributes.forEach(attr => {
    initialAttributeValues[attr] = 0
  })
  const [attributeValues, setAttributeValues] = useSyncedState("attributeValues", initialAttributeValues)

  let roll = (mod, name) => {
    let number1 = Math.floor(Math.random() * 6) + 1
    let number2 = Math.floor(Math.random() * 6) + 1
    let total = number1 + number2 + mod + forward + ongoing

    // Save snapshot of modifiers used in this roll
    setSides1(number1)
    setSides2(number2)
    setRolledModifier(mod)
    setModifierName(name)
    setRolledForward(forward)
    setRolledOngoing(ongoing)

    // Reset forward after roll
    setForward(0)

    console.log(number1, number2, mod, forward, ongoing)
    figma.notify('You rolled a ' + number1 + ' and a ' + number2 + ' (total: ' + total + ')')
  }

  useEffect(() => {
    figma.widget.waitForTask(new Promise(async resolve => {
      if (!initialized) {
        roll()
        setInitialized(true)
      }

      resolve(true)
    }))
  })

  return (
      <AutoLayout direction="vertical" spacing={0} horizontalAlignItems="center" stroke="#333333" strokeWidth={2} cornerRadius={8} width={600}>
        <AutoLayout padding={16} width="fill-parent" fill="#FFFFFF">
          <Text fontSize={40} fontWeight={700}>Character: </Text>
          <Input
              value={characterName}
              onTextEditEnd={(e) => setCharacterName(e.characters)}
              fontSize={40}
              fontWeight={700}
              placeholder="Character Name"
              width="fill-parent"
          />
        </AutoLayout>
        <AutoLayout direction="horizontal" spacing={24} padding={24}>
          <AutoLayout direction="vertical" spacing={24}>
            <Frame
              fill="#FFFFFF"
              width={192}
              height={192}
              cornerRadius={32}
              onClick={() => roll(0, "")}
              effect={[
                {
                  type: 'drop-shadow',
                  color: { r: 0, g: 0, b: 0, a: 0.08 },
                  offset: { x: 0, y: 24 },
                  blur: 40,
                  spread: 0,
                },
                {
                  type: 'drop-shadow',
                  color: { r: 0, g: 0, b: 0, a: 0.12 },
                  offset: { x: 0, y: 2 },
                  blur: 8,
                  spread: 0,
                },
              ]}
          >
            {sides1 ?
                <AutoLayout
                    horizontalAlignItems="center"
                    verticalAlignItems="center"
                    width={192}
                    height={192}
                    padding={48}
                >
                  <Grid sides={sides1} />
                </AutoLayout>
                : null}
          </Frame>
          <Frame
              fill="#FFFFFF"
              width={192}
              height={192}
              cornerRadius={32}
              onClick={() => roll(0, "")}
              effect={[
                {
                  type: 'drop-shadow',
                  color: { r: 0, g: 0, b: 0, a: 0.08 },
                  offset: { x: 0, y: 24 },
                  blur: 40,
                  spread: 0,
                },
                {
                  type: 'drop-shadow',
                  color: { r: 0, g: 0, b: 0, a: 0.12 },
                  offset: { x: 0, y: 2 },
                  blur: 8,
                  spread: 0,
                },
              ]}
          >
            {sides2 ?
                <AutoLayout
                    horizontalAlignItems="center"
                    verticalAlignItems="center"
                    width={192}
                    height={192}
                    padding={48}
                >
                  <Grid sides={sides2} />
                </AutoLayout>
                : null}
          </Frame>
          </AutoLayout>
          <AutoLayout direction="vertical" spacing={8}>
            {attributes.map(attr => (
              <AutoLayout
                  key={attr}
                  fill="#FFFFFF"
                  padding={12}
                  cornerRadius={8}
                  spacing={12}
                  verticalAlignItems="center"
              >
                <AutoLayout direction="vertical" spacing={4}>
                  <AutoLayout
                      fill="#E6E6E6"
                      padding={4}
                      cornerRadius={4}
                      width={24}
                      horizontalAlignItems="center"
                      onClick={() => {
                        const newVal = Math.min(5, attributeValues[attr] + 1)
                        setAttributeValues({
                          ...attributeValues,
                          [attr]: newVal
                        })
                      }}
                  >
                    <Text fontSize={12} fontWeight={600}>+</Text>
                  </AutoLayout>
                  <AutoLayout
                      fill="#E6E6E6"
                      padding={4}
                      cornerRadius={4}
                      width={24}
                      horizontalAlignItems="center"
                      onClick={() => {
                        const newVal = Math.max(-5, attributeValues[attr] - 1)
                        setAttributeValues({
                          ...attributeValues,
                          [attr]: newVal
                        })
                      }}
                  >
                    <Text fontSize={12} fontWeight={600}>-</Text>
                  </AutoLayout>
                </AutoLayout>
                <Input
                    value={(attributeValues[attr] >= 0 ? '+' : '') + String(attributeValues[attr])}
                    onTextEditEnd={(e) => {
                      let val = parseInt(e.characters)
                      if (!isNaN(val)) {
                        setAttributeValues({
                          ...attributeValues,
                          [attr]: Math.max(-5, Math.min(5, val))
                        })
                      }
                    }}
                    fontSize={24}
                    width={60}
                    horizontalAlignText="center"
                />
                <AutoLayout
                    onClick={() => roll(attributeValues[attr], "+" + attr)}
                    fill="#333333"
                    padding={8}
                    cornerRadius={4}
                    horizontalAlignItems="start"
                    spacing={6}
                >
                  <Frame width={27} height={27} fill="#FFFFFF" cornerRadius={4}>
                    <AutoLayout
                        horizontalAlignItems="center"
                        verticalAlignItems="center"
                        width={27}
                        height={27}
                        padding={6}
                    >
                      <Grid sides={6} size={3} fill="#333333" spacing={3} />
                    </AutoLayout>
                  </Frame>
                  <Text fontSize={24} fontWeight={700} fill="#FFFFFF">+{attr}</Text>
                </AutoLayout>
              </AutoLayout>
            ))}
          </AutoLayout>
        </AutoLayout>
        <AutoLayout spacing={12} verticalAlignItems="center" fill="#E8E8E8" padding={24} width="fill-parent" stroke="#333333" strokeWidth={2}>
          <AutoLayout
              fill="#4CAF50"
              padding={16}
              cornerRadius={8}
              onClick={() => roll(0, "")}
          >
            <Text fontSize={20} fontWeight={700} fill="#FFFFFF">Roll</Text>
          </AutoLayout>
          <AutoLayout
              fill="#FFFFFF"
              padding={12}
              cornerRadius={8}
              spacing={12}
              verticalAlignItems="center"
          >
            <AutoLayout direction="vertical" spacing={4}>
              <AutoLayout
                  fill="#E6E6E6"
                  padding={4}
                  cornerRadius={4}
                  width={24}
                  horizontalAlignItems="center"
                  onClick={() => setForward(Math.min(5, forward + 1))}
              >
                <Text fontSize={12} fontWeight={600}>+</Text>
              </AutoLayout>
              <AutoLayout
                  fill="#E6E6E6"
                  padding={4}
                  cornerRadius={4}
                  width={24}
                  horizontalAlignItems="center"
                  onClick={() => setForward(Math.max(-5, forward - 1))}
              >
                <Text fontSize={12} fontWeight={600}>-</Text>
              </AutoLayout>
            </AutoLayout>
            <Input
                value={(forward >= 0 ? '+' : '') + String(forward)}
                onTextEditEnd={(e) => {
                  let val = parseInt(e.characters)
                  if (!isNaN(val)) {
                    setForward(Math.max(-5, Math.min(5, val)))
                  }
                }}
                fontSize={24}
                width={60}
                horizontalAlignText="center"
            />
            <Text fontSize={24} fontWeight={600}>Forward</Text>
          </AutoLayout>
          <AutoLayout
              fill="#FFFFFF"
              padding={12}
              cornerRadius={8}
              spacing={12}
              verticalAlignItems="center"
          >
            <AutoLayout direction="vertical" spacing={4}>
              <AutoLayout
                  fill="#E6E6E6"
                  padding={4}
                  cornerRadius={4}
                  width={24}
                  horizontalAlignItems="center"
                  onClick={() => setOngoing(Math.min(5, ongoing + 1))}
              >
                <Text fontSize={12} fontWeight={600}>+</Text>
              </AutoLayout>
              <AutoLayout
                  fill="#E6E6E6"
                  padding={4}
                  cornerRadius={4}
                  width={24}
                  horizontalAlignItems="center"
                  onClick={() => setOngoing(Math.max(-5, ongoing - 1))}
              >
                <Text fontSize={12} fontWeight={600}>-</Text>
              </AutoLayout>
            </AutoLayout>
            <Input
                value={(ongoing >= 0 ? '+' : '') + String(ongoing)}
                onTextEditEnd={(e) => {
                  let val = parseInt(e.characters)
                  if (!isNaN(val)) {
                    setOngoing(Math.max(-5, Math.min(5, val)))
                  }
                }}
                fontSize={16}
                width={40}
                horizontalAlignText="center"
            />
            <Text fontSize={16} fontWeight={600}>Ongoing</Text>
          </AutoLayout>
        </AutoLayout>
        <AutoLayout
            fill="#E8E8E8"
            padding={16}
            width="fill-parent"
            spacing={8}
            height={115}
        >
          {sides1 && sides2 ?
            <>
              <Text fontSize={32} fontWeight={700}>
                Roll:
              </Text>
              <Text fontSize={32} fontWeight={700} fill="#FF0000">
                {sides1 + sides2 + rolledModifier + rolledForward + rolledOngoing}
              </Text>
              <Text fontSize={32} fontWeight={700} width="fill-parent">
                = [({sides1} + {sides2}){modifierName && rolledModifier !== 0 ? (rolledModifier >= 0 ? ' +' + rolledModifier : ' -' + Math.abs(rolledModifier)) + ' (' + modifierName + ')' : modifierName && rolledModifier === 0 ? ' +' + rolledModifier + ' (' + modifierName + ')' : ''}]{rolledForward !== 0 ? (rolledForward >= 0 ? ' +' + rolledForward : ' -' + Math.abs(rolledForward)) + ' (Forward)' : ''}{rolledOngoing !== 0 ? (rolledOngoing >= 0 ? ' +' + rolledOngoing : ' -' + Math.abs(rolledOngoing)) + ' (Ongoing)' : ''}
              </Text>
            </>
            : null}
        </AutoLayout>
      </AutoLayout>
  )
}
widget.register(lildice)