const { widget } = figma
const { Rectangle, AutoLayout, Frame, Text, useSyncedState, usePropertyMenu, useEffect, Ellipse, Input } = widget

const attributes = ["Muscle", "Finesse", "Grit", "Moxie", "Smarts", "Coin"]

const moves = {
  "Muscle": [
    {
      name: "Go Toe To Toe",
      description: "When you use your abilities to overcome someone or something in a struggle for control, state what your goal is. Your opponent can describe how they respond, at their option. Roll+Muscle.",
      "10+": "Choose 2:\n• You manage to achieve your goal, e.g., take something they hold.\n• You get them good, giving your opponent harm as established by your attacks\n• You block, dodge, or counter their best attempts.(If you don't choose this, they will do Harm to you as established).",
      "7-9": "Choose 1:\n• You manage to achieve your goal, e.g., take something they hold.\n• You get them good, giving your opponent harm as established by your attacks\n• You block, dodge, or counter their best attempts.(If you don't choose this, they will do Harm to you as established)."
    },
    {
      name: "Hit With All You've Got",
      description: "When you have a clear shot and you use your strength to hit someone or something with all you've got, roll+Muscle. On a hit, you give Harm to your opponent as established.",
      "10+": "Choose 2:\n• You take cover or secure a superior position. If you don't choose this, they can give you Harm\n• You get them good (+1 Harm).\n• You control the collateral damage.\n• You hold the target's attention, if possible.\n• You gain the upper hand. Take 1 Juice.",
      "7-9": "Choose 1:\n• You take cover or secure a superior position. If you don't choose this, they can give you Harm\n• You get them good (+1 Harm).\n• You control the collateral damage.\n• You hold the target's attention, if possible.\n• You gain the upper hand. Take 1 Juice."
    }
  ],
  "Finesse": [
    {
      name: "Sneak Around",
      description: "When you use your agility to act secretly or deceptively, roll+Finesse.",
      "10+": "Everyone that should fall for it falls for it.",
      "7-9": "As above, but it's complicated. The MC chooses 1:\n• Someone unimportant noticed you, but that just made them important, right?\n• You are perceived only by a secondary sense (someone picks up your scent while you're stalking them; you're seen whispering a message but the message is not heard).\n• You must leave something important behind or be discovered"
    },
    {
      name: "Take The Shot",
      description: "When you take aim and shoot at an enemy at range (close or far), roll +Finesse.",
      "10+": "You deal damage and choose 1:\n• You keep your position for another shot\n• You create an advantage (create a tag)\n• Do 1 more harm",
      "7-9": "You deal damage but lose your position; you must move to take another shot.",
      "6-": "You miss and the MC makes a move against you"
    }
  ],
  "Grit": [
    {
      name: "To Protect and Serve",
      description: "When you stand in defense of another person, an item, or a location under attack, roll +Grit.",
      "13+": "As for 10+, and inflict 1 Harm or Stress on the attacker",
      "10+": "Hold 3. Spend your hold, 1-for-1, to:\n• Redirect an attack to yourself\n• Reduce the Harm or Stress of the attack by 1\n• Create an advantage. Create 1 Juice",
      "7-9": "Hold 1",
      "6-": "The original target takes harm as established, and your attempts backfires. You take -1 forward, 1 Harm, or 1 Stress, or the target takes 1 more Harm or Stress"
    },
    {
      name: "Tough It Out",
      description: "When you suffer harm, illness, poison, exhaustion, or deprivation, roll +Grit. On cases of direct physical harm, roll +Grit+Armor",
      "13+": "Avoid all Harm or Stress. If the harm or Stress is <3, heal 1 Harm or Stress",
      "10+": "You shake it off. Harm or Stress is reduced by 2",
      "7-9": "You take the effect but it is reduced. Harm or Stress is reduced by 1.",
      "6-": "The effect as expected. Take Harm or Stress as established"
    }
  ],
  "Moxie": [
    {
      name: "Talk Them Into It",
      description: "When you use your abilities to talk, threaten, or seduce someone into doing something, roll+Moxie.",
      "13+": "Hold 3, and you may turn them into a +0 Contact",
      "10+": "Hold 3: Spend your hold 1-for-1 to:\n• Change the target's agenda 1-for-1 to your agena\n• Inflict 1 Stress on the target\n• Have the target comply without questions or a need for reassurance, payment, or coercion\n• Have them comply without eliciting suspicion from those around you",
      "7-9": "Hold 2",
      "6-": "Hold 1, but the target becomes hostile"
    },
    {
      name: "Draw Them Out",
      description: "Use your charisma to get information from a target. When you try to charm answers from a target, roll+Moxie:",
      "10+": "Hold 3: Spend your hold 1-for-1 to ask one of the following questions, and the MC will answer truthfully:\n• What do you or an associate want?\n• What do you or an associate plan to do?\n• What are you or an associate hiding?\n• What is you or an associate's greatest power?\n• What is you or an associate's greatest weakness",
      "7-9": "Hold 1",
      "6-": "Hold 1, but the target becomes hostile, or the MC will answer give you an answer that you wish wasn't true"
    }
  ],
  "Smarts": [
    {
      name: "Investigate a Mystery",
      description: "You may go to each Contact for help for help once per job during the Legwork Phase, roll +the contact rating of the NPC.",
      "10+": "You get what you want and a little something extra (choose either Secrets or Gear).",
      "7-9": "You get what you want, but choose 2 from the list below:\n• Your request is going to cost you extra. Mark 1 Loot\n• Your request is going to attract unwanted attention, complications, consequences, or take extra time\n• Your contact needs you to help them out with something. If you turn them down, take -1 to their contact rating until you make it right\n• They give you what you think you should want",
      "6-": "You get what they think you should want and Advance the Legwork Clock"
    },
    {
      name: "Read a Bad Situation",
      description: "When you look around and read a bad situation, roll +Smarts.",
      "13+": "Hold 3. You can ask any Question, not just the listed ones",
      "10+": "Hold 3. Hold can be spent 1 for 1 to ask Keeper one of the following questions. If you act on the answers, you get +1 ongoing while the information is relevant:\n• What's my best way in?\n• What's my best way out?\n• Are there any dangers we haven't noticed?\n• What's the biggest threat?\n• What's most vulnerable to me?\n• What's the best way to protect the Victims?",
      "7-9": "Hold 1",
      "6-": "Hold 1, and the MC will give you an answer you don't want to hear."
    }
  ],
  "Coin": [
    {
      name: "Shell Out",
      description: "When you need to make a purchase, the MC will set a Price. Roll +Loot+Price. Note: You may use Change the Game to try to improve your odds, but once you roll, you are committed to the outcome",
      "13+": "You get exactly what you wanted, +a little something extra. Take 1 [Gear]",
      "10+": "You get exactly what you wanted",
      "7-9": "You get what what you wanted, but it is somehow flawed or inferior. The MC will tell you how",
      "6-": "You get what what you wanted, but it is wildly flawed or inferior. The MC will tell you how at the worst possible moment"
    },
    {
      name: "Grease the Wheels",
      description: "When you wish to bribe someone or impress them with your status, roll+Coin. Note: You may use Change the Game to try to improve your odds, but once you roll, you are committed to the outcome",
      "13+": "Change the target's agenda to your agena, and you may turn them into a +0 Contact",
      "10+": "Change the target's agenda to your agena",
      "7-9": "Change the target's agenda to your agena, but you must surrender 1 [Gear] or take -1 Ongoing to Coin for the rest of the session",
      "6-": "The target changes its agenda to the Opposite of your agenda"
    }
  ]
}

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
      return <AutoLayout direction="horizontal" spacing={dotSpacing} height="fill-parent">
        <AutoLayout direction="vertical" spacing="auto" height="fill-parent"><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /></AutoLayout>
        <AutoLayout verticalAlignItems="center" height="fill-parent"><Dot visible={false} size={dotSize} fill={dotFill} /></AutoLayout>
        <AutoLayout direction="vertical" spacing="auto" height="fill-parent"><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /></AutoLayout>
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
  const [selectedMove, setSelectedMove] = useSyncedState("selectedMove", null)
  const [moveHistory, setMoveHistory] = useSyncedState("moveHistory", [])
  const [historyPage, setHistoryPage] = useSyncedState("historyPage", 0)

  // Snapshot of modifiers used in the last roll
  const [rolledForward, setRolledForward] = useSyncedState("rolledForward", 0)
  const [rolledOngoing, setRolledOngoing] = useSyncedState("rolledOngoing", 0)
  const [rolledModifier, setRolledModifier] = useSyncedState("rolledModifier", 0)
  const [rollText, setRollText] = useSyncedState("rollText", "")

  // Initialize attribute values as an object
  const initialAttributeValues = {}
  attributes.forEach(attr => {
    initialAttributeValues[attr] = 0
  })
  const [attributeValues, setAttributeValues] = useSyncedState("attributeValues", initialAttributeValues)

  let roll = (mod, name, moveData = null) => {
    let number1 = Math.floor(Math.random() * 6) + 1
    let number2 = Math.floor(Math.random() * 6) + 1
    let total = number1 + number2 + mod + forward + ongoing

    // Build roll text
    let rollTextStr = `${total} = [(${number1} + ${number2})`
    if (name) {
      rollTextStr += modifierName && mod !== 0 ? (mod >= 0 ? ' +' + mod : ' -' + Math.abs(mod)) + ' (' + name + ')' : mod === 0 ? ' +' + mod + ' (' + name + ')' : ''
    }
    rollTextStr += ']'
    if (forward !== 0) {
      rollTextStr += (forward >= 0 ? ' +' + forward : ' -' + Math.abs(forward)) + ' (Forward)'
    }
    if (ongoing !== 0) {
      rollTextStr += (ongoing >= 0 ? ' +' + ongoing : ' -' + Math.abs(ongoing)) + ' (Ongoing)'
    }

    // Save snapshot of modifiers used in this roll
    setSides1(number1)
    setSides2(number2)
    setRolledModifier(mod)
    setModifierName(name)
    setRolledForward(forward)
    setRolledOngoing(ongoing)
    setRollText(rollTextStr)

    // Add to move history if a move was passed directly
    if (moveData) {
      const historyEntry = {
        move: moveData,
        total: total,
        dice: [number1, number2],
        modifier: mod,
        forward: forward,
        ongoing: ongoing,
        rollText: rollTextStr,
        timestamp: Date.now()
      }
      setMoveHistory([historyEntry, ...moveHistory])
    }

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
      <AutoLayout direction="horizontal" spacing={0}>
      <AutoLayout direction="vertical" spacing={0} horizontalAlignItems="center" stroke="#333333" strokeWidth={2} cornerRadius={8} width={800}>
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
              onClick={() => {
                setSelectedMove(null)
                roll(0, "")
              }}
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
              onClick={() => {
                setSelectedMove(null)
                roll(0, "")
              }}
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
                    onClick={() => {
                      setSelectedMove(null)
                      roll(attributeValues[attr], "+" + attr)
                    }}
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
                <AutoLayout direction="vertical" spacing={4}>
                  {moves[attr].map((move, idx) => (
                    <AutoLayout
                        key={`${attr}-${idx}`}
                        fill="#E6E6E6"
                        padding={8}
                        cornerRadius={4}
                        onClick={() => {
                          roll(attributeValues[attr], "+" + attr, move)
                        }}
                        spacing={6}
                    >
                      <Text fontSize={18} fontWeight={600}>{move.name}</Text>
                      <Frame width={18} height={18} fill="#333333" cornerRadius={3}>
                        <AutoLayout
                            horizontalAlignItems="center"
                            verticalAlignItems="center"
                            width={18}
                            height={18}
                            padding={4}
                        >
                          <Grid sides={6} size={2} fill="#FFFFFF" spacing={2} />
                        </AutoLayout>
                      </Frame>
                    </AutoLayout>
                  ))}
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
              onClick={() => {
                const basicRoll = {
                  name: "Roll",
                  description: "",
                  "13+": "Critical Success",
                  "10+": "Great Success",
                  "7-9": "Partial Success",
                  "6-": "Failure"
                }
                roll(0, "", basicRoll)
              }}
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
                fontSize={24}
                width={60}
                horizontalAlignText="center"
            />
            <Text fontSize={24} fontWeight={600}>Ongoing</Text>
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
              <Text fontSize={32} fontWeight={700} width="fill-parent">
                {rollText}
              </Text>
            </>
            : null}
        </AutoLayout>
      </AutoLayout>
      <AutoLayout
          direction="vertical"
          width={400}
          fill="#F5F5F5"
          stroke="#333333"
          strokeWidth={2}
          cornerRadius={8}
          padding={16}
          spacing={16}
      >
        <AutoLayout width="fill-parent" spacing={12} verticalAlignItems="center">
          <Text fontSize={20} fontWeight={700}>Move History</Text>
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
              <Text fontSize={14} fontWeight={600} fill="#FFFFFF">Clear All</Text>
            </AutoLayout>
          )}
        </AutoLayout>
        {moveHistory.length === 0 ? (
          <Text fontSize={16}>Roll a move to see outcomes</Text>
        ) : (
          <>
            <AutoLayout direction="vertical" spacing={12} width="fill-parent">
              {moveHistory.slice(historyPage * 5, (historyPage * 5) + 5).map((entry, idx) => {
                let outcomeText = ""
                if (entry.move["13+"] && entry.total >= 13) {
                  outcomeText = `13+: ${entry.move["13+"]}`
                } else if (entry.total >= 10) {
                  outcomeText = `10+: ${entry.move["10+"]}`
                } else if (entry.total >= 7) {
                  outcomeText = `7-9: ${entry.move["7-9"]}`
                } else if (entry.move["6-"]) {
                  outcomeText = `6-: ${entry.move["6-"]}`
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
                    <Text fontSize={18} fontWeight={700} width="fill-parent">{entry.move.name}</Text>
                    <Text fontSize={16} fontWeight={600} width="fill-parent">Roll: {entry.rollText}</Text>
                    <Text fontSize={14} width="fill-parent">{entry.move.description}</Text>
                    <Text fontSize={14} fontWeight={600} width="fill-parent">{outcomeText}</Text>
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
                  <Text fontSize={14} fontWeight={600} fill="#FFFFFF">← Previous</Text>
                </AutoLayout>
                <Text fontSize={14}>Page {historyPage + 1} of {Math.ceil(moveHistory.length / 5)}</Text>
                <AutoLayout
                    fill={historyPage < Math.ceil(moveHistory.length / 5) - 1 ? "#333333" : "#CCCCCC"}
                    padding={8}
                    cornerRadius={4}
                    onClick={() => historyPage < Math.ceil(moveHistory.length / 5) - 1 && setHistoryPage(historyPage + 1)}
                >
                  <Text fontSize={14} fontWeight={600} fill="#FFFFFF">Next →</Text>
                </AutoLayout>
              </AutoLayout>
            )}
          </>
        )}
      </AutoLayout>
      </AutoLayout>
  )
}
widget.register(lildice)