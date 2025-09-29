const { widget } = figma
k,, 
const { Rectangle, AutoLayout, Frame, Text, useSyncedState, usePropertyMenu, useEffect, Ellipse } = widget

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
  const [sides, setSides] = useSyncedState("side", null)
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
          roll()
        }
      },
  )

  let roll = () => {
    let number = Math.floor(Math.random() * 6) + 1
    setSides(number)
    console.log(number)
    figma.notify('You rolled a ' + number)
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
        {sides ?
            <AutoLayout
                horizontalAlignItems="center"
                verticalAlignItems="center"
                width={192}
                height={192}
                padding={48}
            >
              <Grid sides={sides} />
            </AutoLayout>
            : null}
      </Frame>
  )
}
widget.register(lildice)