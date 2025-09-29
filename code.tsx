const { widget } = figma
const { Rectangle, AutoLayout, Frame, Text, useSyncedState, usePropertyMenu, useEffect, Ellipse, Input } = widget

function Dot(props) {
  let visible = props.visible
  return (
      <Ellipse
          opacity={visible ? 1 : 0}
          width={24}
          height={24}
          fill="#333333"
      ></Ellipse>
  )
}

function Grid(props) {
  let sides = props.sides
  let attrs = {
    direction: "vertical" as const,
    spacing: 12,
    width: "fill-parent" as const
  }
  switch(sides) {
    case 1:
      return <Dot visible={true} />
    case 2:
    case 3:
      return <AutoLayout {...attrs}>
        <AutoLayout horizontalAlignItems="start" width="fill-parent"><Dot visible={true} /></AutoLayout>
        <AutoLayout horizontalAlignItems="center" width="fill-parent"><Dot visible={sides == 2 ? false : true} /></AutoLayout>
        <AutoLayout horizontalAlignItems="end" width="fill-parent"><Dot visible={true} /></AutoLayout>
      </AutoLayout>
    case 4:
    case 5:
      return <AutoLayout {...attrs}>
        <AutoLayout spacing="auto" width="fill-parent"><Dot visible={true} /><Dot visible={true} /></AutoLayout>
        <AutoLayout horizontalAlignItems="center" width="fill-parent"><Dot visible={sides == 4 ? false : true} /></AutoLayout>
        <AutoLayout spacing="auto" width="fill-parent"><Dot visible={true} /><Dot visible={true} /></AutoLayout>
      </AutoLayout>
    case 6:
      return <AutoLayout {...attrs}>
        <AutoLayout spacing="auto" width="fill-parent"><Dot visible={true} /><Dot visible={true} /><Dot visible={true} /></AutoLayout>
        <AutoLayout horizontalAlignItems="center" width="fill-parent"><Dot visible={false} /></AutoLayout>
        <AutoLayout spacing="auto" width="fill-parent"><Dot visible={true} /><Dot visible={true} /><Dot visible={true} /></AutoLayout>
      </AutoLayout>
    default:
      return <Dot visible={true} />
  }
}

function lildice() {
  const [initialized, setInitialized] = useSyncedState("initialized", false)
  const [sides1, setSides1] = useSyncedState("side1", null)
  const [sides2, setSides2] = useSyncedState("side2", null)
  const [modifier, setModifier] = useSyncedState("modifier", 0)
  const [modifierName, setModifierName] = useSyncedState("modifierName", "")
  const [muscle, setMuscle] = useSyncedState("muscle", 0)
  const [finesse, setFinesse] = useSyncedState("finesse", 0)
  const [grit, setGrit] = useSyncedState("grit", 0)
  const [moxie, setMoxie] = useSyncedState("moxie", 0)
  const [smarts, setSmarts] = useSyncedState("smarts", 0)
  const [coin, setCoin] = useSyncedState("coin", 0)
  usePropertyMenu(
      [
        {
          tooltip: 'Roll',
          propertyName: 'roll',
          itemType: 'action',
        },
      ],

      async ({ propertyName }) => {
        if (propertyName === 'roll') {
          roll(0, "")
        }
      },
  )

  let roll = (mod, name) => {
    let number1 = Math.floor(Math.random() * 6) + 1
    let number2 = Math.floor(Math.random() * 6) + 1
    setSides1(number1)
    setSides2(number2)
    setModifier(mod)
    setModifierName(name)
    console.log(number1, number2, mod)
    figma.notify('You rolled a ' + number1 + ' and a ' + number2 + ' (total: ' + (number1 + number2 + mod) + ')')
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
      <AutoLayout direction="vertical" spacing={24} horizontalAlignItems="center">
        <AutoLayout spacing={24}>
          <Frame
              fill="#FFFFFF"
              width={192}
              height={192}
              cornerRadius={32}
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
          <AutoLayout direction="vertical" spacing={8}>
            <AutoLayout
                fill="#FFFFFF"
                padding={12}
                cornerRadius={8}
                spacing={12}
            >
              <Input
                  value={String(muscle)}
                  onTextEditEnd={(e) => {
                    let val = parseInt(e.characters)
                    if (!isNaN(val)) {
                      setMuscle(Math.max(-5, Math.min(5, val)))
                    }
                  }}
                  fontSize={16}
                  width={40}
              />
              <AutoLayout onClick={() => roll(muscle, "+Muscle")}>
                <Text fontSize={16} fontWeight={600}>+Muscle</Text>
              </AutoLayout>
            </AutoLayout>
            <AutoLayout
                fill="#FFFFFF"
                padding={12}
                cornerRadius={8}
                spacing={12}
            >
              <Input
                  value={String(finesse)}
                  onTextEditEnd={(e) => {
                    let val = parseInt(e.characters)
                    if (!isNaN(val)) {
                      setFinesse(Math.max(-5, Math.min(5, val)))
                    }
                  }}
                  fontSize={16}
                  width={40}
              />
              <AutoLayout onClick={() => roll(finesse, "+Finesse")}>
                <Text fontSize={16} fontWeight={600}>+Finesse</Text>
              </AutoLayout>
            </AutoLayout>
            <AutoLayout
                fill="#FFFFFF"
                padding={12}
                cornerRadius={8}
                spacing={12}
            >
              <Input
                  value={String(grit)}
                  onTextEditEnd={(e) => {
                    let val = parseInt(e.characters)
                    if (!isNaN(val)) {
                      setGrit(Math.max(-5, Math.min(5, val)))
                    }
                  }}
                  fontSize={16}
                  width={40}
              />
              <AutoLayout onClick={() => roll(grit, "+Grit")}>
                <Text fontSize={16} fontWeight={600}>+Grit</Text>
              </AutoLayout>
            </AutoLayout>
            <AutoLayout
                fill="#FFFFFF"
                padding={12}
                cornerRadius={8}
                spacing={12}
            >
              <Input
                  value={String(moxie)}
                  onTextEditEnd={(e) => {
                    let val = parseInt(e.characters)
                    if (!isNaN(val)) {
                      setMoxie(Math.max(-5, Math.min(5, val)))
                    }
                  }}
                  fontSize={16}
                  width={40}
              />
              <AutoLayout onClick={() => roll(moxie, "+Moxie")}>
                <Text fontSize={16} fontWeight={600}>+Moxie</Text>
              </AutoLayout>
            </AutoLayout>
            <AutoLayout
                fill="#FFFFFF"
                padding={12}
                cornerRadius={8}
                spacing={12}
            >
              <Input
                  value={String(smarts)}
                  onTextEditEnd={(e) => {
                    let val = parseInt(e.characters)
                    if (!isNaN(val)) {
                      setSmarts(Math.max(-5, Math.min(5, val)))
                    }
                  }}
                  fontSize={16}
                  width={40}
              />
              <AutoLayout onClick={() => roll(smarts, "+Smarts")}>
                <Text fontSize={16} fontWeight={600}>+Smarts</Text>
              </AutoLayout>
            </AutoLayout>
            <AutoLayout
                fill="#FFFFFF"
                padding={12}
                cornerRadius={8}
                spacing={12}
            >
              <Input
                  value={String(coin)}
                  onTextEditEnd={(e) => {
                    let val = parseInt(e.characters)
                    if (!isNaN(val)) {
                      setCoin(Math.max(-5, Math.min(5, val)))
                    }
                  }}
                  fontSize={16}
                  width={40}
              />
              <AutoLayout onClick={() => roll(coin, "+Coin")}>
                <Text fontSize={16} fontWeight={600}>+Coin</Text>
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
        {sides1 && sides2 ?
            <AutoLayout
                fill="#FFFFFF"
                padding={16}
                cornerRadius={8}
                width="fill-parent"
                spacing={8}
            >
              <Text fontSize={32} fontWeight={700}>
                Roll:
              </Text>
              <Text fontSize={32} fontWeight={700} fill="#FF0000">
                {sides1 + sides2 + modifier}
              </Text>
              <Text fontSize={32} fontWeight={700}>
                = {sides1} + {sides2}{modifier !== 0 ? (modifier > 0 ? ' + ' + modifier : ' - ' + Math.abs(modifier)) : ''}{modifierName ? ' (' + modifierName + ')' : ''}
              </Text>
            </AutoLayout>
            : null}
      </AutoLayout>
  )
}
widget.register(lildice)